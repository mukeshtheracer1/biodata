(function (window) {

    "use strict";


    /* =========================================================
       PLANETS
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
       NAKSHATRA LORDS
    ========================================================= */

    const NAKSHATRA_LORDS = [

        "Ketu",
        "Venus",
        "Sun",
        "Moon",
        "Mars",
        "Rahu",
        "Jupiter",
        "Saturn",
        "Mercury"

    ];


    const LORD_HINDI = {

        Ketu: "केतु",
        Venus: "शुक्र",
        Sun: "सूर्य",
        Moon: "चंद्र",
        Mars: "मंगल",
        Rahu: "राहु",
        Jupiter: "गुरु",
        Saturn: "शनि",
        Mercury: "बुध"

    };


    /* =========================================================
       27 NAKSHATRAS
    ========================================================= */

    const NAKSHATRAS = [

        {
            id: "ashwini",
            hindi: "अश्विनी",
            english: "Ashwini"
        },

        {
            id: "bharani",
            hindi: "भरणी",
            english: "Bharani"
        },

        {
            id: "krittika",
            hindi: "कृत्तिका",
            english: "Krittika"
        },

        {
            id: "rohini",
            hindi: "रोहिणी",
            english: "Rohini"
        },

        {
            id: "mrigashira",
            hindi: "मृगशिरा",
            english: "Mrigashira"
        },

        {
            id: "ardra",
            hindi: "आर्द्रा",
            english: "Ardra"
        },

        {
            id: "punarvasu",
            hindi: "पुनर्वसु",
            english: "Punarvasu"
        },

        {
            id: "pushya",
            hindi: "पुष्य",
            english: "Pushya"
        },

        {
            id: "ashlesha",
            hindi: "आश्लेषा",
            english: "Ashlesha"
        },

        {
            id: "magha",
            hindi: "मघा",
            english: "Magha"
        },

        {
            id: "purva-phalguni",
            hindi: "पूर्वा फाल्गुनी",
            english: "Purva Phalguni"
        },

        {
            id: "uttara-phalguni",
            hindi: "उत्तर फाल्गुनी",
            english: "Uttara Phalguni"
        },

        {
            id: "hasta",
            hindi: "हस्त",
            english: "Hasta"
        },

        {
            id: "chitra",
            hindi: "चित्रा",
            english: "Chitra"
        },

        {
            id: "swati",
            hindi: "स्वाती",
            english: "Swati"
        },

        {
            id: "vishakha",
            hindi: "विशाखा",
            english: "Vishakha"
        },

        {
            id: "anuradha",
            hindi: "अनुराधा",
            english: "Anuradha"
        },

        {
            id: "jyeshtha",
            hindi: "ज्येष्ठा",
            english: "Jyeshtha"
        },

        {
            id: "mula",
            hindi: "मूल",
            english: "Mula"
        },

        {
            id: "purva-ashadha",
            hindi: "पूर्वाषाढ़ा",
            english: "Purva Ashadha"
        },

        {
            id: "uttara-ashadha",
            hindi: "उत्तराषाढ़ा",
            english: "Uttara Ashadha"
        },

        {
            id: "shravana",
            hindi: "श्रवण",
            english: "Shravana"
        },

        {
            id: "dhanishtha",
            hindi: "धनिष्ठा",
            english: "Dhanishtha"
        },

        {
            id: "shatabhisha",
            hindi: "शतभिषा",
            english: "Shatabhisha"
        },

        {
            id: "purva-bhadrapada",
            hindi: "पूर्व भाद्रपद",
            english: "Purva Bhadrapada"
        },

        {
            id: "uttara-bhadrapada",
            hindi: "उत्तर भाद्रपद",
            english: "Uttara Bhadrapada"
        },

        {
            id: "revati",
            hindi: "रेवती",
            english: "Revati"
        }

    ];


    /* =========================================================
       PROFILE DATA
    ========================================================= */

    const PROFILES = {

        ashwini: {
            gana: "देव",
            yoni: "अश्व",
            nadi: "आदि"
        },

        bharani: {
            gana: "मनुष्य",
            yoni: "गज",
            nadi: "मध्य"
        },

        krittika: {
            gana: "राक्षस",
            yoni: "मेष",
            nadi: "अन्त्य"
        },

        rohini: {
            gana: "मनुष्य",
            yoni: "सर्प",
            nadi: "अन्त्य"
        },

        mrigashira: {
            gana: "देव",
            yoni: "सर्प",
            nadi: "मध्य"
        },

        ardra: {
            gana: "मनुष्य",
            yoni: "श्वान",
            nadi: "आदि"
        },

        punarvasu: {
            gana: "देव",
            yoni: "मार्जार",
            nadi: "आदि"
        },

        pushya: {
            gana: "देव",
            yoni: "मेष",
            nadi: "मध्य"
        },

        ashlesha: {
            gana: "राक्षस",
            yoni: "मार्जार",
            nadi: "अन्त्य"
        },

        magha: {
            gana: "राक्षस",
            yoni: "मूषक",
            nadi: "अन्त्य"
        },

        "purva-phalguni": {
            gana: "मनुष्य",
            yoni: "मूषक",
            nadi: "मध्य"
        },

        "uttara-phalguni": {
            gana: "मनुष्य",
            yoni: "गो",
            nadi: "आदि"
        },

        hasta: {
            gana: "देव",
            yoni: "महिष",
            nadi: "आदि"
        },

        chitra: {
            gana: "राक्षस",
            yoni: "व्याघ्र",
            nadi: "मध्य"
        },

        swati: {
            gana: "देव",
            yoni: "महिष",
            nadi: "अन्त्य"
        },

        vishakha: {
            gana: "राक्षस",
            yoni: "व्याघ्र",
            nadi: "अन्त्य"
        },

        anuradha: {
            gana: "देव",
            yoni: "मृग",
            nadi: "मध्य"
        },

        jyeshtha: {
            gana: "राक्षस",
            yoni: "मृग",
            nadi: "आदि"
        },

        mula: {
            gana: "राक्षस",
            yoni: "श्वान",
            nadi: "आदि"
        },

        "purva-ashadha": {
            gana: "मनुष्य",
            yoni: "वानर",
            nadi: "मध्य"
        },

        "uttara-ashadha": {
            gana: "मनुष्य",
            yoni: "नकुल",
            nadi: "अन्त्य"
        },

        shravana: {
            gana: "देव",
            yoni: "वानर",
            nadi: "अन्त्य"
        },

        dhanishtha: {
            gana: "राक्षस",
            yoni: "सिंह",
            nadi: "मध्य"
        },

        shatabhisha: {
            gana: "राक्षस",
            yoni: "अश्व",
            nadi: "आदि"
        },

        "purva-bhadrapada": {
            gana: "मनुष्य",
            yoni: "सिंह",
            nadi: "आदि"
        },

        "uttara-bhadrapada": {
            gana: "मनुष्य",
            yoni: "गो",
            nadi: "मध्य"
        },

        revati: {
            gana: "देव",
            yoni: "हाथी",
            nadi: "अन्त्य"
        }

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


    function getRashiHindi(
        planet
    ) {

        return (
            planet &&
            planet.rashi &&
            (
                planet.rashi.hindi ||
                planet.rashi.name
            )
        ) || "—";

    }


    function getNakshatra(
        planet
    ) {

        if (
            !planet ||
            !planet.nakshatra
        ) {

            return null;

        }

        return planet.nakshatra;

    }


    function getNakshatraId(
        nakshatra
    ) {

        if (!nakshatra) {
            return "";
        }

        if (nakshatra.id) {
            return String(nakshatra.id).toLowerCase();
        }

        const index = Number(nakshatra.index);

        if (Number.isInteger(index) && index >= 0 && index < NAKSHATRAS.length) {
            return NAKSHATRAS[index].id;
        }

        const name = String(nakshatra.name || "").trim().toLowerCase();

        const byName = NAKSHATRAS.find(function (item) {
            return item.english.toLowerCase() === name;
        });

        return byName ? byName.id : "";

    }


    function getNakshatraName(
        nakshatra
    ) {

        if (!nakshatra) {
            return "—";
        }

        return (
            nakshatra.hindi ||
            nakshatra.name ||
            "—"
        );

    }


    function getLordFromNakshatra(
        nakshatra
    ) {

        if (
            nakshatra &&
            nakshatra.lord
        ) {

            return nakshatra.lord;

        }


        const id =
            getNakshatraId(
                nakshatra
            );


        const index =
            NAKSHATRAS.findIndex(
                function (item) {

                    return item.id === id;

                }
            );


        if (
            index < 0
        ) {

            return "";

        }


        return NAKSHATRA_LORDS[
            index % 9
        ];

    }


    function getLordHindi(
        lord
    ) {

        if (
            LORD_HINDI[lord]
        ) {

            return LORD_HINDI[lord];

        }


        return lord || "—";

    }


    function getNakshatraProfile(
        nakshatra
    ) {

        const id =
            getNakshatraId(
                nakshatra
            );


        return (
            PROFILES[id] || {
                gana: "—",
                yoni: "—",
                nadi: "—"
            }
        );

    }


    /* =========================================================
       TARA
    ========================================================= */

    function getTara(
        nakshatra
    ) {

        if (!nakshatra) {
            return "—";
        }

        // A person's natal Nakshatra is the Janma Tara.
        // Other Tara categories require a second Nakshatra (for transit/milan).
        return "जन्म / Janma";


    }


    /* =========================================================
       RENDER HERO
    ========================================================= */

    function renderHero(
        kundli
    ) {

        const moon =
            kundli.planets &&
            kundli.planets.Moon;


        const nakshatra =
            getNakshatra(
                moon
            );


        if (!moon || !nakshatra) {
            return;
        }


        const profile =
            getNakshatraProfile(
                nakshatra
            );


        const lord =
            getLordFromNakshatra(
                nakshatra
            );


        const name =
            kundli.input &&
            kundli.input.name
                ? kundli.input.name
                : "Kundli";


        document.getElementById(
            "nakshatraTitle"
        ).textContent =
            `${name} — जन्म नक्षत्र`;


        document.getElementById(
            "janmaNakshatraName"
        ).textContent =
            getNakshatraName(
                nakshatra
            );


        document.getElementById(
            "janmaNakshatraEnglish"
        ).textContent =
            nakshatra.name ||
            NAKSHATRAS.find(
                function (item) {
                    return item.id ===
                        getNakshatraId(
                            nakshatra
                        );
                }
            )?.english ||
            "—";


        document.getElementById(
            "janmaPada"
        ).textContent =
            nakshatra.pada || "—";


        document.getElementById(
            "nakshatraLord"
        ).textContent =
            getLordHindi(
                lord
            );


        document.getElementById(
            "moonRashi"
        ).textContent =
            getRashiHindi(
                moon
            );


        document.getElementById(
            "moonDegree"
        ).textContent =
            moon.degreeFormatted ||
            "—";


        document.getElementById(
            "nakshatraGana"
        ).textContent =
            profile.gana;


        document.getElementById(
            "nakshatraYoni"
        ).textContent =
            profile.yoni;


        document.getElementById(
            "nakshatraNadi"
        ).textContent =
            profile.nadi;


        document.getElementById(
            "nakshatraTara"
        ).textContent =
            getTara(
                nakshatra
            );

    }


    /* =========================================================
       MOON DETAIL
    ========================================================= */

    function renderMoonDetails(
        kundli
    ) {

        const moon =
            kundli.planets &&
            kundli.planets.Moon;


        const nakshatra =
            getNakshatra(
                moon
            );


        if (!moon || !nakshatra) {
            return;
        }


        const profile =
            getNakshatraProfile(
                nakshatra
            );


        const lord =
            getLordFromNakshatra(
                nakshatra
            );


        document.getElementById(
            "moonRashiDetail"
        ).textContent =
            getRashiHindi(
                moon
            );


        document.getElementById(
            "moonNakshatraDetail"
        ).textContent =
            getNakshatraName(
                nakshatra
            );


        document.getElementById(
            "moonPadaDetail"
        ).textContent =
            nakshatra.pada || "—";


        document.getElementById(
            "moonDegreeDetail"
        ).textContent =
            moon.degreeFormatted ||
            "—";


        document.getElementById(
            "moonNakshatraLordDetail"
        ).textContent =
            getLordHindi(
                lord
            );


        document.getElementById(
            "moonMotionDetail"
        ).textContent =
            moon.retrograde
                ? "वक्री"
                : "मार्गी";


        document.getElementById(
            "qualityGana"
        ).textContent =
            profile.gana;


        document.getElementById(
            "qualityYoni"
        ).textContent =
            profile.yoni;


        document.getElementById(
            "qualityNadi"
        ).textContent =
            profile.nadi;


        document.getElementById(
            "qualityTara"
        ).textContent =
            getTara(
                nakshatra
            );

    }


    /* =========================================================
       PLANET TABLE
    ========================================================= */

    function renderPlanetTable(
        kundli
    ) {

        const tbody =
            document.getElementById(
                "nakshatraPlanetTable"
            );


        if (!tbody) {
            return;
        }


        const planets =
            kundli.planets || {};


        const available =
            PLANET_ORDER.filter(
                function (id) {

                    return !!planets[id];

                }
            );


        if (!available.length) {

            tbody.innerHTML = `
                <tr>
                    <td colspan="6">
                        Planetary data उपलब्ध नहीं है।
                    </td>
                </tr>
            `;

            return;

        }


        tbody.innerHTML =
            available.map(
                function (id) {

                    const planet =
                        planets[id];


                    const nakshatra =
                        getNakshatra(
                            planet
                        );


                    const lord =
                        getLordFromNakshatra(
                            nakshatra
                        );


                    return `
                        <tr>

                            <td>

                                <div
                                    class="nakshatra-planet"
                                >

                                    <span
                                        class="nakshatra-planet-symbol"
                                    >
                                        ${escapeHTML(
                                            PLANETS[id]
                                                ? PLANETS[id].short
                                                : id
                                        )}
                                    </span>

                                    <div>

                                        <div
                                            class="nakshatra-planet-name"
                                        >
                                            ${escapeHTML(
                                                PLANETS[id]
                                                    ? PLANETS[id].hindi
                                                    : id
                                            )}
                                        </div>

                                        <div
                                            class="nakshatra-planet-en"
                                        >
                                            ${escapeHTML(id)}
                                        </div>

                                    </div>

                                </div>

                            </td>


                            <td>
                                ${escapeHTML(
                                    getRashiHindi(
                                        planet
                                    )
                                )}
                            </td>


                            <td>

                                <span
                                    class="nakshatra-table-degree"
                                >
                                    ${escapeHTML(
                                        planet.degreeFormatted ||
                                        "—"
                                    )}
                                </span>

                            </td>


                            <td>
                                ${escapeHTML(
                                    getNakshatraName(
                                        nakshatra
                                    )
                                )}
                            </td>


                            <td>

                                <span
                                    class="nakshatra-table-pada"
                                >
                                    ${escapeHTML(
                                        nakshatra &&
                                        nakshatra.pada
                                            ? nakshatra.pada
                                            : "—"
                                    )}
                                </span>

                            </td>


                            <td>
                                ${escapeHTML(
                                    getLordHindi(
                                        lord
                                    )
                                )}
                            </td>

                        </tr>
                    `;

                }
            ).join("");

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
                    ".nakshatra-module"
                );


            if (module) {

                module.innerHTML = `
                    <div class="nakshatra-note">

                        Nakshatra data उपलब्ध नहीं है।

                        <br><br>

                        पहले Birth Details से
                        Kundli generate करें।

                    </div>
                `;

            }

            return;

        }


        renderHero(
            kundli
        );


        renderMoonDetails(
            kundli
        );


        renderPlanetTable(
            kundli
        );


        console.log(
            "[Nakshatra] Rendered successfully."
        );

    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        console.log(
            "[Nakshatra] Module initialized."
        );


        try {

            render();

        } catch (error) {

            console.error(
                "[Nakshatra] Render error:",
                error
            );


            const module =
                document.querySelector(
                    ".nakshatra-module"
                );


            if (module) {

                module.innerHTML = `
                    <div class="nakshatra-note">

                        Nakshatra load करते समय
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
        "nakshatra"
    ] = {

        init

    };


})(window);