(function (window) {

    "use strict";


    /* =========================================================
       CONSTANTS
    ========================================================= */

    const PLANET_ORDER = [
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


    const PLANET_SHORT = {
        Sun: "Su",
        Moon: "Mo",
        Mars: "Ma",
        Mercury: "Me",
        Jupiter: "Ju",
        Venus: "Ve",
        Saturn: "Sa",
        Rahu: "Ra",
        Ketu: "Ke"
    };


    const PLANET_HINDI = {
        Sun: "सूर्य",
        Moon: "चंद्र",
        Mars: "मंगल",
        Mercury: "बुध",
        Jupiter: "गुरु",
        Venus: "शुक्र",
        Saturn: "शनि",
        Rahu: "राहु",
        Ketu: "केतु"
    };


    /* =========================================================
       HELPERS
    ========================================================= */

    function getState() {

        if (
            !window.KundliState ||
            typeof window.KundliState.getState !== "function"
        ) {
            throw new Error(
                "KundliState उपलब्ध नहीं है."
            );
        }

        return window.KundliState.getState();
    }


    function escapeHTML(value) {

        return String(
            value === null ||
            value === undefined
                ? ""
                : value
        )
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
    }


    function escapeAttr(value) {

        return escapeHTML(value);
    }


    function planetHindi(id) {

        return PLANET_HINDI[id] || id;
    }


    function planetShort(id) {

        return PLANET_SHORT[id] || id.slice(0, 2);
    }


    function getRashi(planet) {

        if (
            !planet ||
            !planet.rashi
        ) {
            return null;
        }

        return planet.rashi;
    }


    function rashiHindi(rashi) {

        if (!rashi) {
            return "—";
        }

        return (
            rashi.hindi ||
            rashi.name ||
            "—"
        );
    }


    function rashiEnglish(rashi) {

        if (!rashi) {
            return "—";
        }

        return (
            rashi.name ||
            "—"
        );
    }


    function getHousePlanets(
        planets,
        houseNumber
    ) {

        return PLANET_ORDER.filter(
            function (id) {

                return (
                    planets[id] &&
                    Number(
                        planets[id].house
                    ) === houseNumber
                );
            }
        );
    }


    /* =========================================================
       SVG HELPERS
    ========================================================= */

    function svgText(
        x,
        y,
        text,
        className,
        anchor
    ) {

        return `
            <text
                x="${x}"
                y="${y}"
                class="${className}"
                text-anchor="${anchor || "middle"}"
            >
                ${escapeHTML(text)}
            </text>
        `;
    }


    /*
     * North Indian style chart:
     *
     * Outer square
     * + diagonals
     * + inner diamond
     *
     * 12 fixed house polygons.
     */

    const HOUSE_SHAPES = {

        1: [
            [300, 60],
            [540, 300],
            [300, 300],
            [60, 300]
        ],

        2: [
            [60, 60],
            [300, 60],
            [60, 300]
        ],

        3: [
            [60, 60],
            [180, 180],
            [60, 300]
        ],

        4: [
            [60, 300],
            [300, 300],
            [60, 540]
        ],

        5: [
            [60, 540],
            [300, 300],
            [300, 540]
        ],

        6: [
            [300, 540],
            [540, 300],
            [540, 540]
        ],

        7: [
            [300, 300],
            [540, 300],
            [300, 60],
            [300, 540]
        ],

        8: [
            [540, 300],
            [540, 60],
            [300, 60]
        ],

        9: [
            [540, 60],
            [540, 300],
            [420, 180]
        ],

        10: [
            [540, 300],
            [300, 540],
            [540, 540]
        ],

        11: [
            [300, 540],
            [60, 540],
            [60, 300]
        ],

        12: [
            [60, 300],
            [60, 60],
            [300, 60],
            [300, 300]
        ]

    };


    /*
     * We use dedicated readable positions inside
     * each chart house. The chart remains a visual
     * reference while the detailed table below provides
     * exact placement.
     */

    const HOUSE_POSITIONS = {

        1: {
            rashi: [300, 205],
            number: [300, 128],
            planets: [300, 225]
        },

        2: {
            rashi: [150, 125],
            number: [95, 95],
            planets: [150, 148]
        },

        3: {
            rashi: [92, 215],
            number: [78, 170],
            planets: [105, 240]
        },

        4: {
            rashi: [150, 375],
            number: [95, 330],
            planets: [150, 400]
        },

        5: {
            rashi: [235, 465],
            number: [205, 500],
            planets: [235, 440]
        },

        6: {
            rashi: [375, 465],
            number: [395, 500],
            planets: [375, 440]
        },

        7: {
            rashi: [300, 395],
            number: [300, 470],
            planets: [300, 370]
        },

        8: {
            rashi: [450, 375],
            number: [505, 330],
            planets: [450, 400]
        },

        9: {
            rashi: [508, 215],
            number: [522, 170],
            planets: [495, 240]
        },

        10: {
            rashi: [450, 125],
            number: [505, 95],
            planets: [450, 148]
        },

        11: {
            rashi: [365, 125],
            number: [395, 95],
            planets: [365, 148]
        },

        12: {
            rashi: [215, 205],
            number: [205, 128],
            planets: [215, 225]
        }

    };


    /* =========================================================
       BUILD SVG
    ========================================================= */

    function buildChartSVG(
        kundli
    ) {

        const houses =
            Array.isArray(kundli.houses)
                ? kundli.houses
                : [];

        const planets =
            kundli.planets || {};

        const lagna =
            kundli.lagna;


        if (houses.length !== 12) {

            throw new Error(
                "D1 chart के लिए 12 houses उपलब्ध नहीं हैं."
            );
        }


        let svg = `
            <svg
                viewBox="0 0 600 600"
                role="img"
                aria-label="D1 Rashi Chart"
            >

                <rect
                    x="60"
                    y="60"
                    width="480"
                    height="480"
                    class="d1-chart-outer"
                ></rect>

                <polygon
                    points="300,60 540,300 300,540 60,300"
                    class="d1-chart-house"
                ></polygon>

                <line
                    x1="60"
                    y1="60"
                    x2="540"
                    y2="540"
                    class="d1-chart-line"
                ></line>

                <line
                    x1="540"
                    y1="60"
                    x2="60"
                    y2="540"
                    class="d1-chart-line"
                ></line>

                <line
                    x1="300"
                    y1="60"
                    x2="300"
                    y2="540"
                    class="d1-chart-line"
                ></line>

                <line
                    x1="60"
                    y1="300"
                    x2="540"
                    y2="300"
                    class="d1-chart-line"
                ></line>
        `;


        /*
         * House labels.
         */

        houses.forEach(
            function (houseData) {

                const house =
                    Number(
                        houseData.house
                    );

                const rashi =
                    houseData.rashi;

                const position =
                    HOUSE_POSITIONS[house];


                if (!position) {
                    return;
                }


                const active =
                    house === 1
                        ? " active"
                        : "";


                svg += `
                    <polygon
                        points="${HOUSE_SHAPES[
                            house
                        ]
                            .map(
                                function (point) {
                                    return point.join(",");
                                }
                            )
                            .join(" ")}"
                        class="d1-chart-house${active}"
                    ></polygon>
                `;


                svg += svgText(
                    position.number[0],
                    position.number[1],
                    String(house),
                    "d1-chart-house-number"
                );


                svg += svgText(
                    position.rashi[0],
                    position.rashi[1],
                    rashiHindi(rashi),
                    "d1-chart-rashi"
                );


                /*
                 * Planet names.
                 */

                const housePlanets =
                    getHousePlanets(
                        planets,
                        house
                    );


                if (
                    housePlanets.length === 0
                ) {

                    svg += svgText(
                        position.planets[0],
                        position.planets[1],
                        "—",
                        "d1-chart-empty"
                    );

                    return;
                }


                housePlanets.forEach(
                    function (planetId, index) {

                        const planet =
                            planets[planetId];

                        const y =
                            position.planets[1] +
                            (
                                index * 17
                            );


                        svg += svgText(
                            position.planets[0],
                            y,
                            `${planetShort(
                                planetId
                            )}${
                                planet.retrograde
                                    ? " ℞"
                                    : ""
                            }`,
                            planet.retrograde
                                ? "d1-chart-planet retrograde"
                                : "d1-chart-planet"
                        );

                    }
                );

            }
        );


        /*
         * Explicit Lagna marker.
         */

        if (lagna) {

            svg += svgText(
                300,
                288,
                "LAGNA",
                "d1-chart-lagna"
            );

            svg += svgText(
                300,
                304,
                lagna.degreeFormatted || "—",
                "d1-chart-degree"
            );
        }


        svg += `
            </svg>
        `;


        return svg;
    }


    /* =========================================================
       LAGNA
    ========================================================= */

    function renderLagna(
        kundli
    ) {

        const lagna =
            kundli.lagna;

        const rashiElement =
            document.getElementById(
                "d1LagnaRashi"
            );

        const degreeElement =
            document.getElementById(
                "d1LagnaDegree"
            );

        const summaryElement =
            document.getElementById(
                "d1SummaryList"
            );


        if (!lagna) {

            if (rashiElement) {
                rashiElement.textContent =
                    "—";
            }

            return;
        }


        if (rashiElement) {

            rashiElement.textContent =
                rashiHindi(
                    lagna.rashi
                );
        }


        if (degreeElement) {

            degreeElement.textContent =
                lagna.degreeFormatted ||
                "—";
        }


        if (summaryElement) {

            const rows = [
                [
                    "Rashi / राशि",
                    rashiEnglish(
                        lagna.rashi
                    )
                ],
                [
                    "Rashi Lord / राशि स्वामी",
                    lagna.rashiLord || "—"
                ],
                [
                    "Degree / अंश",
                    lagna.degreeFormatted ||
                        "—"
                ],
                [
                    "Sidereal Longitude",
                    Number.isFinite(
                        Number(
                            lagna.siderealLongitude
                        )
                    )
                        ? `${Number(
                            lagna.siderealLongitude
                        ).toFixed(4)}°`
                        : "—"
                ],
                [
                    "Local Sidereal Time",
                    Number.isFinite(
                        Number(
                            lagna.localSiderealTime
                        )
                    )
                        ? `${Number(
                            lagna.localSiderealTime
                        ).toFixed(4)}°`
                        : "—"
                ]
            ];


            summaryElement.innerHTML =
                rows.map(
                    function (row) {

                        return `
                            <div class="d1-summary-row">

                                <span>
                                    ${escapeHTML(
                                        row[0]
                                    )}
                                </span>

                                <strong>
                                    ${escapeHTML(
                                        row[1]
                                    )}
                                </strong>

                            </div>
                        `;

                    }
                ).join("");
        }
    }


    /* =========================================================
       HOUSE GRID
    ========================================================= */

    function renderHouseGrid(
        kundli
    ) {

        const container =
            document.getElementById(
                "d1HouseGrid"
            );

        if (!container) {
            return;
        }


        const houses =
            kundli.houses || [];

        const planets =
            kundli.planets || {};


        if (houses.length !== 12) {

            container.innerHTML = `
                <div class="d1-error">
                    12 house data उपलब्ध नहीं है।
                </div>
            `;

            return;
        }


        container.innerHTML =
            houses.map(
                function (houseData) {

                    const house =
                        Number(
                            houseData.house
                        );

                    const rashi =
                        houseData.rashi;


                    const housePlanets =
                        getHousePlanets(
                            planets,
                            house
                        );


                    const planetHTML =
                        housePlanets.length
                            ? housePlanets.map(
                                function (id) {

                                    return `
                                        <span
                                            class="d1-house-planet-pill"
                                            title="${escapeAttr(
                                                planetHindi(id)
                                            )}"
                                        >
                                            ${escapeHTML(
                                                planetShort(id)
                                            )}
                                        </span>
                                    `;

                                }
                            ).join("")
                            : `
                                <span
                                    class="d1-house-planet-pill"
                                >
                                    Empty
                                </span>
                            `;


                    return `
                        <div
                            class="
                                d1-house-item
                                ${
                                    house === 1
                                        ? "lagna-house"
                                        : ""
                                }
                            "
                        >

                            <div class="d1-house-number">
                                भाव ${house}
                            </div>

                            <div class="d1-house-rashi">
                                ${escapeHTML(
                                    rashiHindi(rashi)
                                )}
                            </div>

                            <div class="d1-house-rashi-en">
                                ${escapeHTML(
                                    rashiEnglish(rashi)
                                )}
                            </div>

                            <div class="d1-house-lord">
                                Lord / स्वामी: ${escapeHTML(houseData.lord || "—")}
                            </div>

                            <div class="d1-house-planets">
                                ${planetHTML}
                            </div>

                        </div>
                    `;

                }
            ).join("");
    }


    /* =========================================================
       PLANET TABLE
    ========================================================= */

    function renderPlanetTable(
        kundli
    ) {

        const tbody =
            document.getElementById(
                "d1PlanetTable"
            );

        if (!tbody) {
            return;
        }


        const planets =
            kundli.planets || {};


        tbody.innerHTML =
            PLANET_ORDER.map(
                function (id) {

                    const planet =
                        planets[id];


                    if (!planet) {

                        return `
                            <tr>
                                <td colspan="7">
                                    ${escapeHTML(id)}
                                    — data unavailable
                                </td>
                            </tr>
                        `;
                    }


                    const nakshatra =
                        planet.nakshatra;


                    const pada =
                        nakshatra &&
                        nakshatra.pada
                            ? String(
                                nakshatra.pada
                            )
                            : "—";


                    const motionClass =
                        planet.retrograde
                            ? "retrograde"
                            : "";


                    const motionText =
                        planet.retrograde
                            ? "Retrograde"
                            : "Direct";


                    return `
                        <tr>
                            <td>
                                <span class="d1-planet-name">${escapeHTML(id)}</span>
                                <span class="d1-planet-hindi">${escapeHTML(planetHindi(id))}</span>
                            </td>
                            <td class="d1-rashi-cell">${escapeHTML(rashiHindi(planet.rashi))}</td>
                            <td>${escapeHTML(planet.rashiLord || "—")}</td>
                            <td>${escapeHTML(planet.degreeFormatted || "—")}</td>
                            <td>${planet.house ? escapeHTML(String(planet.house)) : "—"}</td>
                            <td class="d1-nakshatra-cell">${escapeHTML(nakshatra ? (nakshatra.hindi || nakshatra.name || "—") : "—")}</td>
                            <td>${escapeHTML(pada)}</td>
                            <td>${escapeHTML(planet.navamsa?.sign ? `${planet.navamsa.sign.hindi || planet.navamsa.sign.name || "—"} · P${planet.navamsa.pada || "—"}` : "—")}</td>
                            <td>${escapeHTML(planet.dignity?.label || "सामान्य / Neutral")}</td>
                            <td><span class="d1-motion ${motionClass}">${escapeHTML(motionText)}${planet.combust ? " · अस्त / Combust" : ""}</span></td>
                        </tr>
                    `;

                }
            ).join("");
    }


    /* =========================================================
       SPECIAL CARDS
    ========================================================= */

    function renderSpecialCards(
        kundli
    ) {

        const planets =
            kundli.planets || {};

        const moon =
            planets.Moon;

        const houses =
            kundli.houses || [];

        const lagna =
            kundli.lagna;


        /*
         * Moon
         */

        const moonSummary =
            document.getElementById(
                "d1MoonSummary"
            );

        const moonNote =
            document.getElementById(
                "d1MoonNote"
            );


        if (moonSummary) {

            moonSummary.textContent =
                moon
                    ? rashiHindi(
                        moon.rashi
                    )
                    : "—";
        }


        if (moonNote) {

            moonNote.textContent =
                moon
                    ? `${moon.degreeFormatted || "—"} · ${
                        moon.nakshatra
                            ? (
                                moon.nakshatra.hindi ||
                                moon.nakshatra.name
                            )
                            : "नक्षत्र —"
                    }`
                    : "Moon data unavailable.";
        }


        /*
         * 7th House
         */

        const seventh =
            houses.find(
                function (item) {

                    return Number(
                        item.house
                    ) === 7;

                }
            );


        const seventhPlanets =
            getHousePlanets(
                planets,
                7
            );


        const seventhSummary =
            document.getElementById(
                "d1SeventhSummary"
            );

        const seventhNote =
            document.getElementById(
                "d1SeventhNote"
            );


        if (seventhSummary) {

            seventhSummary.textContent =
                seventh &&
                seventh.rashi
                    ? rashiHindi(
                        seventh.rashi
                    )
                    : "—";
        }


        if (seventhNote) {

            seventhNote.textContent =
                seventhPlanets.length
                    ? `स्थित ग्रह: ${
                        seventhPlanets
                            .map(
                                function (id) {
                                    return planetHindi(id);
                                }
                            )
                            .join(", ")
                    }`
                    : "इस भाव में कोई ग्रह नहीं है.";
        }


        /*
         * Chart basis
         */

        const basis =
            document.getElementById(
                "d1ChartBasis"
            );

        const basisNote =
            document.getElementById(
                "d1ChartBasisNote"
            );


        if (basis) {

            basis.textContent =
                "Sidereal D1";
        }


        if (basisNote) {

            basisNote.textContent =
                `Lagna: ${
                    lagna &&
                    lagna.rashi
                        ? rashiHindi(
                            lagna.rashi
                        )
                        : "—"
                } · Lahiri Ayanamsha`;
        }
    }


    /* =========================================================
       TITLE
    ========================================================= */

    function renderTitle(
        kundli
    ) {

        const title =
            document.getElementById(
                "d1Title"
            );

        const subtitle =
            document.getElementById(
                "d1Subtitle"
            );

        const legend =
            document.getElementById(
                "d1ChartLegend"
            );


        const name =
            kundli.input &&
            kundli.input.name
                ? kundli.input.name
                : "Kundli";


        if (title) {

            title.textContent =
                `${name} — D1 Rashi`;
        }


        if (subtitle) {

            subtitle.textContent =
                "मुख्य जन्म कुंडली में राशि, भाव और ग्रह स्थिति।";
        }


        if (legend) {

            legend.textContent =
                "Su / Mo / Ma / Me / Ju / Ve / Sa / Ra / Ke";
        }
    }


    /* =========================================================
       MAIN RENDER
    ========================================================= */

    function render() {

        const state =
            getState();

        const kundli =
            state.kundliA;


        if (!kundli) {

            const module =
                document.querySelector(
                    ".d1-rashi-module"
                );

            if (module) {

                module.innerHTML = `
                    <div class="d1-error">
                        D1 chart data उपलब्ध नहीं है।
                        पहले Birth Details में Kundli generate करें।
                    </div>
                `;
            }

            return;
        }


        renderTitle(
            kundli
        );


        renderLagna(
            kundli
        );


        renderHouseGrid(
            kundli
        );


        renderPlanetTable(
            kundli
        );


        renderSpecialCards(
            kundli
        );


        const chart =
            document.getElementById(
                "d1Chart"
            );


        if (chart) {

            chart.innerHTML =
                buildChartSVG(
                    kundli
                );
        }


        console.log(
            "[D1 Rashi] Rendered successfully."
        );
    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        console.log(
            "[D1 Rashi] Module initialized."
        );


        try {

            render();

        } catch (error) {

            console.error(
                "[D1 Rashi] Render error:",
                error
            );


            const module =
                document.querySelector(
                    ".d1-rashi-module"
                );


            if (module) {

                module.innerHTML = `
                    <div class="d1-error">
                        D1 Rashi load करते समय error आया:
                        ${escapeHTML(
                            error.message
                        )}
                    </div>
                `;
            }
        }
    }


    /* =========================================================
       MODULE REGISTRATION
    ========================================================= */

    window.KundliModules =
        window.KundliModules || {};

    window.KundliModules[
        "d1-rashi"
    ] = {
        init
    };


})(window);