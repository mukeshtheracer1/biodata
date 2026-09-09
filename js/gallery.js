/* =========================================================
   MUKESH SAH
   CINEMATIC MEMORY GALLERY
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================================
       SETTINGS
    ===================================================== */

    const TOTAL_PHOTOS = 31;

    const AUTOPLAY_DELAY = 5000;



    /* =====================================================
       PHOTO PATHS
       photo1.jpg ... photo30.jpg
    ===================================================== */

    const photos = Array.from(
        { length: TOTAL_PHOTOS },
        (_, i) => `../images/photo${i + 1}.jpeg`
    );



    /* =====================================================
       ELEMENTS
    ===================================================== */

    const sliderImage =
        document.getElementById("sliderImage");

    const sliderStage =
        document.getElementById("sliderStage");

    const sliderPrev =
        document.getElementById("sliderPrev");

    const sliderNext =
        document.getElementById("sliderNext");

    const sliderPlay =
        document.getElementById("sliderPlay");

    const sliderFullscreen =
        document.getElementById("sliderFullscreen");

    const counterCurrent =
        document.getElementById("counterCurrent");

    const counterTotal =
        document.getElementById("counterTotal");

    const sliderNumber =
        document.getElementById("sliderNumber");

    const sliderTitle =
        document.getElementById("sliderTitle");

    const progressFill =
        document.getElementById("progressFill");

    const dotsContainer =
        document.getElementById("sliderDots");



    /* =====================================================
       LIGHTBOX ELEMENTS
    ===================================================== */

    const lightbox =
        document.getElementById("galleryLightbox");

    const lightboxImage =
        document.getElementById("lightboxImage");

    const lightboxClose =
        document.getElementById("lightboxClose");

    const lightboxPrev =
        document.getElementById("lightboxPrev");

    const lightboxNext =
        document.getElementById("lightboxNext");

    const lightboxCaption =
        document.getElementById("lightboxCaption");



    /* =====================================================
       STATE
    ===================================================== */

    let currentIndex = 0;

    let isPlaying = true;

    let autoplayTimer = null;

    let progressTimer = null;

    let progressStart = 0;

    let touchStartX = 0;

    let lightboxTouchStartX = 0;

    let isLightboxOpen = false;



    /* =====================================================
       TITLES
    ===================================================== */

    const titles = [

        "A Beautiful Moment",

        "A Moment To Remember",

        "Beautiful Memories",

        "A Story Untold",

        "Moments That Matter",

        "A Special Memory",

        "Forever In Time",

        "A Beautiful Day",

        "Captured With Love",

        "Memories In Motion",

        "A Golden Moment",

        "The Little Things",

        "A Story Worth Keeping",

        "Timeless Memories",

        "One Beautiful Chapter",

        "Moments We Treasure",

        "A Memory Forever",

        "Beautifully Remembered",

        "A Moment That Stays",

        "Our Beautiful Story"

    ];



    /* =====================================================
       CREATE DOTS
    ===================================================== */

    function createDots() {

        if (!dotsContainer) return;


        dotsContainer.innerHTML = "";


        photos.forEach((_, index) => {


            const dot =
                document.createElement("button");


            dot.type = "button";


            dot.className =
                "slider-dot";


            dot.dataset.index =
                index;


            dot.setAttribute(
                "aria-label",
                `Go to memory ${index + 1}`
            );


            dot.addEventListener(
                "click",
                () => {

                    const direction =
                        index < currentIndex
                            ? "prev"
                            : "next";


                    showSlide(
                        index,
                        direction
                    );


                    restartAutoplay();

                }
            );


            dotsContainer.appendChild(dot);

        });

    }



    /* =====================================================
       UPDATE UI
    ===================================================== */

    function updateUI() {


        const number =
            String(currentIndex + 1)
                .padStart(2, "0");



        if (counterCurrent) {

            counterCurrent.textContent =
                number;

        }



        if (counterTotal) {

            counterTotal.textContent =
                String(TOTAL_PHOTOS)
                    .padStart(2, "0");

        }



        if (sliderNumber) {

            sliderNumber.textContent =
                number;

        }



        if (sliderTitle) {

            sliderTitle.textContent =
                titles[currentIndex];

        }



        document
            .querySelectorAll(".slider-dot")
            .forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            });

    }



    /* =====================================================
       SHOW SLIDE
    ===================================================== */

    function showSlide(
        newIndex,
        direction = "next"
    ) {


        if (!sliderImage) return;


        currentIndex =
            (newIndex + TOTAL_PHOTOS)
            % TOTAL_PHOTOS;



        sliderImage.classList.remove(
            "cinematic-next",
            "cinematic-prev"
        );


        void sliderImage.offsetWidth;



        sliderImage.src =
            photos[currentIndex];


        sliderImage.alt =
            `Memory ${currentIndex + 1}`;



        sliderImage.classList.add(

            direction === "prev"
                ? "cinematic-prev"
                : "cinematic-next"

        );



        updateUI();

        resetProgress();

    }



    /* =====================================================
       NEXT
    ===================================================== */

    function nextSlide() {

        showSlide(
            currentIndex + 1,
            "next"
        );

    }



    /* =====================================================
       PREVIOUS
    ===================================================== */

    function previousSlide() {

        showSlide(
            currentIndex - 1,
            "prev"
        );

    }



    /* =====================================================
       NAVIGATION BUTTONS
    ===================================================== */

    sliderNext?.addEventListener(
        "click",
        () => {

            nextSlide();

            restartAutoplay();

        }
    );



    sliderPrev?.addEventListener(
        "click",
        () => {

            previousSlide();

            restartAutoplay();

        }
    );



    /* =====================================================
       AUTOPLAY
    ===================================================== */

    function startAutoplay() {


        stopAutoplay();


        if (!isPlaying) return;


        progressStart =
            performance.now();



        autoplayTimer =
            setTimeout(
                () => {

                    nextSlide();

                    startAutoplay();

                },
                AUTOPLAY_DELAY
            );



        animateProgress();

    }



    function stopAutoplay() {


        if (autoplayTimer) {

            clearTimeout(
                autoplayTimer
            );

        }


        autoplayTimer = null;



        if (progressTimer) {

            cancelAnimationFrame(
                progressTimer
            );

        }


        progressTimer = null;

    }



    function restartAutoplay() {

        stopAutoplay();


        if (isPlaying) {

            startAutoplay();

        }

    }



    /* =====================================================
       PROGRESS
    ===================================================== */

    function animateProgress() {


        if (
            !isPlaying ||
            !progressFill
        ) {

            return;

        }



        const elapsed =
            performance.now()
            - progressStart;



        const percentage =
            Math.min(
                elapsed / AUTOPLAY_DELAY,
                1
            ) * 100;



        progressFill.style.width =
            `${percentage}%`;



        if (percentage < 100) {

            progressTimer =
                requestAnimationFrame(
                    animateProgress
                );

        }

    }



    function resetProgress() {


        if (!progressFill) return;


        progressFill.style.width =
            "0%";


        progressStart =
            performance.now();

    }



    /* =====================================================
       PLAY / PAUSE
    ===================================================== */

    function updatePlayButton() {


        if (!sliderPlay) return;


        sliderPlay.textContent =
            isPlaying
                ? "Ⅱ  PAUSE"
                : "▶  PLAY";

    }



    sliderPlay?.addEventListener(
        "click",
        () => {


            isPlaying =
                !isPlaying;



            updatePlayButton();



            if (isPlaying) {

                startAutoplay();

            } else {

                stopAutoplay();

            }

        }
    );



    /* =====================================================
       LIGHTBOX OPEN
    ===================================================== */

    function openLightbox(index) {


        currentIndex =
            (index + TOTAL_PHOTOS)
            % TOTAL_PHOTOS;


        isLightboxOpen = true;



        if (lightboxImage) {

            lightboxImage.src =
                photos[currentIndex];

            lightboxImage.alt =
                `Memory ${currentIndex + 1}`;

        }



        updateLightboxCaption();

        updateUI();



        lightbox?.classList.add(
            "open"
        );



        document.body.style.overflow =
            "hidden";


        stopAutoplay();

    }



    /* =====================================================
       LIGHTBOX CLOSE
    ===================================================== */

    function closeLightbox() {


        isLightboxOpen = false;



        lightbox?.classList.remove(
            "open"
        );



        document.body.style.overflow =
            "";



        if (isPlaying) {

            startAutoplay();

        }

    }



    /* =====================================================
       LIGHTBOX CAPTION
    ===================================================== */

    function updateLightboxCaption() {


        if (!lightboxCaption) return;


        lightboxCaption.textContent =
            `MEMORY ${String(currentIndex + 1).padStart(2, "0")} / ${String(TOTAL_PHOTOS).padStart(2, "0")}`;

    }



    /* =====================================================
       LIGHTBOX IMAGE
    ===================================================== */

    function updateLightboxImage() {


        if (!lightboxImage) return;


        lightboxImage.style.opacity =
            "0";


        lightboxImage.style.transform =
            "scale(.94)";



        setTimeout(() => {


            lightboxImage.src =
                photos[currentIndex];


            lightboxImage.alt =
                `Memory ${currentIndex + 1}`;



            lightboxImage.style.opacity =
                "1";


            lightboxImage.style.transform =
                "scale(1)";



            updateLightboxCaption();

            updateUI();


        }, 180);

    }



    /* =====================================================
       LIGHTBOX NEXT
    ===================================================== */

    function lightboxNextSlide() {


        currentIndex =
            (currentIndex + 1)
            % TOTAL_PHOTOS;


        updateLightboxImage();

    }



    /* =====================================================
       LIGHTBOX PREVIOUS
    ===================================================== */

    function lightboxPreviousSlide() {


        currentIndex =
            (currentIndex - 1 + TOTAL_PHOTOS)
            % TOTAL_PHOTOS;


        updateLightboxImage();

    }



    /* =====================================================
       LIGHTBOX BUTTONS
    ===================================================== */

    lightboxClose?.addEventListener(
        "click",
        closeLightbox
    );



    lightboxNext?.addEventListener(
        "click",
        lightboxNextSlide
    );



    lightboxPrev?.addEventListener(
        "click",
        lightboxPreviousSlide
    );



    lightbox?.addEventListener(
        "click",
        event => {


            if (
                event.target.classList
                    .contains(
                        "lightbox-backdrop"
                    )
            ) {

                closeLightbox();

            }

        }
    );



    /* =====================================================
       FULLSCREEN
    ===================================================== */

    sliderFullscreen?.addEventListener(
        "click",
        () => {

            openLightbox(
                currentIndex
            );

        }
    );



    /* =====================================================
       KEYBOARD
    ===================================================== */

    document.addEventListener(
        "keydown",
        event => {


            if (isLightboxOpen) {


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    lightboxNextSlide();

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    lightboxPreviousSlide();

                }


                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLightbox();

                }


                return;

            }



            if (
                event.key ===
                "ArrowRight"
            ) {

                nextSlide();

                restartAutoplay();

            }



            if (
                event.key ===
                "ArrowLeft"
            ) {

                previousSlide();

                restartAutoplay();

            }



            if (
                event.code ===
                "Space"
            ) {


                event.preventDefault();


                isPlaying =
                    !isPlaying;


                updatePlayButton();



                if (isPlaying) {

                    startAutoplay();

                } else {

                    stopAutoplay();

                }

            }

        }
    );



    /* =====================================================
       SLIDER TOUCH SWIPE
    ===================================================== */

    sliderStage?.addEventListener(
        "touchstart",
        event => {

            touchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );



    sliderStage?.addEventListener(
        "touchend",
        event => {


            const touchEndX =
                event.changedTouches[0]
                    .screenX;



            const distance =
                touchEndX -
                touchStartX;



            if (
                Math.abs(distance) < 50
            ) {

                return;

            }



            if (distance < 0) {

                nextSlide();

            } else {

                previousSlide();

            }



            restartAutoplay();

        },
        {
            passive: true
        }
    );



    /* =====================================================
       LIGHTBOX TOUCH SWIPE
    ===================================================== */

    lightbox?.addEventListener(
        "touchstart",
        event => {

            lightboxTouchStartX =
                event.changedTouches[0]
                    .screenX;

        },
        {
            passive: true
        }
    );



    lightbox?.addEventListener(
        "touchend",
        event => {


            const endX =
                event.changedTouches[0]
                    .screenX;



            const distance =
                endX -
                lightboxTouchStartX;



            if (
                Math.abs(distance) < 50
            ) {

                return;

            }



            if (distance < 0) {

                lightboxNextSlide();

            } else {

                lightboxPreviousSlide();

            }

        },
        {
            passive: true
        }
    );



    /* =====================================================
       PAUSE ON HOVER
    ===================================================== */

    sliderStage?.addEventListener(
        "mouseenter",
        () => {


            if (isPlaying) {

                stopAutoplay();

            }

        }
    );



    sliderStage?.addEventListener(
        "mouseleave",
        () => {


            if (
                isPlaying &&
                !isLightboxOpen
            ) {

                startAutoplay();

            }

        }
    );



    /* =====================================================
       VISIBILITY
    ===================================================== */

    document.addEventListener(
        "visibilitychange",
        () => {


            if (document.hidden) {

                stopAutoplay();

            } else if (
                isPlaying &&
                !isLightboxOpen
            ) {

                startAutoplay();

            }

        }
    );



    /* =====================================================
       PRELOAD
    ===================================================== */

    function preloadImages() {


        photos.forEach(
            src => {

                const image =
                    new Image();

                image.src =
                    src;

            }
        );

    }



    /* =====================================================
       INITIALIZE
    ===================================================== */

    createDots();

    updateUI();

    updatePlayButton();

    preloadImages();

    showSlide(
        0,
        "next"
    );

    startAutoplay();


});
