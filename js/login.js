import { supabase } from "./supabase.js";

document.addEventListener("DOMContentLoaded", async () => {

  // Si ya hay sesión activa, redirige al admin
  const { data: { session } } = await supabase.auth.getSession();
  if (session) {
    window.location.href = "admin.html";
    return;
  }

  const btn = document.getElementById("btn-login");
  const mensaje = document.getElementById("mensaje");

  btn.addEventListener("click", async () => {
    const correo = document.getElementById("correo").value.trim();
    const password = document.getElementById("password").value;

    if (!correo || !password) {
      mensaje.textContent = "⚠️ Completa todos los campos.";
      return;
    }

    btn.textContent = "Entrando...";
    btn.disabled = true;

    const { error } = await supabase.auth.signInWithPassword({
      email: correo,
      password: password
    });

    if (error) {
      mensaje.textContent = "❌ Correo o contraseña incorrectos.";
      btn.textContent = "Iniciar sesión";
      btn.disabled = false;
      return;
    }

    // ✅ Login exitoso — redirige al panel
    window.location.href = "admin.html";
  });

  // También permite presionar Enter
  document.getElementById("password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") btn.click();
  });

});