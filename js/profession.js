/* =========================================================
   PROFESSION PAGE JAVASCRIPT
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


  /* =======================================================
     SCROLL REVEAL
     ======================================================= */

  function initScrollReveal() {
    const elements = document.querySelectorAll(
      ".profession-page .reveal"
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


  /* =======================================================
     STAGGER ANIMATION
     ======================================================= */

  function initStagger() {

    const groups = [
      ".profession-card",
      ".skill-card",
      ".summary-point"
    ];

    groups.forEach((selector) => {

      const elements =
        document.querySelectorAll(
          `.profession-page ${selector}`
        );

      elements.forEach((element, index) => {

        element.style.setProperty(
          "--profession-delay",
          `${Math.min(index * 80, 400)}ms`
        );

      });

    });
  }


  /* =======================================================
     PROFESSION CARD TILT
     ======================================================= */

  function initCardTilt() {

    if (reduceMotion || !finePointer) return;

    const cards =
      document.querySelectorAll(
        ".profession-card"
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
            (-y * 3).toFixed(2);

          const rotateY =
            (x * 3).toFixed(2);

          card.style.transform =
            `perspective(900px)
             rotateX(${rotateX}deg)
             rotateY(${rotateY}deg)
             translateY(-5px)`;

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


  /* =======================================================
     SKILL CARD HOVER EFFECT
     ======================================================= */

  function initSkillCards() {

    if (reduceMotion || !finePointer) return;

    const cards =
      document.querySelectorAll(
        ".skill-card"
      );

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
            "--skill-mouse-x",
            `${x}px`
          );

          card.style.setProperty(
            "--skill-mouse-y",
            `${y}px`
          );

        }
      );

      card.addEventListener(
        "pointerleave",
        () => {

          card.style.removeProperty(
            "--skill-mouse-x"
          );

          card.style.removeProperty(
            "--skill-mouse-y"
          );

        }
      );

    });
  }


  /* =======================================================
     EXPERIENCE CARD EFFECT
     ======================================================= */

  function initExperienceEffect() {

    if (reduceMotion || !finePointer) return;

    const card =
      document.querySelector(
        ".experience-card"
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
          "--experience-x",
          `${(x * 8).toFixed(2)}px`
        );

        card.style.setProperty(
          "--experience-y",
          `${(y * 5).toFixed(2)}px`
        );

      }
    );

    card.addEventListener(
      "pointerleave",
      () => {

        card.style.setProperty(
          "--experience-x",
          "0px"
        );

        card.style.setProperty(
          "--experience-y",
          "0px"
        );

      }
    );
  }


  /* =======================================================
     SUMMARY CARD EFFECT
     ======================================================= */

  function initSummaryEffect() {

    if (reduceMotion || !finePointer) return;

    const card =
      document.querySelector(
        ".profession-summary-card"
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
          "--summary-x",
          `${(x * 7).toFixed(2)}px`
        );

        card.style.setProperty(
          "--summary-y",
          `${(y * 5).toFixed(2)}px`
        );

      }
    );

    card.addEventListener(
      "pointerleave",
      () => {

        card.style.setProperty(
          "--summary-x",
          "0px"
        );

        card.style.setProperty(
          "--summary-y",
          "0px"
        );

      }
    );
  }


  /* =======================================================
     BACK TO TOP
     ======================================================= */

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


  /* =======================================================
     PAGE INITIALIZATION
     ======================================================= */

  function initProfessionPage() {

    if (
      document.body.dataset.page !==
      "profession"
    ) {
      return;
    }

    initStagger();
    initScrollReveal();
    initCardTilt();
    initSkillCards();
    initExperienceEffect();
    initSummaryEffect();
    initBackToTop();

  }


  /* =======================================================
     START
     ======================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    initProfessionPage
  );

})();