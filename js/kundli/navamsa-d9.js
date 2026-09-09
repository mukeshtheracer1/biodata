/* =========================================================
   NAVAMSA D9 MODULE
   FINAL - DIRECT ENGINE DATA
   ========================================================= */

(function () {
    "use strict";

    window.KundliModules = window.KundliModules || {};

    const PLANETS = [
        "Sun",
        "Moon",
        "Mars",
        "Mercury",
        "Jupiter",
        "Venus",
        "Saturn",
        "Rahu",
        "Ketu"
    ];

    const PLANET_NAMES = {
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
       STATE
    ========================================================= */

    function getKundli() {

        if (
            !window.KundliState ||
            typeof window.KundliState.getState !== "function"
        ) {
            return null;
        }

        const state =
            window.KundliState.getState();

        return state &&
            state.kundliA
            ? state.kundliA
            : null;
    }


    /* =========================================================
       RASHI HELPERS
       
       IMPORTANT:
       Engine RASHI IDs are strings like:
       aries, taurus, etc.
       
       So we NEVER convert id to Number.
    ========================================================= */

    function getRashiName(sign) {

        if (!sign) {
            return {
                id: "—",
                name: "—",
                hindi: "—",
                index: null
            };
        }

        if (sign.sign) {
            sign = sign.sign;
        }

        if (typeof sign === "object") {

            return {
                id:
                    sign.id !== undefined
                        ? sign.id
                        : "—",

                name:
                    sign.name ||
                    "—",

                hindi:
                    sign.hindi ||
                    "—",

                index:
                    Number.isFinite(
                        Number(sign.index)
                    )
                        ? Number(sign.index)
                        : null
            };
        }

        return {
            id: "—",
            name: String(sign),
            hindi: String(sign),
            index: null
        };
    }


    /* =========================================================
       BUILD D9 DIRECTLY
       
       Priority:
       1. Existing kundli.navamsa
       2. Existing planet.navamsa
       3. Engine utility from sidereal longitude
    ========================================================= */

    function buildD9(kundli) {

        if (!kundli) {
            return null;
        }


        /*
         * -----------------------------------------------------
         * LAGNA
         * -----------------------------------------------------
         */

        let lagnaD9 = null;


        if (
            kundli.navamsa &&
            kundli.navamsa.lagna
        ) {

            lagnaD9 =
                kundli.navamsa.lagna;

        }


        /*
         * Fallback:
         * calculate directly from D1 Lagna longitude.
         */

        if (
            !lagnaD9 &&
            kundli.lagna &&
            Number.isFinite(
                Number(
                    kundli.lagna.siderealLongitude
                )
            ) &&
            window.KundliEngine &&
            window.KundliEngine.utils &&
            typeof window.KundliEngine.utils.getNavamsa ===
                "function"
        ) {

            lagnaD9 =
                window.KundliEngine.utils.getNavamsa(
                    Number(
                        kundli.lagna.siderealLongitude
                    )
                );

        }


        /*
         * -----------------------------------------------------
         * PLANETS
         * -----------------------------------------------------
         */

        const planets = {};


        PLANETS.forEach(
            function (planetId) {

                const source =
                    kundli.planets &&
                    kundli.planets[planetId]
                        ? kundli.planets[planetId]
                        : null;


                if (!source) {
                    return;
                }


                let d9 = null;


                /*
                 * Existing engine D9
                 */

                if (
                    source.navamsa
                ) {

                    d9 =
                        source.navamsa;

                }


                /*
                 * kundli.navamsa D9
                 */

                if (
                    !d9 &&
                    kundli.navamsa &&
                    kundli.navamsa.planets &&
                    kundli.navamsa.planets[planetId] &&
                    kundli.navamsa.planets[planetId].navamsa
                ) {

                    d9 =
                        kundli.navamsa
                            .planets[planetId]
                            .navamsa;

                }


                /*
                 * FINAL FALLBACK:
                 * calculate from sidereal longitude
                 */

                if (
                    !d9 &&
                    Number.isFinite(
                        Number(source.longitude)
                    ) &&
                    window.KundliEngine &&
                    window.KundliEngine.utils &&
                    typeof window.KundliEngine.utils.getNavamsa ===
                        "function"
                ) {

                    d9 =
                        window.KundliEngine.utils.getNavamsa(
                            Number(
                                source.longitude
                            )
                        );

                }


                if (d9) {

                    planets[planetId] = {

                        id: planetId,

                        longitude:
                            Number(
                                source.longitude
                            ),

                        navamsa: d9,

                        retrograde:
                            source.retrograde === true

                    };

                }

            }
        );


        if (!lagnaD9) {

            console.error(
                "[Navamsa D9] D9 Lagna could not be calculated."
            );

        }


        console.log(
            "[Navamsa D9] Final D9 data:",
            {
                lagna: lagnaD9,
                planets: planets
            }
        );


        return {
            lagna: lagnaD9,
            planets: planets
        };
    }


    /* =========================================================
       HOUSE
    ========================================================= */

    function getHouse(
        planetRashi,
        lagnaRashi
    ) {

        if (
            !planetRashi ||
            !lagnaRashi ||
            planetRashi.index === null ||
            lagnaRashi.index === null
        ) {
            return null;
        }

        return (
            (
                planetRashi.index -
                lagnaRashi.index +
                12
            ) % 12
        ) + 1;
    }


    function getHouseRashi(
        lagnaRashi,
        house
    ) {

        if (
            !lagnaRashi ||
            lagnaRashi.index === null
        ) {
            return null;
        }

        const index =
            (
                lagnaRashi.index +
                house -
                1
            ) % 12;


        const names = [
            ["aries", "Mesha", "मेष"],
            ["taurus", "Vrishabha", "वृषभ"],
            ["gemini", "Mithuna", "मिथुन"],
            ["cancer", "Karka", "कर्क"],
            ["leo", "Simha", "सिंह"],
            ["virgo", "Kanya", "कन्या"],
            ["libra", "Tula", "तुला"],
            ["scorpio", "Vrishchika", "वृश्चिक"],
            ["sagittarius", "Dhanu", "धनु"],
            ["capricorn", "Makara", "मकर"],
            ["aquarius", "Kumbha", "कुंभ"],
            ["pisces", "Meena", "मीन"]
        ];


        return {
            id: names[index][0],
            name: names[index][1],
            hindi: names[index][2],
            index
        };
    }


    /* =========================================================
       SUMMARY
    ========================================================= */

    function renderSummary(
        kundli,
        d9
    ) {

        const el =
            document.getElementById(
                "navamsaSummary"
            );

        if (!el) {
            return;
        }


        const state =
            window.KundliState.getState();


        const name =
            (
                state &&
                state.personA &&
                state.personA.name
            ) ||
            (
                kundli.input &&
                kundli.input.name
            ) ||
            "—";


        const lagna =
            d9.lagna
                ? getRashiName(
                    d9.lagna.sign
                )
                : null;


        const moon =
            d9.planets.Moon
                ? getRashiName(
                    d9.planets.Moon.navamsa.sign
                )
                : null;


        const sun =
            d9.planets.Sun
                ? getRashiName(
                    d9.planets.Sun.navamsa.sign
                )
                : null;


        el.innerHTML = `

            <div class="navamsa-summary-item">

                <div class="navamsa-summary-label">
                    जातक
                </div>

                <div class="navamsa-summary-value">
                    ${escapeHtml(name)}
                </div>

            </div>


            <div class="navamsa-summary-item">

                <div class="navamsa-summary-label">
                    D9 Lagna
                </div>

                <div class="navamsa-summary-value">
                    ${
                        lagna
                            ? lagna.hindi
                            : "—"
                    }
                </div>

            </div>


            <div class="navamsa-summary-item">

                <div class="navamsa-summary-label">
                    D9 Moon
                </div>

                <div class="navamsa-summary-value">
                    ${
                        moon
                            ? moon.hindi
                            : "—"
                    }
                </div>

            </div>


            <div class="navamsa-summary-item">

                <div class="navamsa-summary-label">
                    D9 Sun
                </div>

                <div class="navamsa-summary-value">
                    ${
                        sun
                            ? sun.hindi
                            : "—"
                    }
                </div>

            </div>

        `;
    }


    /* =========================================================
       LAGNA
    ========================================================= */

    function renderLagna(d9) {

        const el =
            document.getElementById(
                "navamsaLagna"
            );

        if (!el) {
            return;
        }


        if (!d9.lagna) {

            el.innerHTML = `
                <div class="navamsa-empty">
                    D9 Lagna calculate नहीं हुआ।
                </div>
            `;

            return;
        }


        const rashi =
            getRashiName(
                d9.lagna.sign
            );


        const pada =
            d9.lagna.pada
                ? Number(d9.lagna.pada)
                : null;


        el.innerHTML = `

            <div class="lagna-display">

                <div class="lagna-symbol">
                    ${rashi.index + 1}
                </div>

                <strong>
                    ${rashi.hindi}
                </strong>

                <small>
                    ${rashi.name}
                    ${
                        pada
                            ? ` • Pada ${pada}`
                            : ""
                    }
                </small>

            </div>

        `;
    }


    /* =========================================================
       PLANET TABLE
    ========================================================= */

    function renderTable(
        kundli,
        d9
    ) {

        const tbody =
            document.getElementById(
                "navamsaPlanetTable"
            );

        if (!tbody) {
            return;
        }


        const lagnaRashi =
            d9.lagna
                ? getRashiName(
                    d9.lagna.sign
                )
                : null;


        tbody.innerHTML =
            PLANETS
                .map(function (planetId) {

                    const data =
                        d9.planets[planetId];


                    if (!data) {

                        return `

                            <tr>

                                <td>
                                    ${
                                        PLANET_NAMES[planetId].hi
                                    }
                                </td>

                                <td>
                                    ${
                                        PLANET_NAMES[planetId].en
                                    }
                                </td>

                                <td>—</td>
                                <td>—</td>
                                <td>—</td>
                                <td>—</td>

                            </tr>

                        `;

                    }


                    const navamsa =
                        data.navamsa;


                    const rashi =
                        getRashiName(
                            navamsa.sign
                        );


                    const house =
                        getHouse(
                            rashi,
                            lagnaRashi
                        );


                    const pada =
                        navamsa.pada;


                    return `

                        <tr>

                            <td>

                                <span class="planet-name-hi">
                                    ${
                                        PLANET_NAMES[
                                            planetId
                                        ].hi
                                    }
                                </span>

                            </td>


                            <td>

                                <span class="planet-name-en">
                                    ${
                                        PLANET_NAMES[
                                            planetId
                                        ].en
                                    }
                                </span>

                            </td>


                            <td>

                                ${rashi.hindi}
                                (${rashi.index + 1})

                            </td>


                            <td>

                                ${
                                    pada
                                        ? `Pada ${pada}`
                                        : "—"
                                }

                            </td>


                            <td>

                                ${
                                    house
                                        ? house
                                        : "—"
                                }

                            </td>


                            <td>

                                <span
                                    class="${
                                        data.retrograde
                                            ? "status-retro"
                                            : "status-direct"
                                    }"
                                >

                                    ${
                                        data.retrograde
                                            ? "Retrograde"
                                            : "Direct"
                                    }

                                </span>

                            </td>

                        </tr>

                    `;

                })
                .join("");
    }


    /* =========================================================
       CHART
    ========================================================= */

    function renderChart(d9) {

        const el =
            document.getElementById(
                "navamsaChart"
            );

        if (!el) {
            return;
        }


        if (!d9.lagna) {

            el.innerHTML = `
                <div class="navamsa-empty">
                    D9 Lagna unavailable.
                </div>
            `;

            return;
        }


        const lagnaRashi =
            getRashiName(
                d9.lagna.sign
            );


        const housePlanets = {};


        PLANETS.forEach(
            function (planetId) {

                const data =
                    d9.planets[planetId];

                if (!data) {
                    return;
                }


                const rashi =
                    getRashiName(
                        data.navamsa.sign
                    );


                const house =
                    getHouse(
                        rashi,
                        lagnaRashi
                    );


                if (!house) {
                    return;
                }


                if (!housePlanets[house]) {
                    housePlanets[house] = [];
                }


                housePlanets[house].push(
                    planetId
                );

            }
        );


        /*
         * North Indian style fixed house layout
         */

        const layout = [
            1, 2, 3,
            12, 5, 4,
            11, 10, 9
        ];


        el.innerHTML =
            layout
                .map(function (house) {

                    const rashi =
                        getHouseRashi(
                            lagnaRashi,
                            house
                        );


                    const planets =
                        housePlanets[house] ||
                        [];


                    return `

                        <div class="d9-house">

                            <span class="d9-house-number">
                                House ${house}
                            </span>


                            <div class="d9-rashi">

                                ${rashi.hindi}

                                <br>

                                <small>
                                    ${rashi.index + 1}
                                </small>

                            </div>


                            <div class="d9-planets">

                                ${
                                    planets
                                        .map(
                                            function (
                                                planetId
                                            ) {

                                                return `

                                                    <span class="d9-planet">

                                                        ${
                                                            PLANET_NAMES[
                                                                planetId
                                                            ].hi
                                                        }

                                                    </span>

                                                `;

                                            }
                                        )
                                        .join("")
                                }

                            </div>

                        </div>

                    `;

                })
                .join("");
    }


    /* =========================================================
       HIGHLIGHTS
    ========================================================= */

    function renderHighlights(d9) {

        const el =
            document.getElementById(
                "navamsaHighlights"
            );

        if (!el) {
            return;
        }


        function getPlanetRashi(
            planetId
        ) {

            if (
                !d9.planets[planetId]
            ) {
                return null;
            }

            return getRashiName(
                d9.planets[
                    planetId
                ].navamsa.sign
            );
        }


        const lagna =
            d9.lagna
                ? getRashiName(
                    d9.lagna.sign
                )
                : null;


        const moon =
            getPlanetRashi(
                "Moon"
            );


        const venus =
            getPlanetRashi(
                "Venus"
            );


        const jupiter =
            getPlanetRashi(
                "Jupiter"
            );


        el.innerHTML = `

            <div class="navamsa-highlight">

                <strong>
                    Navamsa Lagna
                </strong>

                <span>

                    ${
                        lagna
                            ? `
                                D9 Lagna
                                ${lagna.hindi}
                                (${lagna.name})
                                में है।
                              `
                            : "—"
                    }

                </span>

            </div>


            <div class="navamsa-highlight">

                <strong>
                    Moon in D9
                </strong>

                <span>

                    ${
                        moon
                            ? `
                                चंद्रमा Navamsa में
                                ${moon.hindi}
                                (${moon.name})
                                में है।
                              `
                            : "—"
                    }

                </span>

            </div>


            <div class="navamsa-highlight">

                <strong>
                    Venus in D9
                </strong>

                <span>

                    ${
                        venus
                            ? `
                                शुक्र Navamsa में
                                ${venus.hindi}
                                (${venus.name})
                                में है।
                              `
                            : "—"
                    }

                </span>

            </div>


            <div class="navamsa-highlight">

                <strong>
                    Jupiter in D9
                </strong>

                <span>

                    ${
                        jupiter
                            ? `
                                गुरु Navamsa में
                                ${jupiter.hindi}
                                (${jupiter.name})
                                में है।
                              `
                            : "—"
                    }

                </span>

            </div>

        `;
    }


    /* =========================================================
       ESCAPE
    ========================================================= */

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
       INIT
    ========================================================= */

    function init() {

        console.log(
            "[Navamsa D9] Module initialized."
        );


        const kundli =
            getKundli();


        if (!kundli) {

            console.error(
                "[Navamsa D9] kundliA missing."
            );

            return;
        }


        const d9 =
            buildD9(
                kundli
            );


        if (!d9) {

            console.error(
                "[Navamsa D9] Could not build D9."
            );

            return;
        }


        renderSummary(
            kundli,
            d9
        );


        renderLagna(
            d9
        );


        renderChart(
            d9
        );


        renderTable(
            kundli,
            d9
        );


        renderHighlights(
            d9
        );


        console.log(
            "[Navamsa D9] Render complete."
        );
    }


    /* =========================================================
       REGISTER
    ========================================================= */

    window.KundliModules[
        "navamsa-d9"
    ] = {
        init
    };

})();