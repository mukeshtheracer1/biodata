
/* =========================================================
   MUKESH SAH — LUXURY MARRIAGE BIODATA
   MAIN JAVASCRIPT
   File: js/main.js

   Handles:
   ✓ Reusable Header
   ✓ Reusable Footer
   ✓ GitHub Pages paths
   ✓ Desktop navigation
   ✓ Mobile navigation
   ✓ Active navigation
   ✓ Header scroll effect
   ✓ Back to top
   ✓ Smooth navigation
   ========================================================= */

(() => {
  "use strict";

  /* =======================================================
     01. BASIC HELPERS
     ======================================================= */

  const $ = (selector, parent = document) =>
    parent.querySelector(selector);

  const $$ = (selector, parent = document) =>
    [...parent.querySelectorAll(selector)];


  /* =======================================================
     02. DETECT PAGE LOCATION
     ======================================================= */

  const isPagesFolder =
    window.location.pathname.includes("/pages/");

  /*
    Root:
      index.html
      components/header.html

    Pages:
      pages/about.html
      ../components/header.html
  */

  const pathPrefix = isPagesFolder ? "../" : "";


  /* =======================================================
     03. COMPONENT LOADER
     ======================================================= */

  async function loadComponent(elementId, filePath) {
    const container = document.getElementById(elementId);

    if (!container) return false;

    try {
      const response = await fetch(
        `${pathPrefix}${filePath}`,
        {
          cache: "no-cache"
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}: ${response.statusText}`
        );
      }

      container.innerHTML = await response.text();

      return true;

    } catch (error) {
      console.error(
        `Component loading failed: ${filePath}`,
        error
      );

      container.innerHTML = "";

      return false;
    }
  }


  /* =======================================================
     04. LOAD HEADER + FOOTER
     ======================================================= */

  async function loadComponents() {

    const [headerLoaded, footerLoaded] =
      await Promise.all([
        loadComponent(
          "site-header",
          "components/header.html"
        ),

        loadComponent(
          "site-footer",
          "components/footer.html"
        )
      ]);

    if (headerLoaded) {
      fixNavigationPaths();
      initMobileMenu();
      initActiveNavigation();
      initHeaderScroll();
    }

    if (footerLoaded) {
      initBackToTop();
      initFooterYear();
    }
  }


  /* =======================================================
     05. NAVIGATION PATH FIX
     ======================================================= */

  function fixNavigationPaths() {

    const header =
      document.getElementById("site-header");

    if (!header) return;

    const links =
      $$("[data-page]", header);

    links.forEach(link => {

      const page =
        link.getAttribute("data-page");

      if (!page) return;


      /*
        HOME
      */

      if (page === "home") {

        link.href =
          isPagesFolder
            ? "../index.html"
            : "index.html";

        return;
      }


      /*
        OTHER PAGES
      */

      link.href =
        isPagesFolder
          ? `${page}.html`
          : `pages/${page}.html`;
    });
  }


  /* =======================================================
     06. MOBILE MENU
     ======================================================= */

  function initMobileMenu() {

    const menuButton =
      document.getElementById("menu-btn");

    const mobileNav =
      document.getElementById("mobile-nav");

    if (!menuButton || !mobileNav) return;


    /*
      Prevent duplicate event listeners
    */

    if (menuButton.dataset.initialized === "true") {
      return;
    }

    menuButton.dataset.initialized = "true";


    menuButton.addEventListener("click", () => {

      const isOpen =
        mobileNav.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      document.body.classList.toggle(
        "menu-open",
        isOpen
      );
    });


    /*
      Close menu when clicking a link
    */

    $$("a", mobileNav).forEach(link => {

      link.addEventListener("click", () => {

        mobileNav.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "menu-open"
        );
      });
    });


    /*
      Close menu with ESC
    */

    document.addEventListener(
      "keydown",
      event => {

        if (event.key !== "Escape") return;

        mobileNav.classList.remove("open");

        menuButton.setAttribute(
          "aria-expanded",
          "false"
        );

        document.body.classList.remove(
          "menu-open"
        );
      }
    );
  }


  /* =======================================================
     07. ACTIVE NAVIGATION
     ======================================================= */

  function initActiveNavigation() {

    const header =
      document.getElementById("site-header");

    if (!header) return;


    const currentPage =
      document.body.dataset.page;

    if (!currentPage) return;


    $$("[data-page]", header).forEach(link => {

      const linkPage =
        link.getAttribute("data-page");

      const isActive =
        linkPage === currentPage;

      link.classList.toggle(
        "active",
        isActive
      );

      if (isActive) {

        link.setAttribute(
          "aria-current",
          "page"
        );

      } else {

        link.removeAttribute(
          "aria-current"
        );
      }
    });
  }


  /* =======================================================
     08. HEADER SCROLL EFFECT
     ======================================================= */

  function initHeaderScroll() {

    const header =
      document.getElementById("site-header");

    if (!header) return;


    const updateHeader =
      () => {

        const scrolled =
          window.scrollY > 30;

        header.classList.toggle(
          "scrolled",
          scrolled
        );

        /*
          Also support .is-scrolled
          for compatibility.
        */

        header.classList.toggle(
          "is-scrolled",
          scrolled
        );
      };


    updateHeader();


    let ticking = false;

    window.addEventListener(
      "scroll",
      () => {

        if (ticking) return;

        ticking = true;

        requestAnimationFrame(() => {

          updateHeader();

          ticking = false;
        });
      },
      {
        passive: true
      }
    );
  }


  /* =======================================================
     09. BACK TO TOP
     ======================================================= */

  function initBackToTop() {

    const button =
      document.querySelector(
        ".footer-top-button"
      );

    if (!button) return;


    /*
      Prevent duplicate listener
    */

    if (button.dataset.initialized === "true") {
      return;
    }

    button.dataset.initialized = "true";


    button.addEventListener(
      "click",
      event => {

        event.preventDefault();

        window.scrollTo({
          top: 0,
          behavior:
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
              ? "auto"
              : "smooth"
        });
      }
    );
  }


  /* =======================================================
     10. FOOTER YEAR
     ======================================================= */

  function initFooterYear() {

    const yearElements =
      $$("[data-current-year]");

    if (!yearElements.length) return;

    const year =
      new Date().getFullYear();

    yearElements.forEach(element => {
      element.textContent = year;
    });
  }


  /* =======================================================
     11. GLOBAL SMOOTH ANCHOR LINKS
     ======================================================= */

  function initSmoothAnchors() {

    document.addEventListener(
      "click",
      event => {

        const link =
          event.target.closest(
            'a[href^="#"]'
          );

        if (!link) return;

        const targetId =
          link.getAttribute("href");

        if (!targetId || targetId === "#") {
          return;
        }

        const target =
          document.querySelector(targetId);

        if (!target) return;

        event.preventDefault();

        target.scrollIntoView({
          behavior:
            window.matchMedia(
              "(prefers-reduced-motion: reduce)"
            ).matches
              ? "auto"
              : "smooth",
          block: "start"
        });
      }
    );
  }


  /* =======================================================
     12. PAGE LOAD ANIMATION
     ======================================================= */

  function initPageReady() {

    requestAnimationFrame(() => {

      document.body.classList.add(
        "page-ready"
      );
    });
  }


  /* =======================================================
     13. INITIALIZE EVERYTHING
     ======================================================= */

  document.addEventListener(
    "DOMContentLoaded",
    async () => {

      initPageReady();

      initSmoothAnchors();

      await loadComponents();
    }
  );

})();

