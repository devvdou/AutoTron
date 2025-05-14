import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// --- Server-side client initialization ---
let supabaseServerSingleton: SupabaseClient | null = null;

// This block executes when the module is loaded.
// We check if we are on the server and if the service key is available.
if (typeof window === 'undefined') { // Check if running on the server
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (supabaseServiceRoleKey) {
    if (!supabaseUrl) {
        // This should ideally not happen if NEXT_PUBLIC_SUPABASE_URL is set correctly
        console.error("CRITICAL: NEXT_PUBLIC_SUPABASE_URL is not defined for server client initialization.");
        // Not throwing here to avoid build issues, but server client won't be created.
    } else {
        supabaseServerSingleton = createClient(supabaseUrl, supabaseServiceRoleKey);
    }
  } else {
    // On the server, but SUPABASE_SERVICE_ROLE_KEY is missing. This is a configuration error.
    console.error(
      "CRITICAL: SUPABASE_SERVICE_ROLE_KEY is not defined on the server. " +
      "The server-side Supabase client will not be initialized. " +
      "Please check your .env.local file and ensure the server is restarted."
    );
    // supabaseServerSingleton remains null.
  }
}
// On the client-side (typeof window !== 'undefined'), supabaseServiceRoleKey is not accessed,
// and supabaseServerSingleton remains null. No error is thrown during import.

/**
 * Retrieves the server-side Supabase client.
 * This function should ONLY be called from server-side code (e.g., API routes, getServerSideProps).
 * Throws an error if called on the client or if the server client is not initialized
 * (due to missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL on the server).
 */
export const getSupabaseServerClient = (): SupabaseClient => {
  if (typeof window !== 'undefined') {
    throw new Error(
      "`getSupabaseServerClient` was called on the client. " +
      "It is intended for server-side use only."
    );
  }
  if (!supabaseServerSingleton) {
    // This means we are on the server, but the client wasn't initialized.
    // The console.error above would have already indicated why (missing key or URL).
    throw new Error(
      "Supabase server client is not initialized. " +
      "This is likely due to a missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_URL in the server environment. " +
      "Check server logs for more details."
    );
  }
  return supabaseServerSingleton;
};

// Export the singleton directly.
// If used on the client, it will be `null`.
// If used on the server without proper env setup, it will be `null`.
// Code using `supabaseServer` directly must handle it being potentially `null`.
export const supabaseServer: SupabaseClient | null = supabaseServerSingleton;


// --- Client-side client initialization (browser) ---
let browserClientInstance: SupabaseClient | null = null;

/**
 * Retrieves the client-side (browser) Supabase client.
 * Uses NEXT_PUBLIC_ variables.
 */
export const getSupabaseBrowserClient = (): SupabaseClient => {
  if (!supabaseUrl) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_URL is not defined.");
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined. Please check your .env.local file.");
  }
  if (!supabaseAnonKey) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined or is empty.");
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined or is empty. Please check your .env.local file.");
  }
  // Basic validation for anon key format
  if (typeof supabaseAnonKey !== 'string' || supabaseAnonKey.trim() === '' || !supabaseAnonKey.startsWith('eyJ')) {
    console.error("Error: NEXT_PUBLIC_SUPABASE_ANON_KEY does not appear to be a valid JWT. Value:", supabaseAnonKey);
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY must be a valid non-empty JWT string.");
  }

  if (browserClientInstance) {
    return browserClientInstance;
  }

  browserClientInstance = createClient(supabaseUrl, supabaseAnonKey);
  return browserClientInstance;
};

// Export the browser client instance directly for convenience (common pattern)
export const supabase: SupabaseClient = getSupabaseBrowserClient();
