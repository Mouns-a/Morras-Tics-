import { supabase } from "./supabase.js";

// ✅ Verifica sesión — si no hay, redirige al login
export async function verificarSesion() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    window.location.href = "login.html";
    return null;
  }

  return session;
}

// ✅ Cerrar sesión
export async function cerrarSesion() {
  await supabase.auth.signOut();
  window.location.href = "login.html";
}