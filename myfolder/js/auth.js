// js/auth.js
// Shared Supabase client + auth helpers for ALL pages (index/login, sign_up, template, etc.)
//
// Usage (in ANY html file):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="/myfolder/js/auth.js"></script>
//
// Then call:
//   await window.auth.signIn(email, password)
//   await window.auth.signUp(email, password)
//   await window.auth.signOut()
//   const user = await window.auth.getUser()

// --- Supabase setup ---
const SUPABASE_URL = "https://srilbkwgeizbgsbegdwy.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmVzZSIsInJlZiI6InNyaWxia3dnZWl6YmdzYmVnZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzI5OTIsImV4cCI6MjA4NTI0ODk5Mn0.7pNmXY_rjz-QO1RGM9H-gB4pM39TUA7N_cpYB6iK35g";

// Guard: make sure supabase-js is loaded
if (!window.supabase || !window.supabase.createClient) {
  console.error(
    "Supabase JS not found. Include https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 BEFORE /myfolder/js/auth.js"
  );

  // Prevent crashes and make auth calls fail loudly but safely
  window.auth = {
    supabase: null,
    signUp: async () => { throw new Error("Supabase JS not loaded."); },
    signIn: async () => { throw new Error("Supabase JS not loaded."); },
    signOut: async () => { throw new Error("Supabase JS not loaded."); },
    getUser: async () => null,
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
    requireAuth: async (redirectTo = "/myfolder/index.html") => {
      window.location.href = redirectTo;
      return null;
    },
    redirectIfAuthed: async () => null
  };

  // Stop here so we don't throw and kill the script
  throw new Error("Supabase JS not loaded.");
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
  supabase,
  signUp,
  signIn,
  signOut,
  getUser,
  onAuthStateChange,
  requireAuth,
  redirectIfAuthed
};
