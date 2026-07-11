const axios = require('axios');
const Analysis = require('../models/Analysis');
const MockInterview = require('../models/MockInterview');

const OLLAMA_BASE = process.env.OLLAMA_API_URL ? process.env.OLLAMA_API_URL.replace('/api/generate', '') : 'http://localhost:11434';
const OLLAMA_URL = `${OLLAMA_BASE}/api/chat`;

// @desc    Start a new Mock Interview session
// @route   POST /api/interviews/start
// @access  Private
const startInterview = async (req, res) => {
  const { analysisId } = req.body;

  if (!analysisId) {
    res.status(400);
    throw new Error('Please provide an analysisId');
  }

  try {
    const analysis = await Analysis.findById(analysisId);
    if (!analysis) {
      res.status(404);
      throw new Error('Analysis not found');
    }

    if (analysis.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this analysis');
    }

    const missingSkills = analysis.missingSkills.join(', ') || 'General Technical Skills';
    const matchedSkills = analysis.matchedSkills.join(', ') || 'General Qualifications';

    const systemPrompt = `You are a technical interviewer for a ${analysis.jobTitle} position at ${analysis.company || 'a tech company'}.
You are conducting a realistic, conversational mock interview. 
The candidate has strong skills in: ${matchedSkills}.
They need to be evaluated on: ${missingSkills}.

CRITICAL RULES FOR REALISM:
1. Speak like a real human interviewer. Be natural, conversational, and direct. DO NOT sound like an AI or a robot.
2. Keep your responses VERY short. Real interviewers don't give long monologues. 1-3 sentences maximum.
3. Ask ONLY ONE clear, specific question at a time. Never ask two questions in the same message.
4. DO NOT say things like "I'd like to dive deeper into an area where we can grow your skills." Just introduce the topic and ask the technical question directly (e.g., "Let's talk about microservices. How would you design...").
5. If the candidate answers well, acknowledge it briefly (e.g., "Makes sense.") and ask a follow-up.
6. If the answer is poor, briefly correct them and move to the next topic.
7. NEVER break character.
8. Start the interview by briefly introducing yourself (e.g., "Hi, I'm Alex, a Senior Engineer here. Thanks for chatting today.") and immediately ask the first technical question.
9. Ensure your technical questions are logically sound. DO NOT conflate unrelated technologies (e.g., do not ask about using an animation library like Framer Motion for state management). Ask practical, real-world questions.`;

    const initialMessages = [
      { role: 'system', content: systemPrompt }
    ];

    // Get the first question from LLM
    const llmResponse = await axios.post(OLLAMA_URL, {
      model: 'llama3.2',
      messages: initialMessages,
      stream: false,
    });

    const aiMessage = llmResponse.data.message.content;

    // Create Interview session in DB
    const mockInterview = await MockInterview.create({
      user: req.user._id,
      analysis: analysisId,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'interviewer', content: aiMessage }
      ],
    });

    res.status(201).json(mockInterview);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error(error.message || 'Error starting mock interview');
  }
};

// @desc    Submit an answer and get the next AI question
// @route   POST /api/interviews/:id/answer
// @access  Private
const submitAnswer = async (req, res) => {
  const { answer } = req.body;
  
  if (!answer) {
    res.status(400);
    throw new Error('Please provide an answer');
  }

  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!interview) {
      res.status(404);
      throw new Error('Interview session not found');
    }

    if (interview.status === 'Completed') {
      res.status(400);
      throw new Error('This interview is already completed');
    }

    // Append user's answer
    interview.messages.push({ role: 'candidate', content: answer });

    // Format messages for Ollama API
    // Ollama chat format expects: { role: 'system'|'user'|'assistant', content: '...' }
    const ollamaMessages = interview.messages.map(msg => ({
      role: msg.role === 'candidate' ? 'user' : (msg.role === 'interviewer' ? 'assistant' : 'system'),
      content: msg.content
    }));

    // Get next response from LLM
    const llmResponse = await axios.post(OLLAMA_URL, {
      model: 'llama3.2',
      messages: ollamaMessages,
      stream: false,
    });

    const aiMessage = llmResponse.data.message.content;

    // Append AI response
    interview.messages.push({ role: 'interviewer', content: aiMessage });

    await interview.save();

    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Error submitting answer');
  }
};

// @desc    End the interview and get final feedback
// @route   POST /api/interviews/:id/end
// @access  Private
const endInterview = async (req, res) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!interview) {
      res.status(404);
      throw new Error('Interview session not found');
    }

    if (interview.status === 'Completed') {
      return res.status(200).json(interview);
    }

    const ollamaMessages = interview.messages.map(msg => ({
      role: msg.role === 'candidate' ? 'user' : (msg.role === 'interviewer' ? 'assistant' : 'system'),
      content: msg.content
    }));

    // Add a final prompt asking for evaluation
    ollamaMessages.push({
      role: 'user',
      content: 'The interview is now over. Please provide a final evaluation of my performance. Output STRICTLY as a JSON object with the following schema: { "score": Number (0-100), "lackingAreas": ["List of specific concepts I lacked knowledge in or answered poorly"] }. Do not include markdown or other text.'
    });

    // We use the /api/chat endpoint but enforce a JSON response format for this final call
    const llmResponse = await axios.post(OLLAMA_URL, {
      model: 'llama3.2',
      messages: ollamaMessages,
      format: 'json',
      stream: false,
    });

    const aiMessage = llmResponse.data.message.content;
    let parsedData = { score: null, lackingAreas: [] };
    
    try {
      parsedData = JSON.parse(aiMessage.trim());
    } catch (err) {
      console.error("Failed to parse LLM JSON for interview feedback:", aiMessage);
    }

    interview.status = 'Completed';
    interview.score = parsedData.score || 0;
    interview.finalFeedback = parsedData.lackingAreas || [];

    await interview.save();

    res.status(200).json(interview);
  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error('Error ending interview');
  }
};

// @desc    Get an Interview session by ID
// @route   GET /api/interviews/:id
// @access  Private
const getInterview = async (req, res) => {
  try {
    const interview = await MockInterview.findOne({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    res.status(200).json(interview);
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Server error fetching interview', error: error.message });
  }
};

// @desc    Delete an Interview session by ID
// @route   DELETE /api/interviews/:id
// @access  Private
const deleteInterview = async (req, res) => {
  try {
    const interview = await MockInterview.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found or unauthorized' });
    }
    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error('Delete interview error:', error);
    res.status(500).json({ message: 'Server error deleting interview', error: error.message });
  }
};

module.exports = {
  startInterview,
  submitAnswer,
  endInterview,
  getInterview,
  deleteInterview
};
