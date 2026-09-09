/* =========================================================
   MUKESH SAH — CONTACT PAGE
   js/contact.js
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       REVEAL ANIMATION
       ===================================================== */

    const revealItems = document.querySelectorAll(
        ".contact-page .reveal"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries, obs) => {

                entries.forEach((entry) => {

                    if (!entry.isIntersecting) {
                        return;
                    }

                    entry.target.classList.add("is-visible");

                    obs.unobserve(entry.target);

                });

            },
            {
                threshold: 0.08,
                rootMargin: "0px 0px -40px 0px"
            }
        );

        revealItems.forEach((item) => {
            observer.observe(item);
        });

    } else {

        revealItems.forEach((item) => {
            item.classList.add("is-visible");
        });

    }


    /* =====================================================
       CONTACT BUTTON PRESS EFFECT
       ===================================================== */

    const contactActions =
        document.querySelectorAll(".contact-action");


    contactActions.forEach((button) => {

        button.addEventListener("pointerdown", () => {
            button.classList.add("is-pressed");
        });


        button.addEventListener("pointerup", () => {
            button.classList.remove("is-pressed");
        });


        button.addEventListener("pointercancel", () => {
            button.classList.remove("is-pressed");
        });


        button.addEventListener("pointerleave", () => {
            button.classList.remove("is-pressed");
        });

    });


    /* =====================================================
       ADDRESS ROW HOVER
       Desktop ke liye
       ===================================================== */

    const addressRows =
        document.querySelectorAll(".address-row");


    addressRows.forEach((row) => {

        row.addEventListener("mouseenter", () => {
            row.classList.add("address-row-active");
        });


        row.addEventListener("mouseleave", () => {
            row.classList.remove("address-row-active");
        });

    });


    /* =====================================================
       MOBILE SAFETY
       Touch devices par hover state stuck na rahe
       ===================================================== */

    if ("ontouchstart" in window) {

        addressRows.forEach((row) => {

            row.addEventListener("touchstart", () => {
                row.classList.remove("address-row-active");
            });

        });

    }

});