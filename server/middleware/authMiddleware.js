const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    // Validate JWT via Supabase
    const { data, error } = await supabase.auth.getUser(token);

    if (error || !data.user) {
      throw new Error('Supabase Auth Failed');
    }

    // Attach user payload to request
    req.user = data.user;
    next();
  } catch (error) {
    console.error(`Auth Error: ${error.message}`);
    res.status(401).json({ success: false, message: 'Not authorized, invalid token' });
  }
};

module.exports = { protect };
