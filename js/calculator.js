/* =========================================================
   MUKESH SAH — AGE & DATE CALCULATOR
   File: js/calculator.js
========================================================= */

(() => {

    "use strict";


    /* =====================================================
       ELEMENTS
    ====================================================== */

    const birthDateInput =
        document.getElementById("birthDate");

    const asOfDateInput =
        document.getElementById("asOfDate");

    const calculateAgeBtn =
        document.getElementById("calculateAgeBtn");

    const resetCalculatorBtn =
        document.getElementById("resetCalculatorBtn");

    const calculatorMessage =
        document.getElementById("calculatorMessage");

    const ageResult =
        document.getElementById("ageResult");

    const ageResultDate =
        document.getElementById("ageResultDate");

    const ageYears =
        document.getElementById("ageYears");

    const ageMonths =
        document.getElementById("ageMonths");

    const ageDays =
        document.getElementById("ageDays");

    const totalDays =
        document.getElementById("totalDays");

    const totalWeeks =
        document.getElementById("totalWeeks");

    const totalHours =
        document.getElementById("totalHours");

    const totalMinutes =
        document.getElementById("totalMinutes");

    const totalSeconds =
        document.getElementById("totalSeconds");

    const birthWeekday =
        document.getElementById("birthWeekday");


    const birthdayCard =
        document.getElementById("birthdayCard");

    const birthdayDateText =
        document.getElementById("birthdayDateText");

    const birthdayDays =
        document.getElementById("birthdayDays");

    const birthdayHours =
        document.getElementById("birthdayHours");

    const birthdayMinutes =
        document.getElementById("birthdayMinutes");

    const birthdaySeconds =
        document.getElementById("birthdaySeconds");


    const differenceStartDate =
        document.getElementById("differenceStartDate");

    const differenceEndDate =
        document.getElementById("differenceEndDate");

    const calculateDifferenceBtn =
        document.getElementById("calculateDifferenceBtn");

    const differenceMessage =
        document.getElementById("differenceMessage");

    const differenceResult =
        document.getElementById("differenceResult");

    const differenceDays =
        document.getElementById("differenceDays");

    const differenceWeeks =
        document.getElementById("differenceWeeks");

    const differenceMonths =
        document.getElementById("differenceMonths");

    const differenceYears =
        document.getElementById("differenceYears");

    const differenceStartDay =
        document.getElementById("differenceStartDay");

    const differenceEndDay =
        document.getElementById("differenceEndDay");

    const differenceLeapYear =
        document.getElementById("differenceLeapYear");


    const infoDate =
        document.getElementById("infoDate");

    const infoWeekday =
        document.getElementById("infoWeekday");

    const infoDayOfMonth =
        document.getElementById("infoDayOfMonth");

    const infoDayOfYear =
        document.getElementById("infoDayOfYear");

    const infoWeekOfYear =
        document.getElementById("infoWeekOfYear");

    const infoDaysInMonth =
        document.getElementById("infoDaysInMonth");

    const infoDaysInYear =
        document.getElementById("infoDaysInYear");

    const infoLeapYear =
        document.getElementById("infoLeapYear");

    const infoQuarter =
        document.getElementById("infoQuarter");


    /* =====================================================
       STATE
    ====================================================== */

    let birthdayTimer = null;

    let currentBirthDate = null;


    /* =====================================================
       DATE HELPERS
    ====================================================== */

    function pad(number) {

        return String(number).padStart(2, "0");

    }


    function formatInputDate(date) {

        return [
            date.getFullYear(),
            pad(date.getMonth() + 1),
            pad(date.getDate())
        ].join("-");

    }


    function parseInputDate(value) {

        if (!value) {
            return null;
        }

        const parts = value.split("-");

        if (parts.length !== 3) {
            return null;
        }

        const year = Number(parts[0]);
        const month = Number(parts[1]);
        const day = Number(parts[2]);

        const date =
            new Date(year, month - 1, day);

        if (
            date.getFullYear() !== year ||
            date.getMonth() !== month - 1 ||
            date.getDate() !== day
        ) {
            return null;
        }

        return date;

    }


    function startOfDay(date) {

        return new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );

    }


    function today() {

        const now = new Date();

        return startOfDay(now);

    }


    function isLeapYear(year) {

        return (
            year % 4 === 0 &&
            (
                year % 100 !== 0 ||
                year % 400 === 0
            )
        );

    }


    function daysInYear(year) {

        return isLeapYear(year) ? 366 : 365;

    }


    function daysInMonth(year, monthIndex) {

        return new Date(
            year,
            monthIndex + 1,
            0
        ).getDate();

    }


    function formatNumber(number) {

        return new Intl.NumberFormat(
            "en-IN"
        ).format(number);

    }


    function formatLongDate(date) {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        ).format(date);

    }


    function weekdayName(date) {

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                weekday: "long"
            }
        ).format(date);

    }


    /* =====================================================
       INITIAL DATES
    ====================================================== */

    function initializeDates() {

        const currentDate = today();

        const minDate =
            new Date(
                currentDate.getFullYear() - 150,
                currentDate.getMonth(),
                currentDate.getDate()
            );

        birthDateInput.max =
            formatInputDate(currentDate);

        birthDateInput.min =
            formatInputDate(minDate);

        asOfDateInput.value =
            formatInputDate(currentDate);

        asOfDateInput.max =
            formatInputDate(currentDate);

        asOfDateInput.min =
            formatInputDate(minDate);


        differenceEndDate.value =
            formatInputDate(currentDate);

        differenceStartDate.value =
            formatInputDate(
                new Date(
                    currentDate.getFullYear() - 1,
                    currentDate.getMonth(),
                    currentDate.getDate()
                )
            );


        infoDate.value =
            formatInputDate(currentDate);


        updateDateInformation();

    }


    /* =====================================================
       MESSAGE
    ====================================================== */

    function showMessage(element, message, error = false) {

        element.textContent = message;

        element.classList.toggle(
            "error",
            error
        );

    }


    /* =====================================================
       EXACT AGE
    ====================================================== */

    function calculateExactAge(birth, asOf) {

        if (asOf < birth) {
            return null;
        }


        let years =
            asOf.getFullYear() -
            birth.getFullYear();

        let months =
            asOf.getMonth() -
            birth.getMonth();

        let days =
            asOf.getDate() -
            birth.getDate();


        if (days < 0) {

            months--;

            const previousMonth =
                new Date(
                    asOf.getFullYear(),
                    asOf.getMonth(),
                    0
                );

            days +=
                previousMonth.getDate();

        }


        if (months < 0) {

            years--;

            months += 12;

        }


        return {
            years,
            months,
            days
        };

    }


    /* =====================================================
       TOTAL DAYS
    ====================================================== */

    function getTotalDays(start, end) {

        const difference =
            end.getTime() -
            start.getTime();

        return Math.floor(
            difference / 86400000
        );

    }


    /* =====================================================
       AGE CALCULATOR
    ====================================================== */

    function calculateAge() {

        const birth =
            parseInputDate(
                birthDateInput.value
            );

        const asOf =
            parseInputDate(
                asOfDateInput.value
            );


        if (!birth) {

            ageResult.hidden = true;
            birthdayCard.hidden = true;

            showMessage(
                calculatorMessage,
                "Please select your date of birth.",
                true
            );

            return;

        }


        if (!asOf) {

            ageResult.hidden = true;
            birthdayCard.hidden = true;

            showMessage(
                calculatorMessage,
                "Please select the age calculation date.",
                true
            );

            return;

        }


        if (birth > asOf) {

            ageResult.hidden = true;
            birthdayCard.hidden = true;

            showMessage(
                calculatorMessage,
                "Date of birth cannot be after the calculation date.",
                true
            );

            return;

        }


        const age =
            calculateExactAge(
                birth,
                asOf
            );


        if (!age) {
            return;
        }


        const total =
            getTotalDays(
                birth,
                asOf
            );


        ageYears.textContent =
            formatNumber(age.years);

        ageMonths.textContent =
            formatNumber(age.months);

        ageDays.textContent =
            formatNumber(age.days);


        totalDays.textContent =
            formatNumber(total);

        totalWeeks.textContent =
            formatNumber(
                Math.floor(total / 7)
            );

        totalHours.textContent =
            formatNumber(
                total * 24
            );

        totalMinutes.textContent =
            formatNumber(
                total * 24 * 60
            );

        totalSeconds.textContent =
            formatNumber(
                total * 24 * 60 * 60
            );


        birthWeekday.textContent =
            weekdayName(birth);


        ageResultDate.textContent =
            formatLongDate(asOf);


        ageResult.hidden = false;


        showMessage(
            calculatorMessage,
            "Age calculated successfully."
        );


        currentBirthDate =
            birth;


        setupBirthdayCard(birth);

    }


    /* =====================================================
       NEXT BIRTHDAY
    ====================================================== */

    function getNextBirthday(birthDate) {

        const now = new Date();

        let year =
            now.getFullYear();

        let birthday;


        /*
         * Handle 29 February.
         * In non-leap years, birthday is treated as
         * 28 February for countdown purposes.
         */

        if (
            birthDate.getMonth() === 1 &&
            birthDate.getDate() === 29 &&
            !isLeapYear(year)
        ) {

            birthday =
                new Date(
                    year,
                    1,
                    28,
                    0,
                    0,
                    0
                );

        } else {

            birthday =
                new Date(
                    year,
                    birthDate.getMonth(),
                    birthDate.getDate(),
                    0,
                    0,
                    0
                );

        }


        if (birthday <= now) {

            year++;


            if (
                birthDate.getMonth() === 1 &&
                birthDate.getDate() === 29 &&
                !isLeapYear(year)
            ) {

                birthday =
                    new Date(
                        year,
                        1,
                        28,
                        0,
                        0,
                        0
                    );

            } else {

                birthday =
                    new Date(
                        year,
                        birthDate.getMonth(),
                        birthDate.getDate(),
                        0,
                        0,
                        0
                    );

            }

        }


        return birthday;

    }


    function updateBirthdayCountdown() {

        if (!currentBirthDate) {
            return;
        }


        const nextBirthday =
            getNextBirthday(
                currentBirthDate
            );

        const now =
            new Date();


        let difference =
            nextBirthday.getTime() -
            now.getTime();


        if (difference < 0) {
            difference = 0;
        }


        const totalSecondsRemaining =
            Math.floor(
                difference / 1000
            );


        const days =
            Math.floor(
                totalSecondsRemaining / 86400
            );

        const hours =
            Math.floor(
                (totalSecondsRemaining % 86400) /
                3600
            );

        const minutes =
            Math.floor(
                (totalSecondsRemaining % 3600) /
                60
            );

        const seconds =
            totalSecondsRemaining % 60;


        birthdayDays.textContent =
            formatNumber(days);

        birthdayHours.textContent =
            pad(hours);

        birthdayMinutes.textContent =
            pad(minutes);

        birthdaySeconds.textContent =
            pad(seconds);


        birthdayDateText.textContent =
            `${formatLongDate(nextBirthday)} • ${weekdayName(nextBirthday)}`;

    }


    function setupBirthdayCard(birthDate) {

        currentBirthDate =
            birthDate;

        birthdayCard.hidden =
            false;


        if (birthdayTimer) {

            clearInterval(
                birthdayTimer
            );

        }


        updateBirthdayCountdown();


        birthdayTimer =
            setInterval(
                updateBirthdayCountdown,
                1000
            );

    }


    /* =====================================================
       DATE DIFFERENCE
    ====================================================== */

    function calculateDateDifference() {

        const first =
            parseInputDate(
                differenceStartDate.value
            );

        const second =
            parseInputDate(
                differenceEndDate.value
            );


        if (!first || !second) {

            differenceResult.hidden = true;

            showMessage(
                differenceMessage,
                "Please select both dates.",
                true
            );

            return;

        }


        let start = first;
        let end = second;


        if (start > end) {

            const temporary =
                start;

            start =
                end;

            end =
                temporary;

        }


        const total =
            getTotalDays(
                start,
                end
            );


        differenceDays.textContent =
            `${formatNumber(total)} DAYS`;


        differenceWeeks.textContent =
            formatNumber(
                Math.floor(total / 7)
            );


        differenceMonths.textContent =
            formatNumber(
                Math.floor(total / 30.436875)
            );


        differenceYears.textContent =
            formatNumber(
                Math.floor(total / 365.2425)
            );


        differenceStartDay.textContent =
            weekdayName(start);


        differenceEndDay.textContent =
            weekdayName(end);


        const leapYearsFound = [];


        for (
            let year = start.getFullYear();
            year <= end.getFullYear();
            year++
        ) {

            if (isLeapYear(year)) {

                leapYearsFound.push(
                    year
                );

            }

        }


        if (leapYearsFound.length) {

            differenceLeapYear.textContent =
                leapYearsFound.length === 1
                    ? String(leapYearsFound[0])
                    : `${leapYearsFound.length} years`;

        } else {

            differenceLeapYear.textContent =
                "No";

        }


        differenceResult.hidden =
            false;


        showMessage(
            differenceMessage,
            "Date difference calculated successfully."
        );

    }


    /* =====================================================
       DATE INFORMATION
    ====================================================== */

    function getDayOfYear(date) {

        const start =
            new Date(
                date.getFullYear(),
                0,
                1
            );

        return (
            Math.floor(
                (
                    date.getTime() -
                    start.getTime()
                ) / 86400000
            ) + 1
        );

    }


    function getWeekOfYear(date) {

        const target =
            new Date(
                date.valueOf()
            );


        const dayNumber =
            (
                target.getDay() + 6
            ) % 7;


        target.setDate(
            target.getDate() -
            dayNumber +
            3
        );


        const firstThursday =
            new Date(
                target.getFullYear(),
                0,
                4
            );


        const firstDay =
            (
                firstThursday.getDay() + 6
            ) % 7;


        const week =
            1 +
            Math.round(
                (
                    target.getTime() -
                    firstThursday.getTime()
                ) /
                86400000 /
                7
            );


        return week;

    }


    function updateDateInformation() {

        const date =
            parseInputDate(
                infoDate.value
            );


        if (!date) {
            return;
        }


        const year =
            date.getFullYear();

        const month =
            date.getMonth();


        const totalDaysOfYear =
            daysInYear(year);


        const totalDaysOfMonth =
            daysInMonth(
                year,
                month
            );


        const dayOfYear =
            getDayOfYear(
                date
            );


        const week =
            getWeekOfYear(
                date
            );


        const quarter =
            Math.floor(
                month / 3
            ) + 1;


        infoWeekday.textContent =
            weekdayName(date);


        infoDayOfMonth.textContent =
            formatNumber(
                date.getDate()
            );


        infoDayOfYear.textContent =
            formatNumber(
                dayOfYear
            );


        infoWeekOfYear.textContent =
            `Week ${week}`;


        infoDaysInMonth.textContent =
            formatNumber(
                totalDaysOfMonth
            );


        infoDaysInYear.textContent =
            formatNumber(
                totalDaysOfYear
            );


        infoLeapYear.textContent =
            isLeapYear(year)
                ? "Yes"
                : "No";


        infoQuarter.textContent =
            `Q${quarter}`;

    }


    /* =====================================================
       RESET
    ====================================================== */

    function resetCalculator() {

        const currentDate =
            today();


        birthDateInput.value =
            "";

        asOfDateInput.value =
            formatInputDate(
                currentDate
            );


        ageResult.hidden =
            true;

        birthdayCard.hidden =
            true;


        currentBirthDate =
            null;


        if (birthdayTimer) {

            clearInterval(
                birthdayTimer
            );

            birthdayTimer =
                null;

        }


        showMessage(
            calculatorMessage,
            ""
        );


        differenceResult.hidden =
            true;


        showMessage(
            differenceMessage,
            ""
        );


        differenceEndDate.value =
            formatInputDate(
                currentDate
            );


        differenceStartDate.value =
            formatInputDate(
                new Date(
                    currentDate.getFullYear() - 1,
                    currentDate.getMonth(),
                    currentDate.getDate()
                )
            );


        infoDate.value =
            formatInputDate(
                currentDate
            );


        updateDateInformation();

    }


    /* =====================================================
       EVENT LISTENERS
    ====================================================== */

    calculateAgeBtn.addEventListener(
        "click",
        calculateAge
    );


    resetCalculatorBtn.addEventListener(
        "click",
        resetCalculator
    );


    calculateDifferenceBtn.addEventListener(
        "click",
        calculateDateDifference
    );


    infoDate.addEventListener(
        "change",
        updateDateInformation
    );


    /*
     * Automatically recalculate age when either
     * date is changed after a DOB has already been selected.
     */

    birthDateInput.addEventListener(
        "change",
        () => {

            if (birthDateInput.value) {
                calculateAge();
            }

        }
    );


    asOfDateInput.addEventListener(
        "change",
        () => {

            if (
                birthDateInput.value &&
                asOfDateInput.value
            ) {

                calculateAge();

            }

        }
    );


    /* =====================================================
       ENTER KEY
    ====================================================== */

    birthDateInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                calculateAge();
            }

        }
    );


    asOfDateInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {
                calculateAge();
            }

        }
    );


    /* =====================================================
       INITIALIZE
    ====================================================== */

    initializeDates();

})();