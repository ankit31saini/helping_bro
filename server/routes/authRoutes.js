const express = require('express');
const router = express.Router();

// With Supabase Auth, most authentication logic (register, login, password reset) 
// happens directly between the Client and Supabase via their SDK.
// This route file can be used for custom backend sync logic if needed.

router.get('/me', (req, res) => {
  // We can add the protect middleware here if needed
  res.json({ success: true, message: 'Auth endpoints are managed by Supabase on client.' });
});

module.exports = router;
