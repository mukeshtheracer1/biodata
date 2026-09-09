/* =========================================================
   PROFILE PAGE JAVASCRIPT
   Mukesh Sah — Marriage Biodata
   ========================================================= */

(() => {
  "use strict";

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  const finePointer = window.matchMedia(
    "(pointer: fine)"
  ).matches;


  /* ---------------------------------------------------------
     1. SCROLL REVEAL
     --------------------------------------------------------- */

  function initScrollReveal() {
    const elements = document.querySelectorAll(
      ".profile-page .reveal"
    );

    if (!elements.length) return;

    if (
      reduceMotion ||
      !("IntersectionObserver" in window)
    ) {
      elements.forEach((element) => {
        element.classList.add(
          "is-visible",
          "visible"
        );
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


  /* ---------------------------------------------------------
     2. STAGGER REVEAL
     --------------------------------------------------------- */

  function initStagger() {
    const groups = [
      ".profile-detail-item",
      ".background-card",
      ".lifestyle-card",
      ".value-point"
    ];

    groups.forEach((selector) => {
      const items = document.querySelectorAll(
        `.profile-page ${selector}`
      );

      items.forEach((item, index) => {
        item.style.setProperty(
          "--profile-delay",
          `${Math.min(index * 65, 320)}ms`
        );
      });
    });
  }


  /* ---------------------------------------------------------
     3. DESKTOP CARD TILT
     --------------------------------------------------------- */

  function initCardTilt() {
    if (reduceMotion || !finePointer) return;

    const cards = document.querySelectorAll(
      ".profile-identity-card, " +
      ".background-card, " +
      ".lifestyle-card"
    );

    if (!cards.length) return;

    cards.forEach((card) => {

      card.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            card.getBoundingClientRect();

          const x =
            (event.clientX - rect.left) /
              rect.width -
            0.5;

          const y =
            (event.clientY - rect.top) /
              rect.height -
            0.5;

          const rotateX =
            (-y * 2.5).toFixed(2);

          const rotateY =
            (x * 2.5).toFixed(2);

          card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-4px)`;
        }
      );

      card.addEventListener(
        "pointerleave",
        () => {
          card.style.transform = "";
        }
      );
    });
  }


  /* ---------------------------------------------------------
     4. INFORMATION CARD HOVER GLOW
     --------------------------------------------------------- */

  function initInformationGlow() {
    if (reduceMotion || !finePointer) return;

    const items = document.querySelectorAll(
      ".profile-detail-item"
    );

    items.forEach((item) => {

      item.addEventListener(
        "pointermove",
        (event) => {

          const rect =
            item.getBoundingClientRect();

          const x =
            event.clientX - rect.left;

          const y =
            event.clientY - rect.top;

          item.style.setProperty(
            "--detail-x",
            `${x}px`
          );

          item.style.setProperty(
            "--detail-y",
            `${y}px`
          );
        }
      );

      item.addEventListener(
        "pointerleave",
        () => {
          item.style.removeProperty(
            "--detail-x"
          );

          item.style.removeProperty(
            "--detail-y"
          );
        }
      );
    });
  }


  /* ---------------------------------------------------------
     5. VALUES CARD MOUSE EFFECT
     --------------------------------------------------------- */

  function initValuesEffect() {
    if (reduceMotion || !finePointer) return;

    const card = document.querySelector(
      ".profile-values-card"
    );

    if (!card) return;

    card.addEventListener(
      "pointermove",
      (event) => {

        const rect =
          card.getBoundingClientRect();

        const x =
          (event.clientX - rect.left) /
            rect.width -
          0.5;

        const y =
          (event.clientY - rect.top) /
            rect.height -
          0.5;

        card.style.setProperty(
          "--values-x",
          `${(x * 8).toFixed(2)}px`
        );

        card.style.setProperty(
          "--values-y",
          `${(y * 5).toFixed(2)}px`
        );
      }
    );

    card.addEventListener(
      "pointerleave",
      () => {
        card.style.setProperty(
          "--values-x",
          "0px"
        );

        card.style.setProperty(
          "--values-y",
          "0px"
        );
      }
    );
  }


  /* ---------------------------------------------------------
     6. PAGE MOUSE GLOW
     --------------------------------------------------------- */

  function initPageGlow() {
    if (reduceMotion || !finePointer) return;

    const page = document.querySelector(
      ".profile-page"
    );

    if (!page) return;

    let ticking = false;

    page.addEventListener(
      "pointermove",
      (event) => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {

          page.style.setProperty(
            "--profile-mouse-x",
            `${event.clientX}px`
          );

          page.style.setProperty(
            "--profile-mouse-y",
            `${event.clientY}px`
          );

          ticking = false;
        });
      }
    );
  }


  /* ---------------------------------------------------------
     7. BACK TO TOP SUPPORT
     --------------------------------------------------------- */

  function initBackToTop() {
    const button = document.querySelector(
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


  /* ---------------------------------------------------------
     8. INITIALIZE
     --------------------------------------------------------- */

  function initProfilePage() {

    // Only run on Profile page
    if (
      document.body.dataset.page !== "profile"
    ) {
      return;
    }

    initStagger();
    initScrollReveal();
    initCardTilt();
    initInformationGlow();
    initValuesEffect();
    initPageGlow();
    initBackToTop();
  }


  document.addEventListener(
    "DOMContentLoaded",
    initProfilePage
  );

})();