(function (window) {

    "use strict";


    /* =========================================================
       PLANETS
    ========================================================= */

    const PLANET_NAMES = {

        Sun: {
            short: "Su",
            hindi: "सूर्य"
        },

        Moon: {
            short: "Mo",
            hindi: "चंद्र"
        },

        Mars: {
            short: "Ma",
            hindi: "मंगल"
        },

        Mercury: {
            short: "Me",
            hindi: "बुध"
        },

        Jupiter: {
            short: "Ju",
            hindi: "गुरु"
        },

        Venus: {
            short: "Ve",
            hindi: "शुक्र"
        },

        Saturn: {
            short: "Sa",
            hindi: "शनि"
        },

        Rahu: {
            short: "Ra",
            hindi: "राहु"
        },

        Ketu: {
            short: "Ke",
            hindi: "केतु"
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
       RASHI LORDS
    ========================================================= */

    const RASHI_LORDS = {

        aries: "Mars",
        taurus: "Venus",
        gemini: "Mercury",
        cancer: "Moon",
        leo: "Sun",
        virgo: "Mercury",
        libra: "Venus",
        scorpio: "Mars",
        sagittarius: "Jupiter",
        capricorn: "Saturn",
        aquarius: "Saturn",
        pisces: "Jupiter"

    };


    /* =========================================================
       HOUSE SIGNIFICATIONS
    ========================================================= */

    const HOUSE_MEANINGS = {

        1:
            "स्वभाव, शरीर, व्यक्तित्व, जीवन दिशा और self-image",

        2:
            "धन, परिवार, वाणी, भोजन, savings और values",

        3:
            "साहस, communication, छोटे भाई-बहन, प्रयास और skills",

        4:
            "माता, घर, property, vehicles, सुख और emotional foundation",

        5:
            "बुद्धि, शिक्षा, creativity, romance, children और purva punya",

        6:
            "ऋण, रोग, शत्रु, competition, service और daily work",

        7:
            "विवाह, spouse, partnership, public dealing और relationships",

        8:
            "आयु, transformation, joint assets, inheritance और hidden matters",

        9:
            "भाग्य, धर्म, गुरु, higher learning, father और long journeys",

        10:
            "career, profession, status, authority और karma",

        11:
            "income, gains, elder siblings, network और fulfilment",

        12:
            "expenses, foreign matters, isolation, sleep और spiritual release"

    };


    const HOUSE_TYPE = {

        1: "Kendra / Trikona",
        2: "Dhana",
        3: "Upachaya",
        4: "Kendra",
        5: "Trikona",
        6: "Upachaya / Dusthana",
        7: "Kendra",
        8: "Dusthana",
        9: "Trikona",
        10: "Kendra / Upachaya",
        11: "Upachaya",
        12: "Dusthana"

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
            typeof window.KundliState.getState !== "function"
        ) {
            throw new Error(
                "KundliState उपलब्ध नहीं है."
            );
        }

        return window.KundliState.getState();
    }


    function getRashiId(rashi) {

        if (!rashi) {
            return "";
        }

        return String(
            rashi.id ||
            ""
        ).toLowerCase();
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


    function planetHindi(id) {

        return PLANET_NAMES[id]
            ? PLANET_NAMES[id].hindi
            : id;
    }


    function planetShort(id) {

        return PLANET_NAMES[id]
            ? PLANET_NAMES[id].short
            : id;
    }


    function getPlanet(
        planets,
        id
    ) {

        return planets &&
            planets[id]
            ? planets[id]
            : null;
    }


    function getHouse(
        houses,
        number
    ) {

        return (
            houses || []
        ).find(
            function (house) {

                return Number(
                    house.house
                ) === number;

            }
        ) || null;
    }


    function getHousePlanets(
        planets,
        houseNumber
    ) {

        return PLANET_ORDER.filter(
            function (id) {

                const planet =
                    getPlanet(
                        planets,
                        id
                    );

                return (
                    planet &&
                    Number(
                        planet.house
                    ) === houseNumber
                );

            }
        );

    }


    /* =========================================================
       ASPECT HELPERS
    ========================================================= */

    function getAspectsForHouse(
        kundli,
        targetHouse
    ) {

        const aspects =
            Array.isArray(
                kundli.aspects
            )
                ? kundli.aspects
                : [];


        return aspects.filter(
            function (item) {

                return Number(
                    item.targetHouse
                ) === targetHouse;

            }
        );

    }


    function getAspectsFromHouse(
        kundli,
        sourceHouse
    ) {

        const aspects =
            Array.isArray(
                kundli.aspects
            )
                ? kundli.aspects
                : [];


        return aspects.filter(
            function (item) {

                return Number(
                    item.sourceHouse
                ) === sourceHouse;

            }
        );

    }


    /* =========================================================
       LORD
    ========================================================= */

    function getHouseLord(
        house
    ) {

        if (
            !house ||
            !house.rashi
        ) {
            return null;
        }


        const rashiId =
            getRashiId(
                house.rashi
            );


        const lord =
            RASHI_LORDS[rashiId];


        return lord || null;
    }


    /* =========================================================
       SUMMARY
    ========================================================= */

    function renderSummary(
        kundli
    ) {

        const lagna =
            kundli.lagna;

        const houses =
            kundli.houses || [];


        const seventh =
            getHouse(
                houses,
                7
            );

        const tenth =
            getHouse(
                houses,
                10
            );


        const occupied =
            houses.filter(
                function (house) {

                    return getHousePlanets(
                        kundli.planets,
                        Number(house.house)
                    ).length > 0;

                }
            ).length;


        const lagnaElement =
            document.getElementById(
                "bhavaLagna"
            );

        const lagnaDegreeElement =
            document.getElementById(
                "bhavaLagnaDegree"
            );

        const seventhElement =
            document.getElementById(
                "bhavaSeventh"
            );

        const seventhLordElement =
            document.getElementById(
                "bhavaSeventhLord"
            );

        const tenthElement =
            document.getElementById(
                "bhavaTenth"
            );

        const tenthLordElement =
            document.getElementById(
                "bhavaTenthLord"
            );

        const occupiedElement =
            document.getElementById(
                "bhavaOccupied"
            );


        if (lagnaElement) {

            lagnaElement.textContent =
                lagna && lagna.rashi
                    ? rashiHindi(
                        lagna.rashi
                    )
                    : "—";
        }


        if (lagnaDegreeElement) {

            lagnaDegreeElement.textContent =
                lagna &&
                lagna.degreeFormatted
                    ? lagna.degreeFormatted
                    : "—";
        }


        if (seventhElement) {

            seventhElement.textContent =
                seventh
                    ? rashiHindi(
                        seventh.rashi
                    )
                    : "—";
        }


        if (seventhLordElement) {

            const lord =
                getHouseLord(
                    seventh
                );

            seventhLordElement.textContent =
                lord
                    ? `भावेश: ${planetHindi(lord)}`
                    : "भावेश: —";
        }


        if (tenthElement) {

            tenthElement.textContent =
                tenth
                    ? rashiHindi(
                        tenth.rashi
                    )
                    : "—";
        }


        if (tenthLordElement) {

            const lord =
                getHouseLord(
                    tenth
                );

            tenthLordElement.textContent =
                lord
                    ? `भावेश: ${planetHindi(lord)}`
                    : "भावेश: —";
        }


        if (occupiedElement) {

            occupiedElement.textContent =
                String(occupied);
        }
    }


    /* =========================================================
       HOUSE CARDS
    ========================================================= */

    function renderHouseCards(
        kundli
    ) {

        const container =
            document.getElementById(
                "bhavaHouseGrid"
            );

        if (!container) {
            return;
        }


        const houses =
            Array.isArray(
                kundli.houses
            )
                ? kundli.houses
                : [];

        const planets =
            kundli.planets || {};


        if (houses.length !== 12) {

            container.innerHTML = `
                <div class="bhava-error">
                    12 Bhava data उपलब्ध नहीं है।
                </div>
            `;

            return;
        }


        container.innerHTML =
            houses.map(
                function (house) {

                    const number =
                        Number(
                            house.house
                        );

                    const lord =
                        getHouseLord(
                            house
                        );

                    const housePlanets =
                        getHousePlanets(
                            planets,
                            number
                        );


                    const classes = [
                        "bhava-house-card"
                    ];


                    if (number === 1) {
                        classes.push(
                            "is-lagna"
                        );
                    }


                    if (number === 7) {
                        classes.push(
                            "is-marriage"
                        );
                    }


                    const planetHTML =
                        housePlanets.length
                            ? housePlanets.map(
                                function (id) {

                                    const planet =
                                        getPlanet(
                                            planets,
                                            id
                                        );

                                    return `
                                        <span
                                            class="bhava-planet-pill"
                                            title="${escapeHTML(
                                                planetHindi(id)
                                            )}"
                                        >
                                            ${escapeHTML(
                                                planetShort(id)
                                            )}${
                                                planet &&
                                                planet.retrograde
                                                    ? " ℞"
                                                    : ""
                                            }
                                        </span>
                                    `;

                                }
                            ).join("")
                            : `
                                <span class="bhava-empty">
                                    कोई ग्रह नहीं
                                </span>
                            `;


                    return `
                        <article
                            class="${classes.join(" ")}"
                        >

                            <div class="bhava-house-top">

                                <span
                                    class="bhava-house-number"
                                >
                                    भाव ${number}
                                </span>

                                <span
                                    class="bhava-house-type"
                                >
                                    ${escapeHTML(
                                        HOUSE_TYPE[number]
                                    )}
                                </span>

                            </div>


                            <div class="bhava-house-rashi">
                                ${escapeHTML(
                                    rashiHindi(
                                        house.rashi
                                    )
                                )}
                            </div>


                            <div
                                class="bhava-house-rashi-en"
                            >
                                ${escapeHTML(
                                    rashiEnglish(
                                        house.rashi
                                    )
                                )}
                            </div>


                            <div class="bhava-house-lord">

                                <div
                                    class="bhava-house-lord-label"
                                >
                                    भावेश
                                </div>

                                <div
                                    class="bhava-house-lord-value"
                                >
                                    ${
                                        lord
                                            ? escapeHTML(
                                                planetHindi(lord)
                                            )
                                            : "—"
                                    }
                                </div>

                            </div>


                            <div class="bhava-house-planets">
                                ${planetHTML}
                            </div>


                            <div
                                class="bhava-signification"
                            >
                                ${escapeHTML(
                                    HOUSE_MEANINGS[number]
                                )}
                            </div>

                        </article>
                    `;

                }
            ).join("");
    }


    /* =========================================================
       ASPECT GRID
    ========================================================= */

    function renderAspectGrid(
        kundli
    ) {

        const container =
            document.getElementById(
                "bhavaAspectGrid"
            );

        if (!container) {
            return;
        }


        const aspects =
            Array.isArray(
                kundli.aspects
            )
                ? kundli.aspects
                : [];


        if (!aspects.length) {

            container.innerHTML = `
                <div class="bhava-error">
                    ग्रह दृष्टि data उपलब्ध नहीं है।
                </div>
            `;

            return;
        }


        container.innerHTML =
            aspects.map(
                function (item) {

                    const source =
                        item.source;

                    const sourceHouse =
                        Number(
                            item.sourceHouse
                        );

                    const targetHouse =
                        Number(
                            item.targetHouse
                        );

                    const aspect =
                        Number(
                            item.aspect
                        );


                    return `
                        <div
                            class="bhava-aspect-item"
                        >

                            <div>

                                <span
                                    class="bhava-aspect-source"
                                >
                                    ${escapeHTML(
                                        planetHindi(source)
                                    )}
                                </span>

                                <span
                                    class="bhava-aspect-arrow"
                                >
                                    →
                                </span>

                                <span
                                    class="bhava-aspect-target"
                                >
                                    भाव ${escapeHTML(
                                        targetHouse
                                    )}
                                </span>

                            </div>


                            <div
                                class="bhava-aspect-meta"
                            >
                                ${escapeHTML(
                                    planetShort(source)
                                )}
                                ·
                                source house ${escapeHTML(
                                    sourceHouse
                                )}
                                ·
                                ${escapeHTML(
                                    aspect
                                )}th aspect
                            </div>

                        </div>
                    `;

                }
            ).join("");
    }


    /* =========================================================
       DETAIL TABLE
    ========================================================= */

    function renderDetailTable(
        kundli
    ) {

        const tbody =
            document.getElementById(
                "bhavaDetailTable"
            );

        if (!tbody) {
            return;
        }


        const houses =
            Array.isArray(
                kundli.houses
            )
                ? kundli.houses
                : [];

        const planets =
            kundli.planets || {};


        tbody.innerHTML =
            houses.map(
                function (house) {

                    const number =
                        Number(
                            house.house
                        );

                    const lord =
                        getHouseLord(
                            house
                        );


                    const housePlanets =
                        getHousePlanets(
                            planets,
                            number
                        );


                    const incomingAspects =
                        getAspectsForHouse(
                            kundli,
                            number
                        );


                    const planetHTML =
                        housePlanets.length
                            ? housePlanets.map(
                                function (id) {

                                    const planet =
                                        getPlanet(
                                            planets,
                                            id
                                        );

                                    return `
                                        <span
                                            class="bhava-table-planet"
                                        >
                                            ${escapeHTML(
                                                planetHindi(id)
                                            )}${
                                                planet &&
                                                planet.retrograde
                                                    ? " ℞"
                                                    : ""
                                            }
                                        </span>
                                    `;

                                }
                            ).join("")
                            : `
                                <span
                                    class="bhava-table-empty"
                                >
                                    Empty
                                </span>
                            `;


                    const aspectHTML =
                        incomingAspects.length
                            ? incomingAspects.map(
                                function (item) {

                                    return `
                                        ${escapeHTML(
                                            planetHindi(
                                                item.source
                                            )
                                        )}
                                        →
                                        ${escapeHTML(
                                            String(
                                                item.aspect
                                            )
                                        )}th
                                    `;

                                }
                            ).join(", ")
                            : `
                                <span
                                    class="bhava-table-empty"
                                >
                                    कोई दर्ज दृष्टि नहीं
                                </span>
                            `;


                    return `
                        <tr>

                            <td>
                                <span
                                    class="bhava-table-house"
                                >
                                    ${number}
                                </span>
                            </td>


                            <td>
                                <span
                                    class="bhava-table-rashi"
                                >
                                    ${escapeHTML(
                                        rashiHindi(
                                            house.rashi
                                        )
                                    )}
                                </span>
                                <br>
                                <small>
                                    ${escapeHTML(
                                        rashiEnglish(
                                            house.rashi
                                        )
                                    )}
                                </small>
                            </td>


                            <td>
                                <span
                                    class="bhava-table-lord"
                                >
                                    ${
                                        lord
                                            ? escapeHTML(
                                                planetHindi(lord)
                                            )
                                            : "—"
                                    }
                                </span>
                            </td>


                            <td>
                                ${planetHTML}
                            </td>


                            <td>
                                <span
                                    class="bhava-aspect-list"
                                >
                                    ${aspectHTML}
                                </span>
                            </td>


                            <td>
                                ${escapeHTML(
                                    HOUSE_MEANINGS[number]
                                )}
                            </td>

                        </tr>
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
                "bhavaTitle"
            );

        const subtitle =
            document.getElementById(
                "bhavaSubtitle"
            );


        const name =
            kundli.input &&
            kundli.input.name
                ? kundli.input.name
                : "Kundli";


        if (title) {

            title.textContent =
                `${name} — Bhava`;
        }


        if (subtitle) {

            subtitle.textContent =
                "12 भावों में राशि, भावेश, ग्रह और दृष्टि की स्थिति।";
        }
    }


    /* =========================================================
       MAIN
    ========================================================= */

    function render() {

        const state =
            getState();

        const kundli =
            state.kundliA;


        if (!kundli) {

            const module =
                document.querySelector(
                    ".bhava-module"
                );

            if (module) {

                module.innerHTML = `
                    <div class="bhava-error">
                        Bhava data उपलब्ध नहीं है।
                        पहले Birth Details में Kundli generate करें।
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

        renderHouseCards(
            kundli
        );

        renderAspectGrid(
            kundli
        );

        renderDetailTable(
            kundli
        );


        console.log(
            "[Bhava] Rendered successfully."
        );
    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        console.log(
            "[Bhava] Module initialized."
        );


        try {

            render();

        } catch (error) {

            console.error(
                "[Bhava] Render error:",
                error
            );


            const module =
                document.querySelector(
                    ".bhava-module"
                );


            if (module) {

                module.innerHTML = `
                    <div class="bhava-error">
                        Bhava load करते समय error आया:
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
        "bhava"
    ] = {
        init
    };


})(window);