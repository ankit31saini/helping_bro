const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const cookieParser = require('cookie-parser');

const rateLimiter = require('./middleware/rateLimiter');
const sanitizeMiddleware = require('./middleware/sanitizeMiddleware');

// Route imports
const authRoutes = require('./routes/authRoutes');
const interviewRoutes = require('./routes/interviewRoutes');

const app = express();

// Security Middlewares
app.use(helmet()); // Secure HTTP headers
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Body parsing
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(cookieParser());

// Sanitize Data (Prevent NoSQL Injection & XSS conceptually)
// app.use(mongoSanitize());
// app.use(sanitizeMiddleware);

// Rate Limiting
app.use('/api/', rateLimiter.apiLimiter);

// Routes configuration
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/interview', interviewRoutes);

// Base route test
app.get('/', (req, res) => {
  res.send('API is running securely...');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Server Error'
  });
});

module.exports = app;
