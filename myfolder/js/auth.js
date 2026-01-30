// /myfolder/js/auth.js
// Shared Supabase auth helpers for ALL pages (index/login, sign_up, template, etc.)
//
// Usage (in ANY html file):
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="/myfolder/js/auth.js?v=5"></script>
//
// Then call:
//   await window.auth.signIn(email, password)
//   await window.auth.signUp(email, password)
//   await window.auth.signOut()
//   const user = await window.auth.getUser()

(() => {
  // If this file was already loaded once, don't re-init (prevents duplicates)
  if (window.auth && window.auth.__initialized) return;

  const SUPABASE_URL = "https://srilbkwgeizbgsbegdwy.supabase.co";
  const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaWxia3dnZWl6YmdzYmVnZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzI5OTIsImV4cCI6MjA4NTI0ODk5Mn0.7pNmXY_rjz-QO1RGM9H-gB4pM39TUA7N_cpYB6iK35g";

  // Guard: make sure supabase-js is loaded
  if (!window.supabase || typeof window.supabase.createClient !== "function") {
    console.error(
      "Supabase JS not found. Include https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 BEFORE /myfolder/js/auth.js"
    );

    // Safe fallback so pages don't crash mysteriously
    window.auth = {
      __initialized: true,
      client: null,
      supabase: null, // ✅ added for compatibility
      signUp: async () => { throw new Error("Supabase JS not loaded."); },
      signIn: async () => { throw new Error("Supabase JS not loaded."); },
      signOut: async () => { throw new Error("Supabase JS not loaded."); },
      getUser: async () => null,
      getUserId: async () => null,
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      requireAuth: async (redirectTo = "/myfolder/index.html") => {
        window.location.href = redirectTo;
        return null;
      },
      redirectIfAuthed: async () => null,

      // DB helpers (no-op fallbacks)
      db: {
        select: async () => { throw new Error("Supabase JS not loaded."); },
        insert: async () => { throw new Error("Supabase JS not loaded."); },
        update: async () => { throw new Error("Supabase JS not loaded."); },
        remove: async () => { throw new Error("Supabase JS not loaded."); }
      }
    };
    return;
  }

  // IMPORTANT: keep the client local so it never conflicts with any other "supabase" const on your pages
  const client = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

  async function signUp(email, password) {
    const { data, error } = await client.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  }

  async function signIn(email, password) {
    const { data, error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await client.auth.signOut();
    if (error) throw error;
    return true;
  }

  async function getUser() {
    const { data, error } = await client.auth.getUser();
    if (error) throw error;
    return data.user; // null if not logged in
  }

  // ✅ NEW: convenient helper (keeps pages cleaner)
  async function getUserId() {
    const user = await getUser();
    return user ? user.id : null;
  }

  function onAuthStateChange(callback) {
    return client.auth.onAuthStateChange((event, session) => {
      try { callback(event, session); } catch (e) { console.error("Auth state callback error:", e); }
    });
  }

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

  // ✅ NEW: small DB wrappers (optional convenience)
  // These do NOT change existing behavior—just gives you a consistent place to call from.
  const db = {
    // Example:
    // await window.auth.db.select('weight_entries', 'id, entry_date, weight, created_at', q => q.order('created_at'))
    select: async (table, columns = "*", build = null) => {
      let q = client.from(table).select(columns);
      if (typeof build === "function") q = build(q);
      const { data, error } = await q;
      if (error) throw error;
      return data;
    },

    // Example:
    // await window.auth.db.insert('weight_entries', [{ user_id, entry_date, weight }])
    insert: async (table, rows) => {
      const { data, error } = await client.from(table).insert(rows).select();
      if (error) throw error;
      return data;
    },

    update: async (table, values, build = null) => {
      let q = client.from(table).update(values);
      if (typeof build === "function") q = build(q);
      const { data, error } = await q.select();
      if (error) throw error;
      return data;
    },

    remove: async (table, build = null) => {
      let q = client.from(table).delete();
      if (typeof build === "function") q = build(q);
      const { data, error } = await q.select();
      if (error) throw error;
      return data;
    }
  };

  window.auth = {
    __initialized: true,
    client,               // exposed if you ever want it
    supabase: client,     // ✅ so code can do window.auth.supabase.from(...)
    signUp,
    signIn,
    signOut,
    getUser,
    getUserId,            // ✅ added
    onAuthStateChange,
    requireAuth,
    redirectIfAuthed,
    db                    // ✅ added
  };
})();
