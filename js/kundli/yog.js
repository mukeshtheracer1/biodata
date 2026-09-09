/* =========================================================
   VEDIC KUNDLI - YOG MODULE
   D1 CALCULATION BASED YOGA ENGINE
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       REGISTRATION
    ===================================================== */

    window.KundliYog = {
        init: init
    };

    window.KundliModules =
        window.KundliModules || {};

    window.KundliModules["yog"] = {
        init: init
    };


    /* =====================================================
       PLANETS
    ===================================================== */

    const PLANETS = [
        "Sun",
        "Moon",
        "Mars",
        "Mercury",
        "Jupiter",
        "Venus",
        "Saturn"
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


    /* =====================================================
       RASHIS
    ===================================================== */

    const RASHIS = [

        {
            index: 0,
            name: "Aries",
            hindi: "मेष",
            lord: "Mars"
        },

        {
            index: 1,
            name: "Taurus",
            hindi: "वृषभ",
            lord: "Venus"
        },

        {
            index: 2,
            name: "Gemini",
            hindi: "मिथुन",
            lord: "Mercury"
        },

        {
            index: 3,
            name: "Cancer",
            hindi: "कर्क",
            lord: "Moon"
        },

        {
            index: 4,
            name: "Leo",
            hindi: "सिंह",
            lord: "Sun"
        },

        {
            index: 5,
            name: "Virgo",
            hindi: "कन्या",
            lord: "Mercury"
        },

        {
            index: 6,
            name: "Libra",
            hindi: "तुला",
            lord: "Venus"
        },

        {
            index: 7,
            name: "Scorpio",
            hindi: "वृश्चिक",
            lord: "Mars"
        },

        {
            index: 8,
            name: "Sagittarius",
            hindi: "धनु",
            lord: "Jupiter"
        },

        {
            index: 9,
            name: "Capricorn",
            hindi: "मकर",
            lord: "Saturn"
        },

        {
            index: 10,
            name: "Aquarius",
            hindi: "कुंभ",
            lord: "Saturn"
        },

        {
            index: 11,
            name: "Pisces",
            hindi: "मीन",
            lord: "Jupiter"
        }

    ];


    /* =====================================================
       RULE DEFINITIONS
    ===================================================== */

    const RULES = [

        ["राज योग", "Raj Yoga"],
        ["धर्म-कर्माधिपति योग", "Dharma-Karmadhipati Yoga"],
        ["धन योग", "Dhana Yoga"],
        ["गजकेसरी योग", "Gajakesari Yoga"],
        ["बुधादित्य योग", "Budha-Aditya Yoga"],
        ["चंद्र मंगल योग", "Chandra-Mangala Yoga"],
        ["गुरु मंगल योग", "Guru-Mangala Yoga"],
        ["लक्ष्मी योग", "Lakshmi Yoga"],
        ["आधि योग", "Adhi Yoga"],
        ["अमल योग", "Amala Yoga"],
        ["परिवर्तन योग", "Parivartana Yoga"],
        ["विपरीत राज योग", "Viparita Raja Yoga"],
        ["हर्ष योग", "Harsha Yoga"],
        ["सरल योग", "Sarala Yoga"],
        ["विमल योग", "Vimala Yoga"],
        ["रुचक योग", "Ruchaka Yoga"],
        ["भद्र योग", "Bhadra Yoga"],
        ["हंस योग", "Hamsa Yoga"],
        ["मालव्य योग", "Malavya Yoga"],
        ["शश योग", "Shasha Yoga"],
        ["केमद्रुम योग", "Kemadruma Yoga"],
        ["वसुमति योग", "Vasumati Yoga"],
        ["शकट योग", "Shakata Yoga"],
        ["सरस्वती योग", "Saraswati Yoga"]
    ];


    /* =====================================================
       STATE
    ===================================================== */

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


    /* =====================================================
       BASIC HELPERS
    ===================================================== */

    function getPlanet(kundli, planet) {

        if (
            !kundli ||
            !kundli.planets
        ) {
            return null;
        }

        return kundli.planets[planet] || null;
    }


    function getHouse(kundli, planet) {

        const data =
            getPlanet(kundli, planet);

        if (!data) {
            return null;
        }

        const house =
            Number(data.house);

        return Number.isFinite(house)
            ? house
            : null;
    }


    function getRashiIndex(kundli, planet) {

        const data =
            getPlanet(kundli, planet);

        if (
            !data ||
            !data.rashi
        ) {
            return null;
        }

        const index =
            Number(data.rashi.index);

        return Number.isFinite(index)
            ? index
            : null;
    }


    function getAscendantIndex(kundli) {

        if (
            !kundli ||
            !kundli.lagna ||
            !kundli.lagna.rashi
        ) {
            return null;
        }

        const index =
            Number(kundli.lagna.rashi.index);

        return Number.isFinite(index)
            ? index
            : null;
    }


    function getPlanetName(planet) {

        return (
            PLANET_NAMES[planet] ||
            {
                hi: planet,
                en: planet
            }
        );
    }


    function getRashi(index) {

        return RASHIS[index] || null;
    }


    function normalizeHouse(house) {

        let value =
            Number(house);

        if (!Number.isFinite(value)) {
            return null;
        }

        while (value < 1) {
            value += 12;
        }

        while (value > 12) {
            value -= 12;
        }

        return value;
    }


    function relativeHouse(fromHouse, toHouse) {

        fromHouse =
            normalizeHouse(fromHouse);

        toHouse =
            normalizeHouse(toHouse);

        if (
            !fromHouse ||
            !toHouse
        ) {
            return null;
        }

        return (
            (
                toHouse -
                fromHouse +
                12
            ) % 12
        ) + 1;
    }


    function getPlanetHouseFromMoon(
        kundli,
        planet
    ) {

        const moonHouse =
            getHouse(kundli, "Moon");

        const planetHouse =
            getHouse(kundli, planet);

        return relativeHouse(
            moonHouse,
            planetHouse
        );
    }


    function getHouseLord(
        kundli,
        house
    ) {

        const lagnaIndex =
            getAscendantIndex(kundli);

        if (
            lagnaIndex === null
        ) {
            return null;
        }

        const signIndex =
            (
                lagnaIndex +
                Number(house) -
                1
            ) % 12;

        const rashi =
            getRashi(signIndex);

        return rashi
            ? rashi.lord
            : null;
    }


    function getPlanetHouseFromLord(
        kundli,
        house
    ) {

        const lord =
            getHouseLord(
                kundli,
                house
            );

        if (!lord) {
            return null;
        }

        return getHouse(
            kundli,
            lord
        );
    }


    /* =====================================================
       HOUSE CLASSIFICATION
    ===================================================== */

    function isKendra(house) {

        return [
            1,
            4,
            7,
            10
        ].includes(Number(house));
    }


    function isTrikona(house) {

        return [
            1,
            5,
            9
        ].includes(Number(house));
    }


    function isDusthana(house) {

        return [
            6,
            8,
            12
        ].includes(Number(house));
    }


    function isUpachaya(house) {

        return [
            3,
            6,
            10,
            11
        ].includes(Number(house));
    }


    function houseClass(house) {

        const kendra =
            isKendra(house);

        const trikona =
            isTrikona(house);

        const dusthana =
            isDusthana(house);

        if (
            kendra &&
            trikona
        ) {
            return "Kendra + Trikona";
        }

        if (kendra) {
            return "Kendra";
        }

        if (trikona) {
            return "Trikona";
        }

        if (dusthana) {
            return "Dusthana";
        }

        return "Other";
    }


    /* =====================================================
       CONNECTION / ASPECT
    ===================================================== */

    function sameHouse(
        kundli,
        planetA,
        planetB
    ) {

        const a =
            getHouse(kundli, planetA);

        const b =
            getHouse(kundli, planetB);

        return (
            a !== null &&
            b !== null &&
            a === b
        );
    }


    function hasAspect(
        kundli,
        sourcePlanet,
        targetPlanet
    ) {

        const sourceHouse =
            getHouse(
                kundli,
                sourcePlanet
            );

        const targetHouse =
            getHouse(
                kundli,
                targetPlanet
            );

        if (
            sourceHouse === null ||
            targetHouse === null
        ) {
            return false;
        }


        /*
         * Prefer engine-calculated
         * aspect table.
         */

        if (
            Array.isArray(kundli.aspects)
        ) {

            return kundli.aspects.some(
                function (aspect) {

                    return (
                        aspect.source ===
                            sourcePlanet &&
                        Number(
                            aspect.targetHouse
                        ) === targetHouse
                    );

                }
            );
        }


        /*
         * Fallback using classical
         * graha drishti.
         */

        const offset =
            relativeHouse(
                sourceHouse,
                targetHouse
            );

        if (!offset) {
            return false;
        }

        if (
            sourcePlanet === "Mars"
        ) {
            return [
                4,
                7,
                8
            ].includes(offset);
        }

        if (
            sourcePlanet === "Jupiter"
        ) {
            return [
                5,
                7,
                9
            ].includes(offset);
        }

        if (
            sourcePlanet === "Saturn"
        ) {
            return [
                3,
                7,
                10
            ].includes(offset);
        }

        return offset === 7;
    }


    function planetsConnected(
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

        return (
            hasAspect(
                kundli,
                planetA,
                planetB
            ) ||
            hasAspect(
                kundli,
                planetB,
                planetA
            )
        );
    }


    /* =====================================================
       RESULT FACTORY
    ===================================================== */

    function makeYoga(
        id,
        hi,
        en,
        category,
        description,
        basis,
        planets
    ) {

        return {
            id,
            hi,
            en,
            category,
            description,
            basis,
            planets:
                Array.isArray(planets)
                    ? planets
                    : []
        };
    }


    /* =====================================================
       RAJA YOGA
    ===================================================== */

    function detectRajYoga(kundli) {

        const results = [];

        const kendraLords = [
            getHouseLord(kundli, 1),
            getHouseLord(kundli, 4),
            getHouseLord(kundli, 7),
            getHouseLord(kundli, 10)
        ];

        const trikonaLords = [
            getHouseLord(kundli, 1),
            getHouseLord(kundli, 5),
            getHouseLord(kundli, 9)
        ];


        const seen = new Set();


        kendraLords.forEach(
            function (kendraLord) {

                if (!kendraLord) {
                    return;
                }

                trikonaLords.forEach(
                    function (trikonaLord) {

                        if (!trikonaLord) {
                            return;
                        }

                        if (
                            kendraLord ===
                            trikonaLord
                        ) {
                            return;
                        }

                        if (
                            !planetsConnected(
                                kundli,
                                kendraLord,
                                trikonaLord
                            )
                        ) {
                            return;
                        }

                        const key =
                            [
                                kendraLord,
                                trikonaLord
                            ]
                            .sort()
                            .join("-");

                        if (
                            seen.has(key)
                        ) {
                            return;
                        }

                        seen.add(key);

                        results.push(
                            makeYoga(
                                "raja-" +
                                    results.length,

                                "राज योग",
                                "Raja Yoga",
                                "Raj",

                                "केंद्र भावेश और त्रिकोण भावेश के बीच संबंध पाया गया है।",

                                buildConnectionBasis(
                                    kundli,
                                    kendraLord,
                                    trikonaLord
                                ),

                                [
                                    kendraLord,
                                    trikonaLord
                                ]
                            )
                        );

                    }
                );

            }
        );


        return results;
    }


    /* =====================================================
       DHARMA KARMADHIPATI
    ===================================================== */

    function detectDharmaKarmadhipati(
        kundli
    ) {

        const ninthLord =
            getHouseLord(kundli, 9);

        const tenthLord =
            getHouseLord(kundli, 10);


        if (
            !ninthLord ||
            !tenthLord ||
            ninthLord === tenthLord
        ) {
            return [];
        }


        if (
            !planetsConnected(
                kundli,
                ninthLord,
                tenthLord
            )
        ) {
            return [];
        }


        return [
            makeYoga(
                "dharma-karmadhipati",
                "धर्म-कर्माधिपति योग",
                "Dharma-Karmadhipati Yoga",
                "Raj",

                "नवम और दशम भाव के स्वामियों में संबंध पाया गया है।",

                `9वें भावेश ${getPlanetName(ninthLord).hi} और 10वें भावेश ${getPlanetName(tenthLord).hi} connected हैं।`,

                [
                    ninthLord,
                    tenthLord
                ]
            )
        ];
    }


    /* =====================================================
       DHANA YOGA
    ===================================================== */

    function detectDhanaYoga(kundli) {

        const results = [];

        const secondLord =
            getHouseLord(kundli, 2);

        const eleventhLord =
            getHouseLord(kundli, 11);

        const fifthLord =
            getHouseLord(kundli, 5);

        const ninthLord =
            getHouseLord(kundli, 9);


        const seen = new Set();


        function addDhana(
            planetA,
            planetB,
            reason
        ) {

            if (
                !planetA ||
                !planetB ||
                planetA === planetB
            ) {
                return;
            }

            if (
                !planetsConnected(
                    kundli,
                    planetA,
                    planetB
                )
            ) {
                return;
            }

            const key =
                [
                    planetA,
                    planetB
                ]
                .sort()
                .join("-");

            if (seen.has(key)) {
                return;
            }

            seen.add(key);

            results.push(
                makeYoga(
                    "dhana-" +
                        results.length,

                    "धन योग",
                    "Dhana Yoga",
                    "Wealth",

                    reason,

                    `${getPlanetName(planetA).hi} और ${getPlanetName(planetB).hi} connected हैं।`,

                    [
                        planetA,
                        planetB
                    ]
                )
            );
        }


        addDhana(
            secondLord,
            eleventhLord,
            "द्वितीय और एकादश भावेश में संबंध पाया गया है।"
        );


        [
            secondLord,
            eleventhLord
        ].forEach(
            function (wealthLord) {

                if (!wealthLord) {
                    return;
                }

                addDhana(
                    wealthLord,
                    fifthLord,
                    "धन भावेश का पंचम भावेश से संबंध पाया गया है।"
                );

                addDhana(
                    wealthLord,
                    ninthLord,
                    "धन भावेश का नवम भावेश से संबंध पाया गया है।"
                );

            }
        );


        return results;
    }


    /* =====================================================
       GAJAKESARI
    ===================================================== */

    function detectGajakesari(kundli) {

        const moonHouse =
            getHouse(kundli, "Moon");

        const jupiterHouse =
            getHouse(kundli, "Jupiter");


        const relative =
            relativeHouse(
                moonHouse,
                jupiterHouse
            );


        if (
            ![
                1,
                4,
                7,
                10
            ].includes(relative)
        ) {
            return [];
        }


        return [
            makeYoga(
                "gajakesari",
                "गजकेसरी योग",
                "Gajakesari Yoga",
                "Classical",

                "गुरु चंद्रमा से केंद्र स्थान में स्थित है।",

                `गुरु चंद्रमा से ${relative}वें स्थान पर है।`,

                [
                    "Moon",
                    "Jupiter"
                ]
            )
        ];
    }


    /* =====================================================
       BUDHA ADITYA
    ===================================================== */

    function detectBudhaAditya(kundli) {

        if (
            !sameHouse(
                kundli,
                "Sun",
                "Mercury"
            )
        ) {
            return [];
        }


        return [
            makeYoga(
                "budha-aditya",
                "बुधादित्य योग",
                "Budha-Aditya Yoga",
                "Intellect",

                "सूर्य और बुध एक ही भाव में स्थित हैं।",

                buildHouseBasis(
                    kundli,
                    "Sun",
                    "Mercury"
                ),

                [
                    "Sun",
                    "Mercury"
                ]
            )
        ];
    }


    /* =====================================================
       CHANDRA MANGALA
    ===================================================== */

    function detectChandraMangala(kundli) {

        if (
            !planetsConnected(
                kundli,
                "Moon",
                "Mars"
            )
        ) {
            return [];
        }


        return [
            makeYoga(
                "chandra-mangala",
                "चंद्र मंगल योग",
                "Chandra-Mangala Yoga",
                "Wealth",

                "चंद्रमा और मंगल का संबंध धन एवं कर्म संबंधी योग बनाता है।",

                buildConnectionBasis(
                    kundli,
                    "Moon",
                    "Mars"
                ),

                [
                    "Moon",
                    "Mars"
                ]
            )
        ];
    }


    /* =====================================================
       GURU MANGALA
    ===================================================== */

    function detectGuruMangala(kundli) {

        if (
            !planetsConnected(
                kundli,
                "Jupiter",
                "Mars"
            )
        ) {
            return [];
        }


        return [
            makeYoga(
                "guru-mangala",
                "गुरु मंगल योग",
                "Guru-Mangala Yoga",
                "Special",

                "गुरु और मंगल में संबंध पाया गया है।",

                "Jupiter and Mars are connected by conjunction or configured D1 aspect.",

                [
                    "Jupiter",
                    "Mars"
                ]
            )
        ];
    }


    /* =====================================================
       AMALA
    ===================================================== */

    function detectAmala(kundli) {

        const benefics = [
            "Jupiter",
            "Venus",
            "Mercury"
        ];

        const found = [];


        benefics.forEach(
            function (planet) {

                const lagnaHouse =
                    getHouse(
                        kundli,
                        planet
                    );

                const moonHouse =
                    getPlanetHouseFromMoon(
                        kundli,
                        planet
                    );


                if (
                    lagnaHouse === 10 ||
                    moonHouse === 10
                ) {

                    const reference =
                        lagnaHouse === 10
                            ? "Lagna"
                            : "Moon";

                    found.push({
                        planet,
                        reference
                    });

                }

            }
        );


        if (!found.length) {
            return [];
        }


        return found.map(
            function (item, index) {

                return makeYoga(
                    "amala-" + index,

                    "अमल योग",
                    "Amala Yoga",
                    "Reputation",

                    "दशम स्थान से शुभ ग्रह का संबंध पाया गया है।",

                    `${getPlanetName(item.planet).en} 10th from ${item.reference}`,

                    [
                        item.planet
                    ]
                );

            }
        );
    }


    /* =====================================================
       VASUMATI
    ===================================================== */

    function detectVasumati(kundli) {

        const benefics = [
            "Jupiter",
            "Venus",
            "Mercury"
        ];

        const found = [];


        benefics.forEach(
            function (planet) {

                const houseFromLagna =
                    getHouse(
                        kundli,
                        planet
                    );

                const houseFromMoon =
                    getPlanetHouseFromMoon(
                        kundli,
                        planet
                    );


                if (
                    isUpachaya(
                        houseFromLagna
                    )
                ) {

                    found.push(
                        `${getPlanetName(planet).en} in house ${houseFromLagna} from Lagna`
                    );

                    return;
                }


                if (
                    isUpachaya(
                        houseFromMoon
                    )
                ) {

                    found.push(
                        `${getPlanetName(planet).en} in house ${houseFromMoon} from Moon`
                    );

                }

            }
        );


        if (!found.length) {
            return [];
        }


        const planets =
            benefics.filter(
                function (planet) {

                    const h1 =
                        getHouse(
                            kundli,
                            planet
                        );

                    const h2 =
                        getPlanetHouseFromMoon(
                            kundli,
                            planet
                        );

                    return (
                        isUpachaya(h1) ||
                        isUpachaya(h2)
                    );

                }
            );


        return [
            makeYoga(
                "vasumati",
                "वसुमति योग",
                "Vasumati Yoga",
                "Wealth",

                "शुभ ग्रह उपचय भावों में स्थित हैं।",

                found.join("; "),

                planets
            )
        ];
    }


    /* =====================================================
       SHAKATA
    ===================================================== */

    function detectShakata(kundli) {

        const moonHouse =
            getHouse(kundli, "Moon");

        const jupiterHouse =
            getHouse(kundli, "Jupiter");

        const relative =
            relativeHouse(
                moonHouse,
                jupiterHouse
            );


        if (
            ![
                6,
                8,
                12
            ].includes(relative)
        ) {
            return [];
        }


        return [
            makeYoga(
                "shakata",
                "शकट योग",
                "Shakata Yoga",
                "Fluctuation",

                "गुरु चंद्रमा से 6, 8 या 12वें स्थान पर है।",

                `Jupiter Moon से ${relative}वें स्थान पर है।`,

                [
                    "Moon",
                    "Jupiter"
                ]
            )
        ];
    }


    /* =====================================================
       PARIVARTANA
       IMPORTANT: NO SELF EXCHANGE
    ===================================================== */

    function detectParivartana(kundli) {

        const results = [];

        const seen =
            new Set();


        PLANETS.forEach(
            function (planetA) {

                const dataA =
                    getPlanet(
                        kundli,
                        planetA
                    );

                if (
                    !dataA ||
                    !dataA.rashi
                ) {
                    return;
                }

                const rashiA =
                    Number(
                        dataA.rashi.index
                    );

                if (
                    !Number.isFinite(
                        rashiA
                    )
                ) {
                    return;
                }

                const lordA =
                    RASHIS[rashiA].lord;


                PLANETS.forEach(
                    function (planetB) {

                        /*
                         * CRITICAL FIX
                         */
                        if (
                            planetA ===
                            planetB
                        ) {
                            return;
                        }


                        const dataB =
                            getPlanet(
                                kundli,
                                planetB
                            );

                        if (
                            !dataB ||
                            !dataB.rashi
                        ) {
                            return;
                        }

                        const rashiB =
                            Number(
                                dataB.rashi.index
                            );

                        if (
                            !Number.isFinite(
                                rashiB
                            )
                        ) {
                            return;
                        }

                        const lordB =
                            RASHIS[rashiB].lord;


                        /*
                         * Actual exchange:
                         *
                         * A is in B's sign
                         * B is in A's sign
                         */

                        if (
                            lordA !==
                            planetB
                        ) {
                            return;
                        }

                        if (
                            lordB !==
                            planetA
                        ) {
                            return;
                        }


                        const key =
                            [
                                planetA,
                                planetB
                            ]
                            .sort()
                            .join("-");


                        if (
                            seen.has(key)
                        ) {
                            return;
                        }

                        seen.add(key);


                        const houseA =
                            getHouse(
                                kundli,
                                planetA
                            );

                        const houseB =
                            getHouse(
                                kundli,
                                planetB
                            );


                        results.push(
                            makeYoga(
                                "parivartana-" +
                                    results.length,

                                "परिवर्तन योग",
                                "Parivartana Yoga",
                                "Exchange",

                                `${getPlanetName(planetA).hi} और ${getPlanetName(planetB).hi} के बीच वास्तविक राशि परिवर्तन है।`,

                                `${planetA} is in ${planetB}-ruled sign and ${planetB} is in ${planetA}-ruled sign. Houses: ${houseA} ↔ ${houseB}.`,

                                [
                                    planetA,
                                    planetB
                                ]
                            )
                        );

                    }
                );

            }
        );


        return results;
    }


    /* =====================================================
       VIPARITA RAJA YOGA
    ===================================================== */

    function detectViparita(kundli) {

        const results = [];

        const types = [
            {
                house: 6,
                name: "हर्ष योग",
                en: "Harsha Yoga"
            },
            {
                house: 8,
                name: "सरल योग",
                en: "Sarala Yoga"
            },
            {
                house: 12,
                name: "विमल योग",
                en: "Vimala Yoga"
            }
        ];


        types.forEach(
            function (type) {

                const lord =
                    getHouseLord(
                        kundli,
                        type.house
                    );

                const lordHouse =
                    lord
                        ? getHouse(
                            kundli,
                            lord
                        )
                        : null;


                if (
                    !lord ||
                    !isDusthana(
                        lordHouse
                    )
                ) {
                    return;
                }


                results.push(
                    makeYoga(
                        "viparita-" +
                            type.house,

                        type.name,
                        type.en,
                        "Raj",

                        `${type.house}वें भावेश का दूसरे दुष्ट भाव में स्थित होना विपरीत योग की configured condition को पूरा करता है।`,

                        `${getPlanetName(lord).hi} ${lordHouse}वें भाव में स्थित है।`,

                        [
                            lord
                        ]
                    )
                );

            }
        );


        return results;
    }


    /* =====================================================
       PANCHA MAHAPURUSHA
    ===================================================== */

    function detectMahapurusha(kundli) {

        const rules = [

            {
                planet: "Mars",
                hi: "रुचक योग",
                en: "Ruchaka Yoga",
                own: [0, 7],
                exalted: 9
            },

            {
                planet: "Mercury",
                hi: "भद्र योग",
                en: "Bhadra Yoga",
                own: [2, 5],
                exalted: 5
            },

            {
                planet: "Jupiter",
                hi: "हंस योग",
                en: "Hamsa Yoga",
                own: [8, 11],
                exalted: 3
            },

            {
                planet: "Venus",
                hi: "मालव्य योग",
                en: "Malavya Yoga",
                own: [1, 6],
                exalted: 11
            },

            {
                planet: "Saturn",
                hi: "शश योग",
                en: "Shasha Yoga",
                own: [9, 10],
                exalted: 6
            }

        ];


        const results = [];


        rules.forEach(
            function (rule) {

                const house =
                    getHouse(
                        kundli,
                        rule.planet
                    );

                const rashi =
                    getRashiIndex(
                        kundli,
                        rule.planet
                    );


                if (
                    !isKendra(house)
                ) {
                    return;
                }


                const own =
                    rule.own.includes(
                        rashi
                    );

                const exalted =
                    rule.exalted ===
                    rashi;


                if (
                    !own &&
                    !exalted
                ) {
                    return;
                }


                const rashiData =
                    getRashi(rashi);


                results.push(
                    makeYoga(
                        "mahapurusha-" +
                            rule.planet,

                        rule.hi,
                        rule.en,
                        "Mahapurusha",

                        `${getPlanetName(rule.planet).hi} केंद्र में अपनी या उच्च राशि में स्थित है।`,

                        `${getPlanetName(rule.planet).en}: ${house}वां भाव, ${rashiData ? rashiData.hindi : "—"} राशि.`,

                        [
                            rule.planet
                        ]
                    )
                );

            }
        );


        return results;
    }


    /* =====================================================
       KEMADRUMA
    ===================================================== */

    function detectKemadruma(kundli) {

        const moonHouse =
            getHouse(kundli, "Moon");


        if (!moonHouse) {
            return [];
        }


        const adjacentHouses = [
            relativeHouse(
                moonHouse,
                moonHouse - 1
            ),
            relativeHouse(
                moonHouse,
                moonHouse + 1
            )
        ];


        const occupied =
            PLANETS.some(
                function (planet) {

                    if (
                        planet === "Moon"
                    ) {
                        return false;
                    }

                    const house =
                        getHouse(
                            kundli,
                            planet
                        );

                    return (
                        adjacentHouses.includes(
                            relativeHouse(
                                moonHouse,
                                house
                            )
                        )
                    );

                }
            );


        if (occupied) {
            return [];
        }


        return [
            makeYoga(
                "kemadruma",
                "केमद्रुम योग",
                "Kemadruma Yoga",
                "Moon",

                "चंद्रमा से 2nd और 12th स्थान पर सप्तग्रहों की अनुपस्थिति की configured condition मिली।",

                "No classical planets found immediately 2nd or 12th from Moon.",

                [
                    "Moon"
                ]
            )
        ];
    }


    /* =====================================================
       SARASWATI
    ===================================================== */

    function detectSaraswati(kundli) {

        const jupiter =
            getHouse(
                kundli,
                "Jupiter"
            );

        const venus =
            getHouse(
                kundli,
                "Venus"
            );

        const mercury =
            getHouse(
                kundli,
                "Mercury"
            );


        if (
            !jupiter ||
            !venus ||
            !mercury
        ) {
            return [];
        }


        const relevant =
            [jupiter, venus, mercury]
                .some(
                    function (house) {

                        return (
                            isKendra(house) ||
                            isTrikona(house)
                        );

                    }
                );


        if (!relevant) {
            return [];
        }


        return [
            makeYoga(
                "saraswati",
                "सरस्वती योग",
                "Saraswati Yoga",
                "Knowledge",

                "गुरु, शुक्र और बुध में से आवश्यक शुभ ग्रहों की केंद्र/त्रिकोण स्थिति की configured condition मिली।",

                `Jupiter=${jupiter}, Venus=${venus}, Mercury=${mercury} houses.`,

                [
                    "Jupiter",
                    "Venus",
                    "Mercury"
                ]
            )
        ];
    }


    /* =====================================================
       LAKSHMI
    ===================================================== */

    function detectLakshmi(kundli) {

        const ninthLord =
            getHouseLord(kundli, 9);

        const ninthHouse =
            ninthLord
                ? getHouse(
                    kundli,
                    ninthLord
                )
                : null;

        const lagnaLord =
            getHouseLord(kundli, 1);

        const lagnaHouse =
            lagnaLord
                ? getHouse(
                    kundli,
                    lagnaLord
                )
                : null;


        if (
            !ninthLord ||
            !lagnaLord
        ) {
            return [];
        }


        if (
            !isKendra(ninthHouse) &&
            !isTrikona(ninthHouse)
        ) {
            return [];
        }


        if (
            !isKendra(lagnaHouse) &&
            !isTrikona(lagnaHouse)
        ) {
            return [];
        }


        return [
            makeYoga(
                "lakshmi",
                "लक्ष्मी योग",
                "Lakshmi Yoga",
                "Wealth",

                "नवम भावेश और लग्नेश की configured शुभ केंद्र/त्रिकोण स्थिति मिली।",

                `${getPlanetName(ninthLord).hi} house ${ninthHouse}; ${getPlanetName(lagnaLord).hi} house ${lagnaHouse}.`,

                [
                    ninthLord,
                    lagnaLord
                ]
            )
        ];
    }


    /* =====================================================
       ADHI YOGA
    ===================================================== */

    function detectAdhi(kundli) {

        const moonHouse =
            getHouse(kundli, "Moon");


        if (!moonHouse) {
            return [];
        }


        const benefics = [
            "Jupiter",
            "Venus",
            "Mercury"
        ];


        const allPresent =
            benefics.every(
                function (planet) {

                    const house =
                        getHouse(
                            kundli,
                            planet
                        );

                    const relative =
                        relativeHouse(
                            moonHouse,
                            house
                        );

                    return [
                        6,
                        7,
                        8
                    ].includes(relative);

                }
            );


        if (!allPresent) {
            return [];
        }


        return [
            makeYoga(
                "adhi",
                "आधि योग",
                "Adhi Yoga",
                "Strength",

                "चंद्रमा से 6, 7 और 8 स्थानों में शुभ ग्रहों की configured स्थिति मिली।",

                "Benefic planets occupy the 6th, 7th and 8th positions from Moon.",

                benefics
            )
        ];
    }


    /* =====================================================
       DETECT ALL
    ===================================================== */

    function detectYogas(kundli) {

        const results = [];


        results.push(
            ...detectRajYoga(kundli)
        );

        results.push(
            ...detectDharmaKarmadhipati(kundli)
        );

        results.push(
            ...detectDhanaYoga(kundli)
        );

        results.push(
            ...detectGajakesari(kundli)
        );

        results.push(
            ...detectBudhaAditya(kundli)
        );

        results.push(
            ...detectChandraMangala(kundli)
        );

        results.push(
            ...detectGuruMangala(kundli)
        );

        results.push(
            ...detectAmala(kundli)
        );

        results.push(
            ...detectVasumati(kundli)
        );

        results.push(
            ...detectShakata(kundli)
        );

        results.push(
            ...detectParivartana(kundli)
        );

        results.push(
            ...detectViparita(kundli)
        );

        results.push(
            ...detectMahapurusha(kundli)
        );

        results.push(
            ...detectKemadruma(kundli)
        );

        results.push(
            ...detectSaraswati(kundli)
        );

        results.push(
            ...detectLakshmi(kundli)
        );

        results.push(
            ...detectAdhi(kundli)
        );


        return results;
    }


    /* =====================================================
       BASIS HELPERS
    ===================================================== */

    function buildConnectionBasis(
        kundli,
        planetA,
        planetB
    ) {

        const houseA =
            getHouse(
                kundli,
                planetA
            );

        const houseB =
            getHouse(
                kundli,
                planetB
            );


        const aName =
            getPlanetName(
                planetA
            ).hi;

        const bName =
            getPlanetName(
                planetB
            ).hi;


        if (
            houseA === houseB
        ) {

            return `${aName} और ${bName} एक ही भाव (${houseA}) में स्थित हैं।`;

        }


        if (
            hasAspect(
                kundli,
                planetA,
                planetB
            )
        ) {

            return `${aName} ${bName} पर configured ग्रह-दृष्टि डाल रहा है।`;

        }


        if (
            hasAspect(
                kundli,
                planetB,
                planetA
            )
        ) {

            return `${bName} ${aName} पर configured ग्रह-दृष्टि डाल रहा है।`;

        }


        return `${aName} और ${bName} के बीच D1 संबंध पाया गया।`;
    }


    function buildHouseBasis(
        kundli,
        planetA,
        planetB
    ) {

        return (
            `${getPlanetName(planetA).hi} ` +
            `house ${getHouse(kundli, planetA)}; ` +
            `${getPlanetName(planetB).hi} ` +
            `house ${getHouse(kundli, planetB)}.`
        );
    }


    /* =====================================================
       CONJUNCTIONS
    ===================================================== */

    function getConjunctions(kundli) {

        const result = [];

        for (
            let i = 0;
            i < PLANETS.length;
            i++
        ) {

            for (
                let j = i + 1;
                j < PLANETS.length;
                j++
            ) {

                const a =
                    PLANETS[i];

                const b =
                    PLANETS[j];


                if (
                    sameHouse(
                        kundli,
                        a,
                        b
                    )
                ) {

                    result.push({
                        a,
                        b,
                        house:
                            getHouse(
                                kundli,
                                a
                            )
                    });

                }

            }

        }


        return result;
    }


    /* =====================================================
       HOUSE LORD DATA
    ===================================================== */

    function getHouseLordRows(kundli) {

        const rows = [];

        for (
            let house = 1;
            house <= 12;
            house++
        ) {

            const lagnaIndex =
                getAscendantIndex(
                    kundli
                );

            if (
                lagnaIndex === null
            ) {
                continue;
            }


            const signIndex =
                (
                    lagnaIndex +
                    house -
                    1
                ) % 12;


            const rashi =
                getRashi(
                    signIndex
                );

            const lord =
                rashi
                    ? rashi.lord
                    : null;

            const lordHouse =
                lord
                    ? getHouse(
                        kundli,
                        lord
                    )
                    : null;


            rows.push({
                house,
                rashi,
                lord,
                lordHouse,
                className:
                    houseClass(
                        house
                    )
            });

        }


        return rows;
    }


    /* =====================================================
       RULE COVERAGE
    ===================================================== */

    function renderRuleCoverage(
        yogas
    ) {

        const container =
            document.getElementById(
                "yogRuleCoverage"
            );

        if (!container) {
            return;
        }


        container.innerHTML = "";


        RULES.forEach(
            function (rule) {

                const hi =
                    rule[0];

                const en =
                    rule[1];


                const detected =
                    yogas.some(
                        function (yoga) {

                            return (
                                yoga.hi === hi ||
                                yoga.en === en
                            );

                        }
                    );


                const item =
                    document.createElement(
                        "div"
                    );

                item.className =
                    "yog-rule";


                item.innerHTML = `
                    <span class="yog-rule-name">
                        ${escapeHtml(hi)}
                    </span>

                    <span class="yog-rule-status ${
                        detected
                            ? "detected"
                            : "not-detected"
                    }">
                        ${
                            detected
                                ? "✓ Detected"
                                : "Not detected"
                        }
                    </span>
                `;


                container.appendChild(
                    item
                );

            }
        );
    }


    /* =====================================================
       RENDER YOGA LIST
    ===================================================== */

    function renderYogaList(
        yogas
    ) {

        const container =
            document.getElementById(
                "yogList"
            );

        if (!container) {
            return;
        }


        container.innerHTML = "";


        if (!yogas.length) {

            container.innerHTML = `
                <div class="yog-empty">
                    <div class="yog-empty-icon">
                        —
                    </div>

                    <h3>
                        कोई configured Yoga detect नहीं हुआ
                    </h3>

                    <p>
                        वर्तमान D1 planetary positions
                        के अनुसार configured rules में
                        कोई योग match नहीं हुआ।
                    </p>
                </div>
            `;

            return;
        }


        yogas.forEach(
            function (yoga) {

                const card =
                    document.createElement(
                        "article"
                    );

                card.className =
                    "yog-card";


                const planets =
                    yoga.planets
                        .map(
                            function (planet) {

                                const name =
                                    getPlanetName(
                                        planet
                                    );

                                const house =
                                    getHouse(
                                        getKundli(),
                                        planet
                                    );


                                return `
                                    <span class="yog-planet-chip">
                                        ${escapeHtml(name.hi)}
                                        <small>
                                            ${escapeHtml(name.en)}
                                            ${
                                                house
                                                    ? " · H" + house
                                                    : ""
                                            }
                                        </small>
                                    </span>
                                `;

                            }
                        )
                        .join("");


                card.innerHTML = `

                    <div class="yog-card-top">

                        <div class="yog-card-title">

                            <span class="hi">
                                ${escapeHtml(yoga.hi)}
                            </span>

                            <span class="en">
                                ${escapeHtml(yoga.en)}
                            </span>

                        </div>

                        <span class="yog-card-category">
                            ${escapeHtml(yoga.category)}
                        </span>

                    </div>


                    <p class="yog-card-description">
                        ${escapeHtml(yoga.description)}
                    </p>


                    <div class="yog-basis">

                        <strong>
                            Basis:
                        </strong>

                        ${escapeHtml(yoga.basis)}

                    </div>


                    <div class="yog-planets">
                        ${planets}
                    </div>

                `;


                container.appendChild(
                    card
                );

            }
        );
    }


    /* =====================================================
       RENDER COMBINATIONS
    ===================================================== */

    function renderCombinations(
        kundli
    ) {

        const container =
            document.getElementById(
                "yogCombinations"
            );

        if (!container) {
            return;
        }


        const combinations =
            getConjunctions(
                kundli
            );


        container.innerHTML = "";


        if (!combinations.length) {

            container.innerHTML = `
                <div class="yog-combination">
                    कोई planetary conjunction नहीं।
                </div>
            `;

            return;
        }


        combinations.forEach(
            function (item) {

                const a =
                    getPlanetName(
                        item.a
                    );

                const b =
                    getPlanetName(
                        item.b
                    );


                const element =
                    document.createElement(
                        "div"
                    );

                element.className =
                    "yog-combination";


                element.innerHTML = `
                    <strong>
                        ${escapeHtml(a.hi)}
                        +
                        ${escapeHtml(b.hi)}
                    </strong>

                    <span>
                        ${escapeHtml(a.en)}
                        +
                        ${escapeHtml(b.en)}
                        —
                        ${item.house}वां भाव
                    </span>
                `;


                container.appendChild(
                    element
                );

            }
        );
    }


    /* =====================================================
       RENDER HOUSE LORDS
    ===================================================== */

    function renderHouseLords(
        kundli
    ) {

        const tbody =
            document.getElementById(
                "houseLordTable"
            );

        if (!tbody) {
            return;
        }


        const rows =
            getHouseLordRows(
                kundli
            );


        tbody.innerHTML = "";


        rows.forEach(
            function (row) {

                const tr =
                    document.createElement(
                        "tr"
                    );


                const lordName =
                    row.lord
                        ? getPlanetName(
                            row.lord
                        )
                        : {
                            hi: "—",
                            en: "—"
                        };


                tr.innerHTML = `

                    <td class="house-number">
                        ${row.house}
                    </td>

                    <td>
                        ${
                            row.rashi
                                ? escapeHtml(
                                    row.rashi.hindi
                                )
                                : "—"
                        }
                    </td>

                    <td class="lord">
                        ${escapeHtml(lordName.hi)}
                        <small>
                            ${escapeHtml(lordName.en)}
                        </small>
                    </td>

                    <td>
                        ${
                            row.lordHouse ||
                            "—"
                        }
                    </td>

                    <td>
                        <span class="yog-class">
                            ${escapeHtml(
                                row.className
                            )}
                        </span>
                    </td>

                `;


                tbody.appendChild(
                    tr
                );

            }
        );
    }


    /* =====================================================
       HIGHLIGHTS
    ===================================================== */

    function renderHighlights(
        yogas
    ) {

        const container =
            document.getElementById(
                "yogHighlights"
            );

        if (!container) {
            return;
        }


        const rajCount =
            yogas.filter(
                function (yoga) {
                    return (
                        yoga.category ===
                        "Raj"
                    );
                }
            ).length;


        const wealthCount =
            yogas.filter(
                function (yoga) {
                    return (
                        yoga.category ===
                        "Wealth"
                    );
                }
            ).length;


        const special =
            yogas
                .filter(
                    function (yoga) {
                        return (
                            yoga.category ===
                            "Special"
                        );
                    }
                )
                .map(
                    function (yoga) {
                        return yoga.hi;
                    }
                );


        const mahapurusha =
            yogas
                .filter(
                    function (yoga) {
                        return (
                            yoga.category ===
                            "Mahapurusha"
                        );
                    }
                )
                .map(
                    function (yoga) {
                        return yoga.hi;
                    }
                );


        container.innerHTML = `

            <div class="yog-highlight">

                <div class="yog-highlight-title">
                    राज योग
                </div>

                <div class="yog-highlight-value">
                    ${rajCount}
                    Raj/Career Yoga condition(s)
                    detected.
                </div>

            </div>


            <div class="yog-highlight">

                <div class="yog-highlight-title">
                    धन / समृद्धि
                </div>

                <div class="yog-highlight-value">
                    ${wealthCount}
                    wealth/prosperity condition(s)
                    detected.
                </div>

            </div>


            <div class="yog-highlight">

                <div class="yog-highlight-title">
                    विशेष योग
                </div>

                <div class="yog-highlight-value">
                    ${
                        special.length
                            ? special.join(" • ")
                            : "None detected"
                    }
                </div>

            </div>


            <div class="yog-highlight">

                <div class="yog-highlight-title">
                    पंच महापुरुष
                </div>

                <div class="yog-highlight-value">
                    ${
                        mahapurusha.length
                            ? mahapurusha.join(" • ")
                            : "None detected"
                    }
                </div>

            </div>

        `;
    }


    /* =====================================================
       SUMMARY
    ===================================================== */

    function renderSummary(
        kundli,
        yogas
    ) {

        const count =
            document.getElementById(
                "yogCount"
            );

        const rajCount =
            document.getElementById(
                "yogRajCount"
            );

        const lagna =
            document.getElementById(
                "yogLagna"
            );

        const mahapurusha =
            document.getElementById(
                "yogMahapurushaCount"
            );


        if (count) {
            count.textContent =
                yogas.length;
        }


        if (rajCount) {

            rajCount.textContent =
                yogas.filter(
                    function (yoga) {

                        return (
                            yoga.category ===
                            "Raj"
                        );

                    }
                ).length;

        }


        if (lagna) {

            const index =
                getAscendantIndex(
                    kundli
                );

            const rashi =
                getRashi(index);

            lagna.textContent =
                rashi
                    ? rashi.hindi
                    : "—";

        }


        if (mahapurusha) {

            mahapurusha.textContent =
                yogas.filter(
                    function (yoga) {

                        return (
                            yoga.category ===
                            "Mahapurusha"
                        );

                    }
                ).length;

        }

    }


    /* =====================================================
       ESCAPE HTML
    ===================================================== */

    function escapeHtml(value) {

        return String(
            value === undefined ||
            value === null
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


    /* =====================================================
       INIT
    ===================================================== */

    function init() {

        const content =
            document.getElementById(
                "yogContent"
            );

        const empty =
            document.getElementById(
                "yogEmpty"
            );


        const kundli =
            getKundli();


        if (
            !kundli ||
            !kundli.planets ||
            !kundli.lagna
        ) {

            if (content) {
                content.hidden = true;
            }

            if (empty) {
                empty.hidden = false;
            }

            return;
        }


        if (empty) {
            empty.hidden = true;
        }

        if (content) {
            content.hidden = false;
        }


        try {

            const yogas =
                detectYogas(
                    kundli
                );


            renderSummary(
                kundli,
                yogas
            );

            renderYogaList(
                yogas
            );

            renderCombinations(
                kundli
            );

            renderHouseLords(
                kundli
            );

            renderRuleCoverage(
                yogas
            );

            renderHighlights(
                yogas
            );


            console.log(
                "[Kundli Yog] Calculated:",
                yogas
            );

        } catch (error) {

            console.error(
                "[Kundli Yog] Error:",
                error
            );


            if (content) {
                content.hidden = false;
            }

            const list =
                document.getElementById(
                    "yogList"
                );

            if (list) {

                list.innerHTML = `
                    <div class="yog-empty">

                        <div class="yog-empty-icon">
                            ⚠
                        </div>

                        <h3>
                            Yoga calculation error
                        </h3>

                        <p>
                            ${escapeHtml(
                                error.message ||
                                "Unknown calculation error"
                            )}
                        </p>

                    </div>
                `;

            }

        }

    }


})();