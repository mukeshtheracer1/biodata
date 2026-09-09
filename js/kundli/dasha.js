/* =========================================================
   DASHA MODULE
   Module 08
   Uses existing Kundli Engine Vimshottari data
   ========================================================= */

(function () {

    "use strict";


    window.KundliModules =
        window.KundliModules || {};


    /* =========================================================
       PLANET NAMES
    ========================================================= */

    const PLANETS = {

        Sun: {
            hi: "सूर्य",
            en: "Sun"
        },

        Moon: {
            hi: "चंद्र",
            en: "Moon"
        },

        Mars: {
            hi: "मंगल",
            en: "Mars"
        },

        Mercury: {
            hi: "बुध",
            en: "Mercury"
        },

        Jupiter: {
            hi: "गुरु",
            en: "Jupiter"
        },

        Venus: {
            hi: "शुक्र",
            en: "Venus"
        },

        Saturn: {
            hi: "शनि",
            en: "Saturn"
        },

        Rahu: {
            hi: "राहु",
            en: "Rahu"
        },

        Ketu: {
            hi: "केतु",
            en: "Ketu"
        }

    };


    /* =========================================================
       HELPERS
    ========================================================= */

    function getState() {

        if (
            !window.KundliState ||
            typeof window.KundliState.getState !==
                "function"
        ) {
            return null;
        }

        return window.KundliState.getState();
    }


    function getKundli() {

        const state =
            getState();

        if (!state) {
            return null;
        }

        return state.kundliA || null;
    }


    function getDasha() {

        const kundli =
            getKundli();

        if (!kundli) {
            return null;
        }

        return kundli.dasha || null;
    }


    function getPlanetName(lord) {

        return (
            PLANETS[lord] || {
                hi: lord || "—",
                en: lord || "—"
            }
        );
    }


    function formatDate(value) {

        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        ).format(date);
    }


    function formatDateTime(value) {

        if (!value) {
            return "—";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return "—";
        }

        return new Intl.DateTimeFormat(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        ).format(date);
    }


    function formatYears(years) {

        const value =
            Number(years);

        if (
            !Number.isFinite(value)
        ) {
            return "—";
        }

        return value.toFixed(2) + " years";
    }


    function isBetween(
        start,
        end,
        now
    ) {

        const startTime =
            new Date(start).getTime();

        const endTime =
            new Date(end).getTime();

        return (
            Number.isFinite(startTime) &&
            Number.isFinite(endTime) &&
            now >= startTime &&
            now < endTime
        );
    }


    function getStatus(
        start,
        end
    ) {

        const now =
            Date.now();

        const startTime =
            new Date(start).getTime();

        const endTime =
            new Date(end).getTime();


        if (
            !Number.isFinite(startTime) ||
            !Number.isFinite(endTime)
        ) {
            return "unknown";
        }


        if (
            now < startTime
        ) {
            return "future";
        }


        if (
            now >= endTime
        ) {
            return "past";
        }


        return "current";
    }


    function escapeHtml(value) {

        return String(value)
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


    /* =========================================================
       FIND CURRENT MAHADASHA
    ========================================================= */

    function findCurrentMahadasha(
        mahadasha
    ) {

        if (
            !Array.isArray(mahadasha)
        ) {
            return null;
        }

        return (
            mahadasha.find(
                function (item) {

                    return isBetween(
                        item.start,
                        item.end,
                        Date.now()
                    );

                }
            ) || null
        );
    }


    /* =========================================================
       FIND CURRENT ANTARDASHA
    ========================================================= */

    function findCurrentAntardasha(
        mahadasha
    ) {

        if (
            !mahadasha ||
            !Array.isArray(
                mahadasha.antardasha
            )
        ) {
            return null;
        }

        return (
            mahadasha.antardasha.find(
                function (item) {

                    return isBetween(
                        item.start,
                        item.end,
                        Date.now()
                    );

                }
            ) || null
        );
    }


    /* =========================================================
       CURRENT DASHAS
    ========================================================= */

    function renderCurrent(
        dasha
    ) {

        const el =
            document.getElementById(
                "dashaCurrent"
            );

        if (!el) {
            return;
        }


        const mahadasha =
            Array.isArray(
                dasha.mahadasha
            )
                ? dasha.mahadasha
                : [];


        const currentMD =
            findCurrentMahadasha(
                mahadasha
            );


        const currentAD =
            findCurrentAntardasha(
                currentMD
            );


        if (!currentMD) {

            el.innerHTML = `

                <div class="current-dasha-card">

                    <div class="current-dasha-label">
                        Current
                    </div>

                    <div class="current-dasha-planet">
                        —
                    </div>

                    <div class="current-dasha-date">
                        Current Mahadasha data
                        उपलब्ध नहीं है।
                    </div>

                </div>

            `;

            return;
        }


        const mdName =
            getPlanetName(
                currentMD.lord
            );


        const adName =
            currentAD
                ? getPlanetName(
                    currentAD.lord
                )
                : null;


        el.innerHTML = `

            <div class="current-dasha-card active">

                <div class="current-dasha-label">
                    Current Mahadasha
                </div>

                <div class="current-dasha-planet">
                    ${mdName.hi}
                </div>

                <div class="current-dasha-en">
                    ${mdName.en}
                </div>

                <div class="current-dasha-date">

                    ${formatDate(currentMD.start)}
                    →
                    ${formatDate(currentMD.end)}

                </div>

            </div>


            <div class="current-dasha-card active">

                <div class="current-dasha-label">
                    Current Antardasha
                </div>

                <div class="current-dasha-planet">

                    ${
                        adName
                            ? adName.hi
                            : "—"
                    }

                </div>

                <div class="current-dasha-en">

                    ${
                        adName
                            ? adName.en
                            : "—"
                    }

                </div>

                <div class="current-dasha-date">

                    ${
                        currentAD
                            ? `
                                ${formatDate(currentAD.start)}
                                →
                                ${formatDate(currentAD.end)}
                              `
                            : "—"
                    }

                </div>

            </div>


            <div class="current-dasha-card">

                <div class="current-dasha-label">
                    Mahadasha Duration
                </div>

                <div class="current-dasha-planet">

                    ${formatYears(currentMD.years)}

                </div>

                <div class="current-dasha-en">
                    ${
                        mdName.en
                    }
                </div>

                <div class="current-dasha-date">

                    Period begins:
                    ${formatDate(currentMD.start)}

                </div>

            </div>


            <div class="current-dasha-card">

                <div class="current-dasha-label">
                    Dasha System
                </div>

                <div class="current-dasha-planet">
                    Vimshottari
                </div>

                <div class="current-dasha-en">
                    विम्शोत्तरी
                </div>

                <div class="current-dasha-date">
                    Birth Nakshatra based
                </div>

            </div>

        `;
    }


    /* =========================================================
       BIRTH NAKSHATRA
    ========================================================= */

    function renderBirthNakshatra(
        dasha
    ) {

        const el =
            document.getElementById(
                "dashaBirthNakshatra"
            );

        if (!el) {
            return;
        }


        const nak =
            dasha.birthNakshatra;


        if (!nak) {

            el.innerHTML = `
                <div class="dasha-empty">
                    Birth Nakshatra data उपलब्ध नहीं है।
                </div>
            `;

            return;
        }


        el.innerHTML = `

            <div class="nakshatra-detail">

                <div class="nakshatra-detail-label">
                    नक्षत्र
                </div>

                <div class="nakshatra-detail-value">

                    ${escapeHtml(
                        nak.hindi ||
                        nak.name ||
                        "—"
                    )}

                </div>

            </div>


            <div class="nakshatra-detail">

                <div class="nakshatra-detail-label">
                    Nakshatra
                </div>

                <div class="nakshatra-detail-value">

                    ${escapeHtml(
                        nak.name ||
                        "—"
                    )}

                </div>

            </div>


            <div class="nakshatra-detail">

                <div class="nakshatra-detail-label">
                    Nakshatra Lord
                </div>

                <div class="nakshatra-detail-value">

                    ${
                        getPlanetName(
                            nak.lord
                        ).hi
                    }

                </div>

            </div>


            <div class="nakshatra-detail">

                <div class="nakshatra-detail-label">
                    Pada
                </div>

                <div class="nakshatra-detail-value">

                    ${
                        nak.pada ||
                        "—"
                    }

                </div>

            </div>

        `;
    }


    /* =========================================================
       MAHADASHA TIMELINE
    ========================================================= */

    function renderTimeline(
        dasha
    ) {

        const el =
            document.getElementById(
                "mahadashaTimeline"
            );

        if (!el) {
            return;
        }


        const list =
            Array.isArray(
                dasha.mahadasha
            )
                ? dasha.mahadasha
                : [];


        if (!list.length) {

            el.innerHTML = `
                <div class="dasha-empty">
                    Mahadasha data उपलब्ध नहीं है।
                </div>
            `;

            return;
        }


        el.innerHTML =
            list
                .map(
                    function (
                        item,
                        index
                    ) {

                        const name =
                            getPlanetName(
                                item.lord
                            );


                        const status =
                            getStatus(
                                item.start,
                                item.end
                            );


                        return `

                            <div
                                class="
                                    dasha-timeline-item
                                    ${
                                        status === "current"
                                            ? "current"
                                            : ""
                                    }
                                "
                            >

                                <div class="timeline-number">

                                    ${
                                        index + 1
                                    }

                                </div>


                                <div class="timeline-planet">

                                    <strong>
                                        ${name.hi}
                                    </strong>

                                    <span>
                                        ${name.en}
                                    </span>

                                </div>


                                <div class="timeline-bar">

                                    <div
                                        class="timeline-bar-inner"
                                    ></div>

                                </div>


                                <div class="timeline-duration">

                                    ${
                                        formatYears(
                                            item.years
                                        )
                                    }

                                    <br>

                                    ${
                                        formatDate(
                                            item.start
                                        )
                                    }

                                </div>

                            </div>

                        `;

                    }
                )
                .join("");
    }


    /* =========================================================
       MAHADASHA TABLE
    ========================================================= */

    function renderMahadashaTable(
        dasha
    ) {

        const tbody =
            document.getElementById(
                "mahadashaTable"
            );

        if (!tbody) {
            return;
        }


        const list =
            Array.isArray(
                dasha.mahadasha
            )
                ? dasha.mahadasha
                : [];


        tbody.innerHTML =
            list
                .map(
                    function (
                        item,
                        index
                    ) {

                        const name =
                            getPlanetName(
                                item.lord
                            );


                        const status =
                            getStatus(
                                item.start,
                                item.end
                            );


                        let statusText =
                            "Future";


                        if (
                            status === "past"
                        ) {
                            statusText =
                                "Completed";
                        }

                        if (
                            status === "current"
                        ) {
                            statusText =
                                "Current";
                        }


                        return `

                            <tr
                                class="${
                                    status === "current"
                                        ? "current-row"
                                        : ""
                                }"
                            >

                                <td>
                                    ${
                                        index + 1
                                    }
                                </td>


                                <td>

                                    <span
                                        class="dasha-planet-hi"
                                    >
                                        ${name.hi}
                                    </span>

                                </td>


                                <td>

                                    <span
                                        class="dasha-planet-en"
                                    >
                                        ${name.en}
                                    </span>

                                </td>


                                <td>
                                    ${
                                        formatYears(
                                            item.years
                                        )
                                    }
                                </td>


                                <td>
                                    ${
                                        formatDate(
                                            item.start
                                        )
                                    }
                                </td>


                                <td>
                                    ${
                                        formatDate(
                                            item.end
                                        )
                                    }
                                </td>


                                <td>

                                    <span
                                        class="
                                            dasha-status
                                            ${status}
                                        "
                                    >
                                        ${statusText}
                                    </span>

                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");
    }


    /* =========================================================
       ANTARDASHA TABLE
    ========================================================= */

    function renderAntardasha(
        dasha
    ) {

        const tbody =
            document.getElementById(
                "antardashaTable"
            );

        const label =
            document.getElementById(
                "selectedMahadashaLabel"
            );


        if (!tbody) {
            return;
        }


        const currentMD =
            findCurrentMahadasha(
                dasha.mahadasha
            );


        if (!currentMD) {

            if (label) {
                label.textContent =
                    "—";
            }

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        <div class="dasha-empty">
                            Current Mahadasha उपलब्ध नहीं है।
                        </div>
                    </td>
                </tr>
            `;

            return;
        }


        const mdName =
            getPlanetName(
                currentMD.lord
            );


        if (label) {

            label.textContent =
                `${mdName.hi} Mahadasha`;

        }


        const list =
            Array.isArray(
                currentMD.antardasha
            )
                ? currentMD.antardasha
                : [];


        tbody.innerHTML =
            list
                .map(
                    function (
                        item,
                        index
                    ) {

                        const name =
                            getPlanetName(
                                item.lord
                            );


                        const status =
                            getStatus(
                                item.start,
                                item.end
                            );


                        let statusText =
                            "Future";


                        if (
                            status === "past"
                        ) {
                            statusText =
                                "Completed";
                        }

                        if (
                            status === "current"
                        ) {
                            statusText =
                                "Current";
                        }


                        return `

                            <tr
                                class="${
                                    status === "current"
                                        ? "current-row"
                                        : ""
                                }"
                            >

                                <td>
                                    ${
                                        index + 1
                                    }
                                </td>


                                <td>

                                    <span
                                        class="dasha-planet-hi"
                                    >
                                        ${name.hi}
                                    </span>

                                </td>


                                <td>

                                    ${
                                        mdName.en
                                    }
                                        /
                                    ${
                                        name.en
                                    }

                                </td>


                                <td>
                                    ${
                                        formatDateTime(
                                            item.start
                                        )
                                    }
                                </td>


                                <td>
                                    ${
                                        formatDateTime(
                                            item.end
                                        )
                                    }
                                </td>


                                <td>

                                    <span
                                        class="
                                            dasha-status
                                            ${status}
                                        "
                                    >
                                        ${statusText}
                                    </span>

                                </td>

                            </tr>

                        `;

                    }
                )
                .join("");
    }


    /* =========================================================
       HIGHLIGHTS
    ========================================================= */

    function renderHighlights(
        dasha
    ) {

        const el =
            document.getElementById(
                "dashaHighlights"
            );

        if (!el) {
            return;
        }


        const list =
            Array.isArray(
                dasha.mahadasha
            )
                ? dasha.mahadasha
                : [];


        const currentMD =
            findCurrentMahadasha(
                list
            );


        const currentAD =
            findCurrentAntardasha(
                currentMD
            );


        if (!currentMD) {

            el.innerHTML = `
                <div class="dasha-empty">
                    Current Dasha analysis उपलब्ध नहीं है।
                </div>
            `;

            return;
        }


        const md =
            getPlanetName(
                currentMD.lord
            );


        const ad =
            currentAD
                ? getPlanetName(
                    currentAD.lord
                )
                : null;


        const nak =
            dasha.birthNakshatra;


        el.innerHTML = `

            <div class="dasha-highlight">

                <strong>
                    वर्तमान महादशा
                </strong>

                <span>

                    ${
                        md.hi
                    }
                    (${md.en})
                    वर्तमान Mahadasha है।
                    इसका काल
                    ${
                        formatDate(
                            currentMD.start
                        )
                    }
                    से
                    ${
                        formatDate(
                            currentMD.end
                        )
                    }
                    तक है।

                </span>

            </div>


            <div class="dasha-highlight">

                <strong>
                    वर्तमान Antardasha
                </strong>

                <span>

                    ${
                        ad
                            ? `
                                ${ad.hi}
                                (${ad.en})
                                वर्तमान Antardasha है।
                              `
                            : `
                                Current Antardasha
                                उपलब्ध नहीं है।
                              `
                    }

                </span>

            </div>


            <div class="dasha-highlight">

                <strong>
                    Dasha Starting Point
                </strong>

                <span>

                    ${
                        nak
                            ? `
                                Vimshottari sequence
                                जन्म नक्षत्र
                                ${
                                    nak.hindi ||
                                    nak.name ||
                                    ""
                                }
                                और उसके lord
                                ${
                                    nak.lord || ""
                                }
                                से शुरू होता है।
                              `
                            : `
                                Birth Nakshatra
                                data unavailable.
                              `
                    }

                </span>

            </div>


            <div class="dasha-highlight">

                <strong>
                    Period Status
                </strong>

                <span>

                    Current Mahadasha में
                    ${
                        currentMD.antardasha
                            ? currentMD.antardasha.length
                            : 0
                    }
                    Antardasha periods उपलब्ध हैं।

                </span>

            </div>

        `;
    }


    /* =========================================================
       EMPTY
    ========================================================= */

    function renderEmpty() {

        const ids = [
            "dashaCurrent",
            "dashaBirthNakshatra",
            "mahadashaTimeline",
            "mahadashaTable",
            "antardashaTable",
            "dashaHighlights"
        ];


        ids.forEach(
            function (id) {

                const el =
                    document.getElementById(
                        id
                    );

                if (!el) {
                    return;
                }


                if (
                    id === "mahadashaTable" ||
                    id === "antardashaTable"
                ) {

                    el.innerHTML = `
                        <tr>
                            <td colspan="7">
                                <div class="dasha-empty">
                                    पहले Birth Details save करके
                                    Kundli generate करें।
                                </div>
                            </td>
                        </tr>
                    `;

                } else {

                    el.innerHTML = `
                        <div class="dasha-empty">
                            पहले Birth Details save करके
                            Kundli generate करें।
                        </div>
                    `;

                }

            }
        );
    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        console.log(
            "[Dasha] Module initialized."
        );


        const dasha =
            getDasha();


        if (!dasha) {

            console.error(
                "[Dasha] kundli.dasha missing."
            );

            renderEmpty();

            return;
        }


        console.log(
            "[Dasha] Engine data:",
            dasha
        );


        renderCurrent(
            dasha
        );


        renderBirthNakshatra(
            dasha
        );


        renderTimeline(
            dasha
        );


        renderMahadashaTable(
            dasha
        );


        renderAntardasha(
            dasha
        );


        renderHighlights(
            dasha
        );

    }


    /* =========================================================
       REGISTER
    ========================================================= */

    window.KundliModules[
        "dasha"
    ] = {
        init
    };


})();