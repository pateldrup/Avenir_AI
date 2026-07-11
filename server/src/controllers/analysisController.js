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

Calculate an ATS match score from 0 to 100 based strictly on the following formula:

1. Skills Match (35 Points)
- Formula: (Matched Skills / Required Skills) * 35. 
- Allow Full Matches (100%), Alias Matches (NodeJS == Node.js, 80%), and Related Matches (AWS EC2 -> AWS, 50%).

2. Keyword Match (20 Points)
- Extract important keywords from JD (e.g. REST API, Agile, Microservices, CI/CD).
- Formula: (Matched Keywords / Total Keywords) * 20.

3. Experience Match (15 Points)
- Extract Required Experience from JD vs Resume Experience.
- >= required = 15 pts
- 80%-99% = 12 pts
- 60%-79% = 8 pts
- <60% = 4 pts
- NOTE: Adjust your leniency based on the seniority level implied by the Job Description. If it is an entry-level, intern, or junior role, grade them relative to what is expected of a Junior.

4. Projects Relevance (10 Points)
- Analyze project stack relevance to JD stack.
- Score: (Matched Project Tech / JD Tech) * 10.

5. Education Match (5 Points)
- E.g. JD requires Bachelor's, Resume has B.Tech = 5 pts. JD requires Master's, Resume has Bachelor's = 3 pts.

6. Resume Quality (15 Points)
- Contact Info (3 pts): Name, Email, Phone (1 pt each).
- Links (2 pts): LinkedIn, GitHub, or Portfolio presence.
- Length (2 pts): 1 page = 2, 2 pages = 1, 3+ pages = 0.
- Sections Present (4 pts): Education, Skills, Projects, Experience (1 pt each).
- Action Verbs (2 pts): 10+ verbs = 2, 5+ verbs = 1, else = 0.
- Formatting Quality (2 pts): Readable text, well-structured.

Calculate the final score by summing these 6 sections (Total = 100).

Provide a list of matched skills (skills the candidate has that are in the JD) and missing skills (skills in the JD the candidate lacks).
Also provide a short 2-3 sentence overall feedback explaining the score calculation.

Output the response STRICTLY as a JSON object with the following schema:
{
  "atsScore": Number,
  "matchedSkills": ["Skill1", "Skill2"],
  "missingSkills": ["Skill3", "Skill4"],
  "feedback": "Your overall feedback here.",
  "extractedJobTitle": "String (Extract the job title from the JD. If none is found, infer one based on the description, e.g., 'Full Stack Developer')",
  "extractedCompany": "String (Extract the company name from the JD if present, else output 'Unknown Company')"
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
    let finalJobTitle = jobTitle;
    let finalCompany = company;

    // If the frontend sent defaults, override them with the AI-extracted values
    if (!finalJobTitle || finalJobTitle === 'Target Role') {
      finalJobTitle = parsedData.extractedJobTitle || 'Target Role';
    }
    if (!finalCompany || finalCompany === 'Target Company') {
      finalCompany = parsedData.extractedCompany || 'Target Company';
    }

    const analysis = await Analysis.create({
      user: req.user._id,
      resume: resumeId,
      jobTitle: finalJobTitle,
      company: finalCompany,
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

// @desc    Delete an analysis
// @route   DELETE /api/analysis/:id
// @access  Private
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found or unauthorized' });
    }
    res.status(200).json({ message: 'Analysis deleted successfully' });
  } catch (error) {
    console.error('Delete analysis error:', error);
    res.status(500).json({ message: 'Server error deleting analysis', error: error.message });
  }
};

module.exports = {
  scrapeJobUrl,
  analyzeGap,
  getAnalysis,
  deleteAnalysis
};
