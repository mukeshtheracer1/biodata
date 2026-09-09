/* =========================================================
   MARRIAGE MODULE
   =========================================================

   IMPORTANT:
   - No dummy data.
   - No random values.
   - Uses actual KundliState.kundliA.
   - Uses actual planetary positions from Kundli Engine.
   - Missing data is shown as unavailable.
   - This module gives astrological indicators, not guaranteed
     real-world predictions.
   ========================================================= */

(function () {
    "use strict";

    const MODULE_ID = "marriage";

    const RASHIS = [
        { name: "Aries", hindi: "मेष" },
        { name: "Taurus", hindi: "वृषभ" },
        { name: "Gemini", hindi: "मिथुन" },
        { name: "Cancer", hindi: "कर्क" },
        { name: "Leo", hindi: "सिंह" },
        { name: "Virgo", hindi: "कन्या" },
        { name: "Libra", hindi: "तुला" },
        { name: "Scorpio", hindi: "वृश्चिक" },
        { name: "Sagittarius", hindi: "धनु" },
        { name: "Capricorn", hindi: "मकर" },
        { name: "Aquarius", hindi: "कुंभ" },
        { name: "Pisces", hindi: "मीन" }
    ];

    const PLANET_INFO = {
        Sun: {
            hindi: "सूर्य"
        },
        Moon: {
            hindi: "चंद्र"
        },
        Mars: {
            hindi: "मंगल"
        },
        Mercury: {
            hindi: "बुध"
        },
        Jupiter: {
            hindi: "गुरु"
        },
        Venus: {
            hindi: "शुक्र"
        },
        Saturn: {
            hindi: "शनि"
        },
        Rahu: {
            hindi: "राहु"
        },
        Ketu: {
            hindi: "केतु"
        }
    };

    const HOUSE_LORDS = {
        Aries: "Mars",
        Taurus: "Venus",
        Gemini: "Mercury",
        Cancer: "Moon",
        Leo: "Sun",
        Virgo: "Mercury",
        Libra: "Venus",
        Scorpio: "Mars",
        Sagittarius: "Jupiter",
        Capricorn: "Saturn",
        Aquarius: "Saturn",
        Pisces: "Jupiter"
    };

    const HINDI_PLANETS = {
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


    /* =====================================================
       BASIC HELPERS
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

        return null;
    }

    function getKundli() {
        const state = getState();

        return state && state.kundliA
            ? state.kundliA
            : null;
    }

    function getPlanet(kundli, id) {
        if (!kundli || !kundli.planets) {
            return null;
        }

        if (kundli.planets[id]) {
            return kundli.planets[id];
        }

        const wanted = String(id).toLowerCase();

        for (const key of Object.keys(kundli.planets)) {
            if (String(key).toLowerCase() === wanted) {
                return kundli.planets[key];
            }
        }

        return null;
    }

    function getLagna(kundli) {
        if (!kundli) {
            return null;
        }

        return (
            kundli.lagna ||
            kundli.ascendant ||
            kundli.asc ||
            null
        );
    }

    function getHouse(entity) {
        if (!entity) {
            return null;
        }

        const candidates = [
            entity.house,
            entity.houseNumber,
            entity.bhava
        ];

        for (const value of candidates) {
            const number = Number(value);

            if (
                Number.isFinite(number) &&
                number >= 1 &&
                number <= 12
            ) {
                return number;
            }
        }

        return null;
    }

    function normalizeSignIndex(value) {
        if (
            typeof value === "number" &&
            Number.isFinite(value)
        ) {
            const rounded = Math.round(value);

            if (rounded >= 0 && rounded <= 11) {
                return rounded;
            }

            if (rounded >= 1 && rounded <= 12) {
                return rounded - 1;
            }
        }

        if (!value) {
            return null;
        }

        const text = String(value)
            .trim()
            .toLowerCase();

        const byName = RASHIS.findIndex(
            item => item.name.toLowerCase() === text
        );

        if (byName >= 0) {
            return byName;
        }

        const byHindi = RASHIS.findIndex(
            item => item.hindi === String(value).trim()
        );

        if (byHindi >= 0) {
            return byHindi;
        }

        return null;
    }

    function getSignIndex(entity) {
        if (!entity) {
            return null;
        }

        const directCandidates = [
            entity.rashiIndex,
            entity.signIndex
        ];

        for (const value of directCandidates) {
            const result = normalizeSignIndex(value);

            if (result !== null) {
                return result;
            }
        }

        if (
            typeof entity.rashiNumber === "number"
        ) {
            return normalizeSignIndex(
                entity.rashiNumber - 1
            );
        }

        if (
            typeof entity.signNumber === "number"
        ) {
            return normalizeSignIndex(
                entity.signNumber - 1
            );
        }

        if (entity.rashi) {

            if (typeof entity.rashi === "object") {

                const nested =
                    normalizeSignIndex(
                        entity.rashi.name ||
                        entity.rashi.hindi ||
                        entity.rashi.id
                    );

                if (nested !== null) {
                    return nested;
                }
            }

            const rashiIndex =
                normalizeSignIndex(entity.rashi);

            if (rashiIndex !== null) {
                return rashiIndex;
            }
        }

        if (entity.sign) {

            const signIndex =
                normalizeSignIndex(entity.sign);

            if (signIndex !== null) {
                return signIndex;
            }
        }

        const longitude =
            getLongitude(entity);

        if (longitude !== null) {
            return Math.floor(
                longitude / 30
            );
        }

        return null;
    }

    function getLongitude(entity) {
        if (!entity) {
            return null;
        }

        const candidates = [
            entity.siderealLongitude,
            entity.longitude,
            entity.degree,
            entity.degrees
        ];

        for (const value of candidates) {
            const number = Number(value);

            if (Number.isFinite(number)) {
                return number;
            }
        }

        return null;
    }

    function formatDegree(value) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            return "—";
        }

        let degree =
            ((number % 360) + 360) % 360;

        const signIndex =
            Math.floor(degree / 30);

        let degreeInSign =
            degree - signIndex * 30;

        let whole =
            Math.floor(degreeInSign);

        let minutes =
            Math.round(
                (degreeInSign - whole) * 60
            );

        if (minutes === 60) {
            whole += 1;
            minutes = 0;
        }

        return `${whole}° ${String(minutes).padStart(2, "0")}′`;
    }

    function getRashiLabel(entity) {
        const index = getSignIndex(entity);

        if (index === null) {
            return "—";
        }

        return `${RASHIS[index].hindi} (${RASHIS[index].name})`;
    }

    function getPlanetLabel(id) {
        const info = PLANET_INFO[id];

        if (!info) {
            return id;
        }

        return `${info.hindi} (${id})`;
    }

    function getPlanetShortLabel(id) {
        return HINDI_PLANETS[id] || id;
    }


    /* =====================================================
       HOUSE / LORD LOGIC
       ===================================================== */

    function getLagnaSignIndex(kundli) {
        const lagna = getLagna(kundli);

        return getSignIndex(lagna);
    }

    function getHouseSignIndex(kundli, houseNumber) {
        const lagnaSign =
            getLagnaSignIndex(kundli);

        if (lagnaSign === null) {
            return null;
        }

        return (
            (lagnaSign + houseNumber - 1) % 12
        );
    }

    function getHouseLord(kundli, houseNumber) {
        const signIndex =
            getHouseSignIndex(
                kundli,
                houseNumber
            );

        if (signIndex === null) {
            return null;
        }

        const sign =
            RASHIS[signIndex];

        return HOUSE_LORDS[sign.name] || null;
    }

    function getHouseLordPosition(
        kundli,
        houseNumber
    ) {
        const lord =
            getHouseLord(
                kundli,
                houseNumber
            );

        if (!lord) {
            return null;
        }

        const planet =
            getPlanet(
                kundli,
                lord
            );

        if (!planet) {
            return null;
        }

        return {
            planet: lord,
            data: planet,
            house: getHouse(planet),
            signIndex: getSignIndex(planet)
        };
    }

    function getRelativeHouse(
        fromSign,
        toSign
    ) {
        if (
            fromSign === null ||
            toSign === null
        ) {
            return null;
        }

        return (
            (toSign - fromSign + 12) % 12
        ) + 1;
    }


    /* =====================================================
       7TH HOUSE DATA
       ===================================================== */

    function buildSeventhHouseData(kundli) {
        const signIndex =
            getHouseSignIndex(
                kundli,
                7
            );

        const lord =
            getHouseLord(
                kundli,
                7
            );

        const lordPosition =
            getHouseLordPosition(
                kundli,
                7
            );

        return {
            house: 7,
            signIndex,
            sign: signIndex !== null
                ? RASHIS[signIndex]
                : null,
            lord,
            lordPosition
        };
    }


    /* =====================================================
       ASPECT EXTRACTION
       ===================================================== */

    function getAspects(kundli) {
        if (
            !kundli ||
            !Array.isArray(kundli.aspects)
        ) {
            return [];
        }

        return kundli.aspects;
    }

    function getSeventhHouseAspects(kundli) {
        const aspects =
            getAspects(kundli);

        return aspects.filter(aspect => {

            const target =
                Number(
                    aspect.targetHouse ??
                    aspect.house ??
                    aspect.target
                );

            return target === 7;
        });
    }


    /* =====================================================
       PLANETARY CONNECTIONS
       ===================================================== */

    function sameHouse(
        planetA,
        planetB
    ) {
        const houseA =
            getHouse(planetA);

        const houseB =
            getHouse(planetB);

        return (
            houseA !== null &&
            houseB !== null &&
            houseA === houseB
        );
    }

    function getConjunctionsForPlanet(
        kundli,
        planetId
    ) {
        const source =
            getPlanet(
                kundli,
                planetId
            );

        if (!source) {
            return [];
        }

        const result = [];

        Object.keys(HINDI_PLANETS)
            .forEach(otherId => {

                if (otherId === planetId) {
                    return;
                }

                const other =
                    getPlanet(
                        kundli,
                        otherId
                    );

                if (
                    other &&
                    sameHouse(
                        source,
                        other
                    )
                ) {
                    result.push(otherId);
                }
            });

        return result;
    }


    /* =====================================================
       INDICATOR ENGINE
       ===================================================== */

    function buildIndicators(kundli) {
        const indicators = [];

        const seventh =
            buildSeventhHouseData(
                kundli
            );

        const venus =
            getPlanet(
                kundli,
                "Venus"
            );

        const jupiter =
            getPlanet(
                kundli,
                "Jupiter"
            );

        const moon =
            getPlanet(
                kundli,
                "Moon"
            );

        const mars =
            getPlanet(
                kundli,
                "Mars"
            );

        const saturn =
            getPlanet(
                kundli,
                "Saturn"
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

        const lordPosition =
            seventh.lordPosition;


        /* -----------------------------------------------
           7th LORD
           ----------------------------------------------- */

        if (lordPosition) {

            if (
                lordPosition.house === 1 ||
                lordPosition.house === 4 ||
                lordPosition.house === 5 ||
                lordPosition.house === 7 ||
                lordPosition.house === 9 ||
                lordPosition.house === 10 ||
                lordPosition.house === 11
            ) {

                indicators.push({
                    type: "supportive",
                    title: "7th Lord Placement",
                    text:
                        `7th lord ${getPlanetLabel(
                            lordPosition.planet
                        )} is placed in house ${
                            lordPosition.house
                        }, which is being recorded as a supportive placement for this analysis.`
                });

            } else {

                indicators.push({
                    type: "neutral",
                    title: "7th Lord Placement",
                    text:
                        `7th lord ${getPlanetLabel(
                            lordPosition.planet
                        )} is placed in house ${
                            lordPosition.house
                        }. Its complete interpretation requires the other chart factors shown below.`
                });
            }
        }


        /* -----------------------------------------------
           7th LORD IN 6 / 8 / 12
           ----------------------------------------------- */

        if (
            lordPosition &&
            [6, 8, 12].includes(
                lordPosition.house
            )
        ) {

            indicators.push({
                type: "challenging",
                title: "7th Lord in 6th / 8th / 12th",
                text:
                    `The 7th lord is in house ${
                        lordPosition.house
                    }. Traditionally these houses require closer examination in marriage analysis.`
            });
        }


        /* -----------------------------------------------
           VENUS IN 7TH
           ----------------------------------------------- */

        if (venus) {

            const venusHouse =
                getHouse(venus);

            if (venusHouse === 7) {

                indicators.push({
                    type: "supportive",
                    title: "Venus in 7th House",
                    text:
                        "Venus is actually placed in the 7th house, making Venus directly relevant to the marriage axis."
                });
            }
        }


        /* -----------------------------------------------
           JUPITER IN 7TH
           ----------------------------------------------- */

        if (jupiter) {

            const jupiterHouse =
                getHouse(jupiter);

            if (jupiterHouse === 7) {

                indicators.push({
                    type: "supportive",
                    title: "Jupiter in 7th House",
                    text:
                        "Jupiter is actually placed in the 7th house and therefore directly influences the marriage house."
                });
            }
        }


        /* -----------------------------------------------
           SATURN IN 7TH
           ----------------------------------------------- */

        if (saturn) {

            const saturnHouse =
                getHouse(saturn);

            if (saturnHouse === 7) {

                indicators.push({
                    type: "challenging",
                    title: "Saturn in 7th House",
                    text:
                        "Saturn is actually placed in the 7th house. Traditionally this calls for careful evaluation of responsibility, delay and relationship maturity."
                });
            }
        }


        /* -----------------------------------------------
           MARS IN 7TH
           ----------------------------------------------- */

        if (mars) {

            const marsHouse =
                getHouse(mars);

            if (marsHouse === 7) {

                indicators.push({
                    type: "challenging",
                    title: "Mars in 7th House",
                    text:
                        "Mars is actually placed in the 7th house. This is relevant both to marriage analysis and the separate Manglik analysis."
                });
            }
        }


        /* -----------------------------------------------
           RAHU / KETU IN 7TH
           ----------------------------------------------- */

        if (rahu) {

            const rahuHouse =
                getHouse(rahu);

            if (rahuHouse === 7) {

                indicators.push({
                    type: "challenging",
                    title: "Rahu in 7th House",
                    text:
                        "Rahu is actually placed in the 7th house and therefore requires specific evaluation of expectations, unconventional patterns and relationship dynamics."
                });
            }
        }

        if (ketu) {

            const ketuHouse =
                getHouse(ketu);

            if (ketuHouse === 7) {

                indicators.push({
                    type: "challenging",
                    title: "Ketu in 7th House",
                    text:
                        "Ketu is actually placed in the 7th house and therefore requires specific evaluation of detachment and relationship expectations."
                });
            }
        }


        /* -----------------------------------------------
           7TH HOUSE ASPECTS
           ----------------------------------------------- */

        const seventhAspects =
            getSeventhHouseAspects(
                kundli
            );

        seventhAspects.forEach(
            aspect => {

                const source =
                    aspect.source ||
                    aspect.planet ||
                    aspect.from ||
                    "Planet";

                const sourceId =
                    Object.keys(HINDI_PLANETS)
                        .find(
                            key =>
                                key.toLowerCase() ===
                                String(source)
                                    .toLowerCase()
                        );

                const sourcePlanet =
                    sourceId
                        ? getPlanet(
                            kundli,
                            sourceId
                        )
                        : null;

                const sourceHouse =
                    getHouse(
                        sourcePlanet
                    );

                indicators.push({
                    type: "supportive",
                    title: "7th House Aspect",
                    text:
                        `${sourceId
                            ? getPlanetLabel(sourceId)
                            : source
                        } has an engine-recorded aspect toward the 7th house${
                            sourceHouse !== null
                                ? ` from house ${sourceHouse}`
                                : ""
                        }.`
                });
            }
        );


        /* -----------------------------------------------
           VENUS CONJUNCTION
           ----------------------------------------------- */

        if (venus) {

            const conjunctions =
                getConjunctionsForPlanet(
                    kundli,
                    "Venus"
                );

            if (conjunctions.length) {

                indicators.push({
                    type: "neutral",
                    title: "Venus Conjunction",
                    text:
                        `Venus shares its house with ${conjunctions
                            .map(getPlanetShortLabel)
                            .join(", ")}. The exact conjunction is shown in the planetary evidence below.`
                });
            }
        }


        /* -----------------------------------------------
           JUPITER CONJUNCTION
           ----------------------------------------------- */

        if (jupiter) {

            const conjunctions =
                getConjunctionsForPlanet(
                    kundli,
                    "Jupiter"
                );

            if (conjunctions.length) {

                indicators.push({
                    type: "neutral",
                    title: "Jupiter Conjunction",
                    text:
                        `Jupiter shares its house with ${conjunctions
                            .map(getPlanetShortLabel)
                            .join(", ")}.`
                });
            }
        }


        /* -----------------------------------------------
           MOON / VENUS CONNECTION
           ----------------------------------------------- */

        if (
            moon &&
            venus &&
            sameHouse(
                moon,
                venus
            )
        ) {

            indicators.push({
                type: "supportive",
                title: "Moon–Venus Same House",
                text:
                    "Moon and Venus are actually placed in the same house, creating a direct emotional/relationship connection that is relevant to marriage analysis."
            });
        }


        /* -----------------------------------------------
           7TH LORD WITH NATURAL BENEFICS
           ----------------------------------------------- */

        if (
            lordPosition &&
            ["Jupiter", "Venus", "Mercury", "Moon"]
                .includes(
                    lordPosition.planet
                )
        ) {

            indicators.push({
                type: "supportive",
                title: "Natural Benefic as 7th Lord",
                text:
                    `${getPlanetLabel(
                        lordPosition.planet
                    )} is the calculated 7th lord. Its actual placement is shown in the 7th-house section.`
            });
        }


        return indicators;
    }


    /* =====================================================
       OVERALL INTERPRETATION
       ===================================================== */

    function buildOverall(indicators, seventh) {

        const supportive =
            indicators.filter(
                item =>
                    item.type === "supportive"
            ).length;

        const challenging =
            indicators.filter(
                item =>
                    item.type === "challenging"
            ).length;

        if (
            supportive === 0 &&
            challenging === 0
        ) {
            return {
                title: "Insufficient Interpretation Data",
                description:
                    "The available calculated Kundli data does not provide enough specific marriage indicators for a meaningful summary.",
                score: "—"
            };
        }

        if (
            supportive > challenging
        ) {
            return {
                title: "More Supportive Indicators",
                description:
                    "The currently evaluated factors contain more supportive indicators than challenging indicators. This is an astrological indication summary, not a guaranteed outcome.",
                score:
                    `${supportive} / ${challenging}`
            };
        }

        if (
            challenging > supportive
        ) {
            return {
                title: "More Factors Need Attention",
                description:
                    "The currently evaluated factors contain more challenging indicators than supportive indicators. These should be examined together with the complete chart rather than interpreted in isolation.",
                score:
                    `${supportive} / ${challenging}`
            };
        }

        return {
            title: "Mixed Indicators",
            description:
                "The evaluated chart factors contain both supportive and challenging indicators. A balanced interpretation is required.",
            score:
                `${supportive} / ${challenging}`
        };
    }


    /* =====================================================
       RENDER HELPERS
       ===================================================== */

    function renderEmpty(
        container,
        message
    ) {
        container.innerHTML = `
            <div class="marriage-empty">

                <h3>
                    Marriage analysis unavailable
                </h3>

                <p>
                    ${escapeHTML(
                        message ||
                        "पहले Birth Details से Kundli Generate करें।"
                    )}
                </p>

            </div>
        `;
    }


    function renderOverview(
        overall
    ) {
        return `
            <section class="marriage-card marriage-overview">

                <div class="marriage-overview-icon">
                    ♡
                </div>

                <div class="marriage-overview-main">

                    <h3>
                        ${escapeHTML(
                            overall.title
                        )}
                    </h3>

                    <p>
                        ${escapeHTML(
                            overall.description
                        )}
                    </p>

                </div>

                <div class="marriage-overview-score">

                    <strong>
                        ${escapeHTML(
                            overall.score
                        )}
                    </strong>

                    <span>
                        Supportive / Attention
                    </span>

                </div>

            </section>
        `;
    }


    function renderSeventhHouse(
        seventh
    ) {
        const signText =
            seventh.sign
                ? `${seventh.sign.hindi} (${seventh.sign.name})`
                : "—";

        const lordText =
            seventh.lord
                ? getPlanetLabel(
                    seventh.lord
                )
                : "—";

        const lordHouse =
            seventh.lordPosition &&
            seventh.lordPosition.house !== null
                ? `House ${seventh.lordPosition.house}`
                : "—";

        return `
            <section class="marriage-card">

                <div class="marriage-card-title">

                    <h3>
                        7th House / सप्तम भाव
                    </h3>

                    <span>
                        Marriage house
                    </span>

                </div>

                <div class="marriage-seventh-house">

                    <div class="marriage-house-box">

                        <span class="marriage-house-box-label">
                            7th House Sign
                        </span>

                        <strong class="marriage-house-box-value">
                            ${escapeHTML(
                                signText
                            )}
                        </strong>

                        <span class="marriage-house-box-sub">
                            House 7
                        </span>

                    </div>


                    <div class="marriage-house-box">

                        <span class="marriage-house-box-label">
                            7th Lord / सप्तमेश
                        </span>

                        <strong class="marriage-house-box-value">
                            ${escapeHTML(
                                lordText
                            )}
                        </strong>

                        <span class="marriage-house-box-sub">
                            Calculated from 7th house sign
                        </span>

                    </div>


                    <div class="marriage-house-box">

                        <span class="marriage-house-box-label">
                            7th Lord Placement
                        </span>

                        <strong class="marriage-house-box-value">
                            ${escapeHTML(
                                lordHouse
                            )}
                        </strong>

                        <span class="marriage-house-box-sub">
                            Actual planetary placement
                        </span>

                    </div>

                </div>

            </section>
        `;
    }


    function renderKeyFacts(
        kundli,
        seventh
    ) {
        const lagna =
            getLagna(kundli);

        const venus =
            getPlanet(
                kundli,
                "Venus"
            );

        const jupiter =
            getPlanet(
                kundli,
                "Jupiter"
            );

        return `
            <section class="marriage-card">

                <div class="marriage-card-title">

                    <h3>
                        Key Marriage Factors
                    </h3>

                    <span>
                        Actual chart positions
                    </span>

                </div>


                <div class="marriage-facts">

                    <div class="marriage-fact">

                        <span class="marriage-fact-label">
                            Lagna
                        </span>

                        <strong class="marriage-fact-value">
                            ${escapeHTML(
                                getRashiLabel(lagna)
                            )}
                        </strong>

                    </div>


                    <div class="marriage-fact">

                        <span class="marriage-fact-label">
                            7th House
                        </span>

                        <strong class="marriage-fact-value">
                            ${escapeHTML(
                                seventh.sign
                                    ? `${seventh.sign.hindi} (${seventh.sign.name})`
                                    : "—"
                            )}
                        </strong>

                    </div>


                    <div class="marriage-fact">

                        <span class="marriage-fact-label">
                            Venus / शुक्र
                        </span>

                        <strong class="marriage-fact-value">
                            ${escapeHTML(
                                venus
                                    ? `House ${getHouse(venus) ?? "—"}`
                                    : "—"
                            )}
                        </strong>

                    </div>


                    <div class="marriage-fact">

                        <span class="marriage-fact-label">
                            Jupiter / गुरु
                        </span>

                        <strong class="marriage-fact-value">
                            ${escapeHTML(
                                jupiter
                                    ? `House ${getHouse(jupiter) ?? "—"}`
                                    : "—"
                            )}
                        </strong>

                    </div>

                </div>

            </section>
        `;
    }


    function renderPlanetCard(
        id,
        planet
    ) {
        if (!planet) {
            return `
                <article class="marriage-planet">

                    <div class="marriage-planet-head">

                        <div>
                            <div class="marriage-planet-name">
                                ${escapeHTML(
                                    getPlanetLabel(id)
                                )}
                            </div>

                            <div class="marriage-planet-hindi">
                                Data unavailable
                            </div>
                        </div>

                    </div>

                    <div class="marriage-planet-details">

                        <div class="marriage-planet-detail">
                            <span>House</span>
                            <strong>—</strong>
                        </div>

                        <div class="marriage-planet-detail">
                            <span>Rashi</span>
                            <strong>—</strong>
                        </div>

                    </div>

                </article>
            `;
        }

        const house =
            getHouse(planet);

        const longitude =
            getLongitude(planet);

        return `
            <article class="marriage-planet">

                <div class="marriage-planet-head">

                    <div>

                        <div class="marriage-planet-name">
                            ${escapeHTML(
                                getPlanetLabel(id)
                            )}
                        </div>

                        <div class="marriage-planet-hindi">
                            Marriage relevance
                        </div>

                    </div>

                    <span class="marriage-planet-house">
                        ${house !== null
                            ? `House ${house}`
                            : "House —"}
                    </span>

                </div>


                <div class="marriage-planet-details">

                    <div class="marriage-planet-detail">

                        <span>
                            Rashi
                        </span>

                        <strong>
                            ${escapeHTML(
                                getRashiLabel(
                                    planet
                                )
                            )}
                        </strong>

                    </div>


                    <div class="marriage-planet-detail">

                        <span>
                            Degree
                        </span>

                        <strong>
                            ${escapeHTML(
                                formatDegree(
                                    longitude
                                )
                            )}
                        </strong>

                    </div>

                </div>

            </article>
        `;
    }


    function renderPlanets(
        kundli
    ) {
        const ids = [
            "Venus",
            "Jupiter",
            "Moon",
            "Mars",
            "Saturn",
            "Rahu",
            "Ketu"
        ];

        return `
            <section class="marriage-card">

                <div class="marriage-card-title">

                    <h3>
                        Marriage-Relevant Planetary Positions
                    </h3>

                    <span>
                        Actual calculated positions
                    </span>

                </div>

                <div class="marriage-planet-grid">

                    ${ids
                        .map(
                            id =>
                                renderPlanetCard(
                                    id,
                                    getPlanet(
                                        kundli,
                                        id
                                    )
                                )
                        )
                        .join("")}

                </div>

            </section>
        `;
    }


    function renderIndicators(
        indicators
    ) {
        if (!indicators.length) {

            return `
                <section class="marriage-card">

                    <div class="marriage-card-title">

                        <h3>
                            Marriage Indicators
                        </h3>

                        <span>
                            Calculated rules
                        </span>

                    </div>

                    <div class="marriage-empty">

                        <h3>
                            No specific indicator detected
                        </h3>

                        <p>
                            Available chart data did not trigger
                            any of the defined marriage-analysis
                            rules.
                        </p>

                    </div>

                </section>
            `;
        }

        return `
            <section class="marriage-card">

                <div class="marriage-card-title">

                    <h3>
                        Marriage Indicators
                    </h3>

                    <span>
                        Rule-based chart evidence
                    </span>

                </div>

                <div class="marriage-indicator-grid">

                    ${indicators
                        .map(item => {

                            const label =
                                item.type === "supportive"
                                    ? "Supportive"
                                    : item.type === "challenging"
                                        ? "Attention"
                                        : "Neutral";

                            return `
                                <article class="marriage-indicator">

                                    <div class="marriage-indicator-head">

                                        <div class="marriage-indicator-name">
                                            ${escapeHTML(
                                                item.title
                                            )}
                                        </div>

                                        <span class="marriage-indicator-status ${item.type}">
                                            ${label}
                                        </span>

                                    </div>

                                    <p>
                                        ${escapeHTML(
                                            item.text
                                        )}
                                    </p>

                                </article>
                            `;
                        })
                        .join("")}

                </div>

            </section>
        `;
    }


    function renderAspects(
        kundli
    ) {
        const aspects =
            getSeventhHouseAspects(
                kundli
            );

        if (!aspects.length) {

            return `
                <section class="marriage-card">

                    <div class="marriage-card-title">

                        <h3>
                            7th House Aspects
                        </h3>

                        <span>
                            Engine-recorded aspects
                        </span>

                    </div>

                    <div class="marriage-empty">

                        <h3>
                            No 7th-house aspect data
                        </h3>

                        <p>
                            The current Kundli engine did not
                            return an aspect entry targeting
                            the 7th house.
                        </p>

                    </div>

                </section>
            `;
        }

        return `
            <section class="marriage-card">

                <div class="marriage-card-title">

                    <h3>
                        7th House Aspects
                    </h3>

                    <span>
                        Actual engine output
                    </span>

                </div>

                <div class="marriage-aspect-list">

                    ${aspects
                        .map(aspect => {

                            const source =
                                aspect.source ||
                                aspect.planet ||
                                aspect.from ||
                                "Planet";

                            const targetHouse =
                                aspect.targetHouse ??
                                aspect.house ??
                                aspect.target ??
                                "—";

                            const sourceId =
                                Object.keys(
                                    HINDI_PLANETS
                                ).find(
                                    key =>
                                        key.toLowerCase() ===
                                        String(source)
                                            .toLowerCase()
                                );

                            return `
                                <div class="marriage-aspect-row">

                                    <div class="marriage-aspect-source">
                                        ${escapeHTML(
                                            sourceId
                                                ? getPlanetLabel(
                                                    sourceId
                                                )
                                                : source
                                        )}
                                    </div>

                                    <div class="marriage-aspect-description">
                                        Engine-recorded aspect toward
                                        marriage house.
                                    </div>

                                    <div class="marriage-aspect-house">
                                        House ${escapeHTML(
                                            targetHouse
                                        )}
                                    </div>

                                </div>
                            `;
                        })
                        .join("")}

                </div>

            </section>
        `;
    }


    function renderAnalysisSummary(
        indicators
    ) {
        const supportive =
            indicators.filter(
                item =>
                    item.type === "supportive"
            );

        const challenging =
            indicators.filter(
                item =>
                    item.type === "challenging"
            );

        return `
            <section class="marriage-card">

                <div class="marriage-card-title">

                    <h3>
                        Interpretation Summary
                    </h3>

                    <span>
                        Based on detected indicators
                    </span>

                </div>


                <div class="marriage-analysis-list">

                    ${
                        supportive.length
                            ? supportive
                                .map(
                                    item => `
                                        <div class="marriage-analysis-item supportive">

                                            <div class="marriage-analysis-dot">
                                                +
                                            </div>

                                            <div>

                                                <strong>
                                                    ${escapeHTML(
                                                        item.title
                                                    )}
                                                </strong>

                                                <p>
                                                    ${escapeHTML(
                                                        item.text
                                                    )}
                                                </p>

                                            </div>

                                        </div>
                                    `
                                )
                                .join("")
                            : `
                                <div class="marriage-analysis-item">

                                    <div class="marriage-analysis-dot">
                                        —
                                    </div>

                                    <div>

                                        <strong>
                                            No specific supportive rule triggered
                                        </strong>

                                        <p>
                                            No defined supportive marriage rule
                                            was triggered from the available data.
                                        </p>

                                    </div>

                                </div>
                            `
                    }


                    ${
                        challenging.length
                            ? challenging
                                .map(
                                    item => `
                                        <div class="marriage-analysis-item challenging">

                                            <div class="marriage-analysis-dot">
                                                !
                                            </div>

                                            <div>

                                                <strong>
                                                    ${escapeHTML(
                                                        item.title
                                                    )}
                                                </strong>

                                                <p>
                                                    ${escapeHTML(
                                                        item.text
                                                    )}
                                                </p>

                                            </div>

                                        </div>
                                    `
                                )
                                .join("")
                            : `
                                <div class="marriage-analysis-item">

                                    <div class="marriage-analysis-dot">
                                        ✓
                                    </div>

                                    <div>

                                        <strong>
                                            No defined attention indicator triggered
                                        </strong>

                                        <p>
                                            None of the currently defined
                                            attention rules was triggered.
                                        </p>

                                    </div>

                                </div>
                            `
                    }

                </div>

            </section>
        `;
    }


    function renderNote() {
        return `
            <div class="marriage-note">

                <strong>
                    Important Interpretation Note
                </strong>

                <p>
                    यह module traditional Vedic astrology के
                    calculated chart indicators को organize करता है।
                    इसे guaranteed marriage outcome, exact marriage
                    date या निश्चित भविष्यवाणी के रूप में नहीं लेना चाहिए।
                    Complete interpretation में D1, Navamsa D9, Dasha,
                    Yog, Dosha, Manglik और Timing को साथ देखना चाहिए।
                </p>

            </div>
        `;
    }


    /* =====================================================
       ENGINE BADGE
       ===================================================== */

    function updateEngineBadge(
        kundli
    ) {
        const badge =
            document.getElementById(
                "marriageEngineBadge"
            );

        if (!badge) {
            return;
        }

        const provider =
            kundli?.engine?.provider ||
            kundli?.provider ||
            "Kundli Engine";

        const ayanamsha =
            kundli?.engine?.ayanamsha ||
            kundli?.ayanamsha ||
            "Lahiri";

        const houseSystem =
            kundli?.engine?.houseSystem ||
            kundli?.houseSystem ||
            "Whole Sign";

        badge.textContent =
            `${provider} • ${ayanamsha} • ${houseSystem}`;
    }


    /* =====================================================
       MAIN RENDER
       ===================================================== */

    function render(
        kundli
    ) {
        const container =
            document.getElementById(
                "marriageContent"
            );

        if (!container) {
            return;
        }

        if (!kundli) {

            renderEmpty(
                container,
                "Kundli data available नहीं है। पहले Birth Details से Kundli Generate करें।"
            );

            return;
        }

        const lagna =
            getLagna(kundli);

        if (!lagna) {

            renderEmpty(
                container,
                "Calculated Kundli में Lagna data उपलब्ध नहीं है। Marriage analysis के लिए Lagna आवश्यक है।"
            );

            return;
        }

        const seventh =
            buildSeventhHouseData(
                kundli
            );

        if (
            seventh.signIndex === null
        ) {

            renderEmpty(
                container,
                "7th house calculation के लिए Lagna/Rashi data उपलब्ध नहीं है।"
            );

            return;
        }

        const indicators =
            buildIndicators(
                kundli
            );

        const overall =
            buildOverall(
                indicators,
                seventh
            );

        container.innerHTML = `

            ${renderOverview(
                overall
            )}

            ${renderKeyFacts(
                kundli,
                seventh
            )}

            ${renderSeventhHouse(
                seventh
            )}

            ${renderPlanets(
                kundli
            )}

            ${renderIndicators(
                indicators
            )}

            ${renderAspects(
                kundli
            )}

            ${renderAnalysisSummary(
                indicators
            )}

            ${renderNote()}

        `;

        updateEngineBadge(
            kundli
        );
    }


    /* =====================================================
       INIT
       ===================================================== */

    function init() {

        const kundli =
            getKundli();

        render(
            kundli
        );

        console.log(
            "[Kundli Marriage] Initialized with actual Kundli data."
        );
    }


    /* =====================================================
       MODULE REGISTRATION
       ===================================================== */

    window.KundliMarriage = {
        init
    };

    window.KundliModules =
        window.KundliModules || {};

    window.KundliModules[
        MODULE_ID
    ] = {
        init
    };

})();