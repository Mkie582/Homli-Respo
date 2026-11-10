// ==========================================
// CampusNest Supabase Client
// ==========================================

const SUPABASE_URL = "https://cwsuqkrridkjgelmskrm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_HpYst8SJF0KOlo6dF2YRsg_RY_PD7ye";


// Create Supabase client
const campusSupabase = supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
);


// Make available to other CampusNest files
window.campusSupabase = campusSupabase;


console.log("CampusNest Supabase client initialized.");