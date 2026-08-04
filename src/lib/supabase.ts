import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'https://vkwcphlypkhxewyhyjrn.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_SERVICE_ROLE_KEY || '';

let supabaseClient: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (!supabaseClient) {
    if (!supabaseKey) {
      console.warn('[Supabase Warning] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.');
    }
    supabaseClient = createClient(supabaseUrl, supabaseKey || 'placeholder', {
      auth: { persistSession: false }
    });
  }
  return supabaseClient;
}
