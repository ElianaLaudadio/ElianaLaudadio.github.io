// js/auth.js
// Shared Supabase client + auth helpers for ALL pages (index/login, sign_up, template, etc.)
//
// Usage (in ANY html file):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="/js/auth.js"></script>
//
// Then call:
//   await auth.signIn(email, password)
//   await auth.signUp(email, password)
//   await auth.signOut()
//   const user = await auth.getUser()

// --- Supabase setup ---
const SUPABASE_URL = "https://srilbkwgeizbgsbegdwy.supabase.co"; // <-- NOTE: must end with .co
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaWxia3dnZWl6YmdzYmVnZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzI5OTIsImV4cCI6MjA4NTI0ODk5Mn0.7pNmXY_rjz-QO1RGM9H-gB4pM39TUA7N_cpYB6iK35g";

// Guard: make sure supabase-js is loaded
if (!window.supabase || !window.supabase.createClient) {
  console.error("Supabase JS not found. Include https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 before /js/auth.js");
}

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Auth functions ---

async function signUp(email, password) {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
  return true;
}

async function getUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user; // null if not logged in
}

function onAuthStateChange(callback) {
  // callback(event, session)
  return supabase.auth.onAuthStateChange((event, session) => {
    try {
      callback(event, session);
    } catch (e) {
      console.error("Auth state callback error:", e);
    }
  });
}

// --- Convenience helpers for your multi-page site ---

async function requireAuth(redirectTo = "/myfolder/index.html") {
  // Call at top of protected pages (template.html, etc.)
  // Redirects to login page if not authenticated.
  try {
    const user = await getUser();
    if (!user) window.location.href = redirectTo;
    return user;
  } catch (e) {
    window.location.href = redirectTo;
    return null;
  }
}

async function redirectIfAuthed(redirectTo = "/myfolder/template.html") {
  // Call on login page; if already logged in, skip it.
  try {
    const user = await getUser();
    if (user) window.location.href = redirectTo;
    return user;
  } catch (e) {
    return null;
  }
}

// Make available globally
window.auth = {
  // core
  supabase,
  signUp,
  signIn,
  signOut,
  getUser,
  onAuthStateChange,

  // page helpers
  requireAuth,
  redirectIfAuthed
};
