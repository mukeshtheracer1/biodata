(function (window) {

    "use strict";


    /* =========================================================
       HELPERS
    ========================================================= */

    function getState() {

        if (
            !window.KundliState ||
            typeof window.KundliState.getState !== "function"
        ) {
            throw new Error(
                "KundliState available नहीं है."
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
            return value;
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );
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
            return value;
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );
    }


    function getPlanetHindi(id) {

        const names = {
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

        return names[id] || id;
    }


    function getPlanetOrder() {

        return [
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
    }


    function getRashiName(planet) {

        if (
            !planet ||
            !planet.rashi
        ) {
            return "—";
        }

        return (
            planet.rashi.hindi ||
            planet.rashi.name ||
            "—"
        );
    }


    function getNakshatraName(planet) {

        if (
            !planet ||
            !planet.nakshatra
        ) {
            return "—";
        }

        return (
            planet.nakshatra.hindi ||
            planet.nakshatra.name ||
            "—"
        );
    }


    function getD9Name(data) {

        if (
            !data ||
            !data.sign
        ) {
            return "—";
        }

        return (
            data.sign.hindi ||
            data.sign.name ||
            "—"
        );
    }


    /* =========================================================
       BIRTH SUMMARY
    ========================================================= */

    function renderBirthSummary(
        state,
        kundli
    ) {

        const container =
            document.getElementById(
                "dashboardBirthGrid"
            );

        if (!container) {
            return;
        }

        const person =
            state.personA || {};

        const input =
            kundli.input || {};

        const values = [
            {
                label: "नाम",
                value:
                    person.name ||
                    input.name ||
                    "—"
            },
            {
                label: "लिंग",
                value:
                    person.gender ||
                    input.gender ||
                    "—"
            },
            {
                label: "जन्म तारीख",
                value:
                    person.date ||
                    input.birthDate ||
                    "—"
            },
            {
                label: "जन्म समय",
                value:
                    person.time ||
                    input.birthTime ||
                    "—"
            },
            {
                label: "जन्म स्थान",
                value:
                    person.place ||
                    input.birthPlace ||
                    "—"
            },
            {
                label: "समय क्षेत्र",
                value:
                    person.timezone ||
                    input.timezone ||
                    "—"
            },
            {
                label: "Latitude",
                value:
                    Number.isFinite(
                        Number(
                            input.latitude
                        )
                    )
                        ? Number(
                            input.latitude
                        ).toFixed(4)
                        : "—"
            },
            {
                label: "Longitude",
                value:
                    Number.isFinite(
                        Number(
                            input.longitude
                        )
                    )
                        ? Number(
                            input.longitude
                        ).toFixed(4)
                        : "—"
            }
        ];

        container.innerHTML =
            values.map(function (item) {

                return `
                    <div class="dashboard-birth-item">
                        <span>
                            ${escapeHTML(item.label)}
                        </span>

                        <strong title="${escapeHTML(item.value)}">
                            ${escapeHTML(item.value)}
                        </strong>
                    </div>
                `;

            }).join("");
    }


    /* =========================================================
       CORE METRICS
    ========================================================= */

    function renderCoreMetrics(kundli) {

        const lagna =
            kundli.lagna;

        const moon =
            kundli.planets &&
            kundli.planets.Moon;

        const nakshatra =
            kundli.moonNakshatra ||
            (
                moon &&
                moon.nakshatra
            );

        const lagnaElement =
            document.getElementById(
                "dashboardLagna"
            );

        const lagnaDegree =
            document.getElementById(
                "dashboardLagnaDegree"
            );

        const moonElement =
            document.getElementById(
                "dashboardMoonRashi"
            );

        const moonDegree =
            document.getElementById(
                "dashboardMoonDegree"
            );

        const nakshatraElement =
            document.getElementById(
                "dashboardNakshatra"
            );

        const nakshatraPada =
            document.getElementById(
                "dashboardNakshatraPada"
            );

        const ayanamshaElement =
            document.getElementById(
                "dashboardAyanamsha"
            );


        if (lagnaElement) {

            lagnaElement.textContent =
                lagna &&
                lagna.rashi
                    ? (
                        lagna.rashi.hindi ||
                        lagna.rashi.name
                    )
                    : "—";
        }


        if (lagnaDegree) {

            lagnaDegree.textContent =
                lagna &&
                lagna.degreeFormatted
                    ? lagna.degreeFormatted
                    : "—";
        }


        if (moonElement) {

            moonElement.textContent =
                getRashiName(moon);
        }


        if (moonDegree) {

            moonDegree.textContent =
                moon &&
                moon.degreeFormatted
                    ? moon.degreeFormatted
                    : "—";
        }


        if (nakshatraElement) {

            nakshatraElement.textContent =
                nakshatra
                    ? (
                        nakshatra.hindi ||
                        nakshatra.name ||
                        "—"
                    )
                    : "—";
        }


        if (nakshatraPada) {

            nakshatraPada.textContent =
                nakshatra &&
                nakshatra.pada
                    ? `पाद ${nakshatra.pada}`
                    : "—";
        }


        if (ayanamshaElement) {

            const value =
                kundli.atanamsha ||
                kundli.ayanamsha;

            const degrees =
                kundli.ayanamsha &&
                Number(
                    kundli.ayanamsha.degrees
                );

            ayanamshaElement.textContent =
                Number.isFinite(degrees)
                    ? `${degrees.toFixed(4)}°`
                    : "—";
        }
    }


    /* =========================================================
       PLANET TABLE
    ========================================================= */

    function renderPlanetTable(kundli) {

        const table =
            document.getElementById(
                "dashboardPlanetTable"
            );

        if (!table) {
            return;
        }

        const planets =
            kundli.planets || {};

        const order =
            getPlanetOrder();

        table.innerHTML =
            order.map(function (id) {

                const planet =
                    planets[id];

                if (!planet) {

                    return `
                        <tr>
                            <td colspan="6">
                                ${escapeHTML(id)}
                            </td>
                        </tr>
                    `;
                }

                const status =
                    planet.retrograde
                        ? "Retrograde"
                        : "Direct";

                return `
                    <tr>

                        <td>
                            <span class="dashboard-planet-name">
                                ${escapeHTML(id)}
                            </span>

                            <span class="dashboard-planet-hindi">
                                ${escapeHTML(
                                    getPlanetHindi(id)
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHTML(
                                getRashiName(planet)
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                planet.degreeFormatted ||
                                "—"
                            )}
                        </td>

                        <td>
                            ${
                                planet.house
                                    ? escapeHTML(
                                        String(
                                            planet.house
                                        )
                                    )
                                    : "—"
                            }
                        </td>

                        <td>
                            <span class="dashboard-planet-nakshatra">
                                ${escapeHTML(
                                    getNakshatraName(
                                        planet
                                    )
                                )}
                            </span>

                            ${
                                planet.nakshatra &&
                                planet.nakshatra.pada
                                    ? `
                                        <small>
                                            /
                                            ${escapeHTML(
                                                String(
                                                    planet.nakshatra.pada
                                                )
                                            )}
                                        </small>
                                    `
                                    : ""
                            }
                        </td>

                        <td>
                            <span
                                class="
                                    dashboard-planet-status
                                    ${
                                        planet.retrograde
                                            ? "retrograde"
                                            : ""
                                    }
                                "
                            >
                                ${escapeHTML(status)}
                            </span>
                        </td>

                    </tr>
                `;

            }).join("");
    }


    /* =========================================================
       MARRIAGE INDICATORS
    ========================================================= */

    function renderMarriageIndicators(
        kundli
    ) {

        const container =
            document.getElementById(
                "dashboardMarriageIndicators"
            );

        if (!container) {
            return;
        }

        const planets =
            kundli.planets || {};

        const houses =
            kundli.houses || [];

        const lagna =
            kundli.lagna;


        /*
         * Whole-sign house structure:
         * house 7 is opposite house 1.
         */

        let seventhHouse =
            null;

        if (houses.length >= 7) {
            seventhHouse =
                houses[6];
        }


        const seventhSign =
            seventhHouse &&
            seventhHouse.rashi
                ? (
                    seventhHouse.rashi.hindi ||
                    seventhHouse.rashi.name
                )
                : "—";


        const seventhLord =
            getSignLord(
                seventhHouse &&
                seventhHouse.rashi
                    ? seventhHouse.rashi.index
                    : null
            );


        const seventhLordPlanet =
            seventhLord &&
            planets[seventhLord]
                ? planets[seventhLord]
                : null;


        const venus =
            planets.Venus;

        const jupiter =
            planets.Jupiter;


        const indicators = [
            {
                label: "7वां भाव",
                value:
                    seventhHouse
                        ? `भाव 7 — ${seventhSign}`
                        : "—"
            },
            {
                label: "7वें भाव का स्वामी",
                value:
                    seventhLord
                        ? getPlanetHindi(
                            seventhLord
                        )
                        : "—"
            },
            {
                label: "7वें स्वामी की स्थिति",
                value:
                    seventhLordPlanet
                        ? (
                            `${getRashiName(
                                seventhLordPlanet
                            )} / भाव ${
                                seventhLordPlanet.house ||
                                "—"
                            }`
                        )
                        : "—"
            },
            {
                label: "शुक्र",
                value:
                    venus
                        ? (
                            `${getRashiName(venus)} / भाव ${
                                venus.house || "—"
                            }`
                        )
                        : "—"
            },
            {
                label: "गुरु",
                value:
                    jupiter
                        ? (
                            `${getRashiName(jupiter)} / भाव ${
                                jupiter.house || "—"
                            }`
                        )
                        : "—"
            },
            {
                label: "लग्न",
                value:
                    lagna &&
                    lagna.rashi
                        ? (
                            lagna.rashi.hindi ||
                            lagna.rashi.name
                        )
                        : "—"
            }
        ];


        container.innerHTML =
            indicators.map(function (item) {

                return `
                    <div class="dashboard-indicator">

                        <span class="dashboard-indicator-label">
                            ${escapeHTML(
                                item.label
                            )}
                        </span>

                        <strong class="dashboard-indicator-value">
                            ${escapeHTML(
                                item.value
                            )}
                        </strong>

                    </div>
                `;

            }).join("");
    }


    /* =========================================================
       RASHI LORD
    ========================================================= */

    function getSignLord(
        signIndex
    ) {

        if (
            signIndex === null ||
            signIndex === undefined
        ) {
            return null;
        }

        const lords = [
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

        return (
            lords[signIndex] ||
            null
        );
    }


    /* =========================================================
       MANGLIK
    ========================================================= */

    function renderManglik(kundli) {

        const element =
            document.getElementById(
                "dashboardManglik"
            );

        const note =
            document.getElementById(
                "dashboardManglikNote"
            );

        if (!element) {
            return;
        }

        const manglik =
            kundli.manglik;

        if (!manglik) {

            element.textContent =
                "Data unavailable";

            if (note) {
                note.textContent =
                    "Manglik calculation उपलब्ध नहीं है.";
            }

            return;
        }

        element.textContent =
            manglik.assessment ||
            "—";


        if (note) {

            note.textContent =
                `Lagna: ${
                    manglik.marsHouseFromLagna ||
                    "—"
                } | Moon: ${
                    manglik.marsHouseFromMoon ||
                    "—"
                } | Venus: ${
                    manglik.marsHouseFromVenus ||
                    "—"
                }`;
        }
    }


    /* =========================================================
       DASHA
    ========================================================= */

    function renderDasha(kundli) {

        const mahaElement =
            document.getElementById(
                "dashboardMahaDasha"
            );

        const antarElement =
            document.getElementById(
                "dashboardAntarDasha"
            );

        const datesElement =
            document.getElementById(
                "dashboardDashaDates"
            );


        const dasha =
            kundli.dasha;

        if (
            !dasha ||
            !Array.isArray(
                dasha.mahadasha
            )
        ) {

            if (mahaElement) {
                mahaElement.textContent =
                    "—";
            }

            if (antarElement) {
                antarElement.textContent =
                    "—";
            }

            return;
        }


        const now =
            Date.now();


        const currentMaha =
            dasha.mahadasha.find(
                function (item) {

                    const start =
                        new Date(
                            item.start
                        ).getTime();

                    const end =
                        new Date(
                            item.end
                        ).getTime();

                    return (
                        now >= start &&
                        now < end
                    );
                }
            );


        if (!currentMaha) {

            if (mahaElement) {
                mahaElement.textContent =
                    "—";
            }

            if (antarElement) {
                antarElement.textContent =
                    "—";
            }

            if (datesElement) {
                datesElement.textContent =
                    "Current period not found.";
            }

            return;
        }


        if (mahaElement) {

            mahaElement.textContent =
                getPlanetHindi(
                    currentMaha.lord
                );
        }


        let currentAntar =
            null;


        if (
            Array.isArray(
                currentMaha.antardasha
            )
        ) {

            currentAntar =
                currentMaha.antardasha.find(
                    function (item) {

                        const start =
                            new Date(
                                item.start
                            ).getTime();

                        const end =
                            new Date(
                                item.end
                            ).getTime();

                        return (
                            now >= start &&
                            now < end
                        );
                    }
                );
        }


        if (antarElement) {

            antarElement.textContent =
                currentAntar
                    ? getPlanetHindi(
                        currentAntar.lord
                    )
                    : "—";
        }


        if (datesElement) {

            datesElement.textContent =
                `${formatDate(
                    currentMaha.start
                )} — ${formatDate(
                    currentMaha.end
                )}`;
        }
    }


    /* =========================================================
       D9
    ========================================================= */

    function renderD9(kundli) {

        const lagnaElement =
            document.getElementById(
                "dashboardD9Lagna"
            );

        const venusElement =
            document.getElementById(
                "dashboardD9Venus"
            );

        const jupiterElement =
            document.getElementById(
                "dashboardD9Jupiter"
            );


        const navamsa =
            kundli.navamsa;

        if (!navamsa) {
            return;
        }


        if (lagnaElement) {

            lagnaElement.textContent =
                getD9Name(
                    navamsa.lagna
                );
        }


        if (
            venusElement &&
            navamsa.planets &&
            navamsa.planets.Venus
        ) {

            venusElement.textContent =
                getD9Name(
                    navamsa.planets.Venus.navamsa
                );
        }


        if (
            jupiterElement &&
            navamsa.planets &&
            navamsa.planets.Jupiter
        ) {

            jupiterElement.textContent =
                getD9Name(
                    navamsa.planets.Jupiter.navamsa
                );
        }
    }


    /* =========================================================
       CALCULATION INFO
    ========================================================= */

    function renderCalculationInfo(
        kundli
    ) {

        const container =
            document.getElementById(
                "dashboardCalculationInfo"
            );

        if (!container) {
            return;
        }

        const engine =
            kundli.engine || {};

        const input =
            kundli.input || {};


        const values = [
            {
                label: "Provider",
                value:
                    engine.provider ||
                    "—"
            },
            {
                label: "Ayanamsha",
                value:
                    engine.ayanamsha ||
                    "—"
            },
            {
                label: "House System",
                value:
                    engine.houseSystem ||
                    "—"
            },
            {
                label: "Calculation",
                value:
                    engine.calculation ||
                    "—"
            },
            {
                label: "UTC Birth Time",
                value:
                    formatDateTime(
                        input.utcDate
                    )
            },
            {
                label: "Coordinates",
                value:
                    `${input.latitude ?? "—"}, ${
                        input.longitude ?? "—"
                    }`
            },
            {
                label: "Engine Version",
                value:
                    kundli.version ||
                    "—"
            },
            {
                label: "Calculated At",
                value:
                    formatDateTime(
                        kundli.calculatedAt
                    )
            }
        ];


        container.innerHTML =
            values.map(function (item) {

                return `
                    <div class="dashboard-info-item">

                        <span>
                            ${escapeHTML(
                                item.label
                            )}
                        </span>

                        <strong>
                            ${escapeHTML(
                                item.value
                            )}
                        </strong>

                    </div>
                `;

            }).join("");
    }


    /* =========================================================
       QUICK NAVIGATION
    ========================================================= */

    function bindQuickNavigation() {

        const buttons =
            document.querySelectorAll(
                "[data-dashboard-module]"
            );

        buttons.forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        const moduleId =
                            button.getAttribute(
                                "data-dashboard-module"
                            );

                        if (!moduleId) {
                            return;
                        }


                        /*
                         * kundli-shell.js normally owns
                         * navigation. Use its public
                         * navigation method if available.
                         */

                        if (
                            window.KundliShell &&
                            typeof window.KundliShell.goToModule ===
                                "function"
                        ) {

                            window.KundliShell.goToModule(
                                moduleId
                            );

                            return;
                        }


                        /*
                         * Fallback:
                         * find the matching shell nav button.
                         */

                        const navButton =
                            document.querySelector(
                                `[data-module-id="${moduleId}"]`
                            );

                        if (navButton) {
                            navButton.click();
                        }

                    }
                );

            }
        );
    }


    /* =========================================================
       RENDER
    ========================================================= */

    function render() {

        const state =
            getState();

        const kundli =
            state.kundliA;


        if (!kundli) {

            const screen =
                document.querySelector(
                    ".dashboard-module"
                );

            if (screen) {

                screen.innerHTML = `
                    <div class="dashboard-error">
                        Kundli data उपलब्ध नहीं है।
                        पहले Birth Details में जन्म विवरण save
                        और generate करें।
                    </div>
                `;
            }

            return;
        }


        renderBirthSummary(
            state,
            kundli
        );

        renderCoreMetrics(
            kundli
        );

        renderPlanetTable(
            kundli
        );

        renderMarriageIndicators(
            kundli
        );

        renderManglik(
            kundli
        );

        renderDasha(
            kundli
        );

        renderD9(
            kundli
        );

        renderCalculationInfo(
            kundli
        );

        bindQuickNavigation();


        const title =
            document.getElementById(
                "dashboardTitle"
            );

        const subtitle =
            document.getElementById(
                "dashboardSubtitle"
            );


        if (title) {

            title.textContent =
                `${(
                    kundli.input &&
                    kundli.input.name
                ) || "Kundli"} — Dashboard`;
        }


        if (subtitle) {

            subtitle.textContent =
                "जन्म कुंडली का मुख्य सारांश और महत्वपूर्ण संकेत।";
        }


        console.log(
            "[Dashboard] Rendered successfully."
        );
    }


    /* =========================================================
       MODULE INIT
    ========================================================= */

    function init() {

        console.log(
            "[Dashboard] Module initialized."
        );

        try {

            render();

        } catch (error) {

            console.error(
                "[Dashboard] Render error:",
                error
            );

            const screen =
                document.querySelector(
                    ".dashboard-module"
                );

            if (screen) {

                screen.innerHTML = `
                    <div class="dashboard-error">
                        Dashboard load करते समय error आया:
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
        "dashboard"
    ] = {
        init
    };


})(window);