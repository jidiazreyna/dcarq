(function () {
  // Año en footer
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

  // ===== Slider: desplazamiento real, sin controles =====
  const sliders = document.querySelectorAll("[data-slider]");

  sliders.forEach((slider) => {
    const track = slider.querySelector(".slider__track");
    const imgs = slider.querySelectorAll(".slider__img");
    if (!track || imgs.length < 2) return;

    const imgA = imgs[0];
    const imgB = imgs[1];

    const folder = slider.dataset.folder || "assets/proyectos/residencial";
    const prefix = slider.dataset.prefix || "casa-";
    const count = parseInt(slider.dataset.count || "15", 10);
    const ext = slider.dataset.ext || "jpeg";
    const interval = parseInt(slider.dataset.interval || "1700", 10);
    const duration = parseInt(slider.dataset.duration || "520", 10);

    // Asegura que la transición exista y sea la misma que el data-duration
    track.style.transitionDuration = `${duration}ms`;

    const pad2 = (n) => String(n).padStart(2, "0");
    const srcFor = (i) => `${folder}/${prefix}${pad2(i)}.${ext}`;

    let index = 1;      // imgA muestra index
    let timer = null;
    let animating = false;

    function nextIndex(i) {
      return i >= count ? 1 : i + 1;
    }

    // set inicial (por si alguien cambió el HTML)
    imgA.src = srcFor(1);
    imgA.alt = `Residencial — Casa ${pad2(1)}`;
    imgB.src = srcFor(2);

    // Precarga liviana (primeras)
    for (let i = 2; i <= Math.min(count, 6); i++) {
      const im = new Image();
      im.src = srcFor(i);
    }

    function slideOnce() {
      if (animating) return;
      animating = true;

      const next = nextIndex(index);
      imgB.src = srcFor(next);
      imgB.alt = `Residencial — Casa ${pad2(next)}`;

      // 1) arrancar desde 0
      track.style.transitionDuration = `${duration}ms`;
      track.style.transform = "translateX(0)";

      // 2) en el próximo frame, deslizar a -100% (muestra B)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          track.style.transform = "translateX(-50%)";
        });
      });

      // 3) al terminar: fijar B como A y resetear el track sin que se note
      setTimeout(() => {
        index = next;

        imgA.src = imgB.src;
        imgA.alt = imgB.alt;

        // preparar la próxima imagen en B
        const upcoming = nextIndex(index);
        imgB.src = srcFor(upcoming);
        imgB.alt = "";

        // reset instantáneo
        track.style.transitionDuration = "0ms";
        track.style.transform = "translateX(0)";

        // forzar reflow
        track.offsetHeight;

        // restaurar transición
        track.style.transitionDuration = `${duration}ms`;

        animating = false;
      }, duration + 40);
    }

    function start() {
      stop();
      timer = setInterval(slideOnce, interval);
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
    }

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);

    start();
  });
})();
