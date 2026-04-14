const pdfParse = require('pdf-parse');
const aiService = require('../services/aiService');
const Interview = require('../models/Interview');

exports.analyzeInterview = async (req, res) => {
  try {
    const { jobDescription } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a secure PDF resume' });
    }

    if (!jobDescription) {
      return res.status(400).json({ success: false, message: 'Job Description is required' });
    }

    // 1. Extract text from uploaded PDF buffer securely (in-memory)
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;

    if (!resumeText || resumeText.length < 10) {
      return res.status(400).json({ success: false, message: 'Could not extract text from PDF.' });
    }

    // 2. Call Gemini AI Service
    const aiAnalysis = await aiService.analyzeJobFit(resumeText, jobDescription);

    // 3. Save to MongoDB
    const interviewReport = await Interview.create({
      userId: req.user.id, // Supabase UUID
      jobDescription,
      resumeText,
      ...aiAnalysis
    });

    res.status(201).json({ 
      success: true, 
      message: 'Interview successfully analyzed',
      data: interviewReport
    });
  } catch (error) {
    console.error('Analyze Interview Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Server error during analysis' });
  }
};

exports.getInterviewReport = async (req, res) => {
  try {
    const interview = await Interview.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview report not found' });
    }

    res.status(200).json({ success: true, data: interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching report' });
  }
};

exports.getUserInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find({ userId: req.user.id }).sort('-createdAt');
    res.status(200).json({ success: true, count: interviews.length, data: interviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error fetching user interviews' });
  }
};

const pdfGenerator = require('../utils/pdfGenerator');

exports.generateResumePDF = async (req, res) => {
  try {
    const interview = await Interview.findOne({ 
      _id: req.params.id, 
      userId: req.user.id 
    });

    if (!interview) {
      return res.status(404).json({ success: false, message: 'Interview report not found' });
    }

    // Pass data into our secure puppeteer generator
    const pdfBuffer = await pdfGenerator.generatePDF(interview);

    // Set headers to trigger a download or display in browser
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Optimized-Resume-${interview._id}.pdf`);
    
    // Send the generated buffer over the wire
    res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error('PDF Generation Error:', error);
    res.status(500).json({ success: false, message: 'Server error generating secure PDF' });
  }
};
