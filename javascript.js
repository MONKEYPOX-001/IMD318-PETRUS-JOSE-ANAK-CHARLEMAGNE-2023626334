/* Farm Life - shared JavaScript (no external libraries needed) */
document.addEventListener("DOMContentLoaded", () => {
  // ---------------------------
  
  // ---------------------------
  // Welcome popup (assignment markah)
  // Shows on first visit (per browser) and can be reopened by clearing site data
  // ---------------------------
  const welcome = document.getElementById("welcomeOverlay");
  if (welcome) {
    const seenKey = "farmLifeWelcomeSeen";
    const closeBtn = document.getElementById("welcomeClose");
    const okBtn = document.getElementById("welcomeOk");

    const closeWelcome = () => {
      welcome.classList.remove("show");
      try { localStorage.setItem(seenKey, "1"); } catch(e) {}
    };

    // open if not seen
    let seen = false;
    try { seen = localStorage.getItem(seenKey) === "1"; } catch(e) {}
    if (!seen) welcome.classList.add("show");

    // handlers
    if (closeBtn) closeBtn.addEventListener("click", closeWelcome);
    if (okBtn) okBtn.addEventListener("click", closeWelcome);

    // click outside to close
    welcome.addEventListener("click", (e) => {
      if (e.target === welcome) closeWelcome();
    });

    // ESC to close
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && welcome.classList.contains("show")) closeWelcome();
    });
  }

  // Fade-in on scroll
  // ---------------------------
  const faders = document.querySelectorAll(".fade-in");
  if (faders.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.15 }
    );
    faders.forEach((el) => observer.observe(el));
  }

  // ---------------------------
  // Image modal (for .zoomable images)
  // ---------------------------
  const ensureModal = () => {
    let modal = document.getElementById("imgModal");
    if (modal) return modal;

    modal = document.createElement("div");
    modal.id = "imgModal";
    modal.className = "img-modal";
    modal.innerHTML = `
      <span class="close" aria-label="Close">&times;</span>
      <img id="imgModalContent" alt="Preview"/>
    `;
    document.body.appendChild(modal);

    // Close behaviors
    const close = () => modal.classList.remove("open");
    modal.querySelector(".close").addEventListener("click", close);
    modal.addEventListener("click", (e) => {
      if (e.target === modal) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    return modal;
  };

  const modal = ensureModal();
  const modalImg = modal.querySelector("#imgModalContent");

  document.querySelectorAll("img.zoomable").forEach((img) => {
    img.addEventListener("click", () => {
      modalImg.src = img.src;
      modal.classList.add("open");
    });
  });

  // ---------------------------
  // Background music button (index page)
  // ---------------------------
  const music = document.getElementById("bgMusic");
  const musicBtn = document.getElementById("musicBtn");

  if (music && musicBtn) {
    const setIcon = () => {
      musicBtn.textContent = music.paused ? "▶️" : "⏸️";
    };

    musicBtn.addEventListener("click", async () => {
      try {
        if (music.paused) await music.play();
        else music.pause();
        setIcon();
      } catch (err) {
        // Autoplay can be blocked until user interacts; button click should usually fix it.
        console.warn("Music play blocked:", err);
      }
    });

    setIcon();
  }

  // ---------------------------
  // Malaysia time (index page)
  // ---------------------------
  const timeEl = document.getElementById("myTime");
  if (timeEl) {
    const updateMalaysiaTime = () => {
      const options = {
        timeZone: "Asia/Kuala_Lumpur",
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      };
      timeEl.textContent = new Date().toLocaleString("en-MY", options);
    };
    updateMalaysiaTime();
    setInterval(updateMalaysiaTime, 1000);
  }
});


/* =====================
   Welcome Modal (Marks)
===================== */
window.addEventListener("load", () => {
  const modal = document.getElementById("welcomeModal");
  if (!modal) return;

  // show only once per tab/session (still counts as alert feature)
  if (!sessionStorage.getItem("farmLifeVisited")) {
    modal.style.display = "flex";
    sessionStorage.setItem("farmLifeVisited", "true");
  }

  // close on outside click
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeWelcome();
  });

  // close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeWelcome();
  });
});

function closeWelcome() {
  const modal = document.getElementById("welcomeModal");
  if (modal) modal.style.display = "none";
}
