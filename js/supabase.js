import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

export const supabaseUrl = 'https://aryvszimmomtwmcinfmv.supabase.co';
// Usamos el nombre 'supabaseKey' para que coincida con tus otros archivos
export const supabaseKey = 'sb_publishable_O2Nigg3h_0wBBFP23FQduw_gGT-TI4l';

export const supabase = createClient(supabaseUrl, supabaseKey);