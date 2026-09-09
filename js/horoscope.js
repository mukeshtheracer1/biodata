/* =========================================================
   HOROSCOPE PAGE JAVASCRIPT
   Mukesh Sah Marriage Biodata
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       SETTINGS
    ====================================================== */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    const finePointer = window.matchMedia(
        "(pointer: fine)"
    ).matches;



    /* =====================================================
       BIRTH DATE
       
       05 July 1992
       20:29
    ====================================================== */

    const birthDate = new Date(
        1992,
        6,
        5,
        20,
        29,
        0
    );



    /* =====================================================
       PAD NUMBER
    ====================================================== */

    function pad(value) {

        return String(value).padStart(2, "0");

    }



    /* =====================================================
       DAYS IN MONTH
    ====================================================== */

    function daysInMonth(year, month) {

        return new Date(
            year,
            month + 1,
            0
        ).getDate();

    }



    /* =====================================================
       CALCULATE CALENDAR AGE
       
       IMPORTANT:
       This does NOT calculate total hours/minutes
       from 1992.

       It first calculates:

       Years
       ↓
       Months
       ↓
       Days
       ↓
       Hours
       ↓
       Minutes
       ↓
       Seconds
    ====================================================== */

    function calculateAge(now) {

        if (now < birthDate) {

            return {
                years: 0,
                months: 0,
                days: 0,
                hours: 0,
                minutes: 0,
                seconds: 0
            };

        }


        /* ---------------------------------------------
           YEARS
        --------------------------------------------- */

        let years =
            now.getFullYear() -
            birthDate.getFullYear();


        let anniversary =
            new Date(
                birthDate.getFullYear() + years,
                birthDate.getMonth(),
                birthDate.getDate(),
                birthDate.getHours(),
                birthDate.getMinutes(),
                birthDate.getSeconds()
            );


        if (now < anniversary) {

            years--;

            anniversary =
                new Date(
                    birthDate.getFullYear() + years,
                    birthDate.getMonth(),
                    birthDate.getDate(),
                    birthDate.getHours(),
                    birthDate.getMinutes(),
                    birthDate.getSeconds()
                );

        }



        /* ---------------------------------------------
           MONTHS
        --------------------------------------------- */

        let months =
            now.getMonth() -
            anniversary.getMonth();


        if (months < 0) {

            months += 12;

        }


        let monthAnchor =
            new Date(anniversary);


        monthAnchor.setMonth(
            monthAnchor.getMonth() + months
        );


        if (monthAnchor > now) {

            months--;

            monthAnchor =
                new Date(anniversary);

            monthAnchor.setMonth(
                monthAnchor.getMonth() + months
            );

        }



        /* ---------------------------------------------
           REMAINING TIME
        --------------------------------------------- */

        let remaining =
            now.getTime() -
            monthAnchor.getTime();


        const millisecondsPerSecond =
            1000;

        const millisecondsPerMinute =
            millisecondsPerSecond * 60;

        const millisecondsPerHour =
            millisecondsPerMinute * 60;

        const millisecondsPerDay =
            millisecondsPerHour * 24;


        const days =
            Math.floor(
                remaining /
                millisecondsPerDay
            );


        remaining -=
            days *
            millisecondsPerDay;


        const hours =
            Math.floor(
                remaining /
                millisecondsPerHour
            );


        remaining -=
            hours *
            millisecondsPerHour;


        const minutes =
            Math.floor(
                remaining /
                millisecondsPerMinute
            );


        remaining -=
            minutes *
            millisecondsPerMinute;


        const seconds =
            Math.floor(
                remaining /
                millisecondsPerSecond
            );


        return {

            years,
            months,
            days,
            hours,
            minutes,
            seconds

        };

    }



    /* =====================================================
       UPDATE AGE DISPLAY
    ====================================================== */

    function updateLiveAge() {

        const now =
            new Date();


        const age =
            calculateAge(now);


        const years =
            document.getElementById(
                "age-years"
            );


        const months =
            document.getElementById(
                "age-months"
            );


        const days =
            document.getElementById(
                "age-days"
            );


        const hours =
            document.getElementById(
                "age-hours"
            );


        const minutes =
            document.getElementById(
                "age-minutes"
            );


        const seconds =
            document.getElementById(
                "age-seconds"
            );


        if (!years) return;


        years.textContent =
            pad(age.years);


        months.textContent =
            pad(age.months);


        days.textContent =
            pad(age.days);


        hours.textContent =
            pad(age.hours);


        minutes.textContent =
            pad(age.minutes);


        seconds.textContent =
            pad(age.seconds);

    }



    /* =====================================================
       START LIVE AGE
    ====================================================== */

    function initLiveAge() {

        updateLiveAge();


        setInterval(
            updateLiveAge,
            1000
        );

    }



    /* =====================================================
       SCROLL REVEAL
    ====================================================== */

    function initScrollReveal() {

        const elements =
            document.querySelectorAll(
                ".horoscope-page .reveal"
            );


        if (!elements.length) return;


        if (
            reduceMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                (element) => {

                    element.classList.add(
                        "is-visible",
                        "visible"
                    );

                }
            );

            return;

        }


        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(
                        (entry) => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible",
                                "visible"
                            );


                            obs.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.08,

                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );


        elements.forEach(
            (element) => {

                observer.observe(
                    element
                );

            }
        );

    }



    /* =====================================================
       ASTRO ITEM HOVER GLOW
    ====================================================== */

    function initAstroItems() {

        if (
            reduceMotion ||
            !finePointer
        ) return;


        const items =
            document.querySelectorAll(
                ".astro-item"
            );


        items.forEach(
            (item) => {

                item.addEventListener(
                    "pointermove",
                    (event) => {

                        const rect =
                            item.getBoundingClientRect();


                        const x =
                            event.clientX -
                            rect.left;


                        const y =
                            event.clientY -
                            rect.top;


                        item.style.setProperty(
                            "--mouse-x",
                            `${x}px`
                        );


                        item.style.setProperty(
                            "--mouse-y",
                            `${y}px`
                        );

                    }
                );


                item.addEventListener(
                    "pointerleave",
                    () => {

                        item.style.removeProperty(
                            "--mouse-x"
                        );


                        item.style.removeProperty(
                            "--mouse-y"
                        );

                    }
                );

            }
        );

    }



    /* =====================================================
       KUNDLI HOVER EFFECT
    ====================================================== */

    function initKundliEffect() {

        if (
            reduceMotion ||
            !finePointer
        ) return;


        const frame =
            document.querySelector(
                ".kundli-image-frame"
            );


        const image =
            document.querySelector(
                ".kundli-image"
            );


        if (!frame || !image) return;


        frame.addEventListener(
            "pointermove",
            (event) => {

                const rect =
                    frame.getBoundingClientRect();


                const x =
                    (event.clientX -
                        rect.left) /
                        rect.width -
                    0.5;


                const y =
                    (event.clientY -
                        rect.top) /
                        rect.height -
                    0.5;


                const rotateX =
                    (-y * 2).toFixed(2);


                const rotateY =
                    (x * 2).toFixed(2);


                image.style.transform =
                    `perspective(1200px)
                     rotateX(${rotateX}deg)
                     rotateY(${rotateY}deg)
                     scale(1.01)`;

            }
        );


        frame.addEventListener(
            "pointerleave",
            () => {

                image.style.transform =
                    "";

            }
        );

    }



    /* =====================================================
       AGE NUMBER MICRO ANIMATION
    ====================================================== */

    function initAgeNumberEffect() {

        if (reduceMotion) return;


        const seconds =
            document.getElementById(
                "age-seconds"
            );


        if (!seconds) return;


        let previousValue =
            seconds.textContent;


        setInterval(
            () => {

                const currentValue =
                    seconds.textContent;


                if (
                    currentValue ===
                    previousValue
                ) {
                    return;
                }


                seconds.style.transform =
                    "translateY(-3px)";


                requestAnimationFrame(
                    () => {

                        setTimeout(
                            () => {

                                seconds.style.transform =
                                    "";

                            },
                            120
                        );

                    }
                );


                previousValue =
                    currentValue;

            },
            200
        );

    }



    /* =====================================================
       BACK TO TOP
    ====================================================== */

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

                    behavior:
                        reduceMotion
                            ? "auto"
                            : "smooth"

                });

            }
        );

    }



    /* =====================================================
       INITIALIZE HOROSCOPE PAGE
    ====================================================== */

    function initHoroscopePage() {

        if (
            document.body.dataset.page !==
            "horoscope"
        ) {
            return;
        }


        initLiveAge();

        initScrollReveal();

        initAstroItems();

        initKundliEffect();

        initAgeNumberEffect();

        initBackToTop();

    }



    /* =====================================================
       START
    ====================================================== */

    document.addEventListener(
        "DOMContentLoaded",
        initHoroscopePage
    );

})();





































/* =========================================================
   PERSONAL AGE CALCULATOR
   Calculates visitor's age from DOB to LIVE current time
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const dobInput =
        document.getElementById(
            "calculator-dob"
        );


    const timeInput =
        document.getElementById(
            "calculator-time"
        );


    const calculateButton =
        document.getElementById(
            "calculate-age-button"
        );


    const result =
        document.getElementById(
            "calculator-result"
        );


    const error =
        document.getElementById(
            "calculator-error"
        );


    if (
        !dobInput ||
        !timeInput ||
        !calculateButton
    ) {

        return;

    }



    /* =====================================================
       PAD
    ====================================================== */

    function pad(value) {

        return String(value)
            .padStart(2, "0");

    }



    /* =====================================================
       DAYS IN MONTH
    ====================================================== */

    function daysInMonth(
        year,
        month
    ) {

        return new Date(
            year,
            month + 1,
            0
        ).getDate();

    }



    /* =====================================================
       CALCULATE EXACT AGE
    ====================================================== */

    function calculatePersonalAge(
        birth,
        now
    ) {

        if (now < birth) {

            return null;

        }


        let years =
            now.getFullYear() -
            birth.getFullYear();


        let anniversary =
            new Date(
                birth.getFullYear() + years,
                birth.getMonth(),
                birth.getDate(),
                birth.getHours(),
                birth.getMinutes(),
                birth.getSeconds()
            );


        if (now < anniversary) {

            years--;

            anniversary =
                new Date(
                    birth.getFullYear() + years,
                    birth.getMonth(),
                    birth.getDate(),
                    birth.getHours(),
                    birth.getMinutes(),
                    birth.getSeconds()
                );

        }



        /* ---------------------------------------------
           MONTHS
        --------------------------------------------- */

        let months =
            now.getMonth() -
            anniversary.getMonth();


        if (months < 0) {

            months += 12;

        }


        let monthAnchor =
            new Date(anniversary);


        monthAnchor.setMonth(
            monthAnchor.getMonth() + months
        );


        /*
           JavaScript date overflow protection
           Example:
           31 January + 1 month
        */

        if (
            monthAnchor.getDate() !==
            anniversary.getDate()
        ) {

            monthAnchor =
                new Date(
                    anniversary.getFullYear(),
                    anniversary.getMonth() +
                        months + 1,
                    0,
                    anniversary.getHours(),
                    anniversary.getMinutes(),
                    anniversary.getSeconds()
                );

        }


        if (monthAnchor > now) {

            months--;

            monthAnchor =
                new Date(anniversary);


            monthAnchor.setMonth(
                monthAnchor.getMonth() + months
            );

        }



        /* ---------------------------------------------
           REMAINING TIME
        --------------------------------------------- */

        let remaining =
            now.getTime() -
            monthAnchor.getTime();


        const second = 1000;

        const minute =
            second * 60;

        const hour =
            minute * 60;

        const day =
            hour * 24;


        const days =
            Math.floor(
                remaining / day
            );


        remaining -=
            days * day;


        const hours =
            Math.floor(
                remaining / hour
            );


        remaining -=
            hours * hour;


        const minutes =
            Math.floor(
                remaining / minute
            );


        remaining -=
            minutes * minute;


        const seconds =
            Math.floor(
                remaining / second
            );


        return {

            years,
            months,
            days,
            hours,
            minutes,
            seconds

        };

    }



    /* =====================================================
       UPDATE RESULT
    ====================================================== */

    function updatePersonalAge() {

        const dateValue =
            dobInput.value;


        const timeValue =
            timeInput.value ||
            "00:00";


        if (!dateValue) {

            return;

        }


        const [
            year,
            month,
            day
        ] =
            dateValue
                .split("-")
                .map(Number);


        const [
            hours,
            minutes
        ] =
            timeValue
                .split(":")
                .map(Number);


        const birth =
            new Date(
                year,
                month - 1,
                day,
                hours,
                minutes,
                0
            );


        const now =
            new Date();


        const age =
            calculatePersonalAge(
                birth,
                now
            );


        if (!age) {

            error.textContent =
                "Date of birth cannot be in the future.";

            result.classList.remove(
                "is-visible"
            );

            return;

        }


        error.textContent = "";


        document.getElementById(
            "calc-years"
        ).textContent =
            pad(age.years);


        document.getElementById(
            "calc-months"
        ).textContent =
            pad(age.months);


        document.getElementById(
            "calc-days"
        ).textContent =
            pad(age.days);


        document.getElementById(
            "calc-hours"
        ).textContent =
            pad(age.hours);


        document.getElementById(
            "calc-minutes"
        ).textContent =
            pad(age.minutes);


        document.getElementById(
            "calc-seconds"
        ).textContent =
            pad(age.seconds);


        result.classList.add(
            "is-visible"
        );

    }



    /* =====================================================
       CALCULATE BUTTON
    ====================================================== */

    calculateButton.addEventListener(
        "click",
        () => {

            if (!dobInput.value) {

                error.textContent =
                    "Please select your date of birth.";

                result.classList.remove(
                    "is-visible"
                );

                dobInput.focus();

                return;

            }


            updatePersonalAge();

        }
    );



    /* =====================================================
       LIVE UPDATE
       
       Once calculated, result keeps updating every second.
    ====================================================== */

    setInterval(
        () => {

            if (
                result.classList.contains(
                    "is-visible"
                )
            ) {

                updatePersonalAge();

            }

        },
        1000
    );



    /* =====================================================
       OPEN CALCULATOR
    ====================================================== */

    const openCalculator =
        document.getElementById(
            "open-age-calculator"
        );


    const calculatorSection =
        document.getElementById(
            "personal-age-calculator"
        );


    if (
        openCalculator &&
        calculatorSection
    ) {

        openCalculator.addEventListener(
            "click",
            () => {

                setTimeout(
                    () => {

                        dobInput.focus();

                    },
                    400
                );

            }
        );

    }

})();