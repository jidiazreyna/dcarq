(function () {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Menú mobile
  const toggle = document.querySelector("[data-nav-toggle]");
  const nav = document.querySelector("[data-nav]");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });

    // Cerrar al clickear un link
    nav.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Botón: copiar mensaje armado (para WhatsApp)
  const copyBtn = document.querySelector("[data-copy-message]");
  if (copyBtn) {
    copyBtn.addEventListener("click", async () => {
      const nombre = document.getElementById("nombre")?.value?.trim() || "";
      const telefono = document.getElementById("telefono")?.value?.trim() || "";
      const zona = document.getElementById("zona")?.value?.trim() || "";
      const mensaje = document.getElementById("mensaje")?.value?.trim() || "";

      const text =
        `Hola, soy ${nombre || "____"}. ` +
        `Mi teléfono es ${telefono || "____"}. ` +
        `Zona/Ciudad: ${zona || "____"}. ` +
        `Consulta: ${mensaje || "____"}`;

      try {
        await navigator.clipboard.writeText(text);
        copyBtn.textContent = "Mensaje copiado ✓";
        setTimeout(() => (copyBtn.textContent = "Copiar mensaje para WhatsApp"), 1800);
      } catch {
        alert("No se pudo copiar automáticamente. Copialo manualmente:\n\n" + text);
      }
    });
  }
})();
