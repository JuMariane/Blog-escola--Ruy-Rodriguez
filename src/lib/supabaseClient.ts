import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "";

// Verifica se as credenciais do Supabase foram configuradas nas variáveis de ambiente
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Inicializa o cliente com fallbacks para evitar falhas em tempo de execução
export const supabase = createClient(
  supabaseUrl || "https://placeholder-url.supabase.co",
  supabaseAnonKey || "placeholder-key"
);
