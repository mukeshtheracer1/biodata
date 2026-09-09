/* =========================================================
   ABOUT PAGE JAVASCRIPT
   Mukesh Sah — Marriage Biodata
   ========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ---------------------------------------------------------
     1. PAGE REVEAL
     Supports both .is-visible and .visible
     --------------------------------------------------------- */

  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal");

    if (!elements.length) return;

    // Show everything immediately when reduced motion is enabled
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

          entry.target.classList.add("is-visible", "visible");
          obs.unobserve(entry.target);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    elements.forEach((element) => {
      observer.observe(element);
    });
  }

  /* ---------------------------------------------------------
     2. VALUE CARD POINTER EFFECT
     Desktop / fine pointer only
     --------------------------------------------------------- */

  function initCardEffects() {
    if (reduceMotion) return;

    const finePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    if (!finePointer) return;

    const cards = document.querySelectorAll(
      ".about-card, .value-card, .lifestyle-card"
    );

    if (!cards.length) return;

    cards.forEach((card) => {
      card.addEventListener("pointermove", (event) => {
        const rect = card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) / rect.width - 0.5;

        const y =
          (event.clientY - rect.top) / rect.height - 0.5;

        const rotateX = (-y * 2.5).toFixed(2);
        const rotateY = (x * 2.5).toFixed(2);

        card.style.transform = `
          perspective(900px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          translateY(-3px)
        `;
      });

      card.addEventListener("pointerleave", () => {
        card.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     3. GOLD GLOW FOLLOWER
     Subtle mouse position effect on desktop
     --------------------------------------------------------- */

  function initGlowEffect() {
    if (reduceMotion) return;

    const finePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    if (!finePointer) return;

    const page = document.querySelector(".about-page");

    if (!page) return;

    page.addEventListener("pointermove", (event) => {
      const x = event.clientX;
      const y = event.clientY;

      page.style.setProperty(
        "--mouse-x",
        `${x}px`
      );

      page.style.setProperty(
        "--mouse-y",
        `${y}px`
      );
    });
  }

  /* ---------------------------------------------------------
     4. LIFESTYLE ITEMS STAGGER
     Adds small progressive delay without changing CSS
     --------------------------------------------------------- */

  function initLifestyleStagger() {
    const items = document.querySelectorAll(
      ".lifestyle-item"
    );

    if (!items.length) return;

    items.forEach((item, index) => {
      item.style.setProperty(
        "--item-delay",
        `${index * 70}ms`
      );
    });
  }

  /* ---------------------------------------------------------
     5. QUOTE PARALLAX
     Very subtle effect
     --------------------------------------------------------- */

  function initQuoteEffect() {
    if (reduceMotion) return;

    const finePointer = window.matchMedia(
      "(pointer: fine)"
    ).matches;

    if (!finePointer) return;

    const quote = document.querySelector(
      ".about-quote"
    );

    if (!quote) return;

    quote.addEventListener("pointermove", (event) => {
      const rect = quote.getBoundingClientRect();

      const x =
        (event.clientX - rect.left) / rect.width - 0.5;

      const y =
        (event.clientY - rect.top) / rect.height - 0.5;

      quote.style.setProperty(
        "--quote-x",
        `${(x * 5).toFixed(2)}px`
      );

      quote.style.setProperty(
        "--quote-y",
        `${(y * 5).toFixed(2)}px`
      );
    });

    quote.addEventListener("pointerleave", () => {
      quote.style.setProperty(
        "--quote-x",
        "0px"
      );

      quote.style.setProperty(
        "--quote-y",
        "0px"
      );
    });
  }

  /* ---------------------------------------------------------
     6. INITIALIZE
     --------------------------------------------------------- */

  function initAboutPage() {
    initScrollReveal();
    initCardEffects();
    initGlowEffect();
    initLifestyleStagger();
    initQuoteEffect();
  }

  document.addEventListener(
    "DOMContentLoaded",
    initAboutPage
  );

})();