// js/auth.js

// --- Supabase setup (Step 4) ---
const SUPABASE_URL = "https://YOUR_PROJECT_ID.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_ANON_KEY";

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
