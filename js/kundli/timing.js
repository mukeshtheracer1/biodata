/* =========================================================
   TIMING MODULE
   Marriage Timing / विवाह समय

   IMPORTANT:
   - केवल वास्तविक KundliState data
   - कोई dummy / random date नहीं
   - उपलब्ध Dasha data के आधार पर analysis
   ========================================================= */

(function () {
    "use strict";

    const MODULE_ID = "timing";

    /* -------------------------------------------------------
       RASHI DATA
       ------------------------------------------------------- */

    const RASHIS = [
        { id: "Aries", hindi: "मेष", lord: "Mars" },
        { id: "Taurus", hindi: "वृषभ", lord: "Venus" },
        { id: "Gemini", hindi: "मिथुन", lord: "Mercury" },
        { id: "Cancer", hindi: "कर्क", lord: "Moon" },
        { id: "Leo", hindi: "सिंह", lord: "Sun" },
        { id: "Virgo", hindi: "कन्या", lord: "Mercury" },
        { id: "Libra", hindi: "तुला", lord: "Venus" },
        { id: "Scorpio", hindi: "वृश्चिक", lord: "Mars" },
        { id: "Sagittarius", hindi: "धनु", lord: "Jupiter" },
        { id: "Capricorn", hindi: "मकर", lord: "Saturn" },
        { id: "Aquarius", hindi: "कुंभ", lord: "Saturn" },
        { id: "Pisces", hindi: "मीन", lord: "Jupiter" }
    ];

    const PLANET_NAMES = {
        Sun: "सूर्य / Sun",
        Moon: "चंद्र / Moon",
        Mars: "मंगल / Mars",
        Mercury: "बुध / Mercury",
        Jupiter: "गुरु / Jupiter",
        Venus: "शुक्र / Venus",
        Saturn: "शनि / Saturn",
        Rahu: "राहु / Rahu",
        Ketu: "केतु / Ketu"
    };

    const MARRIAGE_PLANETS = [
        "Venus",
        "Jupiter",
        "Moon",
        "Mars",
        "Saturn",
        "Rahu",
        "Ketu"
    ];

    const SUPPORTIVE_PLANETS = [
        "Venus",
        "Jupiter",
        "Moon",
        "Mercury"
    ];

    const CHALLENGING_HOUSES = [
        6,
        8,
        12
    ];

    /* -------------------------------------------------------
       HELPERS
       ------------------------------------------------------- */

    function escapeHtml(value) {
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

        return state
            ? state.kundliA || null
            : null;
    }

    function getPlanet(kundli, planetId) {
        if (
            !kundli ||
            !kundli.planets
        ) {
            return null;
        }

        return kundli.planets[planetId] || null;
    }

    function getHouse(planet) {
        if (!planet) {
            return null;
        }

        const house =
            Number(planet.house);

        return Number.isFinite(house)
            ? house
            : null;
    }

    function getRashiData(rashiId) {
        return RASHIS.find(function (item) {
            return item.id === rashiId;
        }) || null;
    }

    function getRashiName(rashiId) {
        const rashi =
            getRashiData(rashiId);

        return rashi
            ? `${rashi.hindi} / ${rashi.id}`
            : "—";
    }

    function getPlanetName(planetId) {
        return PLANET_NAMES[planetId] ||
            planetId ||
            "—";
    }

    function getSeventhHouse(kundli) {

        if (
            !kundli ||
            !kundli.lagna
        ) {
            return null;
        }

        const lagnaRashi =
            kundli.lagna.rashi ||
            kundli.lagna.sign ||
            kundli.lagna.rashiId;

        const lagnaIndex =
            RASHIS.findIndex(function (item) {
                return item.id === lagnaRashi;
            });

        if (lagnaIndex < 0) {
            return null;
        }

        const seventhIndex =
            (lagnaIndex + 6) % 12;

        const seventhRashi =
            RASHIS[seventhIndex];

        if (!seventhRashi) {
            return null;
        }

        return {
            rashi: seventhRashi.id,
            rashiHindi: seventhRashi.hindi,
            lord: seventhRashi.lord
        };
    }

    function getPlanetHouse(kundli, planetId) {
        return getHouse(
            getPlanet(kundli, planetId)
        );
    }

    function getHouseLord(kundli, houseNumber) {

        if (
            !kundli ||
            !kundli.lagna
        ) {
            return null;
        }

        const lagnaRashi =
            kundli.lagna.rashi ||
            kundli.lagna.sign ||
            kundli.lagna.rashiId;

        const lagnaIndex =
            RASHIS.findIndex(function (item) {
                return item.id === lagnaRashi;
            });

        if (lagnaIndex < 0) {
            return null;
        }

        const targetIndex =
            (
                lagnaIndex +
                Number(houseNumber) -
                1
            ) % 12;

        return RASHIS[targetIndex] || null;
    }

    /* -------------------------------------------------------
       MARRIAGE FACTORS
       ------------------------------------------------------- */

    function buildMarriageFactors(kundli) {

        const seventh =
            getSeventhHouse(kundli);

        if (!seventh) {
            return [];
        }

        const factors = [];

        const seventhLord =
            getPlanet(
                kundli,
                seventh.lord
            );

        const venus =
            getPlanet(kundli, "Venus");

        const jupiter =
            getPlanet(kundli, "Jupiter");

        const moon =
            getPlanet(kundli, "Moon");

        const seventhLordHouse =
            getHouse(seventhLord);

        /* 7th Lord */

        if (seventhLordHouse !== null) {

            if (
                CHALLENGING_HOUSES.includes(
                    seventhLordHouse
                )
            ) {
                factors.push({
                    planet: seventh.lord,
                    type: "attention",
                    title:
                        "7th Lord / सप्तमेश",
                    text:
                        `${getPlanetName(seventh.lord)} ${seventhLordHouse}th House में है। Dasha के दौरान इस ग्रह का activation विवाह के विषयों को सक्रिय कर सकता है, लेकिन timing के लिए D9 और अन्य factors को साथ देखना जरूरी है।`
                });
            } else {
                factors.push({
                    planet: seventh.lord,
                    type: "supportive",
                    title:
                        "7th Lord / सप्तमेश",
                    text:
                        `${getPlanetName(seventh.lord)} ${seventhLordHouse}th House में है। इस ग्रह की Dasha या Antardasha विवाह संबंधी घटनाओं के timing में महत्वपूर्ण हो सकती है।`
                });
            }
        }

        /* Venus */

        if (venus) {

            const house =
                getHouse(venus);

            factors.push({
                planet: "Venus",
                type:
                    house === 7
                        ? "supportive"
                        : "neutral",
                title:
                    "Venus / शुक्र",
                text:
                    house === 7
                        ? "Venus 7th House में है। Venus की Dasha या Antardasha विवाह timing के लिए विशेष रूप से महत्वपूर्ण हो सकती है।"
                        : `Venus ${house !== null ? house + "th House" : "अज्ञात House"} में है। Venus की Dasha को विवाह timing के संदर्भ में देखना उपयोगी रहेगा।`
            });
        }

        /* Jupiter */

        if (jupiter) {

            const house =
                getHouse(jupiter);

            factors.push({
                planet: "Jupiter",
                type:
                    house === 7
                        ? "supportive"
                        : "neutral",
                title:
                    "Jupiter / गुरु",
                text:
                    house === 7
                        ? "Jupiter 7th House में है। Jupiter की Dasha या Antardasha विवाह के लिए महत्वपूर्ण activation period दे सकती है।"
                        : `Jupiter ${house !== null ? house + "th House" : "अज्ञात House"} में है। Jupiter की Dasha को विवाह timing में अन्य factors के साथ देखना चाहिए।`
            });
        }

        /* Moon */

        if (moon) {

            factors.push({
                planet: "Moon",
                type: "neutral",
                title:
                    "Moon / चंद्र",
                text:
                    "Moon की Dasha या Antardasha भावनात्मक और पारिवारिक घटनाओं को सक्रिय कर सकती है। विवाह timing में इसे 7th House और 7th Lord के साथ देखना आवश्यक है।"
            });
        }

        return factors;
    }

    /* -------------------------------------------------------
       DASHA EXTRACTION
       ------------------------------------------------------- */

    function isObject(value) {
        return (
            value !== null &&
            typeof value === "object"
        );
    }

    function findPlanetInText(value) {

        if (
            typeof value !== "string"
        ) {
            return null;
        }

        const clean =
            value.trim();

        const keys =
            Object.keys(
                PLANET_NAMES
            );

        for (const planet of keys) {

            if (
                clean === planet ||
                clean.toLowerCase() ===
                PLANET_NAMES[planet]
                    .toLowerCase()
            ) {
                return planet;
            }
        }

        return null;
    }

    function getPlanetFromPeriod(period) {

        if (!isObject(period)) {
            return null;
        }

        const possibleKeys = [
            "planet",
            "lord",
            "graha",
            "dashaLord",
            "id",
            "name"
        ];

        for (
            const key of possibleKeys
        ) {

            const value =
                period[key];

            const found =
                findPlanetInText(value);

            if (found) {
                return found;
            }

            if (
                isObject(value)
            ) {

                const nested =
                    getPlanetFromPeriod(value);

                if (nested) {
                    return nested;
                }
            }
        }

        return null;
    }

    function normalizePeriod(
        period,
        level
    ) {

        if (
            !isObject(period)
        ) {
            return null;
        }

        const planet =
            getPlanetFromPeriod(period);

        if (!planet) {
            return null;
        }

        const start =
            period.start ||
            period.startDate ||
            period.from ||
            period.begin ||
            period.dateStart ||
            null;

        const end =
            period.end ||
            period.endDate ||
            period.to ||
            period.finish ||
            period.dateEnd ||
            null;

        return {
            planet: planet,
            level: level,
            start: start,
            end: end,
            raw: period
        };
    }

    function collectPeriods(
        value,
        level,
        result,
        depth
    ) {

        if (
            depth > 6 ||
            value === null ||
            value === undefined
        ) {
            return;
        }

        if (
            Array.isArray(value)
        ) {

            value.forEach(function (item) {

                const period =
                    normalizePeriod(
                        item,
                        level
                    );

                if (period) {
                    result.push(period);
                }

                collectPeriods(
                    item,
                    level + 1,
                    result,
                    depth + 1
                );
            });

            return;
        }

        if (!isObject(value)) {
            return;
        }

        const period =
            normalizePeriod(
                value,
                level
            );

        if (period) {
            result.push(period);
        }

        Object.keys(value)
            .forEach(function (key) {

                const child =
                    value[key];

                if (
                    key === "raw"
                ) {
                    return;
                }

                collectPeriods(
                    child,
                    level + 1,
                    result,
                    depth + 1
                );
            });
    }

    function getDashaPeriods(kundli) {

        if (
            !kundli ||
            !kundli.dasha
        ) {
            return [];
        }

        const result = [];

        collectPeriods(
            kundli.dasha,
            0,
            result,
            0
        );

        /* Remove duplicates */

        const unique = [];
        const seen = new Set();

        result.forEach(function (item) {

            const key =
                [
                    item.planet,
                    item.level,
                    item.start || "",
                    item.end || ""
                ].join("|");

            if (!seen.has(key)) {
                seen.add(key);
                unique.push(item);
            }
        });

        return unique;
    }

    /* -------------------------------------------------------
       PERIOD CLASSIFICATION
       ------------------------------------------------------- */

    function getFavorablePlanets(
        kundli
    ) {

        const favorable =
            new Set();

        const seventh =
            getSeventhHouse(kundli);

        if (seventh) {

            favorable.add(
                seventh.lord
            );
        }

        SUPPORTIVE_PLANETS
            .forEach(function (planet) {

                if (
                    getPlanet(
                        kundli,
                        planet
                    )
                ) {
                    favorable.add(
                        planet
                    );
                }
            });

        return favorable;
    }

    function classifyPeriod(
        period,
        kundli
    ) {

        const favorable =
            getFavorablePlanets(
                kundli
            );

        const seventh =
            getSeventhHouse(kundli);

        const planet =
            period.planet;

        if (
            seventh &&
            planet === seventh.lord
        ) {
            return {
                status: "favorable",
                text:
                    "7th Lord / सप्तमेश की Dasha activation"
            };
        }

        if (
            favorable.has(planet)
        ) {
            return {
                status: "favorable",
                text:
                    `${getPlanetName(planet)} की Dasha / Antardasha विवाह factors से जुड़ी हो सकती है`
            };
        }

        if (
            [
                "Saturn",
                "Rahu",
                "Ketu"
            ].includes(planet)
        ) {
            return {
                status: "attention",
                text:
                    `${getPlanetName(planet)} की अवधि में अन्य विवाह factors और D9 को विशेष रूप से देखना चाहिए`
            };
        }

        return {
            status: "neutral",
            text:
                `${getPlanetName(planet)} की अवधि को अन्य विवाह indicators के साथ देखना आवश्यक है`
        };
    }

    /* -------------------------------------------------------
       FORMAT PERIOD
       ------------------------------------------------------- */

    function formatDateValue(value) {

        if (!value) {
            return "—";
        }

        if (
            typeof value === "string"
        ) {
            return value;
        }

        if (
            value instanceof Date &&
            !Number.isNaN(
                value.getTime()
            )
        ) {
            return value
                .toISOString()
                .slice(0, 10);
        }

        return String(value);
    }

    function getLevelLabel(level) {

        if (level <= 1) {
            return "Mahadasha / महादशा";
        }

        if (level === 2) {
            return "Antardasha / अंतर्दशा";
        }

        if (level === 3) {
            return "Pratyantar / प्रत्यंतर";
        }

        return "Dasha Level / दशा स्तर";
    }

    /* -------------------------------------------------------
       RENDER SUMMARY
       ------------------------------------------------------- */

    function renderSummary(
        kundli,
        periods
    ) {

        const seventh =
            getSeventhHouse(kundli);

        const seventhLord =
            seventh
                ? getPlanet(
                    kundli,
                    seventh.lord
                )
                : null;

        const currentDasha =
            periods.length > 0
                ? periods[0]
                : null;

        return `
            <div class="timing-card">

                <div class="timing-card-head">

                    <h3 class="timing-card-title">
                        Timing Overview / समय का सार
                    </h3>

                    <p class="timing-card-subtitle">
                        उपलब्ध वास्तविक Kundli और Dasha data का संक्षिप्त overview
                    </p>

                </div>

                <div class="timing-summary">

                    <div class="timing-summary-item">

                        <span class="timing-summary-label">
                            7th House / सप्तम भाव
                        </span>

                        <span class="timing-summary-value">
                            ${
                                seventh
                                    ? escapeHtml(
                                        `${seventh.rashiHindi} / ${seventh.rashi}`
                                    )
                                    : "—"
                            }
                        </span>

                    </div>

                    <div class="timing-summary-item">

                        <span class="timing-summary-label">
                            7th Lord / सप्तमेश
                        </span>

                        <span class="timing-summary-value">
                            ${
                                seventh
                                    ? escapeHtml(
                                        getPlanetName(
                                            seventh.lord
                                        )
                                    )
                                    : "—"
                            }
                        </span>

                    </div>

                    <div class="timing-summary-item">

                        <span class="timing-summary-label">
                            Current Dasha Data / उपलब्ध दशा
                        </span>

                        <span class="timing-summary-value">

                            ${
                                currentDasha
                                    ? escapeHtml(
                                        getPlanetName(
                                            currentDasha.planet
                                        )
                                    )
                                    : "Available नहीं"
                            }

                            ${
                                currentDasha
                                    ? `
                                        <small>
                                            ${escapeHtml(
                                                getLevelLabel(
                                                    currentDasha.level
                                                )
                                            )}
                                        </small>
                                      `
                                    : ""
                            }

                        </span>

                    </div>

                </div>

            </div>
        `;
    }

    /* -------------------------------------------------------
       STATUS
       ------------------------------------------------------- */

    function renderStatus(
        kundli,
        periods
    ) {

        if (!periods.length) {

            return `
                <div class="timing-card">

                    <div class="timing-status-box">

                        <div class="timing-status-icon">
                            !
                        </div>

                        <div>

                            <h3 class="timing-status-title">
                                Dasha Data / दशा जानकारी उपलब्ध नहीं
                            </h3>

                            <p class="timing-status-text">
                                इस Kundli में Dasha data उपलब्ध नहीं मिला।
                                इसलिए कोई अनुमानित विवाह तारीख या कालखंड
                                नहीं बनाया गया है।
                            </p>

                        </div>

                    </div>

                </div>
            `;
        }

        const favorableCount =
            periods.filter(function (period) {

                return classifyPeriod(
                    period,
                    kundli
                ).status === "favorable";

            }).length;

        return `
            <div class="timing-card">

                <div class="timing-status-box">

                    <div class="timing-status-icon">
                        ✓
                    </div>

                    <div>

                        <h3 class="timing-status-title">
                            Dasha Analysis / दशा विश्लेषण उपलब्ध है
                        </h3>

                        <p class="timing-status-text">
                            उपलब्ध Dasha periods में
                            ${favorableCount}
                            ऐसे period मिले हैं जिनके ग्रह
                            विवाह-related factors से जुड़े हैं।
                            इन्हें exact marriage date नहीं माना जाना चाहिए।
                            D9 और अन्य timing factors की पुष्टि भी जरूरी है।
                        </p>

                    </div>

                </div>

            </div>
        `;
    }

    /* -------------------------------------------------------
       FACTORS
       ------------------------------------------------------- */

    function renderFactors(
        factors
    ) {

        if (!factors.length) {
            return "";
        }

        const html =
            factors.map(function (factor) {

                const label =
                    factor.type === "supportive"
                        ? "Supportive / सहयोगी"
                        : factor.type === "attention"
                            ? "Attention / ध्यान दें"
                            : "Relevant / संबंधित";

                return `
                    <div class="timing-factor">

                        <h4 class="timing-factor-title">
                            ${escapeHtml(
                                factor.title
                            )}
                        </h4>

                        <p class="timing-factor-text">
                            ${escapeHtml(
                                factor.text
                            )}
                        </p>

                        <span class="timing-factor-badge ${
                            factor.type
                        }">
                            ${escapeHtml(label)}
                        </span>

                    </div>
                `;

            }).join("");

        return `
            <div class="timing-card">

                <div class="timing-card-head">

                    <h3 class="timing-card-title">
                        Marriage Timing Factors / विवाह समय के कारक
                    </h3>

                    <p class="timing-card-subtitle">
                        D1 Kundli में timing के लिए महत्वपूर्ण ग्रह और House
                    </p>

                </div>

                <div class="timing-factor-grid">
                    ${html}
                </div>

            </div>
        `;
    }

    /* -------------------------------------------------------
       DASHA TABLE
       ------------------------------------------------------- */

    function renderDashaTable(
        kundli,
        periods
    ) {

        if (!periods.length) {

            return `
                <div class="timing-card">

                    <div class="timing-card-head">

                        <h3 class="timing-card-title">
                            Dasha Periods / दशा अवधि
                        </h3>

                    </div>

                    <div class="timing-empty">
                        <h3 class="timing-empty-title">
                            Dasha Data उपलब्ध नहीं
                        </h3>

                        <p class="timing-empty-text">
                            Kundli Engine से कोई usable Dasha period
                            उपलब्ध नहीं मिला। इसलिए यहां कोई fabricated
                            या अनुमानित period नहीं दिखाया गया है।
                        </p>
                    </div>

                </div>
            `;
        }

        const limited =
            periods.slice(0, 60);

        const rows =
            limited.map(function (period) {

                const result =
                    classifyPeriod(
                        period,
                        kundli
                    );

                const statusLabel =
                    result.status === "favorable"
                        ? "Favorable / अनुकूल"
                        : result.status === "attention"
                            ? "Attention / ध्यान दें"
                            : "Neutral / सामान्य";

                return `
                    <tr>

                        <td>
                            <span class="timing-period-name">
                                ${escapeHtml(
                                    getPlanetName(
                                        period.planet
                                    )
                                )}
                            </span>
                        </td>

                        <td>
                            ${escapeHtml(
                                getLevelLabel(
                                    period.level
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                formatDateValue(
                                    period.start
                                )
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                formatDateValue(
                                    period.end
                                )
                            )}
                        </td>

                        <td>
                            <span class="timing-period-badge ${
                                result.status
                            }">
                                ${escapeHtml(
                                    statusLabel
                                )}
                            </span>

                            <div style="margin-top:6px;">
                                ${escapeHtml(
                                    result.text
                                )}
                            </div>
                        </td>

                    </tr>
                `;

            }).join("");

        return `
            <div class="timing-card">

                <div class="timing-card-head">

                    <h3 class="timing-card-title">
                        Dasha Periods / दशा अवधि
                    </h3>

                    <p class="timing-card-subtitle">
                        Engine में उपलब्ध वास्तविक Dasha periods।
                        यहां कोई नया या अनुमानित period नहीं बनाया गया है।
                    </p>

                </div>

                <div class="timing-table-wrap">

                    <table class="timing-table">

                        <thead>
                            <tr>
                                <th>
                                    Planet / ग्रह
                                </th>

                                <th>
                                    Level / स्तर
                                </th>

                                <th>
                                    Start / शुरुआत
                                </th>

                                <th>
                                    End / समाप्ति
                                </th>

                                <th>
                                    Timing संकेत / संकेत
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            ${rows}
                        </tbody>

                    </table>

                </div>

            </div>
        `;
    }

    /* -------------------------------------------------------
       ANALYSIS
       ------------------------------------------------------- */

    function renderAnalysis(
        kundli,
        periods
    ) {

        const seventh =
            getSeventhHouse(kundli);

        const paragraphs = [];

        if (seventh) {

            paragraphs.push(
                `Marriage Timing / विवाह समय में सबसे पहले 7th House / सप्तम भाव और उसके Lord / सप्तमेश को देखा जाता है। यहां 7th Lord ${getPlanetName(seventh.lord)} है।`
            );

            const lordHouse =
                getPlanetHouse(
                    kundli,
                    seventh.lord
                );

            if (lordHouse !== null) {

                paragraphs.push(
                    `${getPlanetName(seventh.lord)} ${lordHouse}th House में स्थित है। इसलिए इसकी Mahadasha / महादशा या Antardasha / अंतर्दशा को विवाह timing के analysis में विशेष महत्व दिया जा सकता है।`
                );
            }
        }

        if (periods.length) {

            const favorable =
                periods.filter(function (period) {

                    return classifyPeriod(
                        period,
                        kundli
                    ).status === "favorable";

                });

            if (favorable.length) {

                const names =
                    favorable
                        .slice(0, 5)
                        .map(function (period) {
                            return getPlanetName(
                                period.planet
                            );
                        })
                        .filter(function (
                            value,
                            index,
                            array
                        ) {
                            return array.indexOf(
                                value
                            ) === index;
                        })
                        .join(", ");

                paragraphs.push(
                    `उपलब्ध Dasha data में ${names} जैसे ग्रह विवाह-related factors से जुड़े दिखाई दे रहे हैं। इन ग्रहों की Dasha / Antardasha को संभावित activation periods के रूप में देखा जा सकता है।`
                );
            }

        } else {

            paragraphs.push(
                "Dasha data उपलब्ध नहीं होने के कारण इस module में कोई specific timing period नहीं बताया जा रहा है।"
            );
        }

        paragraphs.push(
            "महत्वपूर्ण बात यह है कि किसी Dasha को केवल उसके ग्रह के नाम के आधार पर विवाह की पक्की तारीख नहीं माना जा सकता। D9 Navamsa / नवांश, 7th House, 7th Lord, Venus / शुक्र, Jupiter / गुरु और संबंधित Dasha को एक साथ देखकर ही timing का मजबूत निष्कर्ष निकाला जाना चाहिए।"
        );

        const html =
            paragraphs.map(function (paragraph) {

                return `
                    <p class="timing-analysis-text">
                        ${escapeHtml(
                            paragraph
                        )}
                    </p>
                `;

            }).join("");

        return `
            <div class="timing-card">

                <div class="timing-analysis-box">

                    <h3 class="timing-analysis-title">
                        Timing Analysis / विवाह समय का विश्लेषण
                    </h3>

                    ${html}

                </div>

            </div>
        `;
    }

    /* -------------------------------------------------------
       NOTE
       ------------------------------------------------------- */

    function renderNote() {

        return `
            <div class="timing-card">

                <div class="timing-note">

                    <h3 class="timing-note-title">
                        Important Note / महत्वपूर्ण जानकारी
                    </h3>

                    <p class="timing-note-text">
                        यह module उपलब्ध वास्तविक Kundli और Dasha
                        calculation के आधार पर timing indicators दिखाता है।
                        जहां actual Dasha data उपलब्ध नहीं है, वहां कोई
                        dummy date, fabricated period या अनुमानित marriage
                        date नहीं दिखाई जाएगी। Exact marriage timing के लिए
                        D1 + D9 + Dasha का संयुक्त analysis आवश्यक है।
                    </p>

                </div>

            </div>
        `;
    }

    /* -------------------------------------------------------
       EMPTY STATE
       ------------------------------------------------------- */

    function renderEmpty() {

        return `
            <div class="timing-empty">

                <h3 class="timing-empty-title">
                    Kundli Data उपलब्ध नहीं है
                </h3>

                <p class="timing-empty-text">
                    Marriage Timing / विवाह समय देखने के लिए पहले
                    Birth Details भरकर Kundli Generate करें।
                    इस module में कोई dummy या random data इस्तेमाल
                    नहीं किया जाता।
                </p>

            </div>
        `;
    }

    /* -------------------------------------------------------
       MAIN RENDER
       ------------------------------------------------------- */

    function render() {

        const content =
            document.getElementById(
                "timingContent"
            );

        const badge =
            document.getElementById(
                "timingEngineBadge"
            );

        if (!content) {
            return;
        }

        const kundli =
            getKundli();

        if (!kundli) {

            content.innerHTML =
                renderEmpty();

            if (badge) {
                badge.textContent =
                    "Kundli Data आवश्यक / कुंडली आवश्यक";
            }

            return;
        }

        const periods =
            getDashaPeriods(
                kundli
            );

        const factors =
            buildMarriageFactors(
                kundli
            );

        content.innerHTML = `
            ${renderStatus(
                kundli,
                periods
            )}

            ${renderSummary(
                kundli,
                periods
            )}

            ${renderFactors(
                factors
            )}

            ${renderDashaTable(
                kundli,
                periods
            )}

            ${renderAnalysis(
                kundli,
                periods
            )}

            ${renderNote()}
        `;

        if (badge) {
            badge.textContent =
                "Kundli Engine ✓ / कुंडली इंजन ✓";
        }
    }

    /* -------------------------------------------------------
       INIT
       ------------------------------------------------------- */

    function init() {

        render();

        console.log(
            "[Kundli Timing] Module initialized."
        );
    }

    /* -------------------------------------------------------
       REGISTER
       ------------------------------------------------------- */

    window.KundliTiming = {
        init: init,
        render: render
    };

    window.KundliModules =
        window.KundliModules || {};

    window.KundliModules[
        MODULE_ID
    ] = {
        init: init
    };

})();