// /myfolder/js/auth.js
// Shared Supabase auth helpers for ALL pages (index, sign_up, template, etc.)
//
// Usage in any HTML file:
//
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
// <script src="/myfolder/js/auth.js?v=8"></script>
//
// Then call:
//
// await window.auth.signIn(email, password)
// await window.auth.signUp(email, password)
// await window.auth.signOut()
// const user = await window.auth.getUser()

(() => {
// Prevent the file from initializing more than once.
if (window.auth && window.auth.__initialized) {
return;
}

const SUPABASE_URL =
"https://srilbkwgeizbgsbegdwy.supabase.co";

const SUPABASE_ANON_KEY =
"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyaWxia3dnZWl6YmdzYmVnZHd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk2NzI5OTIsImV4cCI6MjA4NTI0ODk5Mn0.7pNmXY_rjz-QO1RGM9H-gB4pM39TUA7N_cpYB6iK35g";

// Make sure the Supabase JavaScript library loaded first.
if (
!window.supabase ||
typeof window.supabase.createClient !== "function"
) {
console.error(
"Supabase JS not found. Include https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2 before /myfolder/js/auth.js"
);

```
// Fallback object so pages fail clearly instead of crashing mysteriously.
window.auth = {
  __initialized: true,
  client: null,
  supabase: null,

  signUp: async () => {
    throw new Error("Supabase JS not loaded.");
  },

  signIn: async () => {
    throw new Error("Supabase JS not loaded.");
  },

  signOut: async () => {
    throw new Error("Supabase JS not loaded.");
  },

  getUser: async () => null,

  getUserId: async () => null,

  getProfile: async () => null,

  getOrCreateProfile: async () => null,

  updateProfile: async () => {
    throw new Error("Supabase JS not loaded.");
  },

  onAuthStateChange: () => ({
    data: {
      subscription: {
        unsubscribe() {}
      }
    }
  }),

  requireAuth: async (
    redirectTo = "/myfolder/index.html"
  ) => {
    window.location.href = redirectTo;
    return null;
  },

  redirectIfAuthed: async () => null,

  db: {
    select: async () => {
      throw new Error("Supabase JS not loaded.");
    },

    insert: async () => {
      throw new Error("Supabase JS not loaded.");
    },

    update: async () => {
      throw new Error("Supabase JS not loaded.");
    },

    remove: async () => {
      throw new Error("Supabase JS not loaded.");
    }
  }
};

return;
```

}

// Keep the Supabase client local to avoid naming conflicts.
const client = window.supabase.createClient(
SUPABASE_URL,
SUPABASE_ANON_KEY
);

async function signUp(email, password) {
const { data, error } = await client.auth.signUp({
email,
password
});

```
if (error) {
  throw error;
}

return data;
```

}

async function signIn(email, password) {
const { data, error } =
await client.auth.signInWithPassword({
email,
password
});

```
if (error) {
  throw error;
}

return data;
```

}

async function signOut() {
const { error } = await client.auth.signOut();

```
if (error) {
  throw error;
}

return true;
```

}

async function getUser() {
const { data, error } =
await client.auth.getUser();

```
if (error) {
  throw error;
}

return data.user;
```

}

async function getUserId() {
const user = await getUser();

```
return user ? user.id : null;
```

}

async function getProfile() {
const user = await getUser();

```
if (!user) {
  return null;
}

const { data, error } = await client
  .from("profiles")
  .select(
    "id, display_name, role, created_at, updated_at"
  )
  .eq("id", user.id)
  .maybeSingle();

if (error) {
  throw error;
}

return data;
```

}

async function getOrCreateProfile() {
const user = await getUser();

```
if (!user) {
  return null;
}

const existingProfile = await getProfile();

if (existingProfile) {
  return existingProfile;
}

const emailName = user.email
  ? user.email.split("@")[0]
  : "Outlier";

const displayName =
  user.user_metadata?.display_name ||
  emailName ||
  "Outlier";

const { data, error } = await client
  .from("profiles")
  .insert({
    id: user.id,
    display_name: displayName,
    role: "client"
  })
  .select(
    "id, display_name, role, created_at, updated_at"
  )
  .single();

if (error) {
  throw error;
}

return data;
```

}

async function updateProfile(values = {}) {
const user = await getUser();

```
if (!user) {
  throw new Error(
    "User is not authenticated."
  );
}

const allowedValues = {};

if (
  typeof values.display_name === "string"
) {
  allowedValues.display_name =
    values.display_name.trim();
}

allowedValues.updated_at =
  new Date().toISOString();

const { data, error } = await client
  .from("profiles")
  .update(allowedValues)
  .eq("id", user.id)
  .select(
    "id, display_name, role, created_at, updated_at"
  )
  .single();

if (error) {
  throw error;
}

return data;
```

}

function onAuthStateChange(callback) {
return client.auth.onAuthStateChange(
(event, session) => {
try {
callback(event, session);
} catch (error) {
console.error(
"Auth state callback error:",
error
);
}
}
);
}

async function requireAuth(
redirectTo = "/myfolder/index.html"
) {
try {
const user = await getUser();

```
  if (!user) {
    window.location.href = redirectTo;
    return null;
  }

  return user;
} catch (error) {
  console.error(
    "Could not verify authentication:",
    error
  );

  window.location.href = redirectTo;

  return null;
}
```

}

async function redirectIfAuthed(
redirectTo = "/myfolder/template.html"
) {
try {
const user = await getUser();

```
  if (user) {
    window.location.href = redirectTo;
  }

  return user;
} catch (error) {
  console.error(
    "Could not check authentication:",
    error
  );

  return null;
}
```

}

const db = {
select: async (
table,
columns = "*",
build = null
) => {
let query = client
.from(table)
.select(columns);

```
  if (typeof build === "function") {
    query = build(query);
  }

  const { data, error } = await query;

  if (error) {
    throw error;
  }

  return data;
},

insert: async (table, rows) => {
  const { data, error } = await client
    .from(table)
    .insert(rows)
    .select();

  if (error) {
    throw error;
  }

  return data;
},

update: async (
  table,
  values,
  build = null
) => {
  let query = client
    .from(table)
    .update(values);

  if (typeof build === "function") {
    query = build(query);
  }

  const { data, error } =
    await query.select();

  if (error) {
    throw error;
  }

  return data;
},

remove: async (
  table,
  build = null
) => {
  let query = client
    .from(table)
    .delete();

  if (typeof build === "function") {
    query = build(query);
  }

  const { data, error } =
    await query.select();

  if (error) {
    throw error;
  }

  return data;
}
```

};

window.auth = {
__initialized: true,
client,
supabase: client,
signUp,
signIn,
signOut,
getUser,
getUserId,
getProfile,
getOrCreateProfile,
updateProfile,
onAuthStateChange,
requireAuth,
redirectIfAuthed,
db
};
})();
