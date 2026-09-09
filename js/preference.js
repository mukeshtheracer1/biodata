(() => {
  "use strict";

  /* =========================================================
     PREFERENCE PAGE JS
     ========================================================= */

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;


  /* =========================================================
     SCROLL REVEAL
     ========================================================= */

  function initScrollReveal() {
    const elements = document.querySelectorAll(
      ".preference-page .reveal"
    );

    if (!elements.length) return;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add("is-visible", "visible");
      });

      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {

          if (!entry.isIntersecting) return;

          entry.target.classList.add(
            "is-visible",
            "visible"
          );

          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -35px 0px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }


  /* =========================================================
     STAGGER ANIMATION
     ========================================================= */

  function initStagger() {

    const groups = [
      ".preference-highlight",
      ".essential-row",
      ".detail-item"
    ];

    groups.forEach((selector) => {

      const elements = document.querySelectorAll(
        `.preference-page ${selector}`
      );

      elements.forEach((element, index) => {

        const delay = Math.min(
          index * 80,
          480
        );

        element.style.setProperty(
          "--preference-delay",
          `${delay}ms`
        );

        element.style.transitionDelay =
          `${delay}ms`;
      });

    });
  }


  /* =========================================================
     HIGHLIGHT CARD MOUSE GLOW
     ========================================================= */

  function initHighlightGlow() {

    if (reduceMotion || !finePointer) return;

    const cards = document.querySelectorAll(
      ".preference-highlight"
    );

    if (!cards.length) return;

    cards.forEach((card) => {

      card.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const y =
            event.clientY - rect.top;

          card.style.setProperty(
            "--mouse-x",
            `${x}px`
          );

          card.style.setProperty(
            "--mouse-y",
            `${y}px`
          );

          card.style.background = `
            radial-gradient(
              220px circle at ${x}px ${y}px,
              rgba(212,166,58,.08),
              transparent 70%
            ),
            linear-gradient(
              145deg,
              rgba(255,255,255,.035),
              transparent
            )
          `;
        }
      );

      card.addEventListener(
        "pointerleave",
        () => {

          card.style.background = "";

          card.style.removeProperty(
            "--mouse-x"
          );

          card.style.removeProperty(
            "--mouse-y"
          );
        }
      );

    });
  }


  /* =========================================================
     ESSENTIAL FEATURE PARALLAX
     ========================================================= */

  function initEssentialFeature() {

    if (reduceMotion || !finePointer) return;

    const feature = document.querySelector(
      ".essential-feature"
    );

    if (!feature) return;

    feature.addEventListener(
      "pointermove",
      (event) => {

        const rect =
          feature.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
            rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
            rect.height -
          0.5;

        const moveX =
          (x * 8).toFixed(2);

        const moveY =
          (y * 6).toFixed(2);

        feature.style.transform = `
          translate3d(
            ${moveX}px,
            ${moveY}px,
            0
          )
        `;
      }
    );

    feature.addEventListener(
      "pointerleave",
      () => {
        feature.style.transform = "";
      }
    );
  }


  /* =========================================================
     ESSENTIAL ROW EFFECT
     ========================================================= */

  function initEssentialRows() {

    if (reduceMotion || !finePointer) return;

    const rows = document.querySelectorAll(
      ".essential-row"
    );

    rows.forEach((row) => {

      row.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            row.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const percentage =
            Math.max(
              0,
              Math.min(
                100,
                (x / rect.width) * 100
              )
            );

          row.style.setProperty(
            "--row-x",
            `${percentage}%`
          );
        }
      );

      row.addEventListener(
        "pointerleave",
        () => {

          row.style.removeProperty(
            "--row-x"
          );
        }
      );

    });
  }


  /* =========================================================
     DETAIL ICON EFFECT
     ========================================================= */

  function initDetailEffects() {

    if (reduceMotion || !finePointer) return;

    const items = document.querySelectorAll(
      ".detail-item"
    );

    items.forEach((item) => {

      const icon =
        item.querySelector(".detail-icon");

      if (!icon) return;

      item.addEventListener(
        "pointerenter",
        () => {

          icon.style.transform =
            "scale(1.1) rotate(6deg)";

          icon.style.boxShadow =
            "0 0 22px rgba(212,166,58,.30)";
        }
      );

      item.addEventListener(
        "pointerleave",
        () => {

          icon.style.transform = "";

          icon.style.boxShadow = "";
        }
      );

    });
  }


  /* =========================================================
     STATEMENT PARALLAX
     ========================================================= */

  function initStatementEffect() {

    if (reduceMotion || !finePointer) return;

    const statement =
      document.querySelector(
        ".preference-statement"
      );

    const mark =
      document.querySelector(
        ".statement-mark"
      );

    if (!statement || !mark) return;

    statement.addEventListener(
      "pointermove",
      (event) => {

        const rect =
          statement.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
            rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
            rect.height -
          0.5;

        mark.style.transform = `
          translate(
            ${(x * 7).toFixed(2)}px,
            ${(y * 5).toFixed(2)}px
          )
        `;
      }
    );

    statement.addEventListener(
      "pointerleave",
      () => {
        mark.style.transform = "";
      }
    );
  }


  /* =========================================================
     CLOSING HEART EFFECT
     ========================================================= */

  function initClosingEffect() {

    const symbol =
      document.querySelector(
        ".closing-symbol"
      );

    if (!symbol) return;

    if (reduceMotion) return;

    let pulse = 0;

    setInterval(() => {

      pulse += 1;

      if (document.hidden) return;

      symbol.style.transform =
        pulse % 2 === 0
          ? "scale(1)"
          : "scale(1.08)";

    }, 1800);
  }


  /* =========================================================
     PAGE SCROLL GLOW
     ========================================================= */

  function initPageGlow() {

    if (reduceMotion) return;

    const page =
      document.querySelector(
        ".preference-page"
      );

    if (!page) return;

    let ticking = false;

    function updateGlow() {

      const scrollTop =
        window.scrollY || 0;

      const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

      const progress =
        maxScroll > 0
          ? scrollTop / maxScroll
          : 0;

      page.style.setProperty(
        "--page-progress",
        progress.toFixed(3)
      );

      ticking = false;
    }

    window.addEventListener(
      "scroll",
      () => {

        if (ticking) return;

        window.requestAnimationFrame(
          updateGlow
        );

        ticking = true;
      },
      { passive: true }
    );

    updateGlow();
  }


  /* =========================================================
     BACK TO TOP
     ========================================================= */

  function initBackToTop() {

    const button =
      document.querySelector(
        ".footer-top-button"
      );

    if (!button) return;

    button.addEventListener(
      "click",
      (event) => {

        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior: reduceMotion
            ? "auto"
            : "smooth"
        });
      }
    );
  }


  /* =========================================================
     ACTIVE PAGE CHECK
     ========================================================= */

  function initPreferencePage() {

    if (
      document.body.dataset.page !==
      "preference"
    ) {
      return;
    }

    initStagger();
    initScrollReveal();
    initHighlightGlow();
    initEssentialFeature();
    initEssentialRows();
    initDetailEffects();
    initStatementEffect();
    initClosingEffect();
    initPageGlow();
    initBackToTop();
  }


  /* =========================================================
     START
     ========================================================= */

  if (
    document.readyState ===
    "loading"
  ) {
    document.addEventListener(
      "DOMContentLoaded",
      initPreferencePage
    );
  } else {
    initPreferencePage();
  }

})();