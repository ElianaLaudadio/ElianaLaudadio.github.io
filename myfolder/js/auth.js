// js/auth.js

// --- Supabase setup (Step 4) ---
    const SUPABASE_URL = "https://srilbkwgeizbgsbegdwy.supabase.com";
    const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaWxia3dnZWl6YmdzYmVnZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzI5OTIsImV4cCI6MjA4NTI0ODk5Mn0.7pNmXY_rjz-QO1RGM9H-gB4pM39TUA7N_cpYB6iK35g";

const supabase = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// --- Auth functions (Step 5) ---

async function signUp(email, password) {
  return await supabase.auth.signUp({ email, password });
}

async function signIn(email, password) {
  return await supabase.auth.signInWithPassword({ email, password });
}

async function signOut() {
  return await supabase.auth.signOut();
}

async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user;
}

// Make available globally
window.auth = {
  signUp,
  signIn,
  signOut,
  getUser,
  supabase
};
