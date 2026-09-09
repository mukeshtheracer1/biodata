/* =========================================================
   DOSHA MODULE
   File:
   js/kundli/dosha.js

   PURPOSE:
   Calculation-based Vedic Dosha analysis.

   DATA SOURCE:
   window.KundliState
   window.KundliEngine output

   IMPORTANT:
   No random / dummy planetary positions.
========================================================= */

(function (window) {

    "use strict";


    /* =====================================================
       MODULE REGISTRATION
    ====================================================== */

    window.KundliDosha = {
        init
    };

    window.KundliModules =
        window.KundliModules || {};

    window.KundliModules["dosha"] = {
        init
    };


    /* =====================================================
       CONSTANTS
    ====================================================== */

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


    const RASHIS = [
        {
            index: 0,
            hi: "मेष",
            en: "Aries"
        },

        {
            index: 1,
            hi: "वृषभ",
            en: "Taurus"
        },

        {
            index: 2,
            hi: "मिथुन",
            en: "Gemini"
        },

        {
            index: 3,
            hi: "कर्क",
            en: "Cancer"
        },

        {
            index: 4,
            hi: "सिंह",
            en: "Leo"
        },

        {
            index: 5,
            hi: "कन्या",
            en: "Virgo"
        },

        {
            index: 6,
            hi: "तुला",
            en: "Libra"
        },

        {
            index: 7,
            hi: "वृश्चिक",
            en: "Scorpio"
        },

        {
            index: 8,
            hi: "धनु",
            en: "Sagittarius"
        },

        {
            index: 9,
            hi: "मकर",
            en: "Capricorn"
        },

        {
            index: 10,
            hi: "कुंभ",
            en: "Aquarius"
        },

        {
            index: 11,
            hi: "मीन",
            en: "Pisces"
        }

    ];


    /* =====================================================
       GENERAL HELPERS
    ====================================================== */

    function getState() {

        if (
            window.KundliState &&
            typeof window.KundliState.getState === "function"
        ) {
            return window.KundliState.getState();
        }

        return null;
    }


    function getKundli() {

        const state = getState();

        if (!state) {
            return null;
        }

        return (
            state.kundliA ||
            state.kundli ||
            null
        );
    }


    function getPlanet(kundli, id) {

        if (
            !kundli ||
            !kundli.planets
        ) {
            return null;
        }

        return kundli.planets[id] || null;
    }


    function getPlanetHouse(kundli, id) {

        const planet =
            getPlanet(kundli, id);

        if (
            !planet ||
            !Number.isFinite(
                Number(planet.house)
            )
        ) {
            return null;
        }

        return Number(planet.house);
    }


    function getPlanetSignIndex(kundli, id) {

        const planet =
            getPlanet(kundli, id);

        if (
            !planet ||
            !planet.rashi
        ) {
            return null;
        }

        const index =
            Number(
                planet.rashi.index
            );

        return Number.isFinite(index)
            ? index
            : null;
    }


    function getAscendantSignIndex(kundli) {

        if (
            !kundli ||
            !kundli.lagna ||
            !kundli.lagna.rashi
        ) {
            return null;
        }

        const index =
            Number(
                kundli.lagna.rashi.index
            );

        return Number.isFinite(index)
            ? index
            : null;
    }


    function houseFromSign(
        planetSign,
        referenceSign
    ) {

        if (
            !Number.isFinite(
                Number(planetSign)
            ) ||
            !Number.isFinite(
                Number(referenceSign)
            )
        ) {
            return null;
        }

        return (
            (
                Number(planetSign) -
                Number(referenceSign) +
                12
            ) % 12
        ) + 1;
    }


    function getRashiName(index) {

        if (
            index === null ||
            index === undefined
        ) {
            return "—";
        }

        const rashi =
            RASHIS[index];

        if (!rashi) {
            return "—";
        }

        return rashi.hi;
    }


    function getPlanetName(id) {

        return (
            PLANET_NAMES[id] ||
            {
                hi: id,
                en: id
            }
        );
    }


    function getDegree(planet) {

        if (!planet) {
            return "—";
        }

        if (
            planet.degreeFormatted
        ) {
            return planet.degreeFormatted;
        }

        if (
            Number.isFinite(
                Number(planet.degree)
            )
        ) {
            return (
                Number(planet.degree)
                    .toFixed(2) +
                "°"
            );
        }

        return "—";
    }


    function sameHouse(
        kundli,
        planetA,
        planetB
    ) {

        const houseA =
            getPlanetHouse(
                kundli,
                planetA
            );

        const houseB =
            getPlanetHouse(
                kundli,
                planetB
            );

        return (
            houseA !== null &&
            houseB !== null &&
            houseA === houseB
        );
    }


    function hasAspectToHouse(
        kundli,
        planet,
        targetHouse
    ) {

        if (
            !kundli ||
            !Array.isArray(
                kundli.aspects
            )
        ) {
            return false;
        }

        return kundli.aspects.some(
            function (aspect) {

                return (
                    aspect &&
                    aspect.source === planet &&
                    Number(
                        aspect.targetHouse
                    ) === Number(
                        targetHouse
                    )
                );

            }
        );
    }


    function planetConnected(
        kundli,
        planetA,
        planetB
    ) {

        if (
            sameHouse(
                kundli,
                planetA,
                planetB
            )
        ) {
            return true;
        }

        const houseB =
            getPlanetHouse(
                kundli,
                planetB
            );

        const houseA =
            getPlanetHouse(
                kundli,
                planetA
            );

        if (
            houseA === null ||
            houseB === null
        ) {
            return false;
        }

        if (
            hasAspectToHouse(
                kundli,
                planetA,
                houseB
            )
        ) {
            return true;
        }

        if (
            hasAspectToHouse(
                kundli,
                planetB,
                houseA
            )
        ) {
            return true;
        }

        return false;
    }


    function makeResult(
        id,
        nameHi,
        nameEn,
        detected,
        description,
        basis,
        planets
    ) {

        return {

            id,

            nameHi,

            nameEn,

            detected: Boolean(
                detected
            ),

            description:
                description || "",

            basis:
                basis || "",

            planets:
                Array.isArray(planets)
                    ? planets
                    : []

        };

    }


    /* =====================================================
       1. MANGLIK
    ====================================================== */

    function detectManglik(kundli) {

        const mars =
            getPlanet(
                kundli,
                "Mars"
            );

        const moon =
            getPlanet(
                kundli,
                "Moon"
            );

        const venus =
            getPlanet(
                kundli,
                "Venus"
            );

        const lagnaSign =
            getAscendantSignIndex(
                kundli
            );

        const marsSign =
            getPlanetSignIndex(
                kundli,
                "Mars"
            );

        const moonSign =
            getPlanetSignIndex(
                kundli,
                "Moon"
            );

        const venusSign =
            getPlanetSignIndex(
                kundli,
                "Venus"
            );


        if (
            marsSign === null ||
            lagnaSign === null ||
            moonSign === null ||
            venusSign === null
        ) {

            return {

                result: makeResult(
                    "mangal-dosha",
                    "मंगल दोष",
                    "Mangal Dosha",
                    false,
                    "Mars reference data उपलब्ध नहीं है।",
                    "Calculation data incomplete.",
                    ["Mars"]
                ),

                details: null

            };

        }


        const fromLagna =
            houseFromSign(
                marsSign,
                lagnaSign
            );

        const fromMoon =
            houseFromSign(
                marsSign,
                moonSign
            );

        const fromVenus =
            houseFromSign(
                marsSign,
                venusSign
            );


        const affected = [

            fromLagna,
            fromMoon,
            fromVenus

        ].filter(function (house) {

            return [
                1,
                2,
                4,
                7,
                8,
                12
            ].includes(house);

        });


        const detected =
            affected.length > 0;


        let assessment =
            "Not indicated";


        if (
            affected.length >= 2
        ) {

            assessment =
                "Multiple traditional references";

        } else if (
            affected.length === 1
        ) {

            assessment =
                "Single traditional reference";

        }


        const basis =
            "Mars is in house " +
            fromLagna +
            " from Lagna, " +
            fromMoon +
            " from Moon and " +
            fromVenus +
            " from Venus. " +
            "Traditional reference houses: 1, 2, 4, 7, 8, 12.";


        return {

            result: makeResult(
                "mangal-dosha",
                "मंगल दोष",
                "Mangal Dosha",
                detected,
                "मंगल की स्थिति को लग्न, चंद्र और शुक्र से traditional reference houses के आधार पर देखा गया है।",
                basis,
                ["Mars"]
            ),

            details: {

                marsHouseFromLagna:
                    fromLagna,

                marsHouseFromMoon:
                    fromMoon,

                marsHouseFromVenus:
                    fromVenus,

                affectedReferences:
                    affected.length,

                assessment,

                marsRashi:
                    mars &&
                    mars.rashi
                        ? mars.rashi.name ||
                          mars.rashi.en ||
                          mars.rashi.hi
                        : "—",

                marsDegree:
                    getDegree(mars)

            }

        };

    }


    /* =====================================================
       2. GRAHAN DOSHA
    ====================================================== */

    function detectGrahan(kundli) {

        const sun =
            getPlanet(
                kundli,
                "Sun"
            );

        const moon =
            getPlanet(
                kundli,
                "Moon"
            );

        const rahu =
            getPlanet(
                kundli,
                "Rahu"
            );

        const ketu =
            getPlanet(
                kundli,
                "Ketu"
            );


        const sunRahu =
            sameHouse(
                kundli,
                "Sun",
                "Rahu"
            );

        const sunKetu =
            sameHouse(
                kundli,
                "Sun",
                "Ketu"
            );

        const moonRahu =
            sameHouse(
                kundli,
                "Moon",
                "Rahu"
            );

        const moonKetu =
            sameHouse(
                kundli,
                "Moon",
                "Ketu"
            );


        const detected =
            sunRahu ||
            sunKetu ||
            moonRahu ||
            moonKetu;


        const combinations = [];


        if (sunRahu) {
            combinations.push(
                "सूर्य + राहु"
            );
        }

        if (sunKetu) {
            combinations.push(
                "सूर्य + केतु"
            );
        }

        if (moonRahu) {
            combinations.push(
                "चंद्र + राहु"
            );
        }

        if (moonKetu) {
            combinations.push(
                "चंद्र + केतु"
            );
        }


        let basis;

        if (detected) {

            basis =
                combinations.join(
                    " • "
                ) +
                " एक ही भाव में स्थित हैं।";

        } else {

            basis =
                "सूर्य/चंद्र के साथ राहु या केतु की same-house conjunction नहीं मिली।";

        }


        return makeResult(
            "grahan-dosha",
            "ग्रहण दोष",
            "Grahan Dosha",
            detected,
            "सूर्य या चंद्रमा के साथ राहु/केतु की conjunction को देखा गया है।",
            basis,
            detected
                ? [
                    "Sun",
                    "Moon",
                    "Rahu",
                    "Ketu"
                ]
                : []
        );

    }


    /* =====================================================
       3. GURU CHANDAL
    ====================================================== */

    function detectGuruChandal(kundli) {

        const conjunction =
            sameHouse(
                kundli,
                "Jupiter",
                "Rahu"
            ) ||
            sameHouse(
                kundli,
                "Jupiter",
                "Ketu"
            );


        const jupiterHouse =
            getPlanetHouse(
                kundli,
                "Jupiter"
            );


        let aspectConnection =
            false;


        if (
            jupiterHouse !== null
        ) {

            aspectConnection =
                hasAspectToHouse(
                    kundli,
                    "Rahu",
                    jupiterHouse
                ) ||
                hasAspectToHouse(
                    kundli,
                    "Ketu",
                    jupiterHouse
                );

        }


        /*
         * For the actual chart engine, conjunction is
         * the primary node relationship.
         *
         * Rahu/Ketu special aspects are not assumed
         * unless the engine explicitly provides them.
         */

        const detected =
            conjunction;


        let basis;

        if (detected) {

            if (
                sameHouse(
                    kundli,
                    "Jupiter",
                    "Rahu"
                )
            ) {

                basis =
                    "गुरु और राहु एक ही भाव में स्थित हैं।";

            } else {

                basis =
                    "गुरु और केतु एक ही भाव में स्थित हैं।";

            }

        } else {

            basis =
                "गुरु के साथ राहु/केतु की same-house conjunction नहीं मिली।";

        }


        return makeResult(
            "guru-chandal",
            "गुरु चांडाल दोष",
            "Guru Chandal",
            detected,
            "गुरु के साथ राहु या केतु के संबंध को configured D1 rule के अनुसार देखा गया है।",
            basis,
            detected
                ? [
                    "Jupiter",
                    "Rahu",
                    "Ketu"
                ]
                : []
        );

    }


    /* =====================================================
       4. SHRAAPIT
    ====================================================== */

    function detectShrapit(kundli) {

        const conjunction =
            sameHouse(
                kundli,
                "Saturn",
                "Rahu"
            );


        let basis;

        if (conjunction) {

            basis =
                "शनि और राहु एक ही भाव में स्थित हैं।";

        } else {

            basis =
                "शनि और राहु की same-house conjunction नहीं मिली।";

        }


        return makeResult(
            "shrapit",
            "शापित दोष",
            "Shrapit Dosha",
            conjunction,
            "शनि और राहु की same-house conjunction को configured indicator के रूप में देखा गया है।",
            basis,
            conjunction
                ? [
                    "Saturn",
                    "Rahu"
                ]
                : []
        );

    }


    /* =====================================================
       5. KAAL SARP
    ====================================================== */

    function detectKaalSarp(kundli) {

        const rahu =
            getPlanet(
                kundli,
                "Rahu"
            );

        const ketu =
            getPlanet(
                kundli,
                "Ketu"
            );


        if (
            !rahu ||
            !ketu ||
            !rahu.rashi ||
            !ketu.rashi
        ) {

            return makeResult(
                "kaal-sarp",
                "काल सर्प दोष",
                "Kaal Sarp Dosha",
                false,
                "Rahu/Ketu axis data उपलब्ध नहीं है।",
                "Node position data incomplete.",
                []
            );

        }


        const rahuSign =
            Number(
                rahu.rashi.index
            );

        const ketuSign =
            Number(
                ketu.rashi.index
            );


        const planetIds = [
            "Sun",
            "Moon",
            "Mars",
            "Mercury",
            "Jupiter",
            "Venus",
            "Saturn"
        ];


        const positions =
            planetIds.map(
                function (id) {

                    const sign =
                        getPlanetSignIndex(
                            kundli,
                            id
                        );

                    return {
                        id,
                        sign
                    };

                }
            );


        /*
         * Strict sign-axis test:
         *
         * A planet is considered on Rahu side if
         * moving zodiacally from Rahu to Ketu it lies
         * strictly inside that arc.
         *
         * Boundary conjunctions are handled separately.
         */


        function isBetween(
            sign,
            start,
            end
        ) {

            const distance =
                (
                    sign -
                    start +
                    12
                ) % 12;

            const span =
                (
                    end -
                    start +
                    12
                ) % 12;

            return (
                distance > 0 &&
                distance < span
            );

        }


        const allInsideRahuToKetu =
            positions.every(
                function (item) {

                    return isBetween(
                        item.sign,
                        rahuSign,
                        ketuSign
                    );

                }
            );


        const allInsideKetuToRahu =
            positions.every(
                function (item) {

                    return isBetween(
                        item.sign,
                        ketuSign,
                        rahuSign
                    );

                }
            );


        /*
         * For a strict Kaal Sarp condition, all seven
         * classical planets must lie within one side
         * of the Rahu-Ketu axis.
         *
         * If a planet sits exactly on either node sign,
         * we do not automatically declare the condition.
         */

        const detected =
            allInsideRahuToKetu ||
            allInsideKetuToRahu;


        let basis;

        if (
            allInsideRahuToKetu
        ) {

            basis =
                "सातों classical planets Rahu से Ketu के zodiacal arc के भीतर हैं।";

        } else if (
            allInsideKetuToRahu
        ) {

            basis =
                "सातों classical planets Ketu से Rahu के zodiacal arc के भीतर हैं।";

        } else {

            basis =
                "सभी सात classical planets एक ही Rahu-Ketu side के भीतर नहीं हैं।";

        }


        return makeResult(
            "kaal-sarp",
            "काल सर्प दोष",
            "Kaal Sarp Dosha",
            detected,
            "Rahu-Ketu axis के दोनों ओर classical planets की स्थिति को strict sign-based rule से check किया गया है।",
            basis,
            detected
                ? [
                    "Rahu",
                    "Ketu"
                ]
                : []
        );

    }


    /* =====================================================
       6. PITRA DOSHA
    ====================================================== */

    function detectPitra(kundli) {

        const sun =
            getPlanet(
                kundli,
                "Sun"
            );

        const rahu =
            getPlanet(
                kundli,
                "Rahu"
            );

        const ketu =
            getPlanet(
                kundli,
                "Ketu"
            );


        const sunRahu =
            sameHouse(
                kundli,
                "Sun",
                "Rahu"
            );

        const sunKetu =
            sameHouse(
                kundli,
                "Sun",
                "Ketu"
            );


        /*
         * We deliberately keep this indicator narrow.
         *
         * Pitra Dosha has multiple traditions and
         * cancellation/strength considerations.
         *
         * This module therefore does NOT invent a broad
         * "Pitra Dosha" result from arbitrary conditions.
         */

        const detected =
            sunRahu ||
            sunKetu;


        let basis;

        if (sunRahu) {

            basis =
                "सूर्य और राहु एक ही भाव में स्थित हैं — configured Pitra indicator.";

        } else if (sunKetu) {

            basis =
                "सूर्य और केतु एक ही भाव में स्थित हैं — configured Pitra indicator.";

        } else {

            basis =
                "सूर्य और राहु/केतु की same-house conjunction नहीं मिली।";

        }


        return makeResult(
            "pitra",
            "पितृ दोष",
            "Pitra Dosha",
            detected,
            "यहाँ केवल स्पष्ट सूर्य-नोड conjunction को configured indicator माना गया है।",
            basis,
            detected
                ? [
                    "Sun",
                    "Rahu",
                    "Ketu"
                ]
                : []
        );

    }


    /* =====================================================
       7. NODE / PLANET CONJUNCTION DOSHAS
    ====================================================== */

    function detectNodeConjunctions(kundli) {

        const nodePairs = [

            [
                "Rahu",
                "Mars",
                "अंगारक संकेत"
            ],

            [
                "Ketu",
                "Mars",
                "मंगल-केतु संकेत"
            ],

            [
                "Rahu",
                "Jupiter",
                "गुरु-राहु संकेत"
            ],

            [
                "Ketu",
                "Jupiter",
                "गुरु-केतु संकेत"
            ],

            [
                "Rahu",
                "Saturn",
                "शनि-राहु संकेत"
            ]

        ];


        return nodePairs.map(
            function (pair) {

                const detected =
                    sameHouse(
                        kundli,
                        pair[0],
                        pair[1]
                    );

                return {

                    name:
                        pair[2],

                    detected,

                    planets: [
                        pair[0],
                        pair[1]
                    ]

                };

            }
        );

    }


    /* =====================================================
       COMPLETE ANALYSIS
    ====================================================== */

    function calculateDoshas(kundli) {

        const manglik =
            detectManglik(
                kundli
            );


        const results = [

            manglik.result,

            detectGrahan(
                kundli
            ),

            detectGuruChandal(
                kundli
            ),

            detectShrapit(
                kundli
            ),

            detectKaalSarp(
                kundli
            ),

            detectPitra(
                kundli
            )

        ];


        const detected =
            results.filter(
                function (item) {
                    return item.detected;
                }
            );


        const clear =
            results.filter(
                function (item) {
                    return !item.detected;
                }
            );


        const nodePairs =
            detectNodeConjunctions(
                kundli
            );


        return {

            results,

            detected,

            clear,

            manglik:
                manglik.details,

            nodePairs

        };

    }


    /* =====================================================
       RENDER HELPERS
    ====================================================== */

    function escapeHTML(value) {

        return String(
            value === null ||
            value === undefined
                ? ""
                : value
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


    function renderSummary(
        analysis,
        kundli
    ) {

        const detected =
            document.getElementById(
                "doshaDetectedCount"
            );

        const clear =
            document.getElementById(
                "doshaClearCount"
            );

        const manglik =
            document.getElementById(
                "doshaManglikCount"
            );

        const axis =
            document.getElementById(
                "doshaNodeAxis"
            );


        if (detected) {

            detected.textContent =
                analysis.detected.length;

        }


        if (clear) {

            clear.textContent =
                analysis.clear.length;

        }


        if (manglik) {

            manglik.textContent =
                analysis.manglik
                    ? analysis.manglik
                        .affectedReferences
                    : "—";

        }


        const rahuHouse =
            getPlanetHouse(
                kundli,
                "Rahu"
            );

        const ketuHouse =
            getPlanetHouse(
                kundli,
                "Ketu"
            );


        if (axis) {

            if (
                rahuHouse !== null &&
                ketuHouse !== null
            ) {

                axis.textContent =
                    "Rahu " +
                    rahuHouse +
                    " ↔ Ketu " +
                    ketuHouse;

            } else {

                axis.textContent =
                    "—";

            }

        }

    }


    function renderDoshaList(
        analysis
    ) {

        const container =
            document.getElementById(
                "doshaList"
            );


        if (!container) {
            return;
        }


        if (
            !analysis ||
            !Array.isArray(
                analysis.results
            ) ||
            analysis.results.length === 0
        ) {

            container.innerHTML = `
                <div class="dosha-empty">
                    Dosha calculation data उपलब्ध नहीं है।
                </div>
            `;

            return;

        }


        container.innerHTML =
            analysis.results.map(
                function (item) {

                    const statusClass =
                        item.detected
                            ? "detected"
                            : "clear";


                    const cardClass =
                        item.detected
                            ? "is-detected"
                            : "is-clear";


                    const statusText =
                        item.detected
                            ? "Detected"
                            : "Not Detected";


                    const chips =
                        item.planets
                            .map(
                                function (id) {

                                    const name =
                                        getPlanetName(
                                            id
                                        );

                                    return `
                                        <span
                                            class="dosha-planet-chip"
                                        >
                                            ${escapeHTML(
                                                name.hi
                                            )}
                                            ·
                                            ${escapeHTML(
                                                name.en
                                            )}
                                        </span>
                                    `;

                                }
                            )
                            .join("");


                    return `
                        <article
                            class="
                                dosha-card
                                ${cardClass}
                            "
                        >

                            <div
                                class="dosha-card-head"
                            >

                                <div
                                    class="dosha-card-title"
                                >

                                    <h4>
                                        ${escapeHTML(
                                            item.nameHi
                                        )}
                                    </h4>

                                    <span>
                                        ${escapeHTML(
                                            item.nameEn
                                        )}
                                    </span>

                                </div>


                                <span
                                    class="
                                        dosha-status
                                        ${statusClass}
                                    "
                                >
                                    ${statusText}
                                </span>

                            </div>


                            <p
                                class="dosha-card-description"
                            >
                                ${escapeHTML(
                                    item.description
                                )}
                            </p>


                            <div
                                class="dosha-basis"
                            >

                                <span
                                    class="dosha-basis-label"
                                >
                                    Calculated Basis
                                </span>

                                <p
                                    class="dosha-basis-text"
                                >
                                    ${escapeHTML(
                                        item.basis
                                    )}
                                </p>

                            </div>


                            ${
                                chips
                                    ? `
                                        <div
                                            class="dosha-planets"
                                        >
                                            ${chips}
                                        </div>
                                    `
                                    : ""
                            }

                        </article>
                    `;

                }
            )
            .join("");

    }


    /* =====================================================
       MANGLIK DETAIL
    ====================================================== */

    function renderManglikDetail(
        details
    ) {

        const container =
            document.getElementById(
                "doshaManglikDetail"
            );


        if (!container) {
            return;
        }


        if (!details) {

            container.innerHTML = `
                <div class="dosha-empty">
                    Manglik calculation उपलब्ध नहीं है।
                </div>
            `;

            return;

        }


        container.innerHTML = `

            <div class="dosha-detail-grid">

                <div
                    class="dosha-detail-item"
                >
                    <span>
                        Mars from Lagna
                    </span>

                    <strong>
                        House
                        ${escapeHTML(
                            details.marsHouseFromLagna
                        )}
                    </strong>
                </div>


                <div
                    class="dosha-detail-item"
                >
                    <span>
                        Mars from Moon
                    </span>

                    <strong>
                        House
                        ${escapeHTML(
                            details.marsHouseFromMoon
                        )}
                    </strong>
                </div>


                <div
                    class="dosha-detail-item"
                >
                    <span>
                        Mars from Venus
                    </span>

                    <strong>
                        House
                        ${escapeHTML(
                            details.marsHouseFromVenus
                        )}
                    </strong>
                </div>


                <div
                    class="dosha-detail-item"
                >
                    <span>
                        Affected References
                    </span>

                    <strong>
                        ${escapeHTML(
                            details.affectedReferences
                        )}
                    </strong>
                </div>


                <div
                    class="dosha-detail-item"
                >
                    <span>
                        Mars Rashi
                    </span>

                    <strong>
                        ${escapeHTML(
                            details.marsRashi
                        )}
                    </strong>
                </div>


                <div
                    class="dosha-detail-item"
                >
                    <span>
                        Mars Degree
                    </span>

                    <strong>
                        ${escapeHTML(
                            details.marsDegree
                        )}
                    </strong>
                </div>

            </div>


            <div
                class="dosha-basis"
                style="margin-top:14px;"
            >

                <span
                    class="dosha-basis-label"
                >
                    Assessment
                </span>

                <p
                    class="dosha-basis-text"
                >
                    ${escapeHTML(
                        details.assessment
                    )}
                </p>

            </div>

        `;

    }


    /* =====================================================
       NODE DETAIL
    ====================================================== */

    function renderNodeDetail(
        kundli,
        analysis
    ) {

        const container =
            document.getElementById(
                "doshaNodeDetail"
            );


        if (!container) {
            return;
        }


        const rahu =
            getPlanet(
                kundli,
                "Rahu"
            );

        const ketu =
            getPlanet(
                kundli,
                "Ketu"
            );


        if (!rahu || !ketu) {

            container.innerHTML = `
                <div class="dosha-empty">
                    Rahu/Ketu position data उपलब्ध नहीं है।
                </div>
            `;

            return;

        }


        const rahuHouse =
            getPlanetHouse(
                kundli,
                "Rahu"
            );

        const ketuHouse =
            getPlanetHouse(
                kundli,
                "Ketu"
            );


        const rahuSign =
            rahu.rashi &&
            Number.isFinite(
                Number(rahu.rashi.index)
            )
                ? getRashiName(
                    Number(
                        rahu.rashi.index
                    )
                )
                : "—";


        const ketuSign =
            ketu.rashi &&
            Number.isFinite(
                Number(ketu.rashi.index)
            )
                ? getRashiName(
                    Number(
                        ketu.rashi.index
                    )
                )
                : "—";


        const detectedPairs =
            analysis.nodePairs.filter(
                function (item) {
                    return item.detected;
                }
            );


        container.innerHTML = `

            <article class="dosha-node-card">

                <h4>
                    ☊ राहु
                </h4>

                <div
                    class="dosha-node-position"
                >

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            Rashi
                        </span>

                        <strong>
                            ${escapeHTML(
                                rahuSign
                            )}
                        </strong>
                    </div>

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            House
                        </span>

                        <strong>
                            ${escapeHTML(
                                rahuHouse
                            )}
                        </strong>
                    </div>

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            Degree
                        </span>

                        <strong>
                            ${escapeHTML(
                                getDegree(rahu)
                            )}
                        </strong>
                    </div>

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            Status
                        </span>

                        <strong>
                            Retrograde
                        </strong>
                    </div>

                </div>

            </article>


            <article class="dosha-node-card">

                <h4>
                    ☋ केतु
                </h4>

                <div
                    class="dosha-node-position"
                >

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            Rashi
                        </span>

                        <strong>
                            ${escapeHTML(
                                ketuSign
                            )}
                        </strong>
                    </div>

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            House
                        </span>

                        <strong>
                            ${escapeHTML(
                                ketuHouse
                            )}
                        </strong>
                    </div>

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            Degree
                        </span>

                        <strong>
                            ${escapeHTML(
                                getDegree(ketu)
                            )}
                        </strong>
                    </div>

                    <div
                        class="dosha-node-position-item"
                    >
                        <span>
                            Axis
                        </span>

                        <strong>
                            ${escapeHTML(
                                "House " +
                                rahuHouse +
                                " ↔ " +
                                ketuHouse
                            )}
                        </strong>
                    </div>

                </div>

            </article>


            <div
                class="dosha-card"
                style="grid-column:1 / -1;"
            >

                <div
                    class="dosha-card-head"
                >

                    <div
                        class="dosha-card-title"
                    >

                        <h4>
                            Node Relationships
                        </h4>

                        <span>
                            Calculated conjunction indicators
                        </span>

                    </div>

                </div>


                <div
                    class="dosha-planets"
                >

                    ${
                        detectedPairs.length
                            ? detectedPairs
                                .map(
                                    function (
                                        item
                                    ) {

                                        return `
                                            <span
                                                class="
                                                    dosha-planet-chip
                                                "
                                            >
                                                ✓
                                                ${escapeHTML(
                                                    item.name
                                                )}
                                            </span>
                                        `;

                                    }
                                )
                                .join("")
                            : `
                                <span
                                    class="
                                        dosha-planet-chip
                                    "
                                >
                                    No configured node conjunction
                                </span>
                            `
                    }

                </div>

            </div>

        `;

    }


    /* =====================================================
       PLANET TABLE
    ====================================================== */

    function renderPlanetTable(
        kundli
    ) {

        const container =
            document.getElementById(
                "doshaPlanetTable"
            );


        if (!container) {
            return;
        }


        if (
            !kundli ||
            !kundli.planets
        ) {

            container.innerHTML = `
                <div class="dosha-empty">
                    Planet calculation data उपलब्ध नहीं है।
                </div>
            `;

            return;

        }


        const rows =
            PLANETS.map(
                function (id) {

                    const planet =
                        getPlanet(
                            kundli,
                            id
                        );


                    if (!planet) {
                        return "";
                    }


                    const name =
                        getPlanetName(
                            id
                        );


                    const rashi =
                        planet.rashi
                            ? (
                                planet.rashi.hi ||
                                planet.rashi.name ||
                                getRashiName(
                                    planet.rashi.index
                                )
                            )
                            : "—";


                    const house =
                        getPlanetHouse(
                            kundli,
                            id
                        );


                    const retrograde =
                        planet.retrograde
                            ? `
                                <span
                                    class="
                                        dosha-retrograde
                                    "
                                >
                                    R
                                </span>
                            `
                            : "";


                    return `

                        <tr>

                            <td>
                                <strong>
                                    ${escapeHTML(
                                        name.hi
                                    )}
                                </strong>
                                <br>
                                ${escapeHTML(
                                    name.en
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    rashi
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    house
                                )}
                            </td>


                            <td>
                                ${escapeHTML(
                                    getDegree(
                                        planet
                                    )
                                )}
                            </td>


                            <td>
                                ${retrograde || "—"}
                            </td>

                        </tr>

                    `;

                }
            )
            .join("");


        container.innerHTML = `

            <table class="dosha-table">

                <thead>

                    <tr>

                        <th>
                            Planet
                        </th>

                        <th>
                            Rashi
                        </th>

                        <th>
                            House
                        </th>

                        <th>
                            Degree
                        </th>

                        <th>
                            Motion
                        </th>

                    </tr>

                </thead>

                <tbody>
                    ${rows}
                </tbody>

            </table>

        `;

    }


    /* =====================================================
       RULE COVERAGE
    ====================================================== */

    function renderRuleCoverage(
        analysis
    ) {

        const container =
            document.getElementById(
                "doshaRuleCoverage"
            );


        if (!container) {
            return;
        }


        const rules =
            analysis.results.map(
                function (item) {

                    return {

                        name:
                            item.nameHi,

                        detected:
                            item.detected

                    };

                }
            );


        container.innerHTML =
            rules.map(
                function (rule) {

                    return `

                        <div
                            class="dosha-rule-card"
                        >

                            <span
                                class="dosha-rule-name"
                            >
                                ${escapeHTML(
                                    rule.name
                                )}
                            </span>

                            <span
                                class="
                                    dosha-rule-result
                                    ${
                                        rule.detected
                                            ? "detected"
                                            : "clear"
                                    }
                                "
                            >
                                ${
                                    rule.detected
                                        ? "✓ Detected"
                                        : "Not detected"
                                }
                            </span>

                        </div>

                    `;

                }
            )
            .join("");

    }


    /* =====================================================
       ENGINE STATUS
    ====================================================== */

    function renderEngineStatus(
        kundli
    ) {

        const status =
            document.getElementById(
                "doshaEngineStatus"
            );


        if (!status) {
            return;
        }


        if (
            !kundli
        ) {

            status.textContent =
                "Calculation unavailable";

            return;

        }


        const engine =
            kundli.engine;


        if (engine) {

            status.textContent =
                (
                    engine.ayanamsha ||
                    "Lahiri"
                ) +
                " • " +
                (
                    engine.houseSystem ||
                    "Whole Sign"
                );

        } else {

            status.textContent =
                "D1 Calculated";

        }

    }


    /* =====================================================
       EMPTY STATE
    ====================================================== */

    function renderEmpty() {

        const list =
            document.getElementById(
                "doshaList"
            );


        if (list) {

            list.innerHTML = `

                <div
                    class="dosha-empty"
                >

                    <strong>
                        जन्म कुंडली उपलब्ध नहीं है।
                    </strong>

                    <br>

                    पहले Birth Details भरकर
                    Kundli Generate करें।

                </div>

            `;

        }


        [
            "doshaManglikDetail",
            "doshaNodeDetail",
            "doshaPlanetTable",
            "doshaRuleCoverage"

        ].forEach(
            function (id) {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {

                    element.innerHTML = "";

                }

            }
        );


        [
            "doshaDetectedCount",
            "doshaClearCount",
            "doshaManglikCount",
            "doshaNodeAxis"

        ].forEach(
            function (id) {

                const element =
                    document.getElementById(
                        id
                    );

                if (element) {

                    element.textContent =
                        "—";

                }

            }
        );

    }


    /* =====================================================
       MAIN INIT
    ====================================================== */

    function init() {

        const kundli =
            getKundli();


        if (!kundli) {

            renderEmpty();

            return;

        }


        try {

            const analysis =
                calculateDoshas(
                    kundli
                );


            renderEngineStatus(
                kundli
            );


            renderSummary(
                analysis,
                kundli
            );


            renderDoshaList(
                analysis
            );


            renderManglikDetail(
                analysis.manglik
            );


            renderNodeDetail(
                kundli,
                analysis
            );


            renderPlanetTable(
                kundli
            );


            renderRuleCoverage(
                analysis
            );


            console.log(
                "[Kundli Dosha] Calculated:",
                analysis
            );


        } catch (error) {

            console.error(
                "[Kundli Dosha] Error:",
                error
            );


            const list =
                document.getElementById(
                    "doshaList"
                );


            if (list) {

                list.innerHTML = `

                    <div
                        class="dosha-error"
                    >

                        Dosha calculation में error आया:
                        ${escapeHTML(
                            error.message
                        )}

                    </div>

                `;

            }

        }

    }


})(window);