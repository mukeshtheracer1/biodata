(function (window) {

    "use strict";


    /* =========================================================
       PLANET DATA
    ========================================================= */

    const PLANETS = {

        Sun: {
            hindi: "सूर्य",
            short: "Su"
        },

        Moon: {
            hindi: "चंद्र",
            short: "Mo"
        },

        Mars: {
            hindi: "मंगल",
            short: "Ma"
        },

        Mercury: {
            hindi: "बुध",
            short: "Me"
        },

        Jupiter: {
            hindi: "गुरु",
            short: "Ju"
        },

        Venus: {
            hindi: "शुक्र",
            short: "Ve"
        },

        Saturn: {
            hindi: "शनि",
            short: "Sa"
        },

        Rahu: {
            hindi: "राहु",
            short: "Ra"
        },

        Ketu: {
            hindi: "केतु",
            short: "Ke"
        }

    };


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


    /* =========================================================
       RASHI DATA
    ========================================================= */

    const RASHIS = {

        aries: {
            hindi: "मेष",
            english: "Aries"
        },

        taurus: {
            hindi: "वृषभ",
            english: "Taurus"
        },

        gemini: {
            hindi: "मिथुन",
            english: "Gemini"
        },

        cancer: {
            hindi: "कर्क",
            english: "Cancer"
        },

        leo: {
            hindi: "सिंह",
            english: "Leo"
        },

        virgo: {
            hindi: "कन्या",
            english: "Virgo"
        },

        libra: {
            hindi: "तुला",
            english: "Libra"
        },

        scorpio: {
            hindi: "वृश्चिक",
            english: "Scorpio"
        },

        sagittarius: {
            hindi: "धनु",
            english: "Sagittarius"
        },

        capricorn: {
            hindi: "मकर",
            english: "Capricorn"
        },

        aquarius: {
            hindi: "कुंभ",
            english: "Aquarius"
        },

        pisces: {
            hindi: "मीन",
            english: "Pisces"
        }

    };


    /* =========================================================
       DIGNITY RULES
    ========================================================= */

    const EXALTATION = {

        Sun: "aries",
        Moon: "taurus",
        Mars: "capricorn",
        Mercury: "virgo",
        Jupiter: "cancer",
        Venus: "pisces",
        Saturn: "libra"

    };


    const DEBILITATION = {

        Sun: "libra",
        Moon: "scorpio",
        Mars: "cancer",
        Mercury: "pisces",
        Jupiter: "capricorn",
        Venus: "virgo",
        Saturn: "aries"

    };


    const OWN_SIGNS = {

        Sun: ["leo"],

        Moon: ["cancer"],

        Mars: [
            "aries",
            "scorpio"
        ],

        Mercury: [
            "gemini",
            "virgo"
        ],

        Jupiter: [
            "sagittarius",
            "pisces"
        ],

        Venus: [
            "taurus",
            "libra"
        ],

        Saturn: [
            "capricorn",
            "aquarius"
        ]

    };


    /*
     * Mooltrikona sign ranges are degree-sensitive.
     *
     * We keep the standard sign ranges here.
     */

    const MOOLTRIKONA = {

        Sun: {
            sign: "leo",
            start: 0,
            end: 20
        },

        Moon: {
            sign: "taurus",
            start: 4,
            end: 30
        },

        Mars: {
            sign: "aries",
            start: 0,
            end: 12
        },

        Mercury: {
            sign: "virgo",
            start: 16,
            end: 20
        },

        Jupiter: {
            sign: "sagittarius",
            start: 0,
            end: 10
        },

        Venus: {
            sign: "libra",
            start: 0,
            end: 15
        },

        Saturn: {
            sign: "aquarius",
            start: 0,
            end: 20
        }

    };


    /* =========================================================
       COMBUSTION LIMITS
    ========================================================= */

    const COMBUSTION_LIMITS = {

        Moon: 12,

        Mars: 17,

        Mercury: 14,

        Jupiter: 11,

        Venus: 10,

        Saturn: 15

    };


    /* =========================================================
       HELPERS
    ========================================================= */

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


    function getState() {

        if (
            !window.KundliState ||
            typeof window.KundliState.getState !==
                "function"
        ) {

            throw new Error(
                "KundliState उपलब्ध नहीं है."
            );

        }

        return window.KundliState.getState();

    }


    function getRashiId(
        planet
    ) {

        if (
            !planet ||
            !planet.rashi
        ) {
            return "";
        }


        return String(
            planet.rashi.id ||
            ""
        ).toLowerCase();

    }


    function getRashiHindi(
        planet
    ) {

        if (
            !planet ||
            !planet.rashi
        ) {
            return "—";
        }


        return (
            planet.rashi.hindi ||
            RASHIS[
                getRashiId(planet)
            ]?.hindi ||
            "—"
        );

    }


    function getRashiEnglish(
        planet
    ) {

        if (
            !planet ||
            !planet.rashi
        ) {
            return "—";
        }


        return (
            planet.rashi.name ||
            RASHIS[
                getRashiId(planet)
            ]?.english ||
            "—"
        );

    }


    function getPlanetName(
        id
    ) {

        return PLANETS[id]
            ? PLANETS[id].hindi
            : id;

    }


    function getPlanetShort(
        id
    ) {

        return PLANETS[id]
            ? PLANETS[id].short
            : id;

    }


    function normalizeAngle(
        value
    ) {

        let angle =
            Number(value) || 0;

        angle %= 360;

        if (angle < 0) {
            angle += 360;
        }

        return angle;

    }


    function angularDistance(
        a,
        b
    ) {

        const diff =
            Math.abs(
                normalizeAngle(a) -
                normalizeAngle(b)
            );

        return Math.min(
            diff,
            360 - diff
        );

    }


    function getDegree(
        planet
    ) {

        if (
            planet &&
            Number.isFinite(
                Number(planet.degree)
            )
        ) {

            return Number(
                planet.degree
            );

        }


        if (
            planet &&
            Number.isFinite(
                Number(planet.longitude)
            )
        ) {

            return (
                Number(planet.longitude) % 30
            );

        }


        return null;

    }


    /* =========================================================
       DIGNITY
    ========================================================= */

    function getDignity(
        id,
        planet
    ) {

        if (
            id === "Rahu" ||
            id === "Ketu"
        ) {

            return {
                type: "",
                label: "",
                className: ""
            };

        }


        const sign =
            getRashiId(
                planet
            );


        const degree =
            getDegree(
                planet
            );


        /*
         * Exalted takes priority.
         */

        if (
            EXALTATION[id] === sign
        ) {

            return {
                type: "exalted",
                label: "उच्च",
                className:
                    "grah-status-exalted"
            };

        }


        /*
         * Debilitated.
         */

        if (
            DEBILITATION[id] === sign
        ) {

            return {
                type: "debilitated",
                label: "नीच",
                className:
                    "grah-status-debilitated"
            };

        }


        /*
         * Mooltrikona.
         */

        const mt =
            MOOLTRIKONA[id];


        if (
            mt &&
            mt.sign === sign &&
            degree !== null &&
            degree >= mt.start &&
            degree < mt.end
        ) {

            return {
                type: "mooltrikona",
                label: "मूलत्रिकोण",
                className:
                    "grah-status-mooltrikona"
            };

        }


        /*
         * Own sign.
         */

        if (
            Array.isArray(
                OWN_SIGNS[id]
            ) &&
            OWN_SIGNS[id].includes(
                sign
            )
        ) {

            return {
                type: "own",
                label: "स्वक्षेत्री",
                className:
                    "grah-status-own"
            };

        }


        return {
            type: "",
            label: "",
            className: ""
        };

    }


    /* =========================================================
       COMBUSTION
    ========================================================= */

    function isCombust(
        id,
        planet,
        planets
    ) {

        if (
            id === "Sun" ||
            id === "Rahu" ||
            id === "Ketu"
        ) {

            return false;

        }


        const sun =
            planets.Sun;


        if (
            !sun ||
            !planet
        ) {

            return false;

        }


        const limit =
            COMBUSTION_LIMITS[id];


        if (
            !Number.isFinite(
                Number(limit)
            )
        ) {

            return false;

        }


        if (
            !Number.isFinite(
                Number(
                    sun.longitude
                )
            ) ||
            !Number.isFinite(
                Number(
                    planet.longitude
                )
            )
        ) {

            return false;

        }


        return (
            angularDistance(
                sun.longitude,
                planet.longitude
            ) <= limit
        );

    }


    /* =========================================================
       STATUS
    ========================================================= */

    function getStatuses(
        id,
        planet,
        planets
    ) {

        const statuses = [];


        const dignity =
            getDignity(
                id,
                planet
            );


        if (
            dignity.label
        ) {

            statuses.push(
                dignity
            );

        }


        if (
            isCombust(
                id,
                planet,
                planets
            )
        ) {

            statuses.push({

                type: "combust",

                label: "अस्त",

                className:
                    "grah-status-combust"

            });

        }


        if (
            planet &&
            planet.retrograde
        ) {

            statuses.push({

                type: "retro",

                label: "वक्री",

                className:
                    "grah-status-retro"

            });

        }


        return statuses;

    }


    /* =========================================================
       MOTION LABEL
    ========================================================= */

    function getMotionHTML(
        id,
        planet
    ) {

        if (
            id === "Rahu" ||
            id === "Ketu"
        ) {

            return `
                <span class="grah-motion-retro">
                    वक्री
                </span>
                <span class="grah-motion-value">
                    Node
                </span>
            `;

        }


        if (
            planet.retrograde
        ) {

            return `
                <span class="grah-motion-retro">
                    वक्री
                </span>

                <span class="grah-motion-value">
                    ${escapeHTML(
                        planet.dailyMotion !== null &&
                        planet.dailyMotion !== undefined
                            ? planet.dailyMotion
                            : "—"
                    )}° / day
                </span>
            `;

        }


        return `
            <span class="grah-motion-normal">
                मार्गी
            </span>

            <span class="grah-motion-value">
                ${escapeHTML(
                    planet.dailyMotion !== null &&
                    planet.dailyMotion !== undefined
                        ? planet.dailyMotion
                        : "—"
                )}° / day
            </span>
        `;

    }


    /* =========================================================
       STATUS HTML
    ========================================================= */

    function statusHTML(
        statuses
    ) {

        if (
            !statuses.length
        ) {

            return `
                <span class="grah-table-empty">
                    सामान्य
                </span>
            `;

        }


        return statuses.map(
            function (status) {

                return `
                    <span
                        class="
                            grah-status
                            ${escapeHTML(
                                status.className
                            )}
                        "
                    >
                        ${escapeHTML(
                            status.label
                        )}
                    </span>
                `;

            }
        ).join("");

    }


    /* =========================================================
       SUMMARY
    ========================================================= */

    function renderSummary(
        kundli
    ) {

        const planets =
            kundli.planets || {};


        const ids =
            PLANET_ORDER.filter(
                function (id) {

                    return !!planets[id];

                }
            );


        let retrogradeCount = 0;

        let combustCount = 0;

        let ownCount = 0;


        ids.forEach(
            function (id) {

                const planet =
                    planets[id];


                if (
                    planet.retrograde
                ) {

                    retrogradeCount++;

                }


                if (
                    isCombust(
                        id,
                        planet,
                        planets
                    )
                ) {

                    combustCount++;

                }


                const dignity =
                    getDignity(
                        id,
                        planet
                    );


                if (
                    dignity.type === "own" ||
                    dignity.type === "mooltrikona"
                ) {

                    ownCount++;

                }

            }
        );


        const total =
            document.getElementById(
                "grahTotal"
            );

        const retrograde =
            document.getElementById(
                "grahRetrograde"
            );

        const combust =
            document.getElementById(
                "grahCombust"
            );

        const own =
            document.getElementById(
                "grahOwnSign"
            );


        if (total) {
            total.textContent =
                ids.length;
        }


        if (retrograde) {
            retrograde.textContent =
                retrogradeCount;
        }


        if (combust) {
            combust.textContent =
                combustCount;
        }


        if (own) {
            own.textContent =
                ownCount;
        }

    }


    /* =========================================================
       PLANET TABLE
    ========================================================= */

    function renderTable(
        kundli
    ) {

        const tbody =
            document.getElementById(
                "grahTableBody"
            );


        if (!tbody) {
            return;
        }


        const planets =
            kundli.planets || {};


        const ids =
            PLANET_ORDER.filter(
                function (id) {

                    return !!planets[id];

                }
            );


        if (!ids.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="9">
                        ग्रह data उपलब्ध नहीं है।
                    </td>
                </tr>
            `;

            return;

        }


        tbody.innerHTML =
            ids.map(
                function (id) {

                    const planet =
                        planets[id];


                    const statuses =
                        getStatuses(
                            id,
                            planet,
                            planets
                        );


                    const dignity =
                        getDignity(
                            id,
                            planet
                        );


                    const nakshatra =
                        planet.nakshatra || {};


                    return `
                        <tr>

                            <td>

                                <div
                                    class="grah-planet-cell"
                                >

                                    <span
                                        class="grah-planet-symbol"
                                    >
                                        ${escapeHTML(
                                            getPlanetShort(id)
                                        )}
                                    </span>


                                    <div>

                                        <div
                                            class="grah-planet-name"
                                        >
                                            ${escapeHTML(
                                                getPlanetName(id)
                                            )}
                                        </div>

                                        <div
                                            class="grah-planet-en"
                                        >
                                            ${escapeHTML(id)}
                                        </div>

                                    </div>

                                </div>

                            </td>


                            <td>

                                <div
                                    class="grah-rashi-name"
                                >
                                    ${escapeHTML(
                                        getRashiHindi(
                                            planet
                                        )
                                    )}
                                </div>

                                <div
                                    class="grah-rashi-en"
                                >
                                    ${escapeHTML(
                                        getRashiEnglish(
                                            planet
                                        )
                                    )}
                                </div>

                            </td>


                            <td>

                                <div
                                    class="grah-degree"
                                >
                                    ${escapeHTML(
                                        planet.degreeFormatted ||
                                        "—"
                                    )}
                                </div>

                                <div
                                    class="grah-longitude"
                                >
                                    ${escapeHTML(
                                        planet.longitude !==
                                        undefined
                                            ? planet.longitude + "°"
                                            : "—"
                                    )}
                                </div>

                            </td>


                            <td>

                                <span
                                    class="grah-nakshatra"
                                >
                                    ${escapeHTML(
                                        nakshatra.hindi ||
                                        nakshatra.name ||
                                        "—"
                                    )}
                                </span>

                            </td>


                            <td>

                                <span
                                    class="grah-pada"
                                >
                                    ${
                                        nakshatra.pada ||
                                        planet.nakshatra?.pada ||
                                        "—"
                                    }
                                </span>

                            </td>


                            <td>

                                <span
                                    class="grah-house-number"
                                >
                                    ${
                                        planet.house ||
                                        "—"
                                    }
                                </span>

                                <div
                                    class="grah-house-label"
                                >
                                    भाव
                                </div>

                            </td>


                            <td>

                                ${getMotionHTML(
                                    id,
                                    planet
                                )}

                            </td>


                            <td>

                                ${
                                    dignity.label
                                        ? `
                                            <span
                                                class="
                                                    grah-status
                                                    ${escapeHTML(
                                                        dignity.className
                                                    )}
                                                "
                                            >
                                                ${escapeHTML(
                                                    dignity.label
                                                )}
                                            </span>
                                          `
                                        : `
                                            <span
                                                class="grah-table-empty"
                                            >
                                                सामान्य
                                            </span>
                                          `
                                }

                            </td>


                            <td>

                                <div
                                    class="grah-status-list"
                                >
                                    ${statusHTML(
                                        statuses
                                    )}
                                </div>

                            </td>

                        </tr>
                    `;

                }
            ).join("");

    }


    /* =========================================================
       OVERVIEW CARDS
    ========================================================= */

    function renderOverview(
        kundli
    ) {

        const container =
            document.getElementById(
                "grahOverviewGrid"
            );


        if (!container) {
            return;
        }


        const planets =
            kundli.planets || {};


        const ids =
            PLANET_ORDER.filter(
                function (id) {

                    return !!planets[id];

                }
            );


        container.innerHTML =
            ids.map(
                function (id) {

                    const planet =
                        planets[id];


                    const statuses =
                        getStatuses(
                            id,
                            planet,
                            planets
                        );


                    const nakshatra =
                        planet.nakshatra || {};


                    const navamsa =
                        planet.navamsa || {};


                    return `
                        <article
                            class="grah-overview-card"
                        >

                            <div
                                class="grah-overview-top"
                            >

                                <span
                                    class="grah-overview-symbol"
                                >
                                    ${escapeHTML(
                                        getPlanetShort(id)
                                    )}
                                </span>


                                <div>

                                    <div
                                        class="grah-overview-name"
                                    >
                                        ${escapeHTML(
                                            getPlanetName(id)
                                        )}
                                    </div>

                                    <div
                                        class="grah-overview-sub"
                                    >
                                        ${escapeHTML(id)}
                                    </div>

                                </div>

                            </div>


                            <div
                                class="grah-overview-data"
                            >

                                <div
                                    class="grah-data-box"
                                >

                                    <span
                                        class="grah-data-label"
                                    >
                                        राशि
                                    </span>

                                    <span
                                        class="grah-data-value"
                                    >
                                        ${escapeHTML(
                                            getRashiHindi(
                                                planet
                                            )
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="grah-data-box"
                                >

                                    <span
                                        class="grah-data-label"
                                    >
                                        अंश
                                    </span>

                                    <span
                                        class="grah-data-value"
                                    >
                                        ${escapeHTML(
                                            planet.degreeFormatted ||
                                            "—"
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="grah-data-box"
                                >

                                    <span
                                        class="grah-data-label"
                                    >
                                        भाव
                                    </span>

                                    <span
                                        class="grah-data-value"
                                    >
                                        ${escapeHTML(
                                            planet.house ||
                                            "—"
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="grah-data-box"
                                >

                                    <span
                                        class="grah-data-label"
                                    >
                                        नक्षत्र
                                    </span>

                                    <span
                                        class="grah-data-value"
                                    >
                                        ${escapeHTML(
                                            nakshatra.hindi ||
                                            nakshatra.name ||
                                            "—"
                                        )}
                                    </span>

                                </div>


                                <div
                                    class="grah-data-box"
                                >

                                    <span
                                        class="grah-data-label"
                                    >
                                        Navamsa
                                    </span>

                                    <span
                                        class="grah-data-value"
                                    >
                                        ${
                                            navamsa.hindi ||
                                            navamsa.name ||
                                            navamsa.id ||
                                            "—"
                                        }
                                    </span>

                                </div>


                                <div
                                    class="grah-data-box"
                                >

                                    <span
                                        class="grah-data-label"
                                    >
                                        स्थिति
                                    </span>

                                    <span
                                        class="grah-data-value"
                                    >
                                        ${
                                            statuses.length
                                                ? statuses
                                                    .map(
                                                        function (s) {
                                                            return s.label;
                                                        }
                                                    )
                                                    .join(", ")
                                                : "सामान्य"
                                        }
                                    </span>

                                </div>

                            </div>

                        </article>
                    `;

                }
            ).join("");

    }


    /* =========================================================
       TITLE
    ========================================================= */

    function renderTitle(
        kundli
    ) {

        const title =
            document.getElementById(
                "grahTitle"
            );


        const subtitle =
            document.getElementById(
                "grahSubtitle"
            );


        const name =
            kundli.input &&
            kundli.input.name
                ? kundli.input.name
                : "Kundli";


        if (title) {

            title.textContent =
                `${name} — ग्रह स्थिति`;

        }


        if (subtitle) {

            subtitle.textContent =
                "सभी ग्रहों की राशि, अंश, नक्षत्र, भाव और स्थिति।";

        }

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

            const module =
                document.querySelector(
                    ".grah-sthiti-module"
                );


            if (module) {

                module.innerHTML = `
                    <div class="grah-error">

                        ग्रह स्थिति data उपलब्ध नहीं है।

                        <br><br>

                        पहले Birth Details में
                        Kundli generate करें।

                    </div>
                `;

            }

            return;

        }


        renderTitle(
            kundli
        );


        renderSummary(
            kundli
        );


        renderTable(
            kundli
        );


        renderOverview(
            kundli
        );


        console.log(
            "[Grah Sthiti] Rendered successfully."
        );

    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        console.log(
            "[Grah Sthiti] Module initialized."
        );


        try {

            render();

        } catch (error) {

            console.error(
                "[Grah Sthiti] Render error:",
                error
            );


            const module =
                document.querySelector(
                    ".grah-sthiti-module"
                );


            if (module) {

                module.innerHTML = `
                    <div class="grah-error">

                        ग्रह स्थिति load करते समय
                        error आया:

                        <br><br>

                        ${escapeHTML(
                            error.message
                        )}

                    </div>
                `;

            }

        }

    }


    /* =========================================================
       REGISTER
    ========================================================= */

    window.KundliModules =
        window.KundliModules || {};


    window.KundliModules[
        "grah-sthiti"
    ] = {

        init

    };


})(window);