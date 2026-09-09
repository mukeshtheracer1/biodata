/* =========================================================
   GUN MILAN
   Ashtakoota / 36 Guna
   Data Source:
   KundliState.personA
   KundliState.kundliA
   KundliState.personB
   KundliState.kundliB

   NO MANUAL DATA ENTRY
   NO RANDOM DATA
   NO DUMMY SCORES
========================================================= */

(function (window, document) {

    "use strict";


    /* =====================================================
       CONTROLLER
    ===================================================== */

    const CONTROLLER = {

        init,

        render

    };


    /* =====================================================
       CONSTANTS
    ===================================================== */

    const RASHI_NAMES = [
        "Mesha",
        "Vrishabha",
        "Mithuna",
        "Karka",
        "Simha",
        "Kanya",
        "Tula",
        "Vrishchika",
        "Dhanu",
        "Makara",
        "Kumbha",
        "Meena"
    ];

    const RASHI_HINDI = [
        "मेष",
        "वृषभ",
        "मिथुन",
        "कर्क",
        "सिंह",
        "कन्या",
        "तुला",
        "वृश्चिक",
        "धनु",
        "मकर",
        "कुंभ",
        "मीन"
    ];


    /*
     * Varna order:
     *
     * Brahmin  = 4
     * Kshatriya = 3
     * Vaishya = 2
     * Shudra = 1
     *
     * Rashi classification.
     */
    const VARNA_BY_RASHI = [
        3, // Mesha
        1, // Vrishabha
        2, // Mithuna
        4, // Karka
        3, // Simha
        1, // Kanya
        2, // Tula
        4, // Vrishchika
        3, // Dhanu
        1, // Makara
        2, // Kumbha
        4  // Meena
    ];


    const VARNA_NAME = {
        1: "Shudra / शूद्र",
        2: "Vaishya / वैश्य",
        3: "Kshatriya / क्षत्रिय",
        4: "Brahmin / ब्राह्मण"
    };


    /*
     * Sign Lords
     */
    const SIGN_LORD = [
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


    /*
     * Natural planetary relationship.
     *
     *  1  = Friend
     *  0  = Neutral
     * -1  = Enemy
     */
    const PLANET_FRIENDSHIP = {

        Sun: {
            Sun: 1,
            Moon: 1,
            Mars: 1,
            Mercury: 0,
            Jupiter: 1,
            Venus: -1,
            Saturn: -1
        },

        Moon: {
            Sun: 1,
            Moon: 1,
            Mars: 0,
            Mercury: 1,
            Jupiter: 0,
            Venus: 0,
            Saturn: 0
        },

        Mars: {
            Sun: 1,
            Moon: 1,
            Mars: 1,
            Mercury: -1,
            Jupiter: 1,
            Venus: 0,
            Saturn: 0
        },

        Mercury: {
            Sun: 1,
            Moon: 0,
            Mars: 0,
            Mercury: 1,
            Jupiter: 0,
            Venus: 1,
            Saturn: 1
        },

        Jupiter: {
            Sun: 1,
            Moon: 1,
            Mars: 1,
            Mercury: -1,
            Jupiter: 1,
            Venus: -1,
            Saturn: 0
        },

        Venus: {
            Sun: -1,
            Moon: 0,
            Mars: 0,
            Mercury: 1,
            Jupiter: -1,
            Venus: 1,
            Saturn: 1
        },

        Saturn: {
            Sun: -1,
            Moon: 0,
            Mars: -1,
            Mercury: 1,
            Jupiter: 0,
            Venus: 1,
            Saturn: 1
        }

    };


    /*
     * Nakshatra fallback data.
     *
     * Engine data is preferred.
     * These values are only used if an older saved
     * Kundli object does not contain Gana/Yoni/Nadi.
     */

    const NAKSHATRA_DATA = [

        ["Ashwini", "अश्विनी", "Ketu", "Deva", "Horse", "Ashwini"],
        ["Bharani", "भरणी", "Venus", "Manushya", "Elephant", "Bharani"],
        ["Krittika", "कृत्तिका", "Sun", "Deva", "Sheep", "Krittika"],
        ["Rohini", "रोहिणी", "Moon", "Manushya", "Serpent", "Rohini"],
        ["Mrigashira", "मृगशिरा", "Mars", "Deva", "Serpent", "Mrigashira"],
        ["Ardra", "आर्द्रा", "Rahu", "Manushya", "Dog", "Ardra"],
        ["Punarvasu", "पुनर्वसु", "Jupiter", "Deva", "Cat", "Punarvasu"],
        ["Pushya", "पुष्य", "Saturn", "Deva", "Sheep", "Pushya"],
        ["Ashlesha", "आश्लेषा", "Mercury", "Rakshasa", "Cat", "Ashlesha"],
        ["Magha", "मघा", "Ketu", "Rakshasa", "Rat", "Magha"],
        ["Purva Phalguni", "पूर्व फाल्गुनी", "Venus", "Manushya", "Rat", "Purva Phalguni"],
        ["Uttara Phalguni", "उत्तर फाल्गुनी", "Sun", "Manushya", "Cow", "Uttara Phalguni"],
        ["Hasta", "हस्त", "Moon", "Deva", "Buffalo", "Hasta"],
        ["Chitra", "चित्रा", "Mars", "Rakshasa", "Tiger", "Chitra"],
        ["Swati", "स्वाती", "Rahu", "Deva", "Buffalo", "Swati"],
        ["Vishakha", "विशाखा", "Jupiter", "Rakshasa", "Tiger", "Vishakha"],
        ["Anuradha", "अनुराधा", "Saturn", "Deva", "Deer", "Anuradha"],
        ["Jyeshtha", "ज्येष्ठा", "Mercury", "Rakshasa", "Deer", "Jyeshtha"],
        ["Mula", "मूल", "Ketu", "Rakshasa", "Dog", "Mula"],
        ["Purva Ashadha", "पूर्वाषाढ़ा", "Venus", "Manushya", "Monkey", "Purva Ashadha"],
        ["Uttara Ashadha", "उत्तराषाढ़ा", "Sun", "Manushya", "Mongoose", "Uttara Ashadha"],
        ["Shravana", "श्रवण", "Moon", "Deva", "Monkey", "Shravana"],
        ["Dhanishta", "धनिष्ठा", "Mars", "Rakshasa", "Lion", "Dhanishta"],
        ["Shatabhisha", "शतभिषा", "Rahu", "Rakshasa", "Horse", "Shatabhisha"],
        ["Purva Bhadrapada", "पूर्व भाद्रपद", "Jupiter", "Manushya", "Lion", "Purva Bhadrapada"],
        ["Uttara Bhadrapada", "उत्तर भाद्रपद", "Saturn", "Manushya", "Cow", "Uttara Bhadrapada"],
        ["Revati", "रेवती", "Mercury", "Deva", "Elephant", "Revati"]

    ].map(function (item, index) {

        return {

            index,

            name: item[0],

            hindi: item[1],

            lord: item[2],

            gana: item[3],

            yoni: item[4],

            nadi: item[5]

        };

    });


    /*
     * Correct Nadi mapping.
     *
     * Engine's Nadi names are preferred.
     */
    const NADI_BY_INDEX = [
        "Adi",
        "Madhya",
        "Antya",
        "Antya",
        "Madhya",
        "Adi",
        "Adi",
        "Madhya",
        "Antya",
        "Antya",
        "Madhya",
        "Adi",
        "Adi",
        "Madhya",
        "Antya",
        "Antya",
        "Madhya",
        "Adi",
        "Adi",
        "Madhya",
        "Antya",
        "Antya",
        "Madhya",
        "Adi",
        "Adi",
        "Madhya",
        "Antya"
    ];


    const NADI_HINDI = {
        Adi: "आदि",
        Madhya: "मध्य",
        Antya: "अंत्य"
    };


    const GANA_HINDI = {
        Deva: "देव",
        Manushya: "मनुष्य",
        Rakshasa: "राक्षस"
    };


    const YONI_HINDI = {
        Horse: "घोड़ा",
        Elephant: "हाथी",
        Sheep: "भेड़",
        Serpent: "सर्प",
        Dog: "कुत्ता",
        Cat: "बिल्ली",
        Rat: "चूहा",
        Cow: "गाय",
        Buffalo: "भैंस",
        Tiger: "बाघ",
        Deer: "हिरण",
        Monkey: "वानर",
        Mongoose: "नेवला",
        Lion: "सिंह"
    };


    /*
     * Traditional Vashya classes.
     *
     * Sagittarius and Capricorn are split by degree.
     */
    const VASHYA_GROUPS = {

        Manava: "Manava / मानव",

        Chatushpada: "Chatushpada / चतुष्पद",

        Jalachara: "Jalachara / जलचर",

        Vanachara: "Vanachara / वनचर",

        Keeta: "Keeta / कीट"

    };


    /*
     * Classical Vashya scoring matrix.
     */
    const VASHYA_SCORE = {

        Chatushpada: {
            Chatushpada: 2,
            Manava: 1,
            Jalachara: 1,
            Vanachara: 1.5,
            Keeta: 1
        },

        Manava: {
            Chatushpada: 1,
            Manava: 2,
            Jalachara: 1.5,
            Vanachara: 0,
            Keeta: 1
        },

        Jalachara: {
            Chatushpada: 1,
            Manava: 1.5,
            Jalachara: 2,
            Vanachara: 1,
            Keeta: 1
        },

        Vanachara: {
            Chatushpada: 0,
            Manava: 0,
            Jalachara: 1,
            Vanachara: 2,
            Keeta: 0
        },

        Keeta: {
            Chatushpada: 1,
            Manava: 1,
            Jalachara: 1,
            Vanachara: 0,
            Keeta: 2
        }

    };


    /*
     * Yoni:
     *
     * Same = 4
     * Friend = 3
     * Neutral = 2
     * Enemy = 1
     * Bitter enemy = 0
     */
    const YONI_FRIEND_PAIRS = [

        ["Horse", "Elephant"],

        ["Elephant", "Cow"]

    ];


    const YONI_ENEMY_PAIRS = [

        ["Serpent", "Rat"]

    ];


    const YONI_BITTER_ENEMY_PAIRS = [

        ["Horse", "Buffalo"],

        ["Elephant", "Lion"],

        ["Sheep", "Monkey"],

        ["Serpent", "Mongoose"],

        ["Dog", "Deer"],

        ["Cat", "Rat"],

        ["Cow", "Tiger"]

    ];


    /*
     * Tara favorable remainder:
     *
     * 2 Sampat
     * 4 Kshema
     * 6 Sadhaka
     * 8 Mitra
     * 9 Parama Mitra
     *
     * Janma = 1 is treated as neutral/positive
     * in the score implementation.
     */
    const TARA_GOOD = [
        1,
        2,
        4,
        6,
        8,
        9
    ];


    /*
     * Koota metadata
     */
    const KOOTA_META = [

        {
            id: "varna",
            name: "Varna",
            hindi: "वर्ण",
            max: 1
        },

        {
            id: "vashya",
            name: "Vashya",
            hindi: "वश्य",
            max: 2
        },

        {
            id: "tara",
            name: "Tara",
            hindi: "तारा",
            max: 3
        },

        {
            id: "yoni",
            name: "Yoni",
            hindi: "योनि",
            max: 4
        },

        {
            id: "graha-maitri",
            name: "Graha Maitri",
            hindi: "ग्रह मैत्री",
            max: 5
        },

        {
            id: "gana",
            name: "Gana",
            hindi: "गण",
            max: 6
        },

        {
            id: "bhakoot",
            name: "Bhakoot",
            hindi: "भकूट",
            max: 7
        },

        {
            id: "nadi",
            name: "Nadi",
            hindi: "नाड़ी",
            max: 8
        }

    ];


    /* =====================================================
       HELPERS
    ===================================================== */

    function escapeHTML(value) {

        return String(value ?? "")

            .replace(/&/g, "&amp;")

            .replace(/</g, "&lt;")

            .replace(/>/g, "&gt;")

            .replace(/"/g, "&quot;")

            .replace(/'/g, "&#039;");

    }


    function getState() {

        if (
            window.KundliState &&
            typeof window.KundliState.getState === "function"
        ) {

            return window.KundliState.getState();

        }


        if (
            window.KundliState &&
            typeof window.KundliState.get === "function"
        ) {

            return window.KundliState.get();

        }


        return null;

    }


    function getModuleRoot() {

        return document.getElementById(
            "gunMilanModule"
        );

    }


    function getContentElement() {

        return document.getElementById(
            "gunMilanContent"
        );

    }


    function normalizeNumber(value) {

        const number = Number(value);

        return Number.isFinite(number)
            ? number
            : null;

    }


    function pairKey(a, b) {

        return [
            String(a),
            String(b)
        ]
            .sort()
            .join("|");

    }


    function getKundliRashiIndex(kundli) {

        const moon =
            kundli &&
            kundli.planets &&
            kundli.planets.Moon;

        if (!moon) {
            return null;
        }


        if (
            moon.rashi &&
            Number.isInteger(
                Number(moon.rashi.index)
            )
        ) {

            return Number(
                moon.rashi.index
            );

        }


        if (
            Number.isInteger(
                Number(moon.rashiIndex)
            )
        ) {

            return Number(
                moon.rashiIndex
            );

        }


        /*
         * Older engine shape.
         */
        if (
            Number.isFinite(
                Number(moon.longitude)
            )
        ) {

            let longitude =
                Number(moon.longitude) % 360;

            if (longitude < 0) {
                longitude += 360;
            }

            return Math.floor(
                longitude / 30
            );

        }


        return null;

    }


    function getMoonDegreeInRashi(kundli) {

        const moon =
            kundli &&
            kundli.planets &&
            kundli.planets.Moon;

        if (!moon) {
            return null;
        }


        if (
            Number.isFinite(
                Number(moon.degree)
            )
        ) {

            return Number(
                moon.degree
            );

        }


        if (
            Number.isFinite(
                Number(moon.longitude)
            )
        ) {

            let longitude =
                Number(moon.longitude) % 30;

            if (longitude < 0) {
                longitude += 30;
            }

            return longitude;

        }


        return null;

    }


    function getMoonNakshatra(kundli) {

        const moon =
            kundli &&
            kundli.planets &&
            kundli.planets.Moon;

        if (!moon) {
            return null;
        }


        if (moon.nakshatra) {

            /*
             * Current engine returns an object.
             */
            if (
                typeof moon.nakshatra ===
                "object"
            ) {

                return moon.nakshatra;

            }

            /*
             * Older engine may store
             * only nakshatra name.
             */
            if (
                typeof moon.nakshatra ===
                "string"
            ) {

                const found =
                    NAKSHATRA_DATA.find(
                        item =>
                            item.name ===
                            moon.nakshatra
                    );

                if (found) {
                    return found;
                }

            }

        }


        if (kundli.moonNakshatra) {

            if (
                typeof kundli.moonNakshatra ===
                "object"
            ) {

                return kundli.moonNakshatra;

            }

        }


        if (
            Number.isFinite(
                Number(moon.longitude)
            )
        ) {

            const span =
                360 / 27;

            let longitude =
                Number(moon.longitude) % 360;

            if (longitude < 0) {
                longitude += 360;
            }

            const index =
                Math.min(
                    26,
                    Math.floor(
                        longitude / span
                    )
                );

            return NAKSHATRA_DATA[index];

        }


        return null;

    }


    function normalizeNakshatraData(
        nakshatra
    ) {

        if (!nakshatra) {
            return null;
        }


        let index =
            normalizeNumber(
                nakshatra.index
            );


        if (
            index === null &&
            typeof nakshatra.name ===
            "string"
        ) {

            const found =
                NAKSHATRA_DATA.findIndex(
                    item =>
                        item.name ===
                        nakshatra.name
                );

            if (found >= 0) {
                index = found;
            }

        }


        if (
            index === null &&
            typeof nakshatra.hindi ===
            "string"
        ) {

            const found =
                NAKSHATRA_DATA.findIndex(
                    item =>
                        item.hindi ===
                        nakshatra.hindi
                );

            if (found >= 0) {
                index = found;
            }

        }


        if (
            index === null ||
            index < 0 ||
            index > 26
        ) {

            return null;

        }


        const fallback =
            NAKSHATRA_DATA[index];


        return {

            index,

            name:
                nakshatra.name ||
                fallback.name,

            hindi:
                nakshatra.hindi ||
                fallback.hindi,

            lord:
                nakshatra.lord ||
                fallback.lord,

            gana:
                nakshatra.gana ||
                fallback.gana,

            yoni:
                nakshatra.yoni ||
                fallback.yoni,

            nadi:
                nakshatra.nadi ||
                NADI_BY_INDEX[index],

            pada:
                nakshatra.pada || null

        };

    }


    function buildPersonProfile(
        person,
        kundli
    ) {

        if (!kundli) {
            return null;
        }


        const moon =
            kundli.planets &&
            kundli.planets.Moon;

        const rashiIndex =
            getKundliRashiIndex(kundli);

        const nakshatra =
            normalizeNakshatraData(
                getMoonNakshatra(kundli)
            );


        if (
            !moon ||
            rashiIndex === null ||
            !nakshatra
        ) {

            return null;

        }


        return {

            person:
                person || {},

            kundli,

            name:
                person &&
                person.name
                    ? person.name
                    : (
                        kundli.input &&
                        kundli.input.name
                            ? kundli.input.name
                            : "Saved Kundli"
                    ),

            gender:
                person &&
                person.gender
                    ? person.gender
                    : (
                        kundli.input &&
                        kundli.input.gender
                            ? kundli.input.gender
                            : ""
                    ),

            rashiIndex,

            rashi:
                moon.rashi || {},

            moonDegree:
                getMoonDegreeInRashi(
                    kundli
                ),

            nakshatra

        };

    }


    /* =====================================================
       VASHYA
    ===================================================== */

    function getVashyaGroup(
        rashiIndex,
        degree
    ) {

        switch (rashiIndex) {

            case 0:
            case 1:
                return "Chatushpada";

            case 2:
            case 5:
            case 6:
            case 10:
                return "Manava";

            case 3:
            case 11:
                return "Jalachara";

            case 4:
                return "Vanachara";

            case 7:
                return "Keeta";

            case 8:

                if (
                    Number.isFinite(degree) &&
                    degree >= 15
                ) {
                    return "Chatushpada";
                }

                return "Manava";

            case 9:

                if (
                    Number.isFinite(degree) &&
                    degree >= 15
                ) {
                    return "Jalachara";
                }

                return "Chatushpada";

            default:
                return null;

        }

    }


    function calculateVashya(
        first,
        second
    ) {

        const g1 =
            getVashyaGroup(
                first.rashiIndex,
                first.moonDegree
            );

        const g2 =
            getVashyaGroup(
                second.rashiIndex,
                second.moonDegree
            );


        if (!g1 || !g2) {

            return {

                score: null,

                detail:
                    "Moon sign / degree उपलब्ध नहीं है।"

            };

        }


        return {

            score:
                VASHYA_SCORE[g1][g2],

            detail:
                `${VASHYA_GROUPS[g1]} ↔ ${VASHYA_GROUPS[g2]}`

        };

    }


    /* =====================================================
       VARNA
    ===================================================== */

    function getGroomBride(
        first,
        second
    ) {

        const firstGender =
            String(
                first.gender || ""
            ).toLowerCase();

        const secondGender =
            String(
                second.gender || ""
            ).toLowerCase();


        const firstMale =
            [
                "male",
                "m",
                "पुरुष",
                "लड़का",
                "boy"
            ].includes(firstGender);


        const secondMale =
            [
                "male",
                "m",
                "पुरुष",
                "लड़का",
                "boy"
            ].includes(secondGender);


        const firstFemale =
            [
                "female",
                "f",
                "महिला",
                "लड़की",
                "girl"
            ].includes(firstGender);


        const secondFemale =
            [
                "female",
                "f",
                "महिला",
                "लड़की",
                "girl"
            ].includes(secondGender);


        if (
            firstMale &&
            secondFemale
        ) {

            return {
                groom: first,
                bride: second
            };

        }


        if (
            secondMale &&
            firstFemale
        ) {

            return {
                groom: second,
                bride: first
            };

        }


        /*
         * If gender is unavailable, preserve
         * saved Person A -> Person B order.
         * No invented gender.
         */
        return {

            groom: first,

            bride: second,

            genderKnown: false

        };

    }


    function calculateVarna(
        first,
        second
    ) {

        const pair =
            getGroomBride(
                first,
                second
            );

        const groomVarna =
            VARNA_BY_RASHI[
                pair.groom.rashiIndex
            ];

        const brideVarna =
            VARNA_BY_RASHI[
                pair.bride.rashiIndex
            ];


        return {

            score:
                groomVarna >= brideVarna
                    ? 1
                    : 0,

            detail:
                `${VARNA_NAME[groomVarna]} ↔ ${VARNA_NAME[brideVarna]}`,

            genderKnown:
                pair.genderKnown !== false

        };

    }


    /* =====================================================
       TARA
    ===================================================== */

    function taraResult(
        fromIndex,
        toIndex
    ) {

        const distance =
            (
                toIndex -
                fromIndex +
                27
            ) % 27 + 1;


        const remainder =
            distance % 9 === 0
                ? 9
                : distance % 9;


        return {

            distance,

            remainder,

            good:
                TARA_GOOD.includes(
                    remainder
                )

        };

    }


    function calculateTara(
        first,
        second
    ) {

        const forward =
            taraResult(
                first.nakshatra.index,
                second.nakshatra.index
            );

        const reverse =
            taraResult(
                second.nakshatra.index,
                first.nakshatra.index
            );


        let score = 0;


        if (
            forward.good &&
            reverse.good
        ) {

            score = 3;

        }
        else if (
            forward.good ||
            reverse.good
        ) {

            score = 1.5;

        }


        return {

            score,

            detail:
                `Forward ${forward.distance} / ${forward.remainder}, ` +
                `Reverse ${reverse.distance} / ${reverse.remainder}`

        };

    }


    /* =====================================================
       YONI
    ===================================================== */

    function calculateYoni(
        first,
        second
    ) {

        const y1 =
            first.nakshatra.yoni;

        const y2 =
            second.nakshatra.yoni;


        if (!y1 || !y2) {

            return {

                score: null,

                detail:
                    "Nakshatra Yoni data उपलब्ध नहीं है।"

            };

        }


        if (y1 === y2) {

            return {

                score: 4,

                detail:
                    `${YONI_HINDI[y1] || y1} ↔ same Yoni`

            };

        }


        const key =
            pairKey(
                y1,
                y2
            );


        const friend =
            YONI_FRIEND_PAIRS.some(
                pair =>
                    pairKey(
                        pair[0],
                        pair[1]
                    ) === key
            );


        if (friend) {

            return {

                score: 3,

                detail:
                    `${YONI_HINDI[y1] || y1} ↔ ${YONI_HINDI[y2] || y2} : Mitra Yoni`

            };

        }


        const enemy =
            YONI_ENEMY_PAIRS.some(
                pair =>
                    pairKey(
                        pair[0],
                        pair[1]
                    ) === key
            );


        if (enemy) {

            return {

                score: 1,

                detail:
                    `${YONI_HINDI[y1] || y1} ↔ ${YONI_HINDI[y2] || y2} : Shatru Yoni`

            };

        }


        const bitterEnemy =
            YONI_BITTER_ENEMY_PAIRS.some(
                pair =>
                    pairKey(
                        pair[0],
                        pair[1]
                    ) === key
            );


        if (bitterEnemy) {

            return {

                score: 0,

                detail:
                    `${YONI_HINDI[y1] || y1} ↔ ${YONI_HINDI[y2] || y2} : Ati-Shatru Yoni`

            };

        }


        return {

            score: 2,

            detail:
                `${YONI_HINDI[y1] || y1} ↔ ${YONI_HINDI[y2] || y2} : Neutral Yoni`

        };

    }


    /* =====================================================
       GRAHA MAITRI
    ===================================================== */

    function getFriendship(
        planetA,
        planetB
    ) {

        if (
            planetA === planetB
        ) {

            return 1;

        }


        return (
            PLANET_FRIENDSHIP[
                planetA
            ] &&
            PLANET_FRIENDSHIP[
                planetA
            ][planetB]
        ) ?? 0;

    }


    function calculateGrahaMaitri(
        first,
        second
    ) {

        const lord1 =
            SIGN_LORD[
                first.rashiIndex
            ];

        const lord2 =
            SIGN_LORD[
                second.rashiIndex
            ];


        const relation1 =
            getFriendship(
                lord1,
                lord2
            );

        const relation2 =
            getFriendship(
                lord2,
                lord1
            );


        let score = 0;


        if (
            relation1 === 1 &&
            relation2 === 1
        ) {

            score = 5;

        }
        else if (
            relation1 === 1 &&
            relation2 === 0
        ) {

            score = 4;

        }
        else if (
            relation1 === 0 &&
            relation2 === 1
        ) {

            score = 4;

        }
        else if (
            relation1 === 1 ||
            relation2 === 1
        ) {

            score = 3;

        }
        else if (
            relation1 === 0 &&
            relation2 === 0
        ) {

            score = 3;

        }
        else if (
            relation1 === -1 &&
            relation2 === -1
        ) {

            score = 0;

        }
        else {

            score = 0.5;

        }


        return {

            score,

            detail:
                `${lord1} ↔ ${lord2}`

        };

    }


    /* =====================================================
       GANA
    ===================================================== */

    function calculateGana(
        first,
        second
    ) {

        const pair =
            getGroomBride(
                first,
                second
            );


        const g1 =
            pair.groom.nakshatra.gana;

        const g2 =
            pair.bride.nakshatra.gana;


        if (!g1 || !g2) {

            return {

                score: null,

                detail:
                    "Nakshatra Gana data उपलब्ध नहीं है।"

            };

        }


        if (g1 === g2) {

            return {

                score: 6,

                detail:
                    `${GANA_HINDI[g1] || g1} ↔ same Gana`

            };

        }


        const set =
            pairKey(
                g1,
                g2
            );


        if (
            set ===
            pairKey(
                "Deva",
                "Manushya"
            )
        ) {

            return {

                score: 5,

                detail:
                    "देव ↔ मनुष्य"

            };

        }


        if (
            set ===
            pairKey(
                "Rakshasa",
                "Manushya"
            )
        ) {

            /*
             * Traditional directional scoring:
             * Rakshasa groom + Manushya bride = 0
             * Manushya groom + Rakshasa bride = 3
             */
            if (
                pair.groom.nakshatra.gana ===
                "Rakshasa"
            ) {

                return {

                    score: 0,

                    detail:
                        "राक्षस ↔ मनुष्य"

                };

            }


            return {

                score: 3,

                detail:
                    "मनुष्य ↔ राक्षस"

            };

        }


        return {

            score: 1,

            detail:
                `${GANA_HINDI[g1] || g1} ↔ ${GANA_HINDI[g2] || g2}`

        };

    }


    /* =====================================================
       BHAKOOT
    ===================================================== */

    function calculateBhakoot(
        first,
        second
    ) {

        const d1 =
            (
                second.rashiIndex -
                first.rashiIndex +
                12
            ) % 12 + 1;


        const d2 =
            (
                first.rashiIndex -
                second.rashiIndex +
                12
            ) % 12 + 1;


        const dosha =
            (
                d1 === 2 ||
                d1 === 5 ||
                d1 === 6 ||
                d1 === 8 ||
                d1 === 9 ||
                d1 === 12
            );


        return {

            score:
                dosha
                    ? 0
                    : 7,

            dosha,

            detail:
                `${d1}/${d2} Rashi relationship`

        };

    }


    /* =====================================================
       NADI
    ===================================================== */

    function calculateNadi(
        first,
        second
    ) {

        const n1 =
            first.nakshatra.nadi ||
            NADI_BY_INDEX[
                first.nakshatra.index
            ];

        const n2 =
            second.nakshatra.nadi ||
            NADI_BY_INDEX[
                second.nakshatra.index
            ];


        const same =
            n1 === n2;


        return {

            score:
                same
                    ? 0
                    : 8,

            dosha:
                same,

            detail:
                `${NADI_HINDI[n1] || n1} ↔ ${NADI_HINDI[n2] || n2}`

        };

    }


    /* =====================================================
       KOOTA CALCULATION
    ===================================================== */

    function calculateAll(
        first,
        second
    ) {

        const varna =
            calculateVarna(
                first,
                second
            );

        const vashya =
            calculateVashya(
                first,
                second
            );

        const tara =
            calculateTara(
                first,
                second
            );

        const yoni =
            calculateYoni(
                first,
                second
            );

        const maitri =
            calculateGrahaMaitri(
                first,
                second
            );

        const gana =
            calculateGana(
                first,
                second
            );

        const bhakoot =
            calculateBhakoot(
                first,
                second
            );

        const nadi =
            calculateNadi(
                first,
                second
            );


        const results = {

            varna,

            vashya,

            tara,

            yoni,

            "graha-maitri":
                maitri,

            gana,

            bhakoot,

            nadi

        };


        const rows =
            KOOTA_META.map(
                meta => {

                    const result =
                        results[
                            meta.id
                        ];


                    return {

                        ...meta,

                        score:
                            result.score,

                        detail:
                            result.detail,

                        dosha:
                            Boolean(
                                result.dosha
                            )

                    };

                }
            );


        const total =
            rows.reduce(
                (
                    sum,
                    row
                ) => {

                    return sum +
                        (
                            Number.isFinite(
                                row.score
                            )
                                ? row.score
                                : 0
                        );

                },
                0
            );


        const missing =
            rows.some(
                row =>
                    row.score === null
            );


        return {

            rows,

            total,

            missing,

            bhakootDosha:
                Boolean(
                    bhakoot.dosha
                ),

            nadiDosha:
                Boolean(
                    nadi.dosha
                )

        };

    }


    /* =====================================================
       VERDICT
    ===================================================== */

    function getVerdict(
        total
    ) {

        if (total >= 28) {

            return {
                title:
                    "बहुत अच्छा पारंपरिक मिलान",
                className:
                    "good",
                text:
                    "36 गुणों में प्राप्त score पारंपरिक रूप से मजबूत compatibility संकेत देता है।"
            };

        }


        if (total >= 24) {

            return {
                title:
                    "अच्छा मिलान",
                className:
                    "good",
                text:
                    "Overall Guna score अच्छा है और कई compatibility factors अनुकूल दिखाई देते हैं।"
            };

        }


        if (total >= 18) {

            return {
                title:
                    "औसत / विचार योग्य मिलान",
                className:
                    "medium",
                text:
                    "Score पारंपरिक 18-Guna threshold के आसपास या ऊपर है। बाकी Kundli factors को भी साथ देखना चाहिए।"
            };

        }


        return {
            title:
                "कम स्कोर — विस्तृत Kundli परीक्षण आवश्यक",
            className:
                "low",
            text:
                "36 गुणों का score कम है। केवल इस score के आधार पर अंतिम निर्णय नहीं लेना चाहिए।"
        };

    }


    function scoreStatus(
        score,
        max
    ) {

        if (
            score === null ||
            !Number.isFinite(score)
        ) {

            return {
                label:
                    "Data Missing",
                className:
                    "low"
            };

        }


        const ratio =
            score / max;


        if (ratio >= 0.75) {

            return {
                label:
                    "अनुकूल / Good",
                className:
                    "good"
            };

        }


        if (ratio >= 0.5) {

            return {
                label:
                    "मध्यम / Moderate",
                className:
                    "medium"
            };

        }


        return {
            label:
                "कम / Low",
            className:
                "low"
        };

    }


    /* =====================================================
       SUMMARY TEXT
    ===================================================== */

    function buildSummary(
        result,
        first,
        second
    ) {

        const verdict =
            getVerdict(
                result.total
            );


        const sorted =
            result.rows
                .filter(
                    row =>
                        Number.isFinite(
                            row.score
                        )
                )
                .slice()
                .sort(
                    (
                        a,
                        b
                    ) =>
                        (
                            b.score /
                            b.max
                        ) -
                        (
                            a.score /
                            a.max
                        )
                );


        const strongest =
            sorted[0];


        const weakest =
            sorted[
                sorted.length - 1
            ];


        let text =
            `${first.name} और ${second.name} के Moon Sign और Janma Nakshatra से Ashtakoota Gun Milan calculate किया गया है। ` +
            `कुल score ${formatScore(result.total)}/36 है। ` +
            `${verdict.title}।`;


        if (strongest) {

            text +=
                ` सबसे मजबूत factor ${strongest.name} / ${strongest.hindi} रहा, जिसमें ${formatScore(strongest.score)}/${strongest.max} Gun मिले।`;

        }


        if (
            weakest &&
            weakest.id !==
            strongest?.id
        ) {

            text +=
                ` सबसे कम score ${weakest.name} / ${weakest.hindi} में ${formatScore(weakest.score)}/${weakest.max} रहा।`;

        }


        if (result.nadiDosha) {

            text +=
                " दोनों की Nadi समान होने से Nadi Dosha का संकेत आया है।";

        }


        if (result.bhakootDosha) {

            text +=
                " Moon Rashi relationship के आधार पर Bhakoot Dosha का संकेत आया है।";

        }


        return {

            verdict,

            text,

            strongest,

            weakest

        };

    }


    function formatScore(
        value
    ) {

        if (
            value === null ||
            !Number.isFinite(
                Number(value)
            )
        ) {

            return "—";

        }


        const number =
            Number(value);


        return Number.isInteger(
            number
        )
            ? String(number)
            : number.toFixed(1);

    }


    /* =====================================================
       RENDER PERSON
    ===================================================== */

    function renderPerson(
        profile,
        letter
    ) {

        const moon =
            profile.kundli.planets.Moon;


        const rashiName =
            moon.rashi &&
            (
                moon.rashi.name ||
                moon.rashi.sign
            )
                ? (
                    moon.rashi.name ||
                    moon.rashi.sign
                )
                : (
                    RASHI_NAMES[
                        profile.rashiIndex
                    ]
                );


        const rashiHindi =
            moon.rashi &&
            (
                moon.rashi.hindi ||
                moon.rashi.signHindi
            )
                ? (
                    moon.rashi.hindi ||
                    moon.rashi.signHindi
                )
                : (
                    RASHI_HINDI[
                        profile.rashiIndex
                    ]
                );


        const nak =
            profile.nakshatra;


        const degree =
            profile.moonDegree;


        const degreeText =
            Number.isFinite(
                degree
            )
                ? `${degree.toFixed(2)}°`
                : "—";


        return `

            <div class="gun-person-card">

                <div class="gun-person-top">

                    <div class="gun-person-avatar">
                        ${escapeHTML(letter)}
                    </div>

                    <div>

                        <h4>
                            ${escapeHTML(
                                profile.name
                            )}
                        </h4>

                        <span>
                            Person ${escapeHTML(letter)}
                            / व्यक्ति ${escapeHTML(letter)}
                        </span>

                    </div>

                </div>


                <div class="gun-person-details">

                    <div class="gun-detail-box">

                        <small>
                            Moon Sign / चंद्र राशि
                        </small>

                        <strong>
                            ${escapeHTML(
                                rashiHindi
                            )}
                            /
                            ${escapeHTML(
                                rashiName
                            )}
                        </strong>

                    </div>


                    <div class="gun-detail-box">

                        <small>
                            Moon Degree / चंद्र डिग्री
                        </small>

                        <strong>
                            ${escapeHTML(
                                degreeText
                            )}
                        </strong>

                    </div>


                    <div class="gun-detail-box">

                        <small>
                            Nakshatra / नक्षत्र
                        </small>

                        <strong>
                            ${escapeHTML(
                                nak.hindi
                            )}
                            /
                            ${escapeHTML(
                                nak.name
                            )}
                        </strong>

                    </div>


                    <div class="gun-detail-box">

                        <small>
                            Pada / पाद
                        </small>

                        <strong>
                            ${escapeHTML(
                                nak.pada || "—"
                            )}
                        </strong>

                    </div>


                    <div class="gun-detail-box">

                        <small>
                            Gana / गण
                        </small>

                        <strong>
                            ${escapeHTML(
                                GANA_HINDI[
                                    nak.gana
                                ] ||
                                nak.gana ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div class="gun-detail-box">

                        <small>
                            Yoni / योनि
                        </small>

                        <strong>
                            ${escapeHTML(
                                YONI_HINDI[
                                    nak.yoni
                                ] ||
                                nak.yoni ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div class="gun-detail-box">

                        <small>
                            Nadi / नाड़ी
                        </small>

                        <strong>
                            ${escapeHTML(
                                NADI_HINDI[
                                    nak.nadi
                                ] ||
                                nak.nadi ||
                                "—"
                            )}
                        </strong>

                    </div>


                    <div class="gun-detail-box">

                        <small>
                            Gender / लिंग
                        </small>

                        <strong>
                            ${escapeHTML(
                                profile.gender ||
                                "Saved data में उपलब्ध नहीं"
                            )}
                        </strong>

                    </div>

                </div>

            </div>

        `;

    }


    /* =====================================================
       RENDER KOOTA TABLE
    ===================================================== */

    function renderKootaTable(
        result
    ) {

        let rows = "";


        result.rows.forEach(
            row => {

                const status =
                    scoreStatus(
                        row.score,
                        row.max
                    );


                rows += `

                    <tr>

                        <td class="gun-koota-name">

                            <strong>
                                ${escapeHTML(
                                    row.name
                                )}
                            </strong>

                            <span>
                                ${escapeHTML(
                                    row.hindi
                                )}
                            </span>

                        </td>


                        <td>
                            ${row.max}
                        </td>


                        <td class="gun-score-cell">

                            ${
                                row.score === null
                                    ? "—"
                                    : `${formatScore(row.score)} / ${row.max}`
                            }

                        </td>


                        <td>

                            <span
                                class="gun-status ${status.className}"
                            >
                                ${escapeHTML(
                                    status.label
                                )}
                            </span>

                        </td>


                        <td>

                            ${escapeHTML(
                                row.detail ||
                                "—"
                            )}

                        </td>

                    </tr>

                `;

            }
        );


        return `

            <div class="gun-table-wrap">

                <table class="gun-table">

                    <thead>

                        <tr>

                            <th>
                                Koota / कूट
                            </th>

                            <th>
                                Max
                            </th>

                            <th>
                                Score / गुण
                            </th>

                            <th>
                                Status / स्थिति
                            </th>

                            <th>
                                Calculation / गणना
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        ${rows}

                    </tbody>

                </table>

            </div>

        `;

    }


    /* =====================================================
       RENDER FLAGS
    ===================================================== */

    function renderFlags(
        result
    ) {

        const nadiText =
            result.nadiDosha
                ? "दोनों की Nadi समान है।"
                : "दोनों की Nadi अलग है।";

        const bhakootText =
            result.bhakootDosha
                ? "Moon Rashi relationship पारंपरिक Bhakoot Dosha pattern में आता है।"
                : "Moon Rashi relationship में Bhakoot Dosha का संकेत नहीं आया।";


        return `

            <div class="gun-flag-grid">

                <div class="gun-flag">

                    <div class="gun-flag-title">

                        <strong>
                            Nadi Dosha / नाड़ी दोष
                        </strong>

                        <span
                            class="gun-flag-badge ${
                                result.nadiDosha
                                    ? "alert"
                                    : "ok"
                            }"
                        >
                            ${
                                result.nadiDosha
                                    ? "संकेत"
                                    : "नहीं"
                            }
                        </span>

                    </div>

                    <p>
                        ${escapeHTML(
                            nadiText
                        )}
                    </p>

                </div>


                <div class="gun-flag">

                    <div class="gun-flag-title">

                        <strong>
                            Bhakoot Dosha / भकूट दोष
                        </strong>

                        <span
                            class="gun-flag-badge ${
                                result.bhakootDosha
                                    ? "alert"
                                    : "ok"
                            }"
                        >
                            ${
                                result.bhakootDosha
                                    ? "संकेत"
                                    : "नहीं"
                            }
                        </span>

                    </div>

                    <p>
                        ${escapeHTML(
                            bhakootText
                        )}
                    </p>

                </div>

            </div>

        `;

    }


    /* =====================================================
       CANONICAL CALCULATION API
    ===================================================== */

    function calculateForKundlis(kundliA, kundliB, personA, personB) {
        const first = buildPersonProfile(personA || {}, kundliA);
        const second = buildPersonProfile(personB || {}, kundliB);
        if (!first || !second) return null;
        return calculateAll(first, second);
    }


    /* =====================================================
       RENDER
    ===================================================== */

    function render() {

        const content =
            getContentElement();


        if (!content) {
            return;
        }


        const state =
            getState();


        if (!state) {

            renderEmpty(
                content,
                "Kundli State उपलब्ध नहीं है।"
            );

            return;

        }


        const personA =
            state.personA || null;

        const personB =
            state.personB || null;

        const kundliA =
            state.kundliA || null;

        const kundliB =
            state.kundliB || null;


        /*
         * IMPORTANT:
         *
         * No input form.
         * No typing.
         *
         * Both Kundli objects must already
         * exist in central state.
         */

        if (
            !personA ||
            !kundliA
        ) {

            renderEmpty(
                content,
                "Person A / व्यक्ति A की saved Kundli उपलब्ध नहीं है।"
            );

            return;

        }


        if (
            !personB ||
            !kundliB
        ) {

            renderEmpty(
                content,
                "Person B / व्यक्ति B की saved Kundli उपलब्ध नहीं है। पहले Person B की Kundli central Kundli data में save होनी चाहिए।"
            );

            return;

        }


        const first =
            buildPersonProfile(
                personA,
                kundliA
            );


        const second =
            buildPersonProfile(
                personB,
                kundliB
            );


        if (
            !first ||
            !second
        ) {

            renderEmpty(
                content,
                "दोनों saved Kundli में Moon Sign और Nakshatra का calculation data उपलब्ध नहीं है।"
            );

            return;

        }


        const result =
            calculateAll(
                first,
                second
            );

        if (window.KundliState && typeof window.KundliState.saveMilan === "function") {
            window.KundliState.saveMilan({
                source: "Ashtakoota / Gun Milan",
                version: "1.0",
                rows: result.rows,
                total: result.total,
                missing: result.missing,
                bhakootDosha: result.bhakootDosha,
                nadiDosha: result.nadiDosha,
                calculatedAt: new Date().toISOString()
            });
        }


        const summary =
            buildSummary(
                result,
                first,
                second
            );


        const engineVersion =
            (
                kundliA.engine &&
                kundliA.engine.provider
            )
                ? (
                    kundliA.engine.provider
                )
                : "Kundli Engine";


        const incompleteMessage =
            result.missing
                ? `
                    <div class="gun-note">
                        <strong>Calculation Note / गणना नोट:</strong>
                        कुछ Koota के लिए saved Kundli data उपलब्ध नहीं है।
                        इसलिए missing score को zero मानकर final score नहीं बनाया गया है।
                        नीचे केवल उपलब्ध calculated data दिखाया गया है।
                    </div>
                `
                : "";


        content.innerHTML = `

            <!-- =================================================
                 PERSON DATA
            ================================================== -->

            <section class="gun-card">

                <div class="gun-card-head">

                    <h3>
                        Saved Kundli Data / सुरक्षित कुंडली डेटा
                    </h3>

                    <p>
                        दोनों व्यक्तियों का data पहले से saved Kundli से लिया गया है।
                        यहाँ कोई manual typing नहीं है।
                    </p>

                </div>

                <div class="gun-card-body">

                    <div class="gun-person-grid">

                        ${renderPerson(
                            first,
                            "A"
                        )}

                        ${renderPerson(
                            second,
                            "B"
                        )}

                    </div>

                </div>

            </section>


            <!-- =================================================
                 SCORE
            ================================================== -->

            <section class="gun-card">

                <div class="gun-card-head">

                    <h3>
                        Gun Milan Summary / गुण मिलान सारांश
                    </h3>

                    <p>
                        Ashtakoota के 8 Koota का calculated total।
                    </p>

                </div>


                <div class="gun-card-body">

                    <div class="gun-score-card">

                        <div class="gun-score-main">

                            <small>
                                TOTAL GUNA / कुल गुण
                            </small>

                            <div class="gun-score-number">

                                ${formatScore(
                                    result.total
                                )}

                                <span>
                                    / 36
                                </span>

                            </div>

                            <div class="gun-score-verdict">

                                ${escapeHTML(
                                    summary.verdict.title
                                )}

                            </div>

                        </div>


                        <div class="gun-score-summary">

                            <div class="gun-summary-title">
                                Calculated Summary / गणना सारांश
                            </div>

                            <div class="gun-summary-text">

                                ${escapeHTML(
                                    summary.text
                                )}

                            </div>


                            <div class="gun-summary-points">

                                <div class="gun-summary-point">

                                    <small>
                                        Strongest Koota / सबसे मजबूत
                                    </small>

                                    <strong>

                                        ${
                                            summary.strongest
                                                ? `${escapeHTML(summary.strongest.name)} — ${formatScore(summary.strongest.score)}/${summary.strongest.max}`
                                                : "—"
                                        }

                                    </strong>

                                </div>


                                <div class="gun-summary-point">

                                    <small>
                                        Lowest Koota / सबसे कम
                                    </small>

                                    <strong>

                                        ${
                                            summary.weakest
                                                ? `${escapeHTML(summary.weakest.name)} — ${formatScore(summary.weakest.score)}/${summary.weakest.max}`
                                                : "—"
                                        }

                                    </strong>

                                </div>


                                <div class="gun-summary-point">

                                    <small>
                                        Nadi / नाड़ी
                                    </small>

                                    <strong>

                                        ${
                                            result.nadiDosha
                                                ? "Dosha संकेत"
                                                : "अनुकूल"
                                        }

                                    </strong>

                                </div>


                                <div class="gun-summary-point">

                                    <small>
                                        Bhakoot / भकूट
                                    </small>

                                    <strong>

                                        ${
                                            result.bhakootDosha
                                                ? "Dosha संकेत"
                                                : "अनुकूल"
                                        }

                                    </strong>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            <!-- =================================================
                 8 KOOTA
            ================================================== -->

            <section class="gun-card">

                <div class="gun-card-head">

                    <h3>
                        Ashtakoota — 8 Koota / अष्टकूट — 8 कूट
                    </h3>

                    <p>
                        प्रत्येक Koota का actual calculated score और calculation basis।
                    </p>

                </div>

                <div class="gun-card-body">

                    ${renderKootaTable(
                        result
                    )}

                </div>

            </section>


            <!-- =================================================
                 DOSHA FLAGS
            ================================================== -->

            <section class="gun-card">

                <div class="gun-card-head">

                    <h3>
                        Important Milan Indicators / महत्वपूर्ण संकेत
                    </h3>

                    <p>
                        Gun Milan calculation से निकलने वाले Nadi और Bhakoot indicators।
                    </p>

                </div>

                <div class="gun-card-body">

                    ${renderFlags(
                        result
                    )}

                </div>

            </section>


            <!-- =================================================
                 DETAILED INTERPRETATION
            ================================================== -->

            <section class="gun-card">

                <div class="gun-card-head">

                    <h3>
                        Detailed Gun Analysis / विस्तृत गुण विश्लेषण
                    </h3>

                    <p>
                        हर Koota का score उसके actual Moon Sign / Nakshatra data से निकाला गया है।
                    </p>

                </div>


                <div class="gun-card-body">

                    <div class="gun-detail-grid">

                        ${result.rows.map(
                            row => {

                                const status =
                                    scoreStatus(
                                        row.score,
                                        row.max
                                    );


                                return `

                                    <article
                                        class="gun-analysis-card"
                                    >

                                        <h4>

                                            ${escapeHTML(
                                                row.name
                                            )}

                                            /
                                            ${escapeHTML(
                                                row.hindi
                                            )}

                                        </h4>


                                        <p>

                                            <strong>
                                                Score:
                                            </strong>

                                            ${
                                                row.score === null
                                                    ? "Data Missing"
                                                    : `${formatScore(row.score)} / ${row.max}`
                                            }

                                            <br><br>

                                            ${escapeHTML(
                                                row.detail ||
                                                "Calculation detail unavailable."
                                            )}

                                            <br><br>

                                            <strong>
                                                Status:
                                            </strong>

                                            ${escapeHTML(
                                                status.label
                                            )}

                                        </p>

                                    </article>

                                `;

                            }
                        ).join("")}

                    </div>

                </div>

            </section>


            <!-- =================================================
                 IMPORTANT NOTE
            ================================================== -->

            <section class="gun-card">

                <div class="gun-card-body">

                    <div class="gun-note">

                        <strong>
                            Important Jyotish Note / महत्वपूर्ण ज्योतिष नोट:
                        </strong>

                        Ashtakoota / 36 Gun एक traditional compatibility
                        baseline है। यह score केवल saved Moon Sign और
                        Janma Nakshatra based matching को दर्शाता है।
                        विवाह का final assessment केवल 36 Gun देखकर नहीं
                        किया जाना चाहिए। D1, 7th House, 7th Lord, Venus,
                        Jupiter, Manglik, D9 / Navamsa और Dasha factors
                        को भी साथ में देखना चाहिए।

                        <br><br>

                        <strong>
                            Calculation Source:
                        </strong>

                        ${escapeHTML(
                            engineVersion
                        )}
                        + saved Kundli data.

                    </div>

                    ${incompleteMessage}

                </div>

            </section>

        `;

    }


    /* =====================================================
       EMPTY STATE
    ===================================================== */

    function renderEmpty(
        content,
        message
    ) {

        content.innerHTML = `

            <div class="gun-empty">

                <div class="gun-empty-icon">
                    36
                </div>

                <h3>
                    Gun Milan / गुण मिलान
                </h3>

                <p>
                    ${escapeHTML(
                        message
                    )}
                </p>

            </div>

        `;

    }


    /* =====================================================
       INIT
    ===================================================== */

    function init() {

        const root =
            getModuleRoot();


        if (!root) {

            console.error(
                "[Gun Milan] Module root not found."
            );

            return;

        }


        render();


        /*
         * If another module updates
         * Person B / Kundli B in the
         * same page, refresh automatically.
         */
        window.addEventListener(
            "kundli-state-updated",
            render
        );


        console.info(
            "[Gun Milan] Auto calculation initialized."
        );

    }


    /* =====================================================
       PUBLIC REGISTRATION
    ===================================================== */

    CONTROLLER.calculateForKundlis = calculateForKundlis;

    window.KundliGunMilan =
        CONTROLLER;


    window.KundliModules =
        window.KundliModules || {};


    window.KundliModules[
        "gun-milan"
    ] = {

        init

    };


})(window, document);