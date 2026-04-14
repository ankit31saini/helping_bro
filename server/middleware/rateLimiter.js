const rateLimit = require('express-rate-limit');

// General API requests rate limiter
exports.apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict rate limiter for AI interaction endpoints (Preventing abuse)
exports.aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per window for AI usage
  message: 'Too many AI requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});
