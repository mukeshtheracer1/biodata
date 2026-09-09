/* =========================================================
   KUNDLI MILAN
   ---------------------------------------------------------
   Person A = existing saved Kundli
   Person B = new birth details + real engine calculation
   Ashtakoota = calculated from actual Moon Rashi/Nakshatra
   NO RANDOM / NO DUMMY RESULT DATA
   ========================================================= */

(function (window) {

    "use strict";


    /* =====================================================
       CONSTANTS
    ===================================================== */

    const LOCATION_API =
        "https://geocoding-api.open-meteo.com/v1/search";


    const RASHIS = [
        {
            index: 0,
            id: "aries",
            name: "Mesha",
            hindi: "मेष"
        },
        {
            index: 1,
            id: "taurus",
            name: "Vrishabha",
            hindi: "वृषभ"
        },
        {
            index: 2,
            id: "gemini",
            name: "Mithuna",
            hindi: "मिथुन"
        },
        {
            index: 3,
            id: "cancer",
            name: "Karka",
            hindi: "कर्क"
        },
        {
            index: 4,
            id: "leo",
            name: "Simha",
            hindi: "सिंह"
        },
        {
            index: 5,
            id: "virgo",
            name: "Kanya",
            hindi: "कन्या"
        },
        {
            index: 6,
            id: "libra",
            name: "Tula",
            hindi: "तुला"
        },
        {
            index: 7,
            id: "scorpio",
            name: "Vrishchika",
            hindi: "वृश्चिक"
        },
        {
            index: 8,
            id: "sagittarius",
            name: "Dhanu",
            hindi: "धनु"
        },
        {
            index: 9,
            id: "capricorn",
            name: "Makara",
            hindi: "मकर"
        },
        {
            index: 10,
            id: "aquarius",
            name: "Kumbha",
            hindi: "कुंभ"
        },
        {
            index: 11,
            id: "pisces",
            name: "Meena",
            hindi: "मीन"
        }
    ];


    /*
     * 27 Nakshatra order exactly matches the engine.
     */
    const NAKSHATRAS = [
        "Ashwini",
        "Bharani",
        "Krittika",
        "Rohini",
        "Mrigashira",
        "Ardra",
        "Punarvasu",
        "Pushya",
        "Ashlesha",
        "Magha",
        "Purva Phalguni",
        "Uttara Phalguni",
        "Hasta",
        "Chitra",
        "Swati",
        "Vishakha",
        "Anuradha",
        "Jyeshtha",
        "Mula",
        "Purva Ashadha",
        "Uttara Ashadha",
        "Shravana",
        "Dhanishtha",
        "Shatabhisha",
        "Purva Bhadrapada",
        "Uttara Bhadrapada",
        "Revati"
    ];


    const NAKSHATRA_HINDI = [
        "अश्विनी",
        "भरणी",
        "कृत्तिका",
        "रोहिणी",
        "मृगशिरा",
        "आर्द्रा",
        "पुनर्वसु",
        "पुष्य",
        "आश्लेषा",
        "मघा",
        "पूर्व फाल्गुनी",
        "उत्तर फाल्गुनी",
        "हस्त",
        "चित्रा",
        "स्वाती",
        "विशाखा",
        "अनुराधा",
        "ज्येष्ठा",
        "मूल",
        "पूर्वाषाढ़ा",
        "उत्तराषाढ़ा",
        "श्रवण",
        "धनिष्ठा",
        "शतभिषा",
        "पूर्व भाद्रपद",
        "उत्तर भाद्रपद",
        "रेवती"
    ];


    /*
     * Traditional Nadi mapping.
     *
     * 0 = Adi
     * 1 = Madhya
     * 2 = Antya
     */
    const NADI_BY_NAKSHATRA = [
        0, 1, 2,
        0, 1, 2,
        0, 1, 2,
        0, 1, 2,
        0, 1, 2,
        0, 1, 2,
        0, 1, 2,
        0, 1, 2,
        0
    ];


    const NADI_NAMES = [
        "Adi / आदि",
        "Madhya / मध्य",
        "Antya / अन्त्य"
    ];


    /*
     * Gana:
     *
     * Deva / देव
     * Manushya / मनुष्य
     * Rakshasa / राक्षस
     */
    const GANA_BY_NAKSHATRA = [
        "Deva",
        "Manushya",
        "Rakshasa",
        "Manushya",
        "Deva",
        "Manushya",
        "Deva",
        "Deva",
        "Rakshasa",
        "Rakshasa",
        "Manushya",
        "Manushya",
        "Deva",
        "Rakshasa",
        "Deva",
        "Rakshasa",
        "Deva",
        "Rakshasa",
        "Rakshasa",
        "Manushya",
        "Manushya",
        "Deva",
        "Rakshasa",
        "Rakshasa",
        "Manushya",
        "Manushya",
        "Deva"
    ];


    const GANA_HINDI = {
        Deva: "देव",
        Manushya: "मनुष्य",
        Rakshasa: "राक्षस"
    };


    /*
     * Yoni mapping.
     *
     * Same yoni = 4
     * Enemy yoni = 0
     * Otherwise traditional neutral base = 2
     *
     * Friendly relation is upgraded to 3 below.
     */
    const YONI_BY_NAKSHATRA = [
        "Horse",
        "Elephant",
        "Goat",
        "Serpent",
        "Serpent",
        "Dog",
        "Cat",
        "Goat",
        "Cat",
        "Rat",
        "Rat",
        "Cow",
        "Buffalo",
        "Tiger",
        "Buffalo",
        "Tiger",
        "Deer",
        "Deer",
        "Dog",
        "Monkey",
        "Mongoose",
        "Monkey",
        "Lion",
        "Horse",
        "Lion",
        "Cow",
        "Elephant"
    ];


    const YONI_HINDI = {
        Horse: "घोड़ा",
        Elephant: "हाथी",
        Goat: "बकरी",
        Serpent: "सर्प",
        Dog: "कुत्ता",
        Cat: "बिल्ली",
        Rat: "चूहा",
        Cow: "गाय",
        Buffalo: "भैंस",
        Tiger: "बाघ",
        Deer: "हिरण",
        Monkey: "बंदर",
        Mongoose: "नेवला",
        Lion: "सिंह"
    };


    /*
     * Traditional yoni enemies.
     */
    const YONI_ENEMIES = new Set([
        "Horse|Buffalo",
        "Buffalo|Horse",

        "Elephant|Lion",
        "Lion|Elephant",

        "Goat|Monkey",
        "Monkey|Goat",

        "Serpent|Mongoose",
        "Mongoose|Serpent",

        "Dog|Deer",
        "Deer|Dog",

        "Cat|Rat",
        "Rat|Cat",

        "Cow|Tiger",
        "Tiger|Cow"
    ]);


    /*
     * Friendly yoni pairs used for 3-point relation.
     * All unspecified non-enemy/non-same pairs remain neutral.
     */
    const YONI_FRIENDS = new Set([
        "Horse|Monkey",
        "Monkey|Horse",

        "Elephant|Sheep",
        "Sheep|Elephant",

        "Goat|Cow",
        "Cow|Goat",

        "Serpent|Cat",
        "Cat|Serpent",

        "Dog|Monkey",
        "Monkey|Dog",

        "Rat|Goat",
        "Goat|Rat",

        "Buffalo|Deer",
        "Deer|Buffalo",

        "Tiger|Horse",
        "Horse|Tiger",

        "Lion|Elephant",
        "Elephant|Lion"
    ]);


    /*
     * Rashi lord mapping.
     */
    const RASHI_LORDS = [
        "Mars",
        "Venus",
        "Mercury",
        "Moon",
        "Sun",
        "Mercury",
        "Venus",
        "Mars",
        "Jupiter",
        "Saturn",
        "Saturn",
        "Jupiter"
    ];


    const PLANET_HINDI = {
        Sun: "सूर्य",
        Moon: "चंद्र",
        Mars: "मंगल",
        Mercury: "बुध",
        Jupiter: "गुरु",
        Venus: "शुक्र",
        Saturn: "शनि"
    };


    const LORD_HINDI = {
        Sun: "सूर्य",
        Moon: "चंद्र",
        Mars: "मंगल",
        Mercury: "बुध",
        Jupiter: "गुरु",
        Venus: "शुक्र",
        Saturn: "शनि"
    };


    /*
     * Natural friendship table.
     *
     * friend / neutral / enemy.
     */
    const NATURAL_RELATION = {

        Sun: {
            Sun: "friend",
            Moon: "friend",
            Mars: "friend",
            Mercury: "neutral",
            Jupiter: "friend",
            Venus: "enemy",
            Saturn: "enemy"
        },

        Moon: {
            Sun: "friend",
            Moon: "friend",
            Mars: "neutral",
            Mercury: "friend",
            Jupiter: "neutral",
            Venus: "neutral",
            Saturn: "neutral"
        },

        Mars: {
            Sun: "friend",
            Moon: "friend",
            Mars: "friend",
            Mercury: "enemy",
            Jupiter: "friend",
            Venus: "neutral",
            Saturn: "neutral"
        },

        Mercury: {
            Sun: "friend",
            Moon: "enemy",
            Mars: "enemy",
            Mercury: "friend",
            Jupiter: "neutral",
            Venus: "friend",
            Saturn: "neutral"
        },

        Jupiter: {
            Sun: "friend",
            Moon: "friend",
            Mars: "friend",
            Mercury: "enemy",
            Jupiter: "friend",
            Venus: "enemy",
            Saturn: "neutral"
        },

        Venus: {
            Sun: "enemy",
            Moon: "neutral",
            Mars: "neutral",
            Mercury: "friend",
            Jupiter: "enemy",
            Venus: "friend",
            Saturn: "friend"
        },

        Saturn: {
            Sun: "enemy",
            Moon: "enemy",
            Mars: "neutral",
            Mercury: "friend",
            Jupiter: "neutral",
            Venus: "friend",
            Saturn: "friend"
        }
    };


    const VARNA_NAMES = [
        "Shudra / शूद्र",
        "Vaishya / वैश्य",
        "Kshatriya / क्षत्रिय",
        "Brahmin / ब्राह्मण"
    ];


    /*
     * Rashi Varna:
     *
     * Aries Leo Sagittarius = Kshatriya
     * Taurus Virgo Capricorn = Vaishya
     * Gemini Libra Aquarius = Shudra
     * Cancer Scorpio Pisces = Brahmin
     */
    const VARNA_BY_RASHI = [
        2,
        1,
        0,
        3,
        2,
        1,
        0,
        3,
        2,
        1,
        0,
        3
    ];


    /*
     * Vashya groups.
     *
     * This implementation uses the conventional rashi grouping.
     */
    const VASHYA_GROUP_BY_RASHI = [
        "Chatushpada",
        "Chatushpada",
        "Manava",
        "Jalachara",
        "Vanachara",
        "Manava",
        "Manava",
        "Keeta",
        "Chatushpada",
        "Chatushpada",
        "Manava",
        "Jalachara"
    ];


    const VASHYA_HINDI = {
        Chatushpada: "चतुष्पद",
        Manava: "मानव",
        Jalachara: "जलचर",
        Vanachara: "वनचर",
        Keeta: "कीट"
    };


    /*
     * Vashya score matrix.
     */
    const VASHYA_SCORE = {

        Chatushpada: {
            Chatushpada: 2,
            Manava: 1,
            Jalachara: 1,
            Vanachara: 0,
            Keeta: 1
        },

        Manava: {
            Chatushpada: 1,
            Manava: 2,
            Jalachara: 1,
            Vanachara: 1,
            Keeta: 1
        },

        Jalachara: {
            Chatushpada: 1,
            Manava: 1,
            Jalachara: 2,
            Vanachara: 1,
            Keeta: 1
        },

        Vanachara: {
            Chatushpada: 0,
            Manava: 1,
            Jalachara: 1,
            Vanachara: 2,
            Keeta: 0.5
        },

        Keeta: {
            Chatushpada: 1,
            Manava: 1,
            Jalachara: 1,
            Vanachara: 0.5,
            Keeta: 2
        }
    };


    /*
     * Bhakoot relationship.
     *
     * Inauspicious:
     * 2/12
     * 5/9
     * 6/8
     *
     * Favorable:
     * 1/1
     * 3/11
     * 4/10
     * 7/7
     */
    const BHAKOOT_BAD = new Set([
        "2/12",
        "5/9",
        "6/8"
    ]);


    /* =====================================================
       DOM
    ===================================================== */

    let moduleRoot = null;

    let messageBox = null;

    let personABox = null;

    let formB = null;

    let nameB = null;
    let genderB = null;
    let dateB = null;
    let timeB = null;

    let placeB = null;
    let stateB = null;
    let countryB = null;

    let latitudeB = null;
    let longitudeB = null;
    let timezoneB = null;

    let accuracyB = null;
    let notesB = null;

    let locationResults = null;
    let locationStatus = null;

    let changeLocationBtn = null;
    let resetBtn = null;
    let generateBtn = null;

    let calculatedSection = null;
    let quickFacts = null;
    let calculateMilanBtn = null;

    let resultSection = null;
    let scoreSummary = null;
    let resultPersons = null;
    let kootaBody = null;
    let summaryDetails = null;
    let specialChecks = null;
    let chartCrossCheck = null;
    let detailedAnalysis = null;


    let selectedPlace = null;

    let currentPersonA = null;
    let currentKundliA = null;

    let currentPersonB = null;
    let currentKundliB = null;

    let currentMilan = null;


    /* =====================================================
       INIT
    ===================================================== */

    function init() {

        moduleRoot =
            document.getElementById(
                "kundliMilanModule"
            );

        if (!moduleRoot) {
            return;
        }


        cacheDOM();


        bindEvents();


        loadPersonA();


        loadSavedPersonB();


        updateEngineBadge();

    }


    /* =====================================================
       DOM CACHE
    ===================================================== */

    function cacheDOM() {

        messageBox =
            document.getElementById(
                "kundliMilanMessage"
            );

        personABox =
            document.getElementById(
                "kundliMilanPersonA"
            );

        formB =
            document.getElementById(
                "kundliMilanPersonBForm"
            );

        nameB =
            document.getElementById(
                "milanBName"
            );

        genderB =
            document.getElementById(
                "milanBGender"
            );

        dateB =
            document.getElementById(
                "milanBDate"
            );

        timeB =
            document.getElementById(
                "milanBTime"
            );

        placeB =
            document.getElementById(
                "milanBPlace"
            );

        stateB =
            document.getElementById(
                "milanBState"
            );

        countryB =
            document.getElementById(
                "milanBCountry"
            );

        latitudeB =
            document.getElementById(
                "milanBLatitude"
            );

        longitudeB =
            document.getElementById(
                "milanBLongitude"
            );

        timezoneB =
            document.getElementById(
                "milanBTimezone"
            );

        accuracyB =
            document.getElementById(
                "milanBAccuracy"
            );

        notesB =
            document.getElementById(
                "milanBNotes"
            );

        locationResults =
            document.getElementById(
                "milanBLocationResults"
            );

        locationStatus =
            document.getElementById(
                "milanBLocationStatus"
            );

        changeLocationBtn =
            document.getElementById(
                "milanBChangeLocation"
            );

        resetBtn =
            document.getElementById(
                "milanBResetBtn"
            );

        generateBtn =
            document.getElementById(
                "milanBGenerateBtn"
            );

        calculatedSection =
            document.getElementById(
                "kundliMilanCalculatedSection"
            );

        quickFacts =
            document.getElementById(
                "kundliMilanQuickFacts"
            );

        calculateMilanBtn =
            document.getElementById(
                "kundliMilanCalculateBtn"
            );

        resultSection =
            document.getElementById(
                "kundliMilanResult"
            );

        scoreSummary =
            document.getElementById(
                "kundliMilanScoreSummary"
            );

        resultPersons =
            document.getElementById(
                "kundliMilanResultPersons"
            );

        kootaBody =
            document.getElementById(
                "kundliMilanKootaBody"
            );

        summaryDetails =
            document.getElementById(
                "kundliMilanSummaryDetails"
            );

        specialChecks =
            document.getElementById(
                "kundliMilanSpecialChecks"
            );

        chartCrossCheck =
            document.getElementById(
                "kundliMilanChartCrossCheck"
            );

        detailedAnalysis =
            document.getElementById(
                "kundliMilanDetailedAnalysis"
            );

    }


    /* =====================================================
       EVENTS
    ===================================================== */

    function bindEvents() {

        if (formB) {

            formB.addEventListener(
                "submit",
                handlePersonBSubmit
            );

        }


        if (placeB) {

            placeB.addEventListener(
                "input",
                handlePlaceInput
            );

            placeB.addEventListener(
                "keydown",
                handleLocationKeyboard
            );

        }


        if (changeLocationBtn) {

            changeLocationBtn.addEventListener(
                "click",
                resetLocation
            );

        }


        if (resetBtn) {

            resetBtn.addEventListener(
                "click",
                resetPersonB
            );

        }


        if (calculateMilanBtn) {

            calculateMilanBtn.addEventListener(
                "click",
                calculateMilan
            );

        }


        document.addEventListener(
            "click",
            function (event) {

                if (!moduleRoot) {
                    return;
                }

                if (
                    !event.target.closest(
                        ".milan-location-group"
                    )
                ) {

                    hideLocationResults();

                }

            }
        );

    }


    /* =====================================================
       LOAD PERSON A
    ===================================================== */

    function loadPersonA() {

        const state =
            getState();

        if (!state) {

            renderPersonAEmpty(
                "Kundli State उपलब्ध नहीं है।"
            );

            return;
        }


        currentPersonA =
            state.personA || null;

        currentKundliA =
            state.kundliA || null;


        if (
            !currentPersonA ||
            !currentKundliA
        ) {

            renderPersonAEmpty(
                "Person A की saved Kundli उपलब्ध नहीं है। पहले Birth Details module में Kundli बनाएं।"
            );

            return;

        }


        renderPersonA(
            currentPersonA,
            currentKundliA
        );

    }


    /* =====================================================
       STATE
    ===================================================== */

    function getState() {

        if (
            window.KundliState &&
            typeof window.KundliState.getState ===
                "function"
        ) {

            return window.KundliState.getState();

        }


        /*
         * Fallback is intentionally read-only.
         * We do not invent any Person A data.
         */
        return null;

    }


    /* =====================================================
       PERSON A RENDER
    ===================================================== */

    function renderPersonAEmpty(text) {

        if (!personABox) {
            return;
        }


        personABox.innerHTML =
            '<div class="person-empty">' +
                escapeHTML(text) +
            "</div>";

    }


    function renderPersonA(person, kundli) {

        const moon =
            getMoonData(kundli);

        const lagna =
            getLagnaData(kundli);


        personABox.innerHTML =

            dataItem(
                "Name / नाम",
                person.name || "—",
                true
            ) +

            dataItem(
                "Gender / लिंग",
                formatGender(
                    person.gender
                ),
                true
            ) +

            dataItem(
                "Date / जन्म तिथि",
                person.date ||
                person.birthDate ||
                "—",
                true
            ) +

            dataItem(
                "Time / जन्म समय",
                person.time ||
                person.birthTime ||
                "—",
                true
            ) +

            dataItem(
                "Place / जन्म स्थान",
                person.place ||
                person.city ||
                "—",
                true
            ) +

            dataItem(
                "State / राज्य",
                person.state || "—",
                true
            ) +

            dataItem(
                "Country / देश",
                person.country || "—",
                true
            ) +

            dataItem(
                "Latitude / अक्षांश",
                formatNumber(
                    person.latitude
                ),
                true
            ) +

            dataItem(
                "Longitude / देशांतर",
                formatNumber(
                    person.longitude
                ),
                true
            ) +

            dataItem(
                "Timezone / समय क्षेत्र",
                person.timezone || "—",
                true
            ) +

            dataItem(
                "Moon Rashi / चंद्र राशि",
                formatRashi(
                    moon.rashi
                ),
                true,
                true
            ) +

            dataItem(
                "Nakshatra / नक्षत्र",
                formatNakshatra(
                    moon.nakshatra
                ),
                true,
                true
            ) +

            dataItem(
                "Lagna / लग्न",
                formatRashi(
                    lagna.rashi
                ),
                true,
                true
            );

    }


    function dataItem(
        label,
        value,
        full,
        calculated
    ) {

        return (
            '<div class="person-data-item' +
            (full ? " full" : "") +
            '">' +

                "<span>" +
                    escapeHTML(label) +
                "</span>" +

                '<strong class="' +
                    (
                        calculated
                            ? "calculated-value"
                            : ""
                    ) +
                '">' +

                    escapeHTML(
                        value
                    ) +

                "</strong>" +

            "</div>"
        );

    }


    /* =====================================================
       PERSON B SAVED DATA
    ===================================================== */

    function loadSavedPersonB() {

        const state =
            getState();

        if (
            !state ||
            !state.personB ||
            !state.kundliB
        ) {

            return;

        }


        currentPersonB =
            state.personB;

        currentKundliB =
            state.kundliB;


        fillPersonBForm(
            currentPersonB
        );


        showCalculatedSection();


        /*
         * Existing saved Milan is not trusted blindly.
         * Recalculate from current A+B data.
         */
        currentMilan = null;

        hideResult();

    }


    function fillPersonBForm(person) {

        if (!person) {
            return;
        }


        if (nameB) {
            nameB.value =
                person.name || "";
        }


        if (genderB) {
            genderB.value =
                person.gender || "";
        }


        if (dateB) {
            dateB.value =
                person.date ||
                person.birthDate ||
                "";
        }


        if (timeB) {
            timeB.value =
                person.time ||
                person.birthTime ||
                "";
        }


        if (placeB) {
            placeB.value =
                person.place ||
                person.city ||
                "";
        }


        if (stateB) {
            stateB.value =
                person.state || "";
        }


        if (countryB) {
            countryB.value =
                person.country || "";
        }


        if (latitudeB) {
            latitudeB.value =
                valueOrBlank(
                    person.latitude
                );
        }


        if (longitudeB) {
            longitudeB.value =
                valueOrBlank(
                    person.longitude
                );
        }


        if (timezoneB) {
            timezoneB.value =
                person.timezone || "";
        }


        if (accuracyB) {
            accuracyB.value =
                person.birthTimeAccuracy ||
                person.accuracy ||
                "";
        }


        if (notesB) {
            notesB.value =
                person.notes || "";
        }


        selectedPlace = {

            name:
                person.place ||
                person.city ||
                "",

            state:
                person.state || "",

            country:
                person.country || "",

            latitude:
                Number(
                    person.latitude
                ),

            longitude:
                Number(
                    person.longitude
                ),

            timezone:
                person.timezone || ""

        };


        setLocationStatus(
            "Location saved / स्थान सुरक्षित है।",
            "ok"
        );

    }


    /* =====================================================
       LOCATION SEARCH
    ===================================================== */

    let locationTimer = null;


    function handlePlaceInput() {

        const value =
            placeB
                ? placeB.value.trim()
                : "";


        /*
         * Any change invalidates previously selected
         * location. This prevents wrong coordinates.
         */
        selectedPlace = null;


        clearLocationFields();


        if (value.length < 2) {

            hideLocationResults();

            return;

        }


        clearTimeout(
            locationTimer
        );


        locationTimer =
            setTimeout(
                function () {

                    searchLocation(
                        value
                    );

                },
                400
            );

    }


    async function searchLocation(query) {

        try {

            setLocationStatus(
                "Location खोजी जा रही है...",
                ""
            );


            const url =
                LOCATION_API +
                "?name=" +
                encodeURIComponent(
                    query
                ) +
                "&count=8" +
                "&language=en" +
                "&format=json";


            const response =
                await fetch(
                    url
                );


            if (!response.ok) {

                throw new Error(
                    "Location search service response नहीं दे रही है।"
                );

            }


            const data =
                await response.json();


            const results =
                Array.isArray(
                    data.results
                )
                    ? data.results
                    : [];


            renderLocationResults(
                results
            );


            if (!results.length) {

                setLocationStatus(
                    "इस नाम की location नहीं मिली।",
                    "error"
                );

            }

        }
        catch (error) {

            console.error(
                "Kundli Milan location search:",
                error
            );


            hideLocationResults();


            setLocationStatus(
                "Location search में समस्या आई। सही location details manually भरें।",
                "error"
            );

        }

    }


    function renderLocationResults(results) {

        if (!locationResults) {
            return;
        }


        if (!results.length) {

            locationResults.innerHTML =
                '<div class="person-empty">' +
                    "कोई वास्तविक location result नहीं मिला।" +
                "</div>";

            locationResults.hidden = false;

            return;

        }


        locationResults.innerHTML =
            results
                .map(
                    function (item, index) {

                        const name =
                            item.name ||
                            "Unknown";

                        const admin =
                            item.admin1 ||
                            "";

                        const country =
                            item.country ||
                            "";

                        const timezone =
                            item.timezone ||
                            "";


                        return (

                            '<button ' +
                                'type="button" ' +
                                'class="milan-location-result" ' +
                                'data-location-index="' +
                                    index +
                                '">' +

                                "<strong>" +
                                    escapeHTML(
                                        name
                                    ) +
                                "</strong>" +

                                "<span>" +
                                    escapeHTML(
                                        [
                                            admin,
                                            country,
                                            timezone
                                        ]
                                        .filter(Boolean)
                                        .join(
                                            " • "
                                        )
                                    ) +
                                "</span>" +

                            "</button>"

                        );

                    }
                )
                .join("");


        locationResults.hidden = false;


        const buttons =
            locationResults.querySelectorAll(
                ".milan-location-result"
            );


        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const index =
                            Number(
                                button.dataset.locationIndex
                            );

                        const item =
                            results[index];

                        selectLocation(
                            item
                        );

                    }
                );

            }
        );

    }


    function selectLocation(item) {

        if (!item) {
            return;
        }


        selectedPlace = {

            name:
                item.name || "",

            state:
                item.admin1 || "",

            country:
                item.country || "",

            latitude:
                Number(
                    item.latitude
                ),

            longitude:
                Number(
                    item.longitude
                ),

            timezone:
                item.timezone || ""

        };


        if (placeB) {
            placeB.value =
                selectedPlace.name;
        }


        if (stateB) {
            stateB.value =
                selectedPlace.state;
        }


        if (countryB) {
            countryB.value =
                selectedPlace.country;
        }


        if (latitudeB) {
            latitudeB.value =
                valueOrBlank(
                    selectedPlace.latitude
                );
        }


        if (longitudeB) {
            longitudeB.value =
                valueOrBlank(
                    selectedPlace.longitude
                );
        }


        if (timezoneB) {
            timezoneB.value =
                selectedPlace.timezone;
        }


        setLocationStatus(
            "Location selected / स्थान चुन लिया गया।",
            "ok"
        );


        hideLocationResults();

    }


    function resetLocation() {

        selectedPlace = null;


        if (placeB) {
            placeB.value = "";
            placeB.focus();
        }


        clearLocationFields();


        setLocationStatus(
            "नई location select करें।",
            ""
        );


        hideLocationResults();

    }


    function clearLocationFields() {

        if (stateB) {
            stateB.value = "";
        }

        if (countryB) {
            countryB.value = "";
        }

        if (latitudeB) {
            latitudeB.value = "";
        }

        if (longitudeB) {
            longitudeB.value = "";
        }

        if (timezoneB) {
            timezoneB.value = "";
        }

        setLocationStatus(
            "Location select नहीं हुई है।",
            ""
        );

    }


    function hideLocationResults() {

        if (locationResults) {
            locationResults.hidden = true;
        }

    }


    function handleLocationKeyboard(event) {

        if (!locationResults) {
            return;
        }


        if (locationResults.hidden) {
            return;
        }


        const items =
            Array.from(
                locationResults.querySelectorAll(
                    ".milan-location-result"
                )
            );


        if (!items.length) {
            return;
        }


        const active =
            document.activeElement;


        let index =
            items.indexOf(
                active
            );


        if (event.key === "ArrowDown") {

            event.preventDefault();

            index =
                (
                    index + 1
                ) %
                items.length;

            items[index].focus();

        }


        if (event.key === "ArrowUp") {

            event.preventDefault();

            index =
                (
                    index - 1 +
                    items.length
                ) %
                items.length;

            items[index].focus();

        }


        if (event.key === "Escape") {

            hideLocationResults();

            placeB.focus();

        }

    }


    /* =====================================================
       PERSON B SUBMIT
    ===================================================== */

    async function handlePersonBSubmit(event) {

        event.preventDefault();


        clearMessage();


        if (!currentKundliA) {

            showMessage(
                "Person A की Kundli उपलब्ध नहीं है। पहले Birth Details से अपनी Kundli calculate करें।",
                "error"
            );

            return;

        }


        const validation =
            validatePersonB();


        if (!validation.valid) {

            showMessage(
                validation.message,
                "error"
            );

            return;

        }


        setLoading(
            true
        );


        try {

            const input =
                collectPersonBInput();


            if (
                !window.KundliEngine ||
                typeof window.KundliEngine.calculate !==
                    "function"
            ) {

                throw new Error(
                    "KundliEngine load नहीं हुआ।"
                );

            }


            /*
             * REAL calculation.
             */
            const kundli =
                await window.KundliEngine.calculate(
                    input
                );


            currentPersonB =
                inputToPersonB(
                    input
                );


            currentKundliB =
                kundli;


            savePersonBState(
                currentPersonB,
                currentKundliB
            );


            currentMilan =
                null;


            hideResult();


            renderPersonBSuccess();


            showCalculatedSection();


            showMessage(
                "Person B की Kundli वास्तविक जन्म डेटा से successfully calculate हो गई।",
                "success"
            );

        }
        catch (error) {

            console.error(
                "Person B Kundli calculation error:",
                error
            );


            currentKundliB =
                null;

            currentMilan =
                null;


            hideCalculatedSection();


            showMessage(
                error.message ||
                "Person B की Kundli calculate नहीं हो सकी।",
                "error"
            );

        }
        finally {

            setLoading(
                false
            );

        }

    }


    /* =====================================================
       VALIDATION
    ===================================================== */

    function validatePersonB() {

        if (
            !nameB ||
            !nameB.value.trim()
        ) {

            return {
                valid: false,
                message:
                    "Person B का Name / नाम भरें।"
            };

        }


        if (
            !genderB ||
            !genderB.value
        ) {

            return {
                valid: false,
                message:
                    "Person B का Gender / लिंग select करें।"
            };

        }


        if (
            !dateB ||
            !dateB.value
        ) {

            return {
                valid: false,
                message:
                    "Person B की Date of Birth / जन्म तिथि भरें।"
            };

        }


        if (
            !timeB ||
            !timeB.value
        ) {

            return {
                valid: false,
                message:
                    "Person B का Birth Time / जन्म समय भरें।"
            };

        }


        if (!selectedPlace) {

            return {
                valid: false,
                message:
                    "Birth Place के वास्तविक search result में से location select करें। केवल city name लिखना पर्याप्त नहीं है।"
            };

        }


        const latitude =
            Number(
                latitudeB.value
            );

        const longitude =
            Number(
                longitudeB.value
            );


        if (
            !Number.isFinite(
                latitude
            ) ||
            latitude < -90 ||
            latitude > 90
        ) {

            return {
                valid: false,
                message:
                    "Valid Latitude / अक्षांश जरूरी है।"
            };

        }


        if (
            !Number.isFinite(
                longitude
            ) ||
            longitude < -180 ||
            longitude > 180
        ) {

            return {
                valid: false,
                message:
                    "Valid Longitude / देशांतर जरूरी है।"
            };

        }


        if (
            !timezoneB.value.trim()
        ) {

            return {
                valid: false,
                message:
                    "Timezone / समय क्षेत्र जरूरी है।"
            };

        }


        return {
            valid: true
        };

    }


    /* =====================================================
       COLLECT PERSON B
    ===================================================== */

    function collectPersonBInput() {

        const date =
            dateB.value;

        const time =
            timeB.value;

        const timezone =
            timezoneB.value.trim();


        const utcISO =
            localDateTimeToUTC(
                date,
                time,
                timezone
            );


        const utcDate =
            new Date(
                utcISO
            );


        if (
            Number.isNaN(
                utcDate.getTime()
            )
        ) {

            throw new Error(
                "Birth date/time को UTC में convert नहीं किया जा सका।"
            );

        }


        return {

            name:
                nameB.value.trim(),

            gender:
                genderB.value,

            birthDate:
                date,

            birthTime:
                time,

            timezone:
                timezone,

            city:
                placeB.value.trim(),

            place:
                placeB.value.trim(),

            state:
                stateB.value.trim(),

            country:
                countryB.value.trim(),

            latitude:
                Number(
                    latitudeB.value
                ),

            longitude:
                Number(
                    longitudeB.value
                ),

            birthTimeAccuracy:
                accuracyB
                    ? accuracyB.value
                    : "",

            notes:
                notesB
                    ? notesB.value.trim()
                    : "",

            utcDate:
                utcDate

        };

    }


    function inputToPersonB(input) {

        return {

            name:
                input.name,

            gender:
                input.gender,

            date:
                input.birthDate,

            time:
                input.birthTime,

            place:
                input.place,

            city:
                input.city,

            state:
                input.state,

            country:
                input.country,

            latitude:
                input.latitude,

            longitude:
                input.longitude,

            timezone:
                input.timezone,

            birthTimeAccuracy:
                input.birthTimeAccuracy,

            notes:
                input.notes

        };

    }


    /* =====================================================
       LOCAL DATE/TIME → UTC
    ===================================================== */

    function localDateTimeToUTC(
        dateStr,
        timeStr,
        timezone
    ) {

        if (
            !dateStr ||
            !timeStr ||
            !timezone
        ) {

            throw new Error(
                "Date, Time और Timezone required हैं।"
            );

        }


        const dateParts =
            dateStr
                .split("-")
                .map(Number);


        const timeParts =
            timeStr
                .split(":")
                .map(Number);


        const year =
            dateParts[0];

        const month =
            dateParts[1];

        const day =
            dateParts[2];


        const hour =
            Number.isFinite(
                timeParts[0]
            )
                ? timeParts[0]
                : 0;


        const minute =
            Number.isFinite(
                timeParts[1]
            )
                ? timeParts[1]
                : 0;


        const second =
            Number.isFinite(
                timeParts[2]
            )
                ? timeParts[2]
                : 0;


        const guess =
            Date.UTC(
                year,
                month - 1,
                day,
                hour,
                minute,
                second
            );


        let utcDate =
            new Date(
                guess
            );


        const formatter =
            new Intl.DateTimeFormat(
                "en-US",
                {
                    timeZone:
                        timezone,

                    year:
                        "numeric",

                    month:
                        "2-digit",

                    day:
                        "2-digit",

                    hour:
                        "2-digit",

                    minute:
                        "2-digit",

                    second:
                        "2-digit",

                    hourCycle:
                        "h23"
                }
            );


        for (
            let i = 0;
            i < 5;
            i++
        ) {

            const parts =
                formatter.formatToParts(
                    utcDate
                );


            const values = {};


            parts.forEach(
                function (part) {

                    values[
                        part.type
                    ] =
                        part.value;

                }
            );


            const localAsUTC =
                Date.UTC(
                    Number(
                        values.year
                    ),
                    Number(
                        values.month
                    ) - 1,
                    Number(
                        values.day
                    ),
                    Number(
                        values.hour
                    ),
                    Number(
                        values.minute
                    ),
                    Number(
                        values.second
                    )
                );


            const difference =
                localAsUTC -
                guess;


            utcDate =
                new Date(
                    guess -
                    difference
                );

        }


        return utcDate.toISOString();

    }


    /* =====================================================
       SAVE PERSON B
    ===================================================== */

    function savePersonBState(
        person,
        kundli
    ) {

        if (
            window.KundliState &&
            typeof window.KundliState.savePersonB ===
                "function"
        ) {

            window.KundliState.savePersonB(
                person,
                kundli
            );

            return;

        }


        /*
         * Fallback if the state implementation exposes patch().
         */
        if (
            window.KundliState &&
            typeof window.KundliState.patch ===
                "function"
        ) {

            window.KundliState.patch({

                personB:
                    person,

                kundliB:
                    kundli

            });

        }

    }


    /* =====================================================
       CALCULATED SUCCESS
    ===================================================== */

    function renderPersonBSuccess() {

        if (!currentKundliB) {
            return;
        }


        const moon =
            getMoonData(
                currentKundliB
            );

        const lagna =
            getLagnaData(
                currentKundliB
            );


        if (!quickFacts) {
            return;
        }


        quickFacts.innerHTML =

            quickFact(
                "Moon Rashi / चंद्र राशि",
                formatRashi(
                    moon.rashi
                )
            ) +

            quickFact(
                "Nakshatra / नक्षत्र",
                formatNakshatra(
                    moon.nakshatra
                )
            ) +

            quickFact(
                "Gana / गण",
                getGana(
                    moon
                )
            ) +

            quickFact(
                "Nadi / नाड़ी",
                getNadi(
                    moon
                )
            ) +

            quickFact(
                "Yoni / योनि",
                getYoni(
                    moon
                )
            ) +

            quickFact(
                "Lagna / लग्न",
                formatRashi(
                    lagna.rashi
                )
            );

    }


    function quickFact(
        label,
        value
    ) {

        return (

            '<div class="milan-quick-fact">' +

                "<span>" +
                    escapeHTML(
                        label
                    ) +
                "</span>" +

                "<strong>" +
                    escapeHTML(
                        value
                    ) +
                "</strong>" +

            "</div>"

        );

    }


    function showCalculatedSection() {

        if (!calculatedSection) {
            return;
        }


        calculatedSection.hidden =
            !currentKundliB;


        if (currentKundliB) {

            renderPersonBSuccess();

        }

    }


    function hideCalculatedSection() {

        if (calculatedSection) {
            calculatedSection.hidden = true;
        }

    }


    /* =====================================================
       MILAN
    ===================================================== */

    function calculateMilan() {

        clearMessage();


        if (
            !currentKundliA ||
            !currentKundliB
        ) {

            showMessage(
                "दोनों व्यक्तियों की वास्तविक Kundli उपलब्ध होना जरूरी है।",
                "error"
            );

            return;

        }


        try {

            currentMilan =
                calculateAshtakoota(
                    currentKundliA,
                    currentKundliB
                );


            renderMilanResult(
                currentMilan
            );


            showMessage(
                "Kundli Milan वास्तविक calculated data के आधार पर तैयार हो गया।",
                "success"
            );

        }
        catch (error) {

            console.error(
                "Kundli Milan calculation error:",
                error
            );


            showMessage(
                error.message ||
                "Kundli Milan calculate नहीं हो सका।",
                "error"
            );

        }

    }


    /* =====================================================
       ASHTAKOOTA MASTER
    ===================================================== */

    function calculateAshtakoota(
        kundliA,
        kundliB
    ) {

        const moonA =
            getMoonData(
                kundliA
            );

        const moonB =
            getMoonData(
                kundliB
            );


        if (
            !moonA.rashi ||
            !moonB.rashi ||
            !moonA.nakshatra ||
            !moonB.nakshatra
        ) {

            throw new Error(
                "दोनों Kundli में Moon Rashi और Nakshatra data उपलब्ध नहीं है।"
            );

        }


        const varna =
            calculateVarna(
                moonA,
                moonB
            );


        const vashya =
            calculateVashya(
                moonA,
                moonB
            );


        const tara =
            calculateTara(
                moonA,
                moonB
            );


        const yoni =
            calculateYoni(
                moonA,
                moonB
            );


        const maitri =
            calculateGrahaMaitri(
                moonA,
                moonB
            );


        const gana =
            calculateGana(
                moonA,
                moonB
            );


        const bhakoot =
            calculateBhakoot(
                moonA,
                moonB
            );


        const nadi =
            calculateNadi(
                moonA,
                moonB
            );


        const rows = [
            varna,
            vashya,
            tara,
            yoni,
            maitri,
            gana,
            bhakoot,
            nadi
        ];


        const total =
            rows.reduce(
                function (
                    sum,
                    row
                ) {

                    return (
                        sum +
                        Number(
                            row.score
                        )
                    );

                },
                0
            );


        const max =
            rows.reduce(
                function (
                    sum,
                    row
                ) {

                    return (
                        sum +
                        Number(
                            row.max
                        )
                    );

                },
                0
            );


        return {

            personA:
                kundliA,

            personB:
                kundliB,

            moonA:
                moonA,

            moonB:
                moonB,

            rows:
                rows,

            total:
                roundScore(
                    total
                ),

            max:
                max,

            percentage:
                max
                    ? roundScore(
                        (
                            total /
                            max
                        ) *
                        100
                    )
                    : 0,

            nadiDosha:
                nadi.score === 0,

            bhakootDosha:
                bhakoot.score === 0,

            manglik:
                calculateManglikComparison(
                    kundliA,
                    kundliB
                )

        };

    }


    /* =====================================================
       VARNA
    ===================================================== */

    function calculateVarna(
        a,
        b
    ) {

        const va =
            VARNA_BY_RASHI[
                getRashiIndex(
                    a.rashi
                )
            ];


        const vb =
            VARNA_BY_RASHI[
                getRashiIndex(
                    b.rashi
                )
            ];


        /*
         * For conventional male/female pairing,
         * higher/equal reference Varna gets full score.
         *
         * When gender is not a conventional pair,
         * the comparison is kept symmetric.
         */
        let score;


        const genderA =
            currentPersonA
                ? currentPersonA.gender
                : "";


        const genderBValue =
            currentPersonB
                ? currentPersonB.gender
                : "";


        if (
            genderA === "male" &&
            genderBValue === "female"
        ) {

            score =
                va >= vb
                    ? 1
                    : 0;

        }
        else if (
            genderA === "female" &&
            genderBValue === "male"
        ) {

            score =
                vb >= va
                    ? 1
                    : 0;

        }
        else {

            score =
                va === vb
                    ? 1
                    : (
                        Math.abs(
                            va - vb
                        ) <= 1
                            ? 0.5
                            : 0
                    );

        }


        return {

            id:
                "varna",

            name:
                "Varna / वर्ण",

            max:
                1,

            score:
                score,

            a:
                VARNA_NAMES[va],

            b:
                VARNA_NAMES[vb],

            detail:
                score === 1
                    ? "दोनों के Varna relation में पूर्ण गुण मिला।"
                    : score === 0.5
                        ? "Varna में आंशिक compatibility मिली।"
                        : "Varna relation में पारंपरिक score नहीं मिला।"

        };

    }


    /* =====================================================
       VASHYA
    ===================================================== */

    function calculateVashya(
        a,
        b
    ) {

        const groupA =
            VASHYA_GROUP_BY_RASHI[
                getRashiIndex(
                    a.rashi
                )
            ];


        const groupB =
            VASHYA_GROUP_BY_RASHI[
                getRashiIndex(
                    b.rashi
                )
            ];


        const score =
            VASHYA_SCORE[groupA] &&
            VASHYA_SCORE[groupA][groupB]
                !== undefined
                ? VASHYA_SCORE[groupA][groupB]
                : 0;


        return {

            id:
                "vashya",

            name:
                "Vashya / वश्य",

            max:
                2,

            score:
                score,

            a:
                VASHYA_HINDI[groupA],

            b:
                VASHYA_HINDI[groupB],

            detail:
                "Person A का Vashya group " +
                VASHYA_HINDI[groupA] +
                " और Person B का " +
                VASHYA_HINDI[groupB] +
                " है।"

        };

    }


    /* =====================================================
       TARA
    ===================================================== */

    function calculateTara(
        a,
        b
    ) {

        const indexA =
            getNakshatraIndex(
                a.nakshatra
            );


        const indexB =
            getNakshatraIndex(
                b.nakshatra
            );


        /*
         * Count A → B and B → A.
         * 1,3,5,7 = unfavourable Tara
         * 2,4,6,0 = favourable Tara
         */
        const taraAB =
            (
                indexB -
                indexA +
                27
            ) % 27 + 1;


        const taraBA =
            (
                indexA -
                indexB +
                27
            ) % 27 + 1;


        const goodAB =
            taraAB % 9 !== 1 &&
            taraAB % 9 !== 3 &&
            taraAB % 9 !== 5 &&
            taraAB % 9 !== 7;


        const goodBA =
            taraBA % 9 !== 1 &&
            taraBA % 9 !== 3 &&
            taraBA % 9 !== 5 &&
            taraBA % 9 !== 7;


        let score;


        if (
            goodAB &&
            goodBA
        ) {

            score = 3;

        }
        else if (
            goodAB ||
            goodBA
        ) {

            score = 1.5;

        }
        else {

            score = 0;

        }


        return {

            id:
                "tara",

            name:
                "Tara / तारा",

            max:
                3,

            score:
                score,

            a:
                formatNakshatra(
                    a.nakshatra
                ),

            b:
                formatNakshatra(
                    b.nakshatra
                ),

            detail:
                "A→B Tara count " +
                taraAB +
                " और B→A Tara count " +
                taraBA +
                " के आधार पर score निकाला गया।"

        };

    }


    /* =====================================================
       YONI
    ===================================================== */

    function calculateYoni(
        a,
        b
    ) {

        const yoniA =
            getYoniRaw(
                a
            );


        const yoniB =
            getYoniRaw(
                b
            );


        let score;


        if (
            yoniA ===
            yoniB
        ) {

            score = 4;

        }
        else if (
            YONI_ENEMIES.has(
                yoniA +
                "|" +
                yoniB
            )
        ) {

            score = 0;

        }
        else if (
            YONI_FRIENDS.has(
                yoniA +
                "|" +
                yoniB
            )
        ) {

            score = 3;

        }
        else {

            score = 2;

        }


        return {

            id:
                "yoni",

            name:
                "Yoni / योनि",

            max:
                4,

            score:
                score,

            a:
                YONI_HINDI[yoniA],

            b:
                YONI_HINDI[yoniB],

            detail:
                score === 4
                    ? "दोनों का Yoni समान है।"
                    : score === 3
                        ? "Yoni relation friendly है।"
                        : score === 2
                            ? "Yoni relation neutral है।"
                            : "Yoni में traditional enemy relation मिला।"

        };

    }


    /* =====================================================
       GRAHA MAITRI
    ===================================================== */

    function calculateGrahaMaitri(
        a,
        b
    ) {

        const lordA =
            getRashiLord(
                a.rashi
            );


        const lordB =
            getRashiLord(
                b.rashi
            );


        let score;


        if (
            lordA ===
            lordB
        ) {

            score = 5;

        }
        else {

            const relationAB =
                NATURAL_RELATION[
                    lordA
                ][
                    lordB
                ];


            const relationBA =
                NATURAL_RELATION[
                    lordB
                ][
                    lordA
                ];


            score =
                grahaMaitriScore(
                    relationAB,
                    relationBA
                );

        }


        return {

            id:
                "graha-maitri",

            name:
                "Graha Maitri / ग्रह मैत्री",

            max:
                5,

            score:
                score,

            a:
                LORD_HINDI[lordA],

            b:
                LORD_HINDI[lordB],

            detail:
                "Person A की Moon Rashi का lord " +
                LORD_HINDI[lordA] +
                " और Person B की Moon Rashi का lord " +
                LORD_HINDI[lordB] +
                " है।"

        };

    }


    function grahaMaitriScore(
        relationAB,
        relationBA
    ) {

        if (
            relationAB === "friend" &&
            relationBA === "friend"
        ) {

            return 5;

        }


        if (
            (
                relationAB === "friend" &&
                relationBA === "neutral"
            ) ||
            (
                relationAB === "neutral" &&
                relationBA === "friend"
            )
        ) {

            return 4;

        }


        if (
            relationAB === "neutral" &&
            relationBA === "neutral"
        ) {

            return 3;

        }


        if (
            (
                relationAB === "friend" &&
                relationBA === "enemy"
            ) ||
            (
                relationAB === "enemy" &&
                relationBA === "friend"
            )
        ) {

            return 1;

        }


        return 0;

    }


    /* =====================================================
       GANA
    ===================================================== */

    function calculateGana(
        a,
        b
    ) {

        const ganaA =
            getGanaRaw(
                a
            );


        const ganaB =
            getGanaRaw(
                b
            );


        let score;


        if (
            ganaA ===
            ganaB
        ) {

            score = 6;

        }
        else if (
            (
                ganaA === "Deva" &&
                ganaB === "Manushya"
            ) ||
            (
                ganaA === "Manushya" &&
                ganaB === "Deva"
            )
        ) {

            score = 5;

        }
        else if (
            (
                ganaA === "Rakshasa" &&
                ganaB === "Manushya"
            ) ||
            (
                ganaA === "Manushya" &&
                ganaB === "Rakshasa"
            )
        ) {

            score = 1;

        }
        else {

            score = 1;

        }


        return {

            id:
                "gana",

            name:
                "Gana / गण",

            max:
                6,

            score:
                score,

            a:
                GANA_HINDI[ganaA],

            b:
                GANA_HINDI[ganaB],

            detail:
                "Person A का Gana " +
                GANA_HINDI[ganaA] +
                " और Person B का " +
                GANA_HINDI[ganaB] +
                " है।"

        };

    }


    /* =====================================================
       BHAKOOT
    ===================================================== */

    function calculateBhakoot(
        a,
        b
    ) {

        const signA =
            getRashiIndex(
                a.rashi
            );


        const signB =
            getRashiIndex(
                b.rashi
            );


        const distanceAB =
            (
                signB -
                signA +
                12
            ) % 12 + 1;


        const distanceBA =
            (
                signA -
                signB +
                12
            ) % 12 + 1;


        const relation =
            bhakootRelation(
                distanceAB,
                distanceBA
            );


        const bad =
            BHAKOOT_BAD.has(
                relation
            );


        return {

            id:
                "bhakoot",

            name:
                "Bhakoot / भकूट",

            max:
                7,

            score:
                bad
                    ? 0
                    : 7,

            a:
                formatRashi(
                    a.rashi
                ),

            b:
                formatRashi(
                    b.rashi
                ),

            detail:
                bad
                    ? "Moon Rashi relation " +
                      relation +
                      " है, जो पारंपरिक Bhakoot Dosha category में आता है।"
                    : "Moon Rashi relation " +
                      relation +
                      " है और Bhakoot के लिए पूर्ण score मिला।"

        };

    }


    function bhakootRelation(
        distanceAB,
        distanceBA
    ) {

        if (
            (
                distanceAB === 1 &&
                distanceBA === 1
            )
        ) {

            return "1/1";

        }


        if (
            (
                (
                    distanceAB === 3 &&
                    distanceBA === 11
                ) ||
                (
                    distanceAB === 11 &&
                    distanceBA === 3
                )
            )
        ) {

            return "3/11";

        }


        if (
            (
                (
                    distanceAB === 4 &&
                    distanceBA === 10
                ) ||
                (
                    distanceAB === 10 &&
                    distanceBA === 4
                )
            )
        ) {

            return "4/10";

        }


        if (
            (
                distanceAB === 7 &&
                distanceBA === 7
            )
        ) {

            return "7/7";

        }


        if (
            (
                (
                    distanceAB === 2 &&
                    distanceBA === 12
                ) ||
                (
                    distanceAB === 12 &&
                    distanceBA === 2
                )
            )
        ) {

            return "2/12";

        }


        if (
            (
                (
                    distanceAB === 5 &&
                    distanceBA === 9
                ) ||
                (
                    distanceAB === 9 &&
                    distanceBA === 5
                )
            )
        ) {

            return "5/9";

        }


        if (
            (
                (
                    distanceAB === 6 &&
                    distanceBA === 8
                ) ||
                (
                    distanceAB === 8 &&
                    distanceBA === 6
                )
            )
        ) {

            return "6/8";

        }


        return (
            distanceAB +
            "/" +
            distanceBA
        );

    }


    /* =====================================================
       NADI
    ===================================================== */

    function calculateNadi(
        a,
        b
    ) {

        const nadiA =
            getNadiRaw(
                a
            );


        const nadiB =
            getNadiRaw(
                b
            );


        const same =
            nadiA ===
            nadiB;


        return {

            id:
                "nadi",

            name:
                "Nadi / नाड़ी",

            max:
                8,

            score:
                same
                    ? 0
                    : 8,

            a:
                NADI_NAMES[nadiA],

            b:
                NADI_NAMES[nadiB],

            detail:
                same
                    ? "दोनों की Nadi समान है, इसलिए Nadi Dosha indicator मिला।"
                    : "दोनों की Nadi अलग है, इसलिए Nadi के पूर्ण गुण मिले।"

        };

    }


    /* =====================================================
       MANGALIK COMPARISON
    ===================================================== */

    function calculateManglikComparison(
        kundliA,
        kundliB
    ) {

        const a =
            getManglik(
                kundliA
            );

        const b =
            getManglik(
                kundliB
            );


        return {

            a:
                a,

            b:
                b,

            sameStatus:
                a.isManglik ===
                b.isManglik

        };

    }


    function getManglik(
        kundli
    ) {

        if (
            kundli &&
            kundli.manglik
        ) {

            return {

                isManglik:
                    Boolean(
                        kundli.manglik.isManglik
                    ),

                fromLagna:
                    Boolean(
                        kundli.manglik.fromLagna
                    ),

                fromMoon:
                    Boolean(
                        kundli.manglik.fromMoon
                    ),

                fromVenus:
                    Boolean(
                        kundli.manglik.fromVenus
                    ),

                house:
                    kundli.manglik.house ??
                    null

            };

        }


        const mars =
            kundli &&
            kundli.planets
                ? kundli.planets.Mars
                : null;


        if (!mars) {

            return {

                isManglik: false,

                fromLagna: false,

                fromMoon: false,

                fromVenus: false,

                house: null

            };

        }


        const lagnaHouse =
            Number(
                mars.house
            );


        const houses = [
            1,
            2,
            4,
            7,
            8,
            12
        ];


        return {

            isManglik:
                houses.includes(
                    lagnaHouse
                ),

            fromLagna:
                houses.includes(
                    lagnaHouse
                ),

            fromMoon:
                false,

            fromVenus:
                false,

            house:
                lagnaHouse

        };

    }


    /* =====================================================
       RENDER MILAN
    ===================================================== */

    function renderMilanResult(
        milan
    ) {

        if (!milan) {
            return;
        }


        renderScoreSummary(
            milan
        );


        renderResultPersons(
            milan
        );


        renderKootaTable(
            milan
        );


        renderSummaryDetails(
            milan
        );


        renderSpecialChecks(
            milan
        );


        renderChartCrossCheck(
            milan
        );


        renderDetailedAnalysis(
            milan
        );


        if (resultSection) {

            resultSection.hidden =
                false;


            resultSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    }


    /* =====================================================
       SCORE SUMMARY
    ===================================================== */

    function renderScoreSummary(
        milan
    ) {

        const verdict =
            getScoreVerdict(
                milan.total
            );


        const nadiClass =
            milan.nadiDosha
                ? "bad"
                : "good";


        const bhakootClass =
            milan.bhakootDosha
                ? "bad"
                : "good";


        scoreSummary.innerHTML =

            '<div class="milan-score-main">' +

                '<div class="milan-score-number">' +
                    escapeHTML(
                        milan.total
                    ) +
                    "/36" +
                "</div>" +

                '<div class="milan-score-label">' +
                    "Total Guna / कुल गुण" +
                "</div>" +

                '<div class="milan-score-verdict">' +
                    escapeHTML(
                        verdict.title
                    ) +
                "</div>" +

            "</div>" +


            '<div class="milan-score-overview">' +

                scoreStat(
                    "Compatibility / अनुकूलता",
                    milan.percentage +
                    "%",
                    "good"
                ) +

                scoreStat(
                    "Nadi / नाड़ी",
                    milan.nadiDosha
                        ? "Dosha indicator"
                        : "Different Nadi",
                    nadiClass
                ) +

                scoreStat(
                    "Bhakoot / भकूट",
                    milan.bhakootDosha
                        ? "Dosha indicator"
                        : "No Dosha indicator",
                    bhakootClass
                ) +

                scoreStat(
                    "Assessment / मूल्यांकन",
                    verdict.short,
                    verdict.className
                ) +

            "</div>";

    }


    function scoreStat(
        label,
        value,
        className
    ) {

        return (

            '<div class="milan-score-stat">' +

                "<span>" +
                    escapeHTML(
                        label
                    ) +
                "</span>" +

                '<strong class="' +
                    escapeHTML(
                        className
                    ) +
                '">' +

                    escapeHTML(
                        value
                    ) +

                "</strong>" +

            "</div>"

        );

    }


    function getScoreVerdict(
        score
    ) {

        if (score >= 28) {

            return {

                title:
                    "बहुत अच्छा पारंपरिक मिलान",

                short:
                    "High score",

                className:
                    "good"

            };

        }


        if (score >= 24) {

            return {

                title:
                    "अच्छा मिलान",

                short:
                    "Good score",

                className:
                    "good"

            };

        }


        if (score >= 18) {

            return {

                title:
                    "औसत / विचार योग्य",

                short:
                    "Moderate score",

                className:
                    "warn"

            };

        }


        return {

            title:
                "कम स्कोर — विस्तृत परीक्षण आवश्यक",

            short:
                "Low score",

            className:
                "bad"

        };

    }


    /* =====================================================
       RESULT PERSONS
    ===================================================== */

    function renderResultPersons(
        milan
    ) {

        resultPersons.innerHTML =

            resultPerson(
                "Person A / व्यक्ति A",
                currentPersonA,
                milan.moonA,
                milan.personA
            ) +

            resultPerson(
                "Person B / व्यक्ति B",
                currentPersonB,
                milan.moonB,
                milan.personB
            );

    }


    function resultPerson(
        title,
        person,
        moon,
        kundli
    ) {

        const lagna =
            getLagnaData(
                kundli
            );


        return (

            '<div class="milan-result-person">' +

                "<h4>" +
                    escapeHTML(
                        title
                    ) +
                "</h4>" +

                '<div class="milan-result-person-grid">' +

                    resultPersonItem(
                        "Name / नाम",
                        person
                            ? person.name
                            : "—"
                    ) +

                    resultPersonItem(
                        "Moon Rashi / चंद्र राशि",
                        formatRashi(
                            moon.rashi
                        )
                    ) +

                    resultPersonItem(
                        "Nakshatra / नक्षत्र",
                        formatNakshatra(
                            moon.nakshatra
                        )
                    ) +

                    resultPersonItem(
                        "Pada / पाद",
                        moon.nakshatra &&
                        moon.nakshatra.pada
                            ? String(
                                moon.nakshatra.pada
                            )
                            : "—"
                    ) +

                    resultPersonItem(
                        "Gana / गण",
                        getGana(
                            moon
                        )
                    ) +

                    resultPersonItem(
                        "Nadi / नाड़ी",
                        getNadi(
                            moon
                        )
                    ) +

                    resultPersonItem(
                        "Yoni / योनि",
                        getYoni(
                            moon
                        )
                    ) +

                    resultPersonItem(
                        "Lagna / लग्न",
                        formatRashi(
                            lagna.rashi
                        )
                    ) +

                "</div>" +

            "</div>"

        );

    }


    function resultPersonItem(
        label,
        value
    ) {

        return (

            '<div class="milan-result-person-item">' +

                "<span>" +
                    escapeHTML(
                        label
                    ) +
                "</span>" +

                "<strong>" +
                    escapeHTML(
                        value
                    ) +
                "</strong>" +

            "</div>"

        );

    }


    /* =====================================================
       KOOTA TABLE
    ===================================================== */

    function renderKootaTable(
        milan
    ) {

        kootaBody.innerHTML =
            milan.rows
                .map(
                    function (row) {

                        const status =
                            getKootaStatus(
                                row
                            );


                        return (

                            "<tr>" +

                                "<td>" +
                                    "<strong>" +
                                        escapeHTML(
                                            row.name
                                        ) +
                                    "</strong>" +
                                "</td>" +

                                "<td>" +
                                    escapeHTML(
                                        row.max
                                    ) +
                                "</td>" +

                                '<td class="koota-score">' +
                                    escapeHTML(
                                        row.score
                                    ) +
                                "</td>" +

                                "<td>" +
                                    escapeHTML(
                                        row.a
                                    ) +
                                "</td>" +

                                "<td>" +
                                    escapeHTML(
                                        row.b
                                    ) +
                                "</td>" +

                                "<td>" +

                                    '<span class="koota-status ' +
                                        status.className +
                                    '">' +

                                        escapeHTML(
                                            status.text
                                        ) +

                                    "</span>" +

                                    "<div style=\"margin-top:6px\">" +
                                        escapeHTML(
                                            row.detail
                                        ) +
                                    "</div>" +

                                "</td>" +

                            "</tr>"

                        );

                    }
                )
                .join("");

    }


    function getKootaStatus(
        row
    ) {

        const ratio =
            row.max
                ? Number(
                    row.score
                ) /
                Number(
                    row.max
                )
                : 0;


        if (
            ratio >= 0.75
        ) {

            return {

                className:
                    "good",

                text:
                    "अनुकूल"

            };

        }


        if (
            ratio >= 0.40
        ) {

            return {

                className:
                    "warn",

                text:
                    "मध्यम"

            };

        }


        return {

            className:
                "bad",

            text:
                "कम / दोष संकेत"

        };

    }


    /* =====================================================
       SUMMARY DETAILS
    ===================================================== */

    function renderSummaryDetails(
        milan
    ) {

        const verdict =
            getScoreVerdict(
                milan.total
            );


        summaryDetails.innerHTML =

            analysisBlock(
                "कुल गुण / Total Score",
                "दोनों की calculated Moon Rashi और Nakshatra से कुल " +
                milan.total +
                " / " +
                milan.max +
                " गुण प्राप्त हुए। Percentage " +
                milan.percentage +
                "% है। Assessment: " +
                verdict.title +
                "।"
            ) +

            analysisBlock(
                "Nadi / नाड़ी",
                milan.nadiDosha
                    ? "दोनों की Nadi समान है: " +
                      getNadi(
                          milan.moonA
                      ) +
                      "। इसलिए Nadi Dosha indicator मिला है।"
                    : "दोनों की Nadi अलग है: " +
                      getNadi(
                          milan.moonA
                      ) +
                      " और " +
                      getNadi(
                          milan.moonB
                      ) +
                      "। इसलिए Nadi के पूर्ण 8 गुण मिले।"
            ) +

            analysisBlock(
                "Bhakoot / भकूट",
                getBhakootSummary(
                    milan
                )
            ) +

            analysisBlock(
                "Graha Maitri / ग्रह मैत्री",
                getMaitriSummary(
                    milan
                )
            );

    }


    function getBhakootSummary(
        milan
    ) {

        const row =
            milan.rows.find(
                function (item) {

                    return (
                        item.id ===
                        "bhakoot"
                    );

                }
            );


        if (!row) {
            return "Bhakoot calculation उपलब्ध नहीं है।";
        }


        return row.detail;

    }


    function getMaitriSummary(
        milan
    ) {

        const row =
            milan.rows.find(
                function (item) {

                    return (
                        item.id ===
                        "graha-maitri"
                    );

                }
            );


        if (!row) {
            return "Graha Maitri calculation उपलब्ध नहीं है।";
        }


        return (
            row.detail +
            " Score " +
            row.score +
            "/" +
            row.max +
            " है।"
        );

    }


    /* =====================================================
       SPECIAL CHECKS
    ===================================================== */

    function renderSpecialChecks(
        milan
    ) {

        const manglik =
            milan.manglik;


        specialChecks.innerHTML =

            specialItem(
                "Nadi Dosha / नाड़ी दोष",
                milan.nadiDosha
                    ? "Indicator Present / संकेत मौजूद"
                    : "No Indicator / संकेत नहीं",
                milan.nadiDosha
                    ? "दोनों की Nadi समान है।"
                    : "दोनों की Nadi अलग है।",
                milan.nadiDosha
                    ? "bad"
                    : "good"
            ) +

            specialItem(
                "Bhakoot Dosha / भकूट दोष",
                milan.bhakootDosha
                    ? "Indicator Present / संकेत मौजूद"
                    : "No Indicator / संकेत नहीं",
                getBhakootSummary(
                    milan
                ),
                milan.bhakootDosha
                    ? "bad"
                    : "good"
            ) +

            specialItem(
                "Person A Manglik",
                manglik.a.isManglik
                    ? "Manglik indicator"
                    : "Non-Manglik by primary rule",
                getManglikText(
                    manglik.a
                ),
                manglik.a.isManglik
                    ? "warn"
                    : "good"
            ) +

            specialItem(
                "Person B Manglik",
                manglik.b.isManglik
                    ? "Manglik indicator"
                    : "Non-Manglik by primary rule",
                getManglikText(
                    manglik.b
                ),
                manglik.b.isManglik
                    ? "warn"
                    : "good"
            );

    }


    function specialItem(
        title,
        value,
        text,
        className
    ) {

        return (

            '<div class="milan-special-item">' +

                "<span>" +
                    escapeHTML(
                        title
                    ) +
                "</span>" +

                "<strong>" +
                    escapeHTML(
                        value
                    ) +
                "</strong>" +

                "<p>" +
                    escapeHTML(
                        text
                    ) +
                "</p>" +

            "</div>"

        );

    }


    function getManglikText(
        data
    ) {

        if (!data) {

            return "Manglik calculation data उपलब्ध नहीं है।";

        }


        if (!data.isManglik) {

            return (
                "Primary Lagna-based rule में Mars " +
                "Manglik houses में नहीं है।"
            );

        }


        return (
            "Mars House " +
            (
                data.house ??
                "—"
            ) +
            " में है। Primary Lagna-based Manglik indicator मिला।"
        );

    }


    /* =====================================================
       CHART CROSS CHECK
    ===================================================== */

    function renderChartCrossCheck(
        milan
    ) {

        chartCrossCheck.innerHTML =

            chartColumn(
                "Person A / व्यक्ति A",
                milan.personA
            ) +

            chartColumn(
                "Person B / व्यक्ति B",
                milan.personB
            );

    }


    function chartColumn(
        title,
        kundli
    ) {

        const lagna =
            getLagnaData(
                kundli
            );


        const mars =
            getPlanet(
                kundli,
                "Mars"
            );


        const venus =
            getPlanet(
                kundli,
                "Venus"
            );


        const jupiter =
            getPlanet(
                kundli,
                "Jupiter"
            );


        const seventh =
            getHouse(
                kundli,
                7
            );


        const seventhLord =
            getPlanet(
                kundli,
                seventh
                    ? seventh.lord
                    : null
            );


        const d9 =
            kundli &&
            kundli.navamsa
                ? kundli.navamsa.lagna
                : null;


        return (

            '<div class="milan-chart-column">' +

                "<h5>" +
                    escapeHTML(
                        title
                    ) +
                "</h5>" +

                chartRow(
                    "Lagna / लग्न",
                    formatRashi(
                        lagna.rashi
                    )
                ) +

                chartRow(
                    "7th House / सप्तम भाव",
                    seventh
                        ? formatRashi(
                            seventh.rashi
                        )
                        : "—"
                ) +

                chartRow(
                    "7th Lord / सप्तमेश",
                    seventhLord
                        ? (
                            formatPlanetName(
                                seventhLord.id ||
                                seventh.lord
                            ) +
                            " • House " +
                            (
                                seventhLord.house ??
                                "—"
                            )
                        )
                        : "—"
                ) +

                chartRow(
                    "Mars / मंगल",
                    mars
                        ? (
                            formatRashi(
                                mars.rashi
                            ) +
                            " • House " +
                            (
                                mars.house ??
                                "—"
                            )
                        )
                        : "—"
                ) +

                chartRow(
                    "Venus / शुक्र",
                    venus
                        ? (
                            formatRashi(
                                venus.rashi
                            ) +
                            " • House " +
                            (
                                venus.house ??
                                "—"
                            )
                        )
                        : "—"
                ) +

                chartRow(
                    "Jupiter / गुरु",
                    jupiter
                        ? (
                            formatRashi(
                                jupiter.rashi
                            ) +
                            " • House " +
                            (
                                jupiter.house ??
                                "—"
                            )
                        )
                        : "—"
                ) +

                chartRow(
                    "D9 Lagna / नवांश लग्न",
                    d9
                        ? formatRashi(
                            d9.sign ||
                            d9
                        )
                        : "—"
                ) +

            "</div>"

        );

    }


    function chartRow(
        label,
        value
    ) {

        return (

            '<div class="milan-chart-row">' +

                "<span>" +
                    escapeHTML(
                        label
                    ) +
                "</span>" +

                "<strong>" +
                    escapeHTML(
                        value
                    ) +
                "</strong>" +

            "</div>"

        );

    }


    /* =====================================================
       DETAILED ANALYSIS
    ===================================================== */

    function renderDetailedAnalysis(
        milan
    ) {

        const rows =
            milan.rows;


        const varna =
            getRow(
                rows,
                "varna"
            );

        const vashya =
            getRow(
                rows,
                "vashya"
            );

        const tara =
            getRow(
                rows,
                "tara"
            );

        const yoni =
            getRow(
                rows,
                "yoni"
            );

        const maitri =
            getRow(
                rows,
                "graha-maitri"
            );

        const gana =
            getRow(
                rows,
                "gana"
            );


        detailedAnalysis.innerHTML =

            analysisBlock(
                "Varna / वर्ण",
                varna.detail +
                " Person A: " +
                varna.a +
                " • Person B: " +
                varna.b +
                "। Score " +
                varna.score +
                "/" +
                varna.max +
                "।"
            ) +

            analysisBlock(
                "Vashya / वश्य",
                vashya.detail +
                " Score " +
                vashya.score +
                "/" +
                vashya.max +
                "।"
            ) +

            analysisBlock(
                "Tara / तारा",
                tara.detail +
                " Score " +
                tara.score +
                "/" +
                tara.max +
                "।"
            ) +

            analysisBlock(
                "Yoni / योनि",
                yoni.detail +
                " Person A: " +
                yoni.a +
                " • Person B: " +
                yoni.b +
                "। Score " +
                yoni.score +
                "/" +
                yoni.max +
                "।"
            ) +

            analysisBlock(
                "Gana / गण",
                gana.detail +
                " Score " +
                gana.score +
                "/" +
                gana.max +
                "।"
            ) +

            analysisBlock(
                "Overall / समग्र",
                "कुल " +
                milan.total +
                "/" +
                milan.max +
                " गुण प्राप्त हुए। यह score केवल Ashtakoota compatibility को दर्शाता है। विवाह के व्यापक निष्कर्ष के लिए D1, D9, 7th House, Venus, Jupiter, Mars और Dasha को साथ देखना आवश्यक है।"
            );

    }


    function analysisBlock(
        title,
        text
    ) {

        return (

            '<div class="milan-analysis-block">' +

                "<h5>" +
                    escapeHTML(
                        title
                    ) +
                "</h5>" +

                "<p>" +
                    escapeHTML(
                        text
                    ) +
                "</p>" +

            "</div>"

        );

    }


    /* =====================================================
       DATA HELPERS
    ===================================================== */

    function getMoonData(
        kundli
    ) {

        const moon =
            getPlanet(
                kundli,
                "Moon"
            );


        return {

            planet:
                moon,

            rashi:
                moon
                    ? moon.rashi
                    : null,

            nakshatra:
                moon
                    ? moon.nakshatra
                    : null

        };

    }


    function getLagnaData(
        kundli
    ) {

        if (
            kundli &&
            kundli.lagna
        ) {

            return {

                rashi:
                    kundli.lagna.rashi ||
                    kundli.lagna.sign ||
                    kundli.lagna

            };

        }


        return {
            rashi: null
        };

    }


    function getPlanet(
        kundli,
        id
    ) {

        if (
            !kundli ||
            !kundli.planets ||
            !id
        ) {

            return null;

        }


        return (
            kundli.planets[id] ||
            null
        );

    }


    function getHouse(
        kundli,
        number
    ) {

        if (
            !kundli ||
            !Array.isArray(
                kundli.houses
            )
        ) {

            return null;

        }


        return (
            kundli.houses[
                Number(number) - 1
            ] ||
            null
        );

    }


    function getRashiIndex(
        rashi
    ) {

        if (!rashi) {
            return -1;
        }


        if (
            Number.isFinite(
                Number(
                    rashi.index
                )
            )
        ) {

            return Number(
                rashi.index
            );

        }


        if (
            rashi.id
        ) {

            const byId =
                RASHIS.find(
                    function (item) {

                        return (
                            item.id ===
                            rashi.id
                        );

                    }
                );


            if (byId) {
                return byId.index;
            }

        }


        if (
            rashi.name
        ) {

            const byName =
                RASHIS.find(
                    function (item) {

                        return (
                            item.name ===
                            rashi.name
                        );

                    }
                );


            if (byName) {
                return byName.index;
            }

        }


        return -1;

    }


    function getNakshatraIndex(
        nakshatra
    ) {

        if (!nakshatra) {
            return -1;
        }


        if (
            Number.isFinite(
                Number(
                    nakshatra.index
                )
            )
        ) {

            return Number(
                nakshatra.index
            );

        }


        const name =
            nakshatra.name ||
            "";


        return NAKSHATRAS.indexOf(
            name
        );

    }


    function getRashiLord(
        rashi
    ) {

        const index =
            getRashiIndex(
                rashi
            );


        return (
            RASHI_LORDS[index] ||
            ""
        );

    }


    function getGanaRaw(
        moon
    ) {

        if (
            moon &&
            moon.nakshatra &&
            moon.nakshatra.gana
        ) {

            return normalizeGana(
                moon.nakshatra.gana
            );

        }


        const index =
            getNakshatraIndex(
                moon.nakshatra
            );


        return (
            GANA_BY_NAKSHATRA[index] ||
            "Unknown"
        );

    }


    function getGana(
        moon
    ) {

        const raw =
            getGanaRaw(
                moon
            );


        return (
            GANA_HINDI[raw] ||
            "उपलब्ध नहीं"
        );

    }


    function normalizeGana(
        value
    ) {

        const text =
            String(
                value || ""
            ).toLowerCase();


        if (
            text.includes("deva") ||
            text.includes("देव")
        ) {

            return "Deva";

        }


        if (
            text.includes("manushya") ||
            text.includes("manush") ||
            text.includes("मनुष्य")
        ) {

            return "Manushya";

        }


        if (
            text.includes("rakshasa") ||
            text.includes("राक्षस")
        ) {

            return "Rakshasa";

        }


        return value;

    }


    function getNadiRaw(
        moon
    ) {

        if (
            moon &&
            moon.nakshatra &&
            moon.nakshatra.nadi
        ) {

            return normalizeNadi(
                moon.nakshatra.nadi
            );

        }


        const index =
            getNakshatraIndex(
                moon.nakshatra
            );


        return (
            NADI_BY_NAKSHATRA[index] ??
            -1
        );

    }


    function getNadi(
        moon
    ) {

        const raw =
            getNadiRaw(
                moon
            );


        if (
            typeof raw ===
            "number"
        ) {

            return (
                NADI_NAMES[raw] ||
                "उपलब्ध नहीं"
            );

        }


        return String(
            raw ||
            "उपलब्ध नहीं"
        );

    }


    function normalizeNadi(
        value
    ) {

        const text =
            String(
                value || ""
            ).toLowerCase();


        if (
            text.includes("adi") ||
            text.includes("आदि")
        ) {

            return 0;

        }


        if (
            text.includes("madhya") ||
            text.includes("मध्य")
        ) {

            return 1;

        }


        if (
            text.includes("antya") ||
            text.includes("अन्त्य") ||
            text.includes("ant")
        ) {

            return 2;

        }


        return Number(
            value
        );

    }


    function getYoniRaw(
        moon
    ) {

        if (
            moon &&
            moon.nakshatra &&
            moon.nakshatra.yoni
        ) {

            return normalizeYoni(
                moon.nakshatra.yoni
            );

        }


        const index =
            getNakshatraIndex(
                moon.nakshatra
            );


        return (
            YONI_BY_NAKSHATRA[index] ||
            "Unknown"
        );

    }


    function getYoni(
        moon
    ) {

        const raw =
            getYoniRaw(
                moon
            );


        return (
            YONI_HINDI[raw] ||
            String(
                raw ||
                "उपलब्ध नहीं"
            )
        );

    }


    function normalizeYoni(
        value
    ) {

        const text =
            String(
                value || ""
            ).toLowerCase();


        const match =
            Object.keys(
                YONI_HINDI
            ).find(
                function (key) {

                    return (
                        text.includes(
                            key.toLowerCase()
                        )
                    );

                }
            );


        return (
            match ||
            value
        );

    }


    /* =====================================================
       FORMATTING
    ===================================================== */

    function formatRashi(
        rashi
    ) {

        if (!rashi) {
            return "—";
        }


        const name =
            rashi.name ||
            "";


        const hindi =
            rashi.hindi ||
            "";


        if (
            name &&
            hindi
        ) {

            return (
                name +
                " / " +
                hindi
            );

        }


        return (
            hindi ||
            name ||
            "—"
        );

    }


    function formatNakshatra(
        nakshatra
    ) {

        if (!nakshatra) {
            return "—";
        }


        const name =
            nakshatra.name ||
            "";


        const hindi =
            nakshatra.hindi ||
            getNakshatraHindi(
                name
            );


        const pada =
            nakshatra.pada
                ? " P" +
                  nakshatra.pada
                : "";


        return (
            name +
            " / " +
            hindi +
            pada
        );

    }


    function getNakshatraHindi(
        name
    ) {

        const index =
            NAKSHATRAS.indexOf(
                name
            );


        return (
            NAKSHATRA_HINDI[index] ||
            name ||
            ""
        );

    }


    function formatPlanetName(
        id
    ) {

        return (
            PLANET_HINDI[id] ||
            id ||
            "—"
        );

    }


    function formatGender(
        value
    ) {

        if (
            value === "male"
        ) {

            return "Male / पुरुष";

        }


        if (
            value === "female"
        ) {

            return "Female / महिला";

        }


        if (
            value === "other"
        ) {

            return "Other / अन्य";

        }


        return (
            value ||
            "—"
        );

    }


    function formatNumber(
        value
    ) {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {

            return "—";

        }


        const number =
            Number(
                value
            );


        if (
            !Number.isFinite(
                number
            )
        ) {

            return "—";

        }


        return number.toFixed(
            6
        );

    }


    function valueOrBlank(
        value
    ) {

        return (
            value === null ||
            value === undefined ||
            value === ""
        )
            ? ""
            : String(
                value
            );

    }


    function roundScore(
        value
    ) {

        return Math.round(
            Number(value) * 10
        ) / 10;

    }


    function getRow(
        rows,
        id
    ) {

        return (
            rows.find(
                function (row) {

                    return (
                        row.id ===
                        id
                    );

                }
            ) ||
            {
                score: 0,
                max: 0,
                detail:
                    "Calculation unavailable."
            }
        );

    }


    /* =====================================================
       UI STATE
    ===================================================== */

    function setLoading(
        loading
    ) {

        if (!generateBtn) {
            return;
        }


        generateBtn.disabled =
            loading;


        generateBtn.innerHTML =
            loading
                ? "⏳ Calculating... / गणना हो रही है..."
                : "✦ Generate Person B Kundli / व्यक्ति B की कुंडली बनाएं";

    }


    function resetPersonB() {

        if (formB) {
            formB.reset();
        }


        selectedPlace = null;


        currentPersonB = null;

        currentKundliB = null;

        currentMilan = null;


        hideCalculatedSection();

        hideResult();

        hideLocationResults();

        clearLocationFields();

        clearMessage();


        /*
         * Clear Person B state but NEVER Person A.
         */
        if (
            window.KundliState &&
            typeof window.KundliState.patch ===
                "function"
        ) {

            window.KundliState.patch({

                personB:
                    null,

                kundliB:
                    null,

                milan:
                    null

            });

        }


        showMessage(
            "Person B form reset हो गया। Person A की Kundli सुरक्षित है।",
            "success"
        );

    }


    function hideResult() {

        if (resultSection) {
            resultSection.hidden = true;
        }

    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    function showMessage(
        text,
        type
    ) {

        if (!messageBox) {
            return;
        }


        messageBox.textContent =
            text;


        messageBox.className =
            "kundli-milan-message " +
            (
                type ||
                ""
            );


        messageBox.hidden =
            false;

    }


    function clearMessage() {

        if (!messageBox) {
            return;
        }


        messageBox.textContent =
            "";


        messageBox.hidden =
            true;


        messageBox.className =
            "kundli-milan-message";

    }


    function setLocationStatus(
        text,
        type
    ) {

        if (!locationStatus) {
            return;
        }


        locationStatus.textContent =
            text;


        locationStatus.className =
            "milan-location-status " +
            (
                type ||
                ""
            );

    }


    /* =====================================================
       ENGINE BADGE
    ===================================================== */

    function updateEngineBadge() {

        const badge =
            document.getElementById(
                "kundliMilanEngineBadge"
            );


        if (!badge) {
            return;
        }


        badge.textContent =
            window.KundliEngine
                ? "Kundli Engine / कुंडली इंजन"
                : "Engine Loading / इंजन लोड हो रहा है";

    }


    /* =====================================================
       ESCAPE
    ===================================================== */

    function escapeHTML(
        value
    ) {

        return String(
            value ??
            ""
        )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

    }


    /* =====================================================
       PUBLIC API
    ===================================================== */

    window.KundliMilan = {

        init:
            init,

        render:
            function () {

                loadPersonA();

                if (
                    currentPersonB &&
                    currentKundliB
                ) {

                    showCalculatedSection();

                }

                if (
                    currentMilan
                ) {

                    renderMilanResult(
                        currentMilan
                    );

                }

            }

    };


    /*
     * Required by dynamic Kundli shell.
     */
    window.KundliModules =
        window.KundliModules ||
        {};


    window.KundliModules[
        "kundli-milan"
    ] = {

        init:
            init

    };


})(window);