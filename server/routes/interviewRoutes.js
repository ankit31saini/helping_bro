const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const rateLimiter = require('../middleware/rateLimiter');
const interviewController = require('../controllers/interviewController');

// All interview routes require authentication
router.use(protect);

// Apply strict AI rate limiter to the analyze endpoint
router.post('/analyze', rateLimiter.aiLimiter, upload.single('resume'), interviewController.analyzeInterview);

router.get('/:id', interviewController.getInterviewReport);
router.get('/', interviewController.getUserInterviews);
router.get('/generate-pdf/:id', interviewController.generateResumePDF);

module.exports = router;
