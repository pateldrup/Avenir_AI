const axios = require('axios');
const cheerio = require('cheerio');
const Resume = require('../models/Resume');
const Analysis = require('../models/Analysis');

// @desc    Scrape Job Description from a URL
// @route   POST /api/analysis/scrape
// @access  Private
const scrapeJobUrl = async (req, res) => {
  const { url } = req.body;

  if (!url) {
    res.status(400);
    throw new Error('Please provide a URL to scrape');
  }

  try {
    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    // Remove scripts, styles, and nav elements to clean up text
    $('script, style, nav, footer, header, noscript, iframe').remove();

    // Extract text from the body
    let text = $('body').text();
    
    // Clean up whitespace
    text = text.replace(/\s+/g, ' ').trim();

    res.json({ text });
  } catch (error) {
    res.status(500);
    throw new Error('Failed to scrape URL. It might be blocking automated requests.');
  }
};

// @desc    Analyze resume against job description using Local Llama 3.2
// @route   POST /api/analysis/gap
// @access  Private
const analyzeGap = async (req, res) => {
  const { resumeId, jobDescription, jobTitle, company } = req.body;

  if (!resumeId || !jobDescription) {
    res.status(400);
    throw new Error('Please provide both resumeId and jobDescription');
  }

  try {
    // 1. Fetch the user's parsed resume
    const resume = await Resume.findById(resumeId);
    if (!resume) {
      res.status(404);
      throw new Error('Resume not found');
    }

    // Ensure this user owns the resume
    if (resume.user.toString() !== req.user._id.toString()) {
      res.status(401);
      throw new Error('Not authorized to access this resume');
    }

    const resumeText = resume.extractedText;

    // 2. Construct the Prompt for Llama 3.2
    const systemPrompt = `
You are an expert ATS (Applicant Tracking System) software and Technical Recruiter.
Evaluate the following Resume against the provided Job Description.

Calculate an ATS match score from 0 to 100 based on the following criteria:
1. Hard Skills Match (40%)
2. Experience and Qualifications (30%)
3. Education (10%)
4. Keyword optimization & Impact metrics (20%)

Provide a list of matched skills (skills the candidate has that are in the JD) and missing skills (skills in the JD the candidate lacks).
Also provide a short 2-3 sentence overall feedback.

Output the response STRICTLY as a JSON object with the following schema:
{
  "atsScore": Number,
  "matchedSkills": ["Skill1", "Skill2"],
  "missingSkills": ["Skill3", "Skill4"],
  "feedback": "Your overall feedback here."
}
Do not include any markdown formatting, backticks, or other text outside the JSON object. Just the raw JSON.
`;

    const userPrompt = `
--- JOB DESCRIPTION ---
${jobDescription}

--- RESUME TEXT ---
${resumeText}
`;

    // 3. Call Local Llama 3.2 (Ollama)
    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
    
    const llmResponse = await axios.post(ollamaUrl, {
      model: 'llama3.2',
      prompt: systemPrompt + '\n\n' + userPrompt,
      format: 'json',
      stream: false,
    });

    const llmText = llmResponse.data.response;
    
    // Parse the JSON
    let parsedData;
    try {
      parsedData = JSON.parse(llmText.trim());
    } catch (err) {
      console.error("Failed to parse LLM JSON:", llmText);
      throw new Error('AI returned an invalid response format.');
    }

    // 4. Save to Database
    const analysis = await Analysis.create({
      user: req.user._id,
      resume: resumeId,
      jobTitle: jobTitle || 'Target Role',
      company: company || 'Target Company',
      atsScore: parsedData.atsScore || 0,
      matchedSkills: parsedData.matchedSkills || [],
      missingSkills: parsedData.missingSkills || [],
      feedback: parsedData.feedback || 'No feedback provided.',
    });

    res.status(201).json(analysis);

  } catch (error) {
    console.error(error);
    res.status(500);
    throw new Error(error.message || 'Error analyzing gap');
  }
};

const getAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, user: req.user._id });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }
    res.status(200).json(analysis);
  } catch (error) {
    console.error('Get analysis error:', error);
    res.status(500).json({ message: 'Server error fetching analysis', error: error.message });
  }
};

module.exports = {
  scrapeJobUrl,
  analyzeGap,
  getAnalysis
};
