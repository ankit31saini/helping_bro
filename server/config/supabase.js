const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_ANON_KEY || '';

// Initialize Supabase. For backend validation we can use the anon key.
// The actual identity validation happens when we parse the JWT or call getUser
const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
