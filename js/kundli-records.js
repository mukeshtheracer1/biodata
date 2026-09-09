"use strict";

/* ============================================================
   KUNDLI RECORDS APP
   File:
   js/kundli-records.js

   Responsibility:
   - Application state
   - Birth form
   - Calculation
   - Navigation
   - Dashboard
   - Module rendering
   - Person B
   - Storage
   - Print

   Calculation itself:
   kundli-engine.js
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

    /* ========================================================
       BASIC DOM HELPER
    ======================================================== */

    const $ = (id) => document.getElementById(id);

    const $$ = (selector) =>
        Array.from(document.querySelectorAll(selector));


    /* ========================================================
       APP CHECK
    ======================================================== */

    const app = $("kundliApp");

    if (!app) {
        console.error(
            "KundliApp: #kundliApp नहीं मिला।"
        );
        return;
    }


    /* ========================================================
       ENGINE CHECK
    ======================================================== */

    if (
        typeof window.KundliEngine === "undefined" ||
        typeof window.KundliEngine.calculate !== "function"
    ) {
        console.error(
            "KundliEngine load नहीं हुआ। " +
            "Check करें: ../js/kundli-engine.js"
        );

        showStatus(
            "Kundli calculation engine load नहीं हुआ।",
            "error"
        );

        return;
    }


    /* ========================================================
       CONFIGURATION
    ======================================================== */

    const STORAGE_KEY =
        "vedic_kundli_app_v1";

    const MODULES = [
        "birth",
        "dashboard",
        "d1",
        "bhava",
        "planets",
        "nakshatra",
        "d9",
        "dasha",
        "yoga",
        "dosha",
        "manglik",
        "marriage",
        "timing",
        "milan",
        "gun-milan",
        "compatibility",
        "report"
    ];


    const MODULE_INFO = {

        birth: {
            title: "जन्म विवरण",
            description:
                "Birth details और location"
        },

        dashboard: {
            title: "Dashboard",
            description:
                "कुंडली का overview"
        },

        d1: {
            title: "D1 Rashi",
            description:
                "जन्म लग्न एवं राशि chart"
        },

        bhava: {
            title: "Bhava",
            description:
                "12 भावों का विवरण"
        },

        planets: {
            title: "Grah Sthiti",
            description:
                "ग्रहों की स्थिति"
        },

        nakshatra: {
            title: "Nakshatra",
            description:
                "जन्म नक्षत्र analysis"
        },

        d9: {
            title: "Navamsa D9",
            description:
                "विवाह एवं ग्रह strength"
        },

        dasha: {
            title: "Vimshottari Dasha",
            description:
                "दशा एवं अंतर्दशा"
        },

        yoga: {
            title: "Yog",
            description:
                "Supported planetary yogas"
        },

        dosha: {
            title: "Dosha",
            description:
                "दोष analysis"
        },

        manglik: {
            title: "Manglik",
            description:
                "Mars / Manglik analysis"
        },

        marriage: {
            title: "Marriage",
            description:
                "विवाह के प्रमुख संकेत"
        },

        timing: {
            title: "Marriage Timing",
            description:
                "दशा आधारित timing"
        },

        milan: {
            title: "Kundli Milan",
            description:
                "Person A और B matching"
        },

        "gun-milan": {
            title: "Gun Milan",
            description:
                "Ashtakoota 36 Guna"
        },

        compatibility: {
            title: "Compatibility",
            description:
                "Relationship compatibility"
        },

        report: {
            title: "Detailed Report",
            description:
                "Final consolidated report"
        }
    };


    /* ========================================================
       CENTRAL STATE
       एक ही state पूरी application को control करेगी।
    ======================================================== */

    const state = {

        currentModule: "birth",

        personA: null,

        personB: null,

        kundliA: null,

        kundliB: null,

        milan: null,

        lastError: null
    };


    /* ========================================================
       DOM REFERENCES
    ======================================================== */

    const elements = {

        birthForm:
            $("birthDetailsForm"),

        personBForm:
            $("personBForm"),

        generateBtn:
            $("generateKundliBtn"),

        previousBtn:
            $("previousModuleBtn"),

        nextBtn:
            $("nextModuleBtn"),

        bottomPreviousBtn:
            $("bottomPreviousBtn"),

        bottomNextBtn:
            $("bottomNextBtn"),

        dashboardBtn:
            $("dashboardBtn"),

        moduleTabs:
            $("moduleTabs"),

        status:
            $("kundliStatus"),

        toast:
            $("toast"),

        printBtn:
            $("printReportBtn"),

        saveReportBtn:
            $("saveReportBtn"),

        continueBtn:
            $("continueSavedProfileBtn"),

        screens:
            $$("[data-screen]"),

        tabs:
            $$(".module-tab")
    };


    /* ========================================================
       GENERIC HELPERS
    ======================================================== */

    function escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function number(value, fallback = null) {

        const n = Number(value);

        return Number.isFinite(n)
            ? n
            : fallback;
    }


    function text(value, fallback = "—") {

        if (
            value === null ||
            value === undefined ||
            value === ""
        ) {
            return fallback;
        }

        return String(value);
    }


    function formatDegree(value) {

        const n = number(value);

        if (n === null) {
            return "—";
        }

        return `${n.toFixed(2)}°`;
    }


    function formatDate(date) {

        if (!date) {
            return "—";
        }

        const parts =
            String(date).split("-");

        if (parts.length !== 3) {
            return String(date);
        }

        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }


    function showStatus(message, type = "success") {

        if (!elements.status) {
            return;
        }

        elements.status.hidden = false;

        elements.status.textContent =
            message;

        elements.status.className =
            `kundli-status is-${type}`;
    }


    function hideStatus() {

        if (!elements.status) {
            return;
        }

        elements.status.hidden = true;
        elements.status.textContent = "";
    }


    function showToast(message) {

        if (!elements.toast) {
            return;
        }

        const textNode =
            $("toastText");

        if (textNode) {
            textNode.textContent = message;
        }

        elements.toast.hidden = false;

        clearTimeout(
            showToast.timer
        );

        showToast.timer =
            setTimeout(() => {
                elements.toast.hidden = true;
            }, 3000);
    }


    function setButtonLoading(
        button,
        loading,
        loadingText,
        normalText
    ) {

        if (!button) {
            return;
        }

        if (loading) {

            button.disabled = true;

            button.dataset.normalText =
                normalText ||
                button.textContent;

            button.textContent =
                loadingText;

        } else {

            button.disabled = false;

            button.textContent =
                button.dataset.normalText ||
                normalText ||
                button.textContent;

            delete button.dataset.normalText;
        }
    }


    /* ========================================================
       FORM HELPERS
    ======================================================== */

    function readBirthForm(form) {

        if (!form) {
            return null;
        }

        const data =
            new FormData(form);

        return {

            name:
                String(data.get("name") || "").trim(),

            gender:
                String(data.get("gender") || "").trim(),

            birthDate:
                String(data.get("birthDate") || "").trim(),

            birthTime:
                String(data.get("birthTime") || "").trim(),

            birthPlace:
                String(data.get("birthPlace") || "").trim(),

            latitude:
                number(data.get("latitude")),

            longitude:
                number(data.get("longitude")),

            timezone:
                String(data.get("timezone") || "").trim(),

            ayanamsha:
                String(
                    data.get("ayanamsha") ||
                    "lahiri"
                ),

            birthTimeAccuracy:
                String(
                    data.get("birthTimeAccuracy") ||
                    "exact"
                ),

            lmtCorrection:
                String(
                    data.get("lmtCorrection") ||
                    ""
                )
        };
    }


    function validateBirthData(data) {

        if (!data) {
            return "Birth details उपलब्ध नहीं हैं।";
        }

        if (!data.name) {
            return "नाम भरना जरूरी है।";
        }

        if (!data.gender) {
            return "Gender select करें।";
        }

        if (!data.birthDate) {
            return "जन्म तारीख भरें।";
        }

        if (!data.birthTime) {
            return "जन्म समय भरें।";
        }

        if (!data.birthPlace) {
            return "जन्म स्थान भरें।";
        }

        /*
         * Exact astronomical calculation के लिए
         * latitude / longitude जरूरी हैं।
         */

        if (data.latitude === null) {
            return "Birth location की latitude उपलब्ध नहीं है।";
        }

        if (data.longitude === null) {
            return "Birth location की longitude उपलब्ध नहीं है।";
        }

        return null;
    }


    /* ========================================================
       ENGINE INPUT
    ======================================================== */

    function buildEngineInput(person) {

        /*
         * Existing engine के input contract को preserve
         * करने के लिए basic birth fields pass किए जाते हैं।
         *
         * अगर engine में additional accepted fields हैं,
         * उन्हें यहाँ आगे extend किया जा सकता है।
         */

        return {

            name:
                person.name,

            gender:
                person.gender,

            birthDate:
                person.birthDate,

            birthTime:
                person.birthTime,

            birthPlace:
                person.birthPlace,

            latitude:
                person.latitude,

            longitude:
                person.longitude,

            timezone:
                person.timezone,

            ayanamsha:
                person.ayanamsha,

            birthTimeAccuracy:
                person.birthTimeAccuracy,

            lmtCorrection:
                person.lmtCorrection
        };
    }


    /* ========================================================
       CALCULATION
    ======================================================== */

    function calculatePerson(person) {

        const input =
            buildEngineInput(person);

        const result =
            window.KundliEngine.calculate(
                input
            );

        if (!result) {

            throw new Error(
                "KundliEngine ने कोई result नहीं दिया।"
            );
        }

        return result;
    }


    /* ========================================================
       PERSON A
    ======================================================== */

    function generatePersonA() {

        const person =
            readBirthForm(
                elements.birthForm
            );

        const error =
            validateBirthData(person);

        if (error) {

            showStatus(
                error,
                "error"
            );

            return false;
        }

        hideStatus();

        setButtonLoading(
            elements.generateBtn,
            true,
            "कुंडली तैयार हो रही है...",
            "Save & Generate Kundli"
        );

        try {

            const result =
                calculatePerson(person);

            state.personA =
                person;

            state.kundliA =
                result;

            state.currentModule =
                "dashboard";

            saveState();

            renderApplication();

            navigateTo("dashboard");

            showToast(
                "Kundli successfully generated."
            );

            return true;

        } catch (error) {

            console.error(
                "Kundli calculation error:",
                error
            );

            state.lastError =
                error.message;

            showStatus(
                "कुंडली calculate नहीं हो सकी। Console में error देखें।",
                "error"
            );

            return false;

        } finally {

            setButtonLoading(
                elements.generateBtn,
                false,
                "कुंडली तैयार हो रही है...",
                "Save & Generate Kundli"
            );
        }
    }


    /* ========================================================
       PERSON B
    ======================================================== */

    function generatePersonB() {

        if (!state.kundliA) {

            showStatus(
                "पहले Person A की Kundli generate करें।",
                "error"
            );

            navigateTo("birth");

            return false;
        }

        const person =
            readBirthForm(
                elements.personBForm
            );

        const error =
            validateBirthData(person);

        if (error) {

            showStatus(
                `Person B: ${error}`,
                "error"
            );

            return false;
        }

        try {

            const result =
                calculatePerson(person);

            state.personB =
                person;

            state.kundliB =
                result;

            saveState();

            calculateMilan();

            renderApplication();

            navigateTo("milan");

            showToast(
                "Person B saved और Milan calculate हो गया।"
            );

            return true;

        } catch (error) {

            console.error(
                "Person B calculation error:",
                error
            );

            showStatus(
                "Person B की Kundli calculate नहीं हो सकी।",
                "error"
            );

            return false;
        }
    }


    /* ========================================================
       NAVIGATION
    ======================================================== */

    function navigateTo(module) {

        if (!MODULES.includes(module)) {
            return;
        }

        /*
         * Birth screen के अलावा बाकी modules के लिए
         * Person A जरूरी है।
         */

        if (
            module !== "birth" &&
            !state.kundliA
        ) {
            module = "birth";
        }

        state.currentModule =
            module;

        elements.screens.forEach(
            (screen) => {

                const active =
                    screen.dataset.screen === module;

                screen.hidden =
                    !active;

                screen.classList.toggle(
                    "active",
                    active
                );
            }
        );


        elements.tabs.forEach(
            (tab) => {

                tab.classList.toggle(
                    "active",
                    tab.dataset.module === module
                );
            }
        );


        updateNavigationButtons();

        renderModule(module);
    }


    function moduleIndex() {

        return MODULES.indexOf(
            state.currentModule
        );
    }


    function previousModule() {

        const index =
            moduleIndex();

        if (index <= 0) {
            return;
        }

        navigateTo(
            MODULES[index - 1]
        );
    }


    function nextModule() {

        const index =
            moduleIndex();

        if (
            index < 0 ||
            index >= MODULES.length - 1
        ) {
            return;
        }

        /*
         * Person B/Milan sections पर जाने के लिए
         * Person A calculation पर्याप्त है।
         */

        navigateTo(
            MODULES[index + 1]
        );
    }


    function updateNavigationButtons() {

        const index =
            moduleIndex();

        const atFirst =
            index <= 0;

        const atLast =
            index >= MODULES.length - 1;


        if (elements.previousBtn) {
            elements.previousBtn.disabled =
                atFirst;
        }

        if (elements.bottomPreviousBtn) {
            elements.bottomPreviousBtn.disabled =
                atFirst;
        }

        if (elements.nextBtn) {
            elements.nextBtn.disabled =
                atLast;
        }

        if (elements.bottomNextBtn) {
            elements.bottomNextBtn.disabled =
                atLast;
        }
    }


    /* ========================================================
       DASHBOARD
    ======================================================== */

    function renderDashboard() {

        const kundli =
            state.kundliA;

        if (!kundli) {
            return;
        }


        const person =
            state.personA;


        const name =
            $("dashboardPersonName");

        const meta =
            $("dashboardBirthMeta");

        const lagna =
            $("summaryLagna");

        const lagnaDeg =
            $("summaryLagnaDeg");

        const moon =
            $("summaryMoon");

        const moonDeg =
            $("summaryMoonDeg");

        const nakshatra =
            $("summaryNakshatra");

        const pada =
            $("summaryPada");

        const manglik =
            $("summaryManglik");

        const manglikText =
            $("summaryManglikText");


        if (name) {
            name.textContent =
                text(person?.name);
        }


        if (meta) {

            meta.textContent =
                [
                    formatDate(person?.birthDate),
                    person?.birthTime,
                    person?.birthPlace
                ]
                .filter(Boolean)
                .join(" • ");
        }


        if (lagna) {

            lagna.textContent =
                getRashiName(
                    kundli.lagna
                );
        }


        if (lagnaDeg) {

            lagnaDeg.textContent =
                getDegreeFromObject(
                    kundli.lagna
                );
        }


        const moonPlanet =
            getPlanet(
                kundli,
                "Moon"
            );


        if (moon) {

            moon.textContent =
                getPlanetSignName(
                    moonPlanet
                );
        }


        if (moonDeg) {

            moonDeg.textContent =
                getPlanetDegree(
                    moonPlanet
                );
        }


        const moonNakshatra =
            kundli.moonNakshatra;


        if (nakshatra) {

            nakshatra.textContent =
                text(
                    moonNakshatra?.hindi ||
                    moonNakshatra?.name
                );
        }


        if (pada) {

            pada.textContent =
                moonNakshatra?.pada
                    ? `Pada ${moonNakshatra.pada}`
                    : "—";
        }


        const manglikData =
            kundli.manglik;


        if (manglik) {

            manglik.textContent =
                getManglikStatus(
                    manglikData
                );
        }


        if (manglikText) {

            manglikText.textContent =
                getManglikExplanation(
                    manglikData
                );
        }


        renderDashboardModules();
    }


    function renderDashboardModules() {

        const container =
            $("dashboardModules");

        if (!container) {
            return;
        }


        const cards =
            MODULES
                .filter(
                    (module) =>
                        module !== "birth"
                )
                .map(
                    (module, index) => {

                        const info =
                            MODULE_INFO[module];

                        return `
                            <article
                                class="dashboard-module-card"
                                data-dashboard-module="${escapeHTML(module)}"
                            >

                                <span class="module-number">
                                    ${String(index + 2).padStart(2, "0")}
                                </span>

                                <h3>
                                    ${escapeHTML(info.title)}
                                </h3>

                                <p>
                                    ${escapeHTML(info.description)}
                                </p>

                            </article>
                        `;
                    }
                )
                .join("");


        container.innerHTML =
            cards;


        container
            .querySelectorAll(
                "[data-dashboard-module]"
            )
            .forEach((card) => {

                card.addEventListener(
                    "click",
                    () => {

                        navigateTo(
                            card.dataset.dashboardModule
                        );
                    }
                );
            });
    }


    /* ========================================================
       RASHI HELPERS
    ======================================================== */

    function getRashiName(value) {

        if (!value) {
            return "—";
        }

        if (typeof value === "object") {

            return (
                value.hindi ||
                value.name ||
                value.signHindi ||
                value.sign ||
                "—"
            );
        }

        if (
            window.KundliEngine?.RASHIS &&
            Number.isInteger(Number(value))
        ) {

            const rashi =
                window.KundliEngine.RASHIS[
                    Number(value)
                ];

            return (
                rashi?.hindi ||
                rashi?.name ||
                "—"
            );
        }

        return String(value);
    }


    function getDegreeFromObject(value) {

        if (!value) {
            return "—";
        }

        if (typeof value === "number") {
            return formatDegree(value);
        }

        return formatDegree(
            value.degree ??
            value.degrees ??
            value.longitude ??
            value.absoluteLongitude
        );
    }


    /* ========================================================
       PLANET HELPERS
    ======================================================== */

    function getPlanet(kundli, key) {

        if (!kundli) {
            return null;
        }


        const planets =
            kundli.planets ||
            kundli.planetPositions ||
            kundli.grahas ||
            {};


        return (
            planets[key] ||
            planets[key.toLowerCase()] ||
            planets[
                key.charAt(0).toUpperCase() +
                key.slice(1)
            ] ||
            null
        );
    }


    function getPlanetSignName(planet) {

        if (!planet) {
            return "—";
        }

        return getRashiName(
            planet.sign ??
            planet.rashi ??
            planet.signIndex
        );
    }


    function getPlanetDegree(planet) {

        if (!planet) {
            return "—";
        }

        return formatDegree(
            planet.degree ??
            planet.degrees ??
            planet.longitude
        );
    }


    /* ========================================================
       MANGLIK
    ======================================================== */

    function getManglikStatus(data) {

        if (!data) {
            return "Data unavailable";
        }

        if (
            data.isManglik === true ||
            data.manglik === true
        ) {
            return "Manglik";
        }

        if (
            data.isManglik === false ||
            data.manglik === false
        ) {
            return "Non-Manglik";
        }

        return text(
            data.status ||
            data.result,
            "Calculated"
        );
    }


    function getManglikExplanation(data) {

        if (!data) {
            return "—";
        }

        return text(
            data.explanation ||
            data.reason ||
            data.message,
            "Calculated from chart."
        );
    }


    /* ========================================================
       D1 RASHI
    ======================================================== */

    function renderD1() {

        const container =
            $("northChart");

        if (!container) {
            return;
        }

        const kundli =
            state.kundliA;

        if (!kundli) {
            return;
        }


        /*
         * Existing project में D1 renderer पहले से था।
         * यहां chart geometry को अलग renderer में रखा गया है
         * ताकि controller calculation में interfere न करे।
         */

        renderNorthIndianChart(
            container,
            kundli,
            "d1"
        );


        const info =
            $("d1ChartInfo");

        if (info) {

            info.innerHTML =
                buildChartInfo(
                    kundli,
                    "D1 Rashi Chart"
                );
        }
    }


    /* ========================================================
       GENERIC NORTH INDIAN CHART
    ======================================================== */

    function renderNorthIndianChart(
        container,
        kundli,
        chartType
    ) {

        if (!container) {
            return;
        }


        const chartData =
            getChartData(
                kundli,
                chartType
            );


        /*
         * Chart rendering data-driven है।
         * कोई ग्रह manually नहीं डाला जाता।
         */

        const houses =
            Array.from(
                { length: 12 },
                (_, index) =>
                    getHousePlanets(
                        chartData,
                        index + 1
                    )
            );


        const size = 600;

        const svgNS =
            "http://www.w3.org/2000/svg";


        const svg =
            document.createElementNS(
                svgNS,
                "svg"
            );


        svg.setAttribute(
            "viewBox",
            `0 0 ${size} ${size}`
        );

        svg.setAttribute(
            "role",
            "img"
        );

        svg.setAttribute(
            "aria-label",
            chartType === "d9"
                ? "Navamsa chart"
                : "D1 Rashi chart"
        );


        /*
         * Outer square
         */

        svg.appendChild(
            svgPolygon(
                svgNS,
                [
                    [50, 50],
                    [550, 50],
                    [550, 550],
                    [50, 550]
                ]
            )
        );


        /*
         * Main diagonals
         */

        svg.appendChild(
            svgLine(
                svgNS,
                50,
                50,
                550,
                550
            )
        );

        svg.appendChild(
            svgLine(
                svgNS,
                550,
                50,
                50,
                550
            )
        );


        /*
         * Inner diamond
         */

        svg.appendChild(
            svgPolygon(
                svgNS,
                [
                    [300, 50],
                    [550, 300],
                    [300, 550],
                    [50, 300]
                ]
            )
        );


        /*
         * House centers
         */

        const centers = [

            [300, 160],
            [160, 110],
            [110, 160],
            [160, 300],

            [110, 440],
            [160, 490],
            [300, 440],
            [440, 490],

            [490, 440],
            [440, 300],
            [490, 160],
            [440, 110]
        ];


        centers.forEach(
            (point, index) => {

                const group =
                    document.createElementNS(
                        svgNS,
                        "g"
                    );


                const houseNumber =
                    document.createElementNS(
                        svgNS,
                        "text"
                    );

                houseNumber.setAttribute(
                    "x",
                    point[0]
                );

                houseNumber.setAttribute(
                    "y",
                    point[1] - 24
                );

                houseNumber.setAttribute(
                    "text-anchor",
                    "middle"
                );

                houseNumber.setAttribute(
                    "font-size",
                    "12"
                );

                houseNumber.setAttribute(
                    "font-weight",
                    "700"
                );

                houseNumber.textContent =
                    String(index + 1);


                group.appendChild(
                    houseNumber
                );


                const content =
                    document.createElementNS(
                        svgNS,
                        "text"
                    );

                content.setAttribute(
                    "x",
                    point[0]
                );

                content.setAttribute(
                    "y",
                    point[1]
                );

                content.setAttribute(
                    "text-anchor",
                    "middle"
                );

                content.setAttribute(
                    "font-size",
                    "13"
                );


                content.textContent =
                    houses[index].join(" ");


                group.appendChild(
                    content
                );

                svg.appendChild(
                    group
                );
            }
        );


        container.replaceChildren(
            svg
        );
    }


    function svgLine(
        svgNS,
        x1,
        y1,
        x2,
        y2
    ) {

        const line =
            document.createElementNS(
                svgNS,
                "line"
            );

        line.setAttribute("x1", x1);
        line.setAttribute("y1", y1);
        line.setAttribute("x2", x2);
        line.setAttribute("y2", y2);

        line.setAttribute(
            "stroke",
            "currentColor"
        );

        line.setAttribute(
            "stroke-width",
            "1.2"
        );

        return line;
    }


    function svgPolygon(
        svgNS,
        points
    ) {

        const polygon =
            document.createElementNS(
                svgNS,
                "polygon"
            );

        polygon.setAttribute(
            "points",
            points
                .map(
                    ([x, y]) =>
                        `${x},${y}`
                )
                .join(" ")
        );

        polygon.setAttribute(
            "fill",
            "none"
        );

        polygon.setAttribute(
            "stroke",
            "currentColor"
        );

        polygon.setAttribute(
            "stroke-width",
            "1.2"
        );

        return polygon;
    }


    /* ========================================================
       CHART DATA
    ======================================================== */

    function getChartData(
        kundli,
        chartType
    ) {

        if (
            chartType === "d9"
        ) {

            return (
                kundli.navamsa ||
                kundli.d9 ||
                kundli.navamsaChart ||
                null
            );
        }


        return (
            kundli.rashiChart ||
            kundli.d1 ||
            kundli.chart ||
            kundli
        );
    }


    function getHousePlanets(
        chartData,
        houseNumber
    ) {

        if (!chartData) {
            return [];
        }


        const houses =
            chartData.houses ||
            chartData.housePositions ||
            [];


        const house =
            houses[houseNumber - 1];


        if (!house) {
            return [];
        }


        const planets =
            house.planets ||
            house.occupants ||
            [];


        if (!Array.isArray(planets)) {
            return [];
        }


        return planets.map(
            (planet) => {

                if (
                    typeof planet === "string"
                ) {
                    return planet;
                }

                return (
                    planet.symbol ||
                    planet.short ||
                    planet.name ||
                    planet.key ||
                    "?"
                );
            }
        );
    }


    function buildChartInfo(
        kundli,
        title
    ) {

        const lagna =
            getRashiName(
                kundli.lagna
            );

        return `

            <div class="analysis-card">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <p>
                    Lagna:
                    <strong>
                        ${escapeHTML(lagna)}
                    </strong>
                </p>

                <p>
                    Chart data calculation engine से
                    प्राप्त किया गया है।
                </p>

            </div>
        `;
    }


    /* ========================================================
       BHAVA
    ======================================================== */

    function renderBhava() {

        const container =
            $("bhavaContent");

        if (!container) {
            return;
        }


        const kundli =
            state.kundliA;

        if (!kundli) {
            return;
        }


        const houses =
            kundli.houses ||
            kundli.bhavas ||
            [];


        if (!Array.isArray(houses)) {

            container.innerHTML =
                emptyState(
                    "Bhava data उपलब्ध नहीं है।"
                );

            return;
        }


        container.innerHTML = `

            <div class="kundli-data-card">

                <div class="kundli-data-card-header">

                    <h3>
                        12 Bhava
                    </h3>

                    <p>
                        Actual calculated house data
                    </p>

                </div>

                <div class="kundli-table-wrap">

                    <table class="kundli-table">

                        <thead>

                            <tr>
                                <th>House</th>
                                <th>Rashi</th>
                                <th>Lord</th>
                                <th>Planets</th>
                                <th>Degree</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${houses.map(
                                (house, index) =>
                                    renderHouseRow(
                                        house,
                                        index
                                    )
                            ).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;
    }


    function renderHouseRow(
        house,
        index
    ) {

        const planets =
            house?.planets ||
            house?.occupants ||
            [];


        const planetText =
            Array.isArray(planets)
                ? planets.map(
                    (p) =>
                        typeof p === "string"
                            ? p
                            : (
                                p.name ||
                                p.key ||
                                p.symbol ||
                                "?"
                            )
                ).join(", ")
                : "—";


        return `

            <tr>

                <td>
                    ${index + 1}
                </td>

                <td>
                    ${escapeHTML(
                        getRashiName(
                            house?.sign ??
                            house?.rashi ??
                            house?.signIndex
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        text(
                            house?.lordHindi ||
                            house?.lord
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        planetText
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        getDegreeFromObject(
                            house
                        )
                    )}
                </td>

            </tr>
        `;
    }


    /* ========================================================
       PLANETS
    ======================================================== */

    function renderPlanets() {

        const container =
            $("planetTable");

        if (!container) {
            return;
        }


        const kundli =
            state.kundliA;


        const planets =
            kundli?.planets ||
            kundli?.planetPositions ||
            kundli?.grahas;


        if (!planets) {

            container.innerHTML =
                emptyState(
                    "Planet data उपलब्ध नहीं है।"
                );

            return;
        }


        const entries =
            Array.isArray(planets)
                ? planets.map(
                    (planet, index) =>
                        [
                            planet?.name ||
                            planet?.key ||
                            String(index + 1),
                            planet
                        ]
                )
                : Object.entries(planets);


        container.innerHTML = `

            <div class="kundli-data-card">

                <div class="kundli-data-card-header">

                    <h3>
                        ग्रह स्थिति
                    </h3>

                    <p>
                        Sign • Degree • House • Nakshatra • Motion
                    </p>

                </div>

                <div class="kundli-table-wrap">

                    <table class="kundli-table">

                        <thead>

                            <tr>
                                <th>Planet</th>
                                <th>Rashi</th>
                                <th>Degree</th>
                                <th>House</th>
                                <th>Nakshatra</th>
                                <th>Pada</th>
                                <th>Motion</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${entries.map(
                                ([key, planet]) =>
                                    renderPlanetRow(
                                        key,
                                        planet
                                    )
                            ).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;
    }


    function renderPlanetRow(
        key,
        planet
    ) {

        return `

            <tr>

                <td>
                    <strong>
                        ${escapeHTML(
                            planet?.nameHindi ||
                            planet?.hindi ||
                            key
                        )}
                    </strong>
                </td>

                <td>
                    ${escapeHTML(
                        getPlanetSignName(
                            planet
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        getPlanetDegree(
                            planet
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        text(
                            planet?.house
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        text(
                            planet?.nakshatra?.hindi ||
                            planet?.nakshatra?.name ||
                            planet?.nakshatra
                        )
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        text(
                            planet?.pada
                        )
                    )}
                </td>

                <td>
                    ${planet?.retrograde === true
                        ? "Retrograde"
                        : "Direct"}
                </td>

            </tr>
        `;
    }


    /* ========================================================
       NAKSHATRA
    ======================================================== */

    function renderNakshatra() {

        const container =
            $("nakshatraBox");

        if (!container) {
            return;
        }


        const kundli =
            state.kundliA;

        const nakshatra =
            kundli?.moonNakshatra;


        if (!nakshatra) {

            container.innerHTML =
                emptyState(
                    "Nakshatra data उपलब्ध नहीं है।"
                );

            return;
        }


        const moon =
            getPlanet(
                kundli,
                "Moon"
            );


        container.innerHTML = `

            <div class="analysis-grid">

                <article class="analysis-card">

                    <h3>
                        जन्म नक्षत्र
                    </h3>

                    <div class="analysis-value">
                        ${escapeHTML(
                            text(
                                nakshatra.hindi ||
                                nakshatra.name
                            )
                        )}
                    </div>

                    <span class="analysis-label">
                        Janma Nakshatra
                    </span>

                </article>


                <article class="analysis-card">

                    <h3>
                        Pada
                    </h3>

                    <div class="analysis-value">
                        ${escapeHTML(
                            text(nakshatra.pada)
                        )}
                    </div>

                </article>


                <article class="analysis-card">

                    <h3>
                        Nakshatra Lord
                    </h3>

                    <div class="analysis-value">
                        ${escapeHTML(
                            text(
                                nakshatra.lordHindi ||
                                nakshatra.lord
                            )
                        )}
                    </div>

                </article>


                <article class="analysis-card">

                    <h3>
                        Moon Sign
                    </h3>

                    <div class="analysis-value">
                        ${escapeHTML(
                            getPlanetSignName(
                                moon
                            )
                        )}
                    </div>

                </article>

            </div>
        `;
    }


    /* ========================================================
       D9
    ======================================================== */

    function renderD9() {

        const chart =
            $("navamsaChart");

        if (chart) {

            renderNorthIndianChart(
                chart,
                state.kundliA,
                "d9"
            );
        }


        const table =
            $("navamsaTable");

        if (!table) {
            return;
        }


        const d9 =
            state.kundliA?.navamsa ||
            state.kundliA?.d9;


        if (!d9) {

            table.innerHTML =
                emptyState(
                    "Navamsa data उपलब्ध नहीं है।"
                );

            return;
        }


        table.innerHTML =
            renderD9Table(d9);
    }


    function renderD9Table(d9) {

        const planets =
            d9.planets ||
            d9.planetPositions ||
            [];


        const entries =
            Array.isArray(planets)
                ? planets.map(
                    (planet, index) =>
                        [
                            planet?.name ||
                            planet?.key ||
                            String(index + 1),
                            planet
                        ]
                )
                : Object.entries(planets);


        return `

            <div class="kundli-data-card">

                <div class="kundli-data-card-header">

                    <h3>
                        Navamsa Positions
                    </h3>

                </div>

                <div class="kundli-table-wrap">

                    <table class="kundli-table">

                        <thead>

                            <tr>
                                <th>Planet</th>
                                <th>D9 Sign</th>
                                <th>House</th>
                                <th>Degree</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${entries.map(
                                ([key, planet]) =>
                                    `
                                    <tr>

                                        <td>
                                            ${escapeHTML(
                                                planet?.nameHindi ||
                                                planet?.hindi ||
                                                key
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                getPlanetSignName(
                                                    planet
                                                )
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                text(
                                                    planet?.house
                                                )
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                getPlanetDegree(
                                                    planet
                                                )
                                            )}
                                        </td>

                                    </tr>
                                    `
                            ).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;
    }


    /* ========================================================
       DASHA
    ======================================================== */

    function renderDasha() {

        const container =
            $("dashaTable");

        if (!container) {
            return;
        }


        const dasha =
            state.kundliA?.dasha ||
            state.kundliA?.vimshottariDasha;


        if (!dasha) {

            container.innerHTML =
                emptyState(
                    "Dasha data उपलब्ध नहीं है।"
                );

            return;
        }


        const periods =
            Array.isArray(dasha)
                ? dasha
                : (
                    dasha.periods ||
                    dasha.mahadasha ||
                    []
                );


        if (!Array.isArray(periods)) {

            container.innerHTML =
                emptyState(
                    "Dasha periods उपलब्ध नहीं हैं।"
                );

            return;
        }


        container.innerHTML = `

            <div class="kundli-data-card">

                <div class="kundli-data-card-header">

                    <h3>
                        Vimshottari Dasha
                    </h3>

                </div>

                <div class="kundli-table-wrap">

                    <table class="kundli-table">

                        <thead>

                            <tr>
                                <th>Period</th>
                                <th>Start</th>
                                <th>End</th>
                            </tr>

                        </thead>

                        <tbody>

                            ${periods.map(
                                (period) =>
                                    `
                                    <tr>

                                        <td>
                                            ${escapeHTML(
                                                text(
                                                    period?.planet ||
                                                    period?.name ||
                                                    period?.lord
                                                )
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                text(
                                                    period?.start
                                                )
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                text(
                                                    period?.end
                                                )
                                            )}
                                        </td>

                                    </tr>
                                    `
                            ).join("")}

                        </tbody>

                    </table>

                </div>

            </div>
        `;
    }


    /* ========================================================
       YOGA
    ======================================================== */

    function renderYoga() {

        const container =
            $("yogaContent");

        if (!container) {
            return;
        }


        const yoga =
            state.kundliA?.yoga ||
            state.kundliA?.yogas;


        if (!yoga) {

            container.innerHTML =
                emptyState(
                    "इस chart में कोई calculated yoga dataset उपलब्ध नहीं है।"
                );

            return;
        }


        const list =
            Array.isArray(yoga)
                ? yoga
                : Object.values(yoga);


        container.innerHTML =
            list.map(
                (item) => `

                    <article class="analysis-card">

                        <h3>
                            ${escapeHTML(
                                text(
                                    item?.nameHindi ||
                                    item?.hindi ||
                                    item?.name
                                )
                            )}
                        </h3>

                        <p>
                            ${escapeHTML(
                                text(
                                    item?.description ||
                                    item?.reason ||
                                    item?.explanation,
                                    "Yoga details available."
                                )
                            )}
                        </p>

                    </article>
                `
            ).join("");
    }


    /* ========================================================
       DOSHA
    ======================================================== */

    function renderDosha() {

        const container =
            $("doshaContent");

        if (!container) {
            return;
        }


        const kundli =
            state.kundliA;


        const doshas = [];


        if (kundli?.manglik) {

            doshas.push({

                title:
                    "Manglik",

                data:
                    kundli.manglik
            });
        }


        /*
         * Existing engine में actual dosha properties उपलब्ध हों
         * तो वही यहां read होंगे।
         *
         * Undefined dosha को fake result के रूप में नहीं दिखाया जाएगा।
         */

        const possible =
            [
                ["Nadi", kundli?.nadiDosha],
                ["Bhakoot", kundli?.bhakootDosha],
                ["Grahan", kundli?.grahanDosha],
                [
                    "7th House Affliction",
                    kundli?.seventhHouseAffliction
                ],
                [
                    "7th Lord Affliction",
                    kundli?.seventhLordAffliction
                ]
            ];


        possible.forEach(
            ([title, data]) => {

                if (data !== undefined) {

                    doshas.push({
                        title,
                        data
                    });
                }
            }
        );


        if (!doshas.length) {

            container.innerHTML =
                emptyState(
                    "इस chart के लिए available dosha calculations नहीं मिलीं।"
                );

            return;
        }


        container.innerHTML =
            doshas.map(
                ({ title, data }) => {

                    const status =
                        getAnalysisStatus(
                            data
                        );

                    return `

                        <article class="analysis-card">

                            <h3>
                                ${escapeHTML(title)}
                            </h3>

                            <div class="analysis-value">
                                ${escapeHTML(status.label)}
                            </div>

                            <p>
                                ${escapeHTML(
                                    status.reason
                                )}
                            </p>

                        </article>
                    `;
                }
            ).join("");
    }


    function getAnalysisStatus(data) {

        if (!data) {

            return {
                label: "Unavailable",
                reason: "Calculation data उपलब्ध नहीं है।"
            };
        }


        if (
            data.present === true ||
            data.detected === true ||
            data.isPresent === true
        ) {

            return {
                label: "Present",
                reason:
                    text(
                        data.reason ||
                        data.explanation ||
                        data.message,
                        "Detected from calculated chart factors."
                    )
            };
        }


        if (
            data.present === false ||
            data.detected === false ||
            data.isPresent === false
        ) {

            return {
                label: "Not detected",
                reason:
                    text(
                        data.reason ||
                        data.explanation ||
                        data.message,
                        "Required condition was not detected."
                    )
            };
        }


        return {

            label:
                text(
                    data.status ||
                    data.result,
                    "Calculated"
                ),

            reason:
                text(
                    data.reason ||
                    data.explanation ||
                    data.message,
                    "Based on available calculated factors."
                )
        };
    }


    /* ========================================================
       MANGLIK SCREEN
    ======================================================== */

    function renderManglik() {

        const container =
            $("manglikContent");

        if (!container) {
            return;
        }


        const data =
            state.kundliA?.manglik;


        if (!data) {

            container.innerHTML =
                emptyState(
                    "Manglik calculation data उपलब्ध नहीं है।"
                );

            return;
        }


        container.innerHTML = `

            <article class="analysis-card">

                <h3>
                    Manglik Status
                </h3>

                <div class="analysis-value">
                    ${escapeHTML(
                        getManglikStatus(data)
                    )}
                </div>

                <p>
                    ${escapeHTML(
                        getManglikExplanation(data)
                    )}
                </p>

            </article>


            <article class="analysis-card">

                <h3>
                    Calculation Evidence
                </h3>

                <p>
                    ${escapeHTML(
                        text(
                            data.evidence ||
                            data.details ||
                            data.reason,
                            "Detailed evidence is not exposed by the calculation engine."
                        )
                    )}
                </p>

            </article>
        `;
    }


    /* ========================================================
       MARRIAGE
    ======================================================== */

    function renderMarriage() {

        const container =
            $("marriageAnalysis");

        if (!container) {
            return;
        }


        const marriage =
            state.kundliA?.marriage;


        if (!marriage) {

            container.innerHTML =
                emptyState(
                    "Marriage analysis data उपलब्ध नहीं है।"
                );

            return;
        }


        const cards = [];


        if (marriage.seventhHouse) {

            cards.push(
                buildAnalysisCard(
                    "7th House",
                    marriage.seventhHouse
                )
            );
        }


        if (marriage.seventhLordPosition) {

            cards.push(
                buildAnalysisCard(
                    "7th Lord",
                    marriage.seventhLordPosition
                )
            );
        }


        if (marriage.venus) {

            cards.push(
                buildAnalysisCard(
                    "Venus",
                    marriage.venus
                )
            );
        }


        if (marriage.jupiter) {

            cards.push(
                buildAnalysisCard(
                    "Jupiter",
                    marriage.jupiter
                )
            );
        }


        if (marriage.mars) {

            cards.push(
                buildAnalysisCard(
                    "Mars",
                    marriage.mars
                )
            );
        }


        if (marriage.manglik) {

            cards.push(
                buildAnalysisCard(
                    "Manglik",
                    marriage.manglik
                )
            );
        }


        container.innerHTML =
            cards.length
                ? cards.join("")
                : emptyState(
                    "Marriage indicators उपलब्ध नहीं हैं।"
                );
    }


    function buildAnalysisCard(
        title,
        data
    ) {

        if (
            data === null ||
            data === undefined
        ) {
            return "";
        }


        if (
            typeof data === "string" ||
            typeof data === "number"
        ) {

            return `

                <article class="analysis-card">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>

                    <div class="analysis-value">
                        ${escapeHTML(
                            String(data)
                        )}
                    </div>

                </article>
            `;
        }


        const value =
            data.status ||
            data.result ||
            data.name ||
            data.value ||
            "Calculated";


        const reason =
            data.reason ||
            data.explanation ||
            data.description ||
            "";


        return `

            <article class="analysis-card">

                <h3>
                    ${escapeHTML(title)}
                </h3>

                <div class="analysis-value">
                    ${escapeHTML(
                        String(value)
                    )}
                </div>

                ${
                    reason
                        ? `
                            <p>
                                ${escapeHTML(
                                    String(reason)
                                )}
                            </p>
                        `
                        : ""
                }

            </article>
        `;
    }


    /* ========================================================
       MARRIAGE TIMING
    ======================================================== */

    function renderTiming() {

        const container =
            $("marriageTimingContent");

        if (!container) {
            return;
        }


        const kundli =
            state.kundliA;


        const dasha =
            kundli?.dasha ||
            kundli?.vimshottariDasha;


        if (!dasha) {

            container.innerHTML =
                emptyState(
                    "Marriage timing के लिए Dasha data उपलब्ध नहीं है।"
                );

            return;
        }


        container.innerHTML = `

            <div class="analysis-card">

                <h3>
                    Timing Analysis
                </h3>

                <p>
                    Available Vimshottari Dasha data को
                    marriage indicators के साथ interpret किया जाएगा।
                    Fixed marriage date बिना sufficient calculated
                    evidence के नहीं दिखाई जाएगी।
                </p>

            </div>
        `;
    }


    /* ========================================================
       PERSON B SUMMARY
    ======================================================== */

    function renderMilan() {

        const container =
            $("milanContent");

        if (!container) {
            return;
        }


        if (!state.personB) {

            container.innerHTML =
                emptyState(
                    "Person B की details भरकर Milan calculate करें।"
                );

            return;
        }


        container.innerHTML = `

            <div class="milan-person-grid">

                <article class="milan-person-card">

                    <h3>
                        Person A
                    </h3>

                    <p>
                        ${escapeHTML(
                            text(
                                state.personA?.name
                            )
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            formatDate(
                                state.personA?.birthDate
                            )
                        )}
                        •
                        ${escapeHTML(
                            text(
                                state.personA?.birthTime
                            )
                        )}
                    </p>

                </article>


                <article class="milan-person-card">

                    <h3>
                        Person B
                    </h3>

                    <p>
                        ${escapeHTML(
                            text(
                                state.personB?.name
                            )
                        )}
                    </p>

                    <p>
                        ${escapeHTML(
                            formatDate(
                                state.personB?.birthDate
                            )
                        )}
                        •
                        ${escapeHTML(
                            text(
                                state.personB?.birthTime
                            )
                        )}
                    </p>

                </article>

            </div>
        `;
    }


    /* ========================================================
       GUN MILAN
    ======================================================== */

    function renderGunMilan() {

        const container =
            $("gunMilanContent");

        if (!container) {
            return;
        }


        if (
            !state.personB ||
            !state.kundliB
        ) {

            container.innerHTML =
                emptyState(
                    "पहले Person B की Kundli calculate करें।"
                );

            return;
        }


        const milan =
            state.milan;


        if (!milan) {

            container.innerHTML =
                emptyState(
                    "Gun Milan calculation उपलब्ध नहीं है।"
                );

            return;
        }


        const total =
            number(
                milan.total ??
                milan.score
            );


        container.innerHTML = `

            <div class="analysis-grid">

                <div class="guna-total">

                    <strong>
                        ${
                            total === null
                                ? "—"
                                : total
                        }
                    </strong>

                    <span>
                        out of 36 Guna
                    </span>

                </div>


                ${
                    renderKootaRows(
                        milan
                    )
                }

            </div>
        `;
    }


    function renderKootaRows(milan) {

        const kootas =
            milan.kootas ||
            milan.ashtakoota ||
            [];


        if (!Array.isArray(kootas)) {

            return `
                <article class="analysis-card">

                    <h3>
                        Ashtakoota
                    </h3>

                    <p>
                        Detailed koota data available नहीं है।
                    </p>

                </article>
            `;
        }


        return kootas.map(
            (koota) => `

                <article class="analysis-card">

                    <h3>
                        ${escapeHTML(
                            text(
                                koota?.name ||
                                koota?.title
                            )
                        )}
                    </h3>

                    <div class="analysis-value">

                        ${escapeHTML(
                            text(
                                koota?.score,
                                "—"
                            )
                        )}

                    </div>

                    <p>
                        ${escapeHTML(
                            text(
                                koota?.reason ||
                                koota?.explanation,
                                ""
                            )
                        )}
                    </p>

                </article>
            `
        ).join("");
    }


    /* ========================================================
       MILAN CALCULATION
    ======================================================== */

    function calculateMilan() {

        if (
            !state.kundliA ||
            !state.kundliB
        ) {
            return null;
        }


        /*
         * IMPORTANT:
         * Existing engine में dedicated Milan API available
         * हो तो वही use होगा।
         *
         * Engine API absent होने पर fake score नहीं बनाया जाएगा।
         */

        const engine =
            window.KundliEngine;


        if (
            typeof engine.calculateMilan ===
            "function"
        ) {

            state.milan =
                engine.calculateMilan(
                    state.kundliA,
                    state.kundliB
                );

            return state.milan;
        }


        if (
            typeof engine.match ===
            "function"
        ) {

            state.milan =
                engine.match(
                    state.kundliA,
                    state.kundliB
                );

            return state.milan;
        }


        state.milan = null;

        return null;
    }


    /* ========================================================
       COMPATIBILITY
    ======================================================== */

    function renderCompatibility() {

        const container =
            $("compatibilityContent");

        if (!container) {
            return;
        }


        if (!state.milan) {

            container.innerHTML =
                emptyState(
                    "Compatibility calculation के लिए Person B और supported Milan data जरूरी है।"
                );

            return;
        }


        const compatibility =
            state.milan.compatibility;


        if (!compatibility) {

            container.innerHTML =
                emptyState(
                    "Detailed compatibility score engine से उपलब्ध नहीं है।"
                );

            return;
        }


        const dimensions =
            compatibility.dimensions ||
            compatibility.categories ||
            [];


        container.innerHTML = `

            <div class="analysis-grid">

                ${
                    Array.isArray(dimensions)
                        ? dimensions.map(
                            (item) => `

                                <article
                                    class="analysis-card"
                                >

                                    <h3>
                                        ${escapeHTML(
                                            text(
                                                item?.name ||
                                                item?.title
                                            )
                                        )}
                                    </h3>

                                    <div
                                        class="analysis-value"
                                    >
                                        ${escapeHTML(
                                            text(
                                                item?.score,
                                                "—"
                                            )
                                        )}
                                    </div>

                                    <p>
                                        ${escapeHTML(
                                            text(
                                                item?.reason ||
                                                item?.explanation,
                                                ""
                                            )
                                        )}
                                    </p>

                                </article>
                            `
                        ).join("")
                        : emptyState(
                            "Compatibility dimensions उपलब्ध नहीं हैं।"
                        )
                }

            </div>
        `;
    }


    /* ========================================================
       REPORT
    ======================================================== */

    function renderReport() {

        const container =
            $("detailedReportContent");

        if (!container) {
            return;
        }


        const kundli =
            state.kundliA;


        if (!kundli) {

            container.innerHTML =
                emptyState(
                    "पहले Kundli generate करें।"
                );

            return;
        }


        const person =
            state.personA;


        container.innerHTML = `

            <section class="report-section">

                <h3>
                    Birth Summary
                </h3>

                <p>
                    <strong>
                        ${escapeHTML(
                            text(person?.name)
                        )}
                    </strong>
                </p>

                <p>
                    DOB:
                    ${escapeHTML(
                        formatDate(
                            person?.birthDate
                        )
                    )}
                    <br>

                    Time:
                    ${escapeHTML(
                        text(
                            person?.birthTime
                        )
                    )}
                    <br>

                    Place:
                    ${escapeHTML(
                        text(
                            person?.birthPlace
                        )
                    )}
                </p>

            </section>


            <section class="report-section">

                <h3>
                    Lagna & Moon
                </h3>

                <p>
                    Lagna:
                    ${escapeHTML(
                        getRashiName(
                            kundli.lagna
                        )
                    )}
                </p>

                <p>
                    Moon:
                    ${escapeHTML(
                        getPlanetSignName(
                            getPlanet(
                                kundli,
                                "Moon"
                            )
                        )
                    )}
                </p>

            </section>


            <section class="report-section">

                <h3>
                    Nakshatra
                </h3>

                <p>
                    ${escapeHTML(
                        text(
                            kundli.moonNakshatra?.hindi ||
                            kundli.moonNakshatra?.name
                        )
                    )}
                </p>

            </section>


            <section class="report-section">

                <h3>
                    Marriage Indicators
                </h3>

                <p>
                    ${escapeHTML(
                        text(
                            kundli.marriage
                                ? "Marriage indicator data calculated."
                                : "Marriage indicator data unavailable."
                        )
                    )}
                </p>

            </section>


            <section class="report-section">

                <h3>
                    Manglik
                </h3>

                <p>
                    ${escapeHTML(
                        getManglikStatus(
                            kundli.manglik
                        )
                    )}
                </p>

                <p>
                    ${escapeHTML(
                        getManglikExplanation(
                            kundli.manglik
                        )
                    )}
                </p>

            </section>


            <section class="report-section">

                <h3>
                    Interpretation Notice
                </h3>

                <p>
                    यह report calculated chart factors पर आधारित
                    traditional Jyotish interpretation के लिए है।
                    इसे निश्चित भविष्यवाणी के रूप में नहीं लेना चाहिए।
                </p>

            </section>
        `;
    }


    /* ========================================================
       EMPTY STATE
    ======================================================== */

    function emptyState(message) {

        return `

            <div class="kundli-empty">

                <strong>
                    Data unavailable
                </strong>

                <p>
                    ${escapeHTML(message)}
                </p>

            </div>
        `;
    }


    /* ========================================================
       MODULE RENDER DISPATCHER
    ======================================================== */

    function renderModule(module) {

        switch (module) {

            case "birth":
                renderBirthState();
                break;

            case "dashboard":
                renderDashboard();
                break;

            case "d1":
                renderD1();
                break;

            case "bhava":
                renderBhava();
                break;

            case "planets":
                renderPlanets();
                break;

            case "nakshatra":
                renderNakshatra();
                break;

            case "d9":
                renderD9();
                break;

            case "dasha":
                renderDasha();
                break;

            case "yoga":
                renderYoga();
                break;

            case "dosha":
                renderDosha();
                break;

            case "manglik":
                renderManglik();
                break;

            case "marriage":
                renderMarriage();
                break;

            case "timing":
                renderTiming();
                break;

            case "milan":
                renderMilan();
                break;

            case "gun-milan":
                renderGunMilan();
                break;

            case "compatibility":
                renderCompatibility();
                break;

            case "report":
                renderReport();
                break;

            default:
                break;
        }
    }


    /* ========================================================
       BIRTH SCREEN STATE
    ======================================================== */

    function renderBirthState() {

        if (!state.personA) {
            return;
        }


        const profile =
            $("savedProfileCard");

        const name =
            $("savedProfileName");

        const meta =
            $("savedProfileMeta");


        if (profile) {
            profile.hidden = false;
        }


        if (name) {
            name.textContent =
                state.personA.name;
        }


        if (meta) {

            meta.textContent =
                [
                    formatDate(
                        state.personA.birthDate
                    ),

                    state.personA.birthTime,

                    state.personA.birthPlace
                ]
                .filter(Boolean)
                .join(" • ");
        }
    }


    /* ========================================================
       COMPLETE APPLICATION RENDER
    ======================================================== */

    function renderApplication() {

        renderBirthState();

        renderDashboard();

        renderMilan();
    }


    /* ========================================================
       STORAGE
    ======================================================== */

    function saveState() {

        try {

            const data = {

                personA:
                    state.personA,

                personB:
                    state.personB,

                kundliA:
                    state.kundliA,

                kundliB:
                    state.kundliB,

                milan:
                    state.milan,

                currentModule:
                    state.currentModule
            };


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

        } catch (error) {

            console.warn(
                "Kundli state save failed:",
                error
            );
        }
    }


    function loadState() {

        try {

            const raw =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!raw) {
                return;
            }


            const data =
                JSON.parse(raw);


            if (!data) {
                return;
            }


            state.personA =
                data.personA || null;

            state.personB =
                data.personB || null;

            state.kundliA =
                data.kundliA || null;

            state.kundliB =
                data.kundliB || null;

            state.milan =
                data.milan || null;

            state.currentModule =
                MODULES.includes(
                    data.currentModule
                )
                    ? data.currentModule
                    : (
                        state.kundliA
                            ? "dashboard"
                            : "birth"
                    );


            restoreForms();

        } catch (error) {

            console.warn(
                "Kundli state load failed:",
                error
            );
        }
    }


    /* ========================================================
       FORM RESTORE
    ======================================================== */

    function restoreForms() {

        restorePersonForm(
            elements.birthForm,
            state.personA
        );


        restorePersonForm(
            elements.personBForm,
            state.personB
        );
    }


    function restorePersonForm(
        form,
        person
    ) {

        if (
            !form ||
            !person
        ) {
            return;
        }


        const fields =
            [
                "name",
                "gender",
                "birthDate",
                "birthTime",
                "birthPlace",
                "latitude",
                "longitude",
                "timezone",
                "ayanamsha",
                "birthTimeAccuracy",
                "lmtCorrection"
            ];


        fields.forEach(
            (field) => {

                const input =
                    form.elements[field];

                if (!input) {
                    return;
                }

                if (
                    person[field] !==
                    undefined &&
                    person[field] !== null
                ) {

                    input.value =
                        person[field];
                }
            }
        );
    }


    /* ========================================================
       EVENT LISTENERS
    ======================================================== */

    elements.birthForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            generatePersonA();
        }
    );


    elements.personBForm?.addEventListener(
        "submit",
        (event) => {

            event.preventDefault();

            generatePersonB();
        }
    );


    elements.tabs.forEach(
        (tab) => {

            tab.addEventListener(
                "click",
                () => {

                    navigateTo(
                        tab.dataset.module
                    );
                }
            );
        }
    );


    elements.previousBtn?.addEventListener(
        "click",
        previousModule
    );


    elements.bottomPreviousBtn?.addEventListener(
        "click",
        previousModule
    );


    elements.nextBtn?.addEventListener(
        "click",
        nextModule
    );


    elements.bottomNextBtn?.addEventListener(
        "click",
        nextModule
    );


    elements.dashboardBtn?.addEventListener(
        "click",
        () => {

            navigateTo(
                "dashboard"
            );
        }
    );


    elements.continueBtn?.addEventListener(
        "click",
        () => {

            if (state.kundliA) {

                navigateTo(
                    "dashboard"
                );

            } else {

                showStatus(
                    "पहले Kundli generate करें।",
                    "error"
                );
            }
        }
    );


    elements.printBtn?.addEventListener(
        "click",
        () => {

            navigateTo("report");

            setTimeout(
                () => window.print(),
                100
            );
        }
    );


    elements.saveReportBtn?.addEventListener(
        "click",
        () => {

            saveState();

            showToast(
                "Kundli report state saved."
            );
        }
    );


    /* ========================================================
       KEYBOARD NAVIGATION
    ======================================================== */

    document.addEventListener(
        "keydown",
        (event) => {

            /*
             * Input fields में keyboard navigation
             * interfere नहीं करेगा।
             */

            const tag =
                document.activeElement?.tagName;

            if (
                tag === "INPUT" ||
                tag === "TEXTAREA" ||
                tag === "SELECT"
            ) {
                return;
            }


            if (
                event.key === "ArrowLeft"
            ) {
                previousModule();
            }


            if (
                event.key === "ArrowRight"
            ) {
                nextModule();
            }
        }
    );


    /* ========================================================
       INITIALIZE
    ======================================================== */

    loadState();

    renderApplication();

    navigateTo(
        state.personA && state.kundliA
            ? state.currentModule
            : "birth"
    );


    console.log(
        "KundliApp initialized."
    );

});