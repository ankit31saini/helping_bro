const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'PLACEHOLDER_KEY');

const analyzeJobFit = async (resumeText, jobDescription) => {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
      You are an expert technical recruiter and ATS software analyzer.
      Given the following Resume and Job Description, analyze the fit and provide a detailed interview prep report.
      
      Job Description:
      ${jobDescription}
      
      Resume text:
      ${resumeText}
      
      Respond STRICTLY in JSON format with exactly these keys:
      {
        "matchScore": <number between 0 and 100>,
        "skillGaps": ["<gap 1>", "<gap 2>"],
        "technicalQuestions": ["<q1>", "<q2>", "<q3>"],
        "behavioralQuestions": ["<q1>", "<q2>"],
        "recommendations": ["<rec1>", "<rec2>"],
        "summary": "<2-3 sentence overview>"
      }
    `;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Clean up potential markdown formatting in response (e.g., \`\`\`json ...)
    let jsonString = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('Gemini API Error:', error);
    throw new Error('Failed to analyze job fit with AI.');
  }
};

module.exports = {
  analyzeJobFit
};
