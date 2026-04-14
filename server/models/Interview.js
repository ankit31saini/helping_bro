const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: { 
    type: String, // String because we use Supabase UUIDs
    required: true,
    index: true // For fast lookups by user
  },
  jobDescription: { 
    type: String, 
    required: true 
  },
  resumeText: { 
    type: String, 
    required: true 
  },
  matchScore: { 
    type: Number 
  },
  skillGaps: [{ 
    type: String 
  }],
  technicalQuestions: [{ 
    type: String 
  }],
  behavioralQuestions: [{ 
    type: String 
  }],
  recommendations: [{ 
    type: String 
  }],
  summary: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Interview', interviewSchema);
