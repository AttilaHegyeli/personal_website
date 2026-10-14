(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function placeholder(url) {
    if (!url) return true;
    const u = String(url).trim();
    return u === "#" || u === "" || /YOUR_|example\.com/i.test(u);
  }

  function esc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function finishIntro() {
    const intro = document.getElementById("intro");
    document.body.classList.remove("is-intro");
    document.body.classList.add("is-ready");
    if (intro) {
      intro.classList.add("is-done");
      intro.setAttribute("aria-hidden", "true");
      setTimeout(() => intro.remove(), 1200);
    }
    // Start photo parallax after entrance animation settles
    setTimeout(initParallax, reduced ? 0 : 1600);
  }

  /** Movie-style title sequence, then hero reveal */
  function initIntro() {
    const intro = document.getElementById("intro");
    if (!intro) {
      document.body.classList.remove("is-intro");
      document.body.classList.add("is-ready");
      return;
    }

    if (reduced) {
      finishIntro();
      return;
    }

    requestAnimationFrame(() => {
      intro.classList.add("is-play");
    });

    // Title hold → flash → letterbox open → fade out
    setTimeout(() => intro.classList.add("is-flash"), 2400);
    setTimeout(() => intro.classList.add("is-exit"), 2700);
    setTimeout(finishIntro, 2900);
  }

  function initProfile() {
    const img = document.getElementById("profile-image");
    const fb = document.getElementById("profile-fallback");
    if (!img || !fb) return;
    const show = () => {
      img.style.display = "none";
      fb.classList.add("is-on");
    };
    img.addEventListener("error", show);
    if (img.complete && img.naturalWidth === 0) show();
  }

  function initScrollButtons() {
    document.querySelectorAll("[data-scroll-to]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        const el = document.getElementById(btn.getAttribute("data-scroll-to"));
        if (el) {
          el.scrollIntoView({
            behavior: reduced ? "auto" : "smooth",
            block: "start",
          });
        }
      });
    });
  }

  function initReveals() {
    const nodes = document.querySelectorAll("[data-reveal]");
    if (reduced) {
      nodes.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    nodes.forEach((n) => io.observe(n));
  }

  function bindParallax(selector) {
    if (reduced) return;
    const layers = document.querySelectorAll(selector);
    if (!layers.length) return;

    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      layers.forEach((layer) => {
        const speed = parseFloat(layer.getAttribute("data-speed")) || 0;
        layer.style.transform = `translate3d(0, ${y * speed}px, 0)`;
      });
      ticking = false;
    };

    window.addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          requestAnimationFrame(update);
          ticking = true;
        }
      },
      { passive: true }
    );
    update();
  }

  function initSceneParallax() {
    bindParallax(".scene [data-speed]");
  }

  function initParallax() {
    bindParallax(".hero__photo[data-speed]");
  }

  function renderProjects() {
    const root = document.getElementById("projects-grid");
    if (!root || typeof SITE_CONFIG === "undefined") return;

    root.innerHTML = SITE_CONFIG.projects
      .map((p, i) => {
        const num = String(i + 1).padStart(2, "0");
        const statusLabel =
          p.status === "in-progress"
            ? "In progress"
            : p.status === "for company"
              ? "For company"
              : "";
        const status = statusLabel
          ? `<span class="work__status">${statusLabel}</span>`
          : "";
        const tags = (p.technologies || []).join(" · ");
        const off = placeholder(p.github);
        const href = off ? "#" : esc(p.github);

        return `
          <li class="work__item" data-reveal>
            <span class="work__num">${num}</span>
            <div>
              <h3 class="work__title">${esc(p.title)} ${status}</h3>
              <p class="work__desc">${esc(p.description)}</p>
              <p class="work__tags">${esc(tags)}</p>
            </div>
            <a class="work__link ${off ? "is-off" : ""}" href="${href}" ${
              off
                ? 'aria-disabled="true" tabindex="-1"'
                : 'target="_blank" rel="noopener noreferrer"'
            }>Code</a>
          </li>`;
      })
      .join("");
  }

  function renderInternship() {
    const el = document.getElementById("internship-content");
    if (!el || typeof SITE_CONFIG === "undefined" || !SITE_CONFIG.internship) {
      return;
    }
    const i = SITE_CONFIG.internship;
    el.innerHTML = `
      <p class="intern__company">${esc(i.company)}</p>
      <p class="intern__role">${esc(i.title)}</p>
      <p class="intern__desc">${esc(i.description)}</p>
      <p class="intern__tags">${esc((i.technologies || []).join(" · "))}</p>
    `;
  }

  function renderSkills() {
    const el = document.getElementById("skills-line");
    if (!el || typeof SITE_CONFIG === "undefined") return;
    el.innerHTML = SITE_CONFIG.skills.map((s) => esc(s)).join("  ·  ");
  }

  function wireContact() {
    if (typeof SITE_CONFIG === "undefined") return;
    const c = SITE_CONFIG.contact || {};
    const map = [
      { id: "contact-email", href: `mailto:${c.email || ""}`, raw: c.email },
      { id: "contact-github", href: c.github, raw: c.github },
      { id: "contact-instagram", href: c.instagram, raw: c.instagram },
      { id: "contact-whatsapp", href: c.whatsapp, raw: c.whatsapp },
      { id: "footer-github", href: c.github, raw: c.github },
    ];

    map.forEach(({ id, href, raw }) => {
      const node = document.getElementById(id);
      if (!node) return;
      if (placeholder(raw)) {
        node.addEventListener("click", (e) => e.preventDefault());
        node.title = "Set in js/config.js";
      } else {
        node.href = href;
        if (!String(href).startsWith("mailto:")) {
          node.target = "_blank";
          node.rel = "noopener noreferrer";
        }
      }
    });
  }

  function init() {
    renderProjects();
    renderInternship();
    renderSkills();
    initProfile();
    initScrollButtons();
    wireContact();
    const y = document.getElementById("footer-year");
    if (y) y.textContent = String(new Date().getFullYear());
    // Scene bands parallax immediately; photo waits until intro ends
    initSceneParallax();
    initReveals();
    initIntro();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
