(() => {
  "use strict";

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  function initGanesh() {
    const intro = document.querySelector(".ganesh-intro");
    const hero = document.querySelector(".hero-section");
    if (!intro) return;

    // Critical fix: Ganesh is permanent. No timeout, no opacity:0, no display:none.
    intro.classList.add("ganesh-permanent");
    if (hero) hero.classList.add("hero-revealed");

    // Gentle breathing only; reduced-motion users get a static version.
    if (!reduceMotion) intro.classList.add("ganesh-animation-ready");
  }

  function initPointerEffects() {
    if (reduceMotion || !finePointer) return;
    const stage = document.querySelector(".profile-photo-stage");
    const photo = document.querySelector(".profile-photo-box");
    const cards = document.querySelectorAll(".detail-box");

    if (stage) {
      stage.addEventListener("pointermove", e => {
        const r = stage.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        stage.style.setProperty("--photo-move-x", `${x*8}px`);
        stage.style.setProperty("--photo-move-y", `${y*8}px`);
      });
      stage.addEventListener("pointerleave", () => {
        stage.style.setProperty("--photo-move-x","0px");
        stage.style.setProperty("--photo-move-y","0px");
      });
    }

    if (photo) {
      photo.addEventListener("pointermove", e => {
        const r = photo.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width-.5;
        const y = (e.clientY-r.top)/r.height-.5;
        photo.style.transform = `perspective(900px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*4).toFixed(2)}deg) translateZ(5px)`;
      });
      photo.addEventListener("pointerleave", () => photo.style.transform = "");
    }

    cards.forEach(card => {
      card.addEventListener("pointermove", e => {
        const r=card.getBoundingClientRect();
        const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
        card.style.transform=`perspective(700px) rotateX(${(-y*2).toFixed(2)}deg) rotateY(${(x*2).toFixed(2)}deg) translateY(-2px)`;
      });
      card.addEventListener("pointerleave", () => card.style.transform="");
    });
  }

  function initScrollReveal() {
    const els = document.querySelectorAll(".reveal");
    if (!els.length) return;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      els.forEach(e => e.classList.add("is-visible"));
      return;
    }
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); io.unobserve(entry.target); }
    }), {threshold:.08});
    els.forEach(e => io.observe(e));
  }

  document.addEventListener("DOMContentLoaded", () => {
    initGanesh();
    initPointerEffects();
    initScrollReveal();
  });
})();