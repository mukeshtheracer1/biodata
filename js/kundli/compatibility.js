(function (window) {

    "use strict";


    /* =========================================================
       HELPERS
    ========================================================= */

    function safeString(value) {

        if (
            value === null ||
            value === undefined
        ) {
            return "";
        }

        if (
            typeof value === "string" ||
            typeof value === "number" ||
            typeof value === "boolean"
        ) {
            return String(value);
        }

        if (
            typeof value === "object"
        ) {

            /*
             * Engine objects are intentionally preserved.
             *
             * Example:
             *
             * rashi:
             * {
             *   index,
             *   id,
             *   name,
             *   hindi,
             *   element,
             *   modality
             * }
             */

            if (value.name) {
                return String(value.name);
            }

            if (value.label) {
                return String(value.label);
            }

            if (value.sign) {
                return safeString(value.sign);
            }

            if (value.rashi) {
                return safeString(value.rashi);
            }

            if (value.id) {
                return String(value.id);
            }

            if (value.value) {
                return String(value.value);
            }

            return "";
        }

        return "";
    }


    function bilingualRashi(value) {

        if (!value) {
            return "—";
        }

        if (
            typeof value === "object"
        ) {

            const english =
                value.name ||
                value.label ||
                value.id ||
                "";

            const hindi =
                value.hindi ||
                "";

            if (
                english &&
                hindi
            ) {
                return (
                    english +
                    " / " +
                    hindi
                );
            }

            return (
                english ||
                hindi ||
                "—"
            );
        }

        return safeString(value);
    }


    function getRashiFromPlanet(
        planet
    ) {

        if (!planet) {
            return null;
        }

        return (
            planet.rashi ||
            planet.sign ||
            null
        );
    }


    function getPlanet(
        kundli,
        id
    ) {

        if (
            !kundli ||
            !kundli.planets
        ) {
            return null;
        }

        return (
            kundli.planets[id] ||
            null
        );
    }


    function getLagna(
        kundli
    ) {

        if (
            !kundli ||
            !kundli.lagna
        ) {
            return null;
        }

        return kundli.lagna;
    }


    function getMoon(
        kundli
    ) {

        return getPlanet(
            kundli,
            "Moon"
        );
    }


    function getNakshatra(
        kundli
    ) {

        const moon =
            getMoon(kundli);

        if (!moon) {
            return null;
        }

        return (
            moon.nakshatra ||
            null
        );
    }


    function getHouse(
        kundli,
        houseNumber
    ) {

        if (
            !kundli ||
            !Array.isArray(
                kundli.houses
            )
        ) {
            return null;
        }

        return (
            kundli.houses.find(
                function (item) {

                    return (
                        Number(
                            item.house
                        ) ===
                        Number(
                            houseNumber
                        )
                    );

                }
            ) ||
            null
        );
    }


    function getPlanetHouse(
        kundli,
        planetId
    ) {

        const planet =
            getPlanet(
                kundli,
                planetId
            );

        if (!planet) {
            return null;
        }

        return Number.isFinite(
            Number(planet.house)
        )
            ? Number(planet.house)
            : null;
    }


    function getNavamsaLagna(
        kundli
    ) {

        if (
            !kundli ||
            !kundli.navamsa
        ) {
            return null;
        }

        return (
            kundli.navamsa.lagna ||
            null
        );
    }


    function getNavamsaPlanet(
        kundli,
        planetId
    ) {

        if (
            !kundli ||
            !kundli.navamsa ||
            !kundli.navamsa.planets
        ) {
            return null;
        }

        return (
            kundli.navamsa.planets[
                planetId
            ] ||
            null
        );
    }


    function getDashaLord(
        kundli
    ) {

        if (
            !kundli ||
            !kundli.dasha ||
            !Array.isArray(
                kundli.dasha.mahadasha
            ) ||
            !kundli.dasha.mahadasha.length
        ) {
            return null;
        }

        const now =
            Date.now();

        const current =
            kundli.dasha.mahadasha.find(
                function (item) {

                    const start =
                        Date.parse(
                            item.start
                        );

                    const end =
                        Date.parse(
                            item.end
                        );

                    return (
                        Number.isFinite(
                            start
                        ) &&
                        Number.isFinite(
                            end
                        ) &&
                        now >= start &&
                        now < end
                    );

                }
            );

        return current
            ? current.lord
            : null;
    }


    function getCurrentAntardasha(
        kundli
    ) {

        if (
            !kundli ||
            !kundli.dasha ||
            !Array.isArray(
                kundli.dasha.mahadasha
            )
        ) {
            return null;
        }

        const now =
            Date.now();

        for (
            let i = 0;
            i < kundli.dasha.mahadasha.length;
            i++
        ) {

            const maha =
                kundli.dasha.mahadasha[i];

            if (
                !Array.isArray(
                    maha.antardasha
                )
            ) {
                continue;
            }

            for (
                let j = 0;
                j < maha.antardasha.length;
                j++
            ) {

                const antara =
                    maha.antardasha[j];

                const start =
                    Date.parse(
                        antara.start
                    );

                const end =
                    Date.parse(
                        antara.end
                    );

                if (
                    Number.isFinite(
                        start
                    ) &&
                    Number.isFinite(
                        end
                    ) &&
                    now >= start &&
                    now < end
                ) {

                    return antara.lord;
                }
            }
        }

        return null;
    }


    function getManglikText(
        kundli
    ) {

        if (
            !kundli ||
            !kundli.manglik
        ) {
            return "डेटा उपलब्ध नहीं";
        }

        return (
            kundli.manglik.assessment ||
            "डेटा उपलब्ध नहीं"
        );
    }


    function getEngineVersion(
        kundli
    ) {

        if (
            kundli &&
            kundli.engine
        ) {

            return (
                kundli.engine.provider ||
                "Kundli Engine"
            );
        }

        return "Kundli Engine";
    }


    function sameValue(
        a,
        b
    ) {

        if (
            a === null ||
            a === undefined ||
            b === null ||
            b === undefined
        ) {
            return false;
        }

        return (
            String(a)
                .trim()
                .toLowerCase() ===
            String(b)
                .trim()
                .toLowerCase()
        );
    }


    function sameRashi(
        a,
        b
    ) {

        if (
            !a ||
            !b
        ) {
            return false;
        }

        const aIndex =
            Number(
                a.index
            );

        const bIndex =
            Number(
                b.index
            );

        if (
            Number.isFinite(
                aIndex
            ) &&
            Number.isFinite(
                bIndex
            )
        ) {
            return (
                aIndex === bIndex
            );
        }

        const aId =
            a.id ||
            a.name ||
            "";

        const bId =
            b.id ||
            b.name ||
            "";

        return sameValue(
            aId,
            bId
        );
    }


    function sameNumber(
        a,
        b
    ) {

        return (
            Number.isFinite(
                Number(a)
            ) &&
            Number.isFinite(
                Number(b)
            ) &&
            Number(a) === Number(b)
        );
    }


    /* =========================================================
       PROFILE DATA
    ========================================================= */

    function profileData(
        person,
        kundli
    ) {

        const moon =
            getMoon(kundli);

        const nak =
            getNakshatra(kundli);

        const lagna =
            getLagna(kundli);

        const venus =
            getPlanet(
                kundli,
                "Venus"
            );

        const mars =
            getPlanet(
                kundli,
                "Mars"
            );

        const jupiter =
            getPlanet(
                kundli,
                "Jupiter"
            );

        const saturn =
            getPlanet(
                kundli,
                "Saturn"
            );

        const d9Lagna =
            getNavamsaLagna(
                kundli
            );

        return {

            name:
                person &&
                person.name
                    ? person.name
                    : "—",

            gender:
                person &&
                person.gender
                    ? person.gender
                    : "—",

            moonRashi:
                bilingualRashi(
                    getRashiFromPlanet(
                        moon
                    )
                ),

            nakshatra:
                nak
                    ? (
                        (
                            nak.hindi ||
                            nak.name ||
                            "—"
                        ) +
                        (
                            nak.name &&
                            nak.hindi
                                ? " / " +
                                  nak.name
                                : ""
                        )
                    )
                    : "—",

            pada:
                nak &&
                nak.pada
                    ? "P" +
                      nak.pada
                    : "—",

            lagna:
                bilingualRashi(
                    lagna
                        ? lagna.rashi
                        : null
                ),

            venus:
                bilingualRashi(
                    getRashiFromPlanet(
                        venus
                    )
                ),

            mars:
                bilingualRashi(
                    getRashiFromPlanet(
                        mars
                    )
                ),

            jupiter:
                bilingualRashi(
                    getRashiFromPlanet(
                        jupiter
                    )
                ),

            saturnHouse:
                getPlanetHouse(
                    kundli,
                    "Saturn"
                ),

            marsHouse:
                getPlanetHouse(
                    kundli,
                    "Mars"
                ),

            venusHouse:
                getPlanetHouse(
                    kundli,
                    "Venus"
                ),

            manglik:
                getManglikText(
                    kundli
                ),

            d9Lagna:
                bilingualRashi(
                    d9Lagna
                        ? (
                            d9Lagna.sign ||
                            d9Lagna.rashi ||
                            d9Lagna
                        )
                        : null
                ),

            dasha:
                getDashaLord(
                    kundli
                ),

            antardasha:
                getCurrentAntardasha(
                    kundli
                ),

            nakObject:
                nak,

            moonObject:
                moon,

            lagnaObject:
                lagna,

            venusObject:
                venus,

            marsObject:
                mars,

            jupiterObject:
                jupiter,

            saturnObject:
                saturn,

            d9LagnaObject:
                d9Lagna

        };
    }


    /* =========================================================
       PROFILE CARD
    ========================================================= */

    function renderProfile(
        person,
        kundli,
        label,
        index
    ) {

        const data =
            profileData(
                person,
                kundli
            );

        return `

            <article class="compatibility-profile-card">

                <div class="compatibility-profile-top">

                    <div>

                        <p class="compatibility-profile-label">
                            ${label}
                        </p>

                        <h3 class="compatibility-profile-name">
                            ${escapeHtml(
                                data.name
                            )}
                        </h3>

                    </div>

                    <div class="compatibility-profile-index">
                        ${index}
                    </div>

                </div>


                <div class="compatibility-profile-details">

                    ${profileItem(
                        "Moon Sign / चंद्र राशि",
                        data.moonRashi
                    )}

                    ${profileItem(
                        "Nakshatra / नक्षत्र",
                        data.nakshatra +
                        " • " +
                        data.pada
                    )}

                    ${profileItem(
                        "Lagna / लग्न",
                        data.lagna
                    )}

                    ${profileItem(
                        "Venus / शुक्र",
                        data.venus +
                        formatHouse(
                            data.venusHouse
                        )
                    )}

                    ${profileItem(
                        "Mars / मंगल",
                        data.mars +
                        formatHouse(
                            data.marsHouse
                        )
                    )}

                    ${profileItem(
                        "Manglik / मंगलिक",
                        data.manglik
                    )}

                </div>

            </article>

        `;
    }


    function profileItem(
        label,
        value
    ) {

        return `

            <div class="compatibility-profile-item">

                <span class="compatibility-profile-item-label">
                    ${label}
                </span>

                <span class="compatibility-profile-item-value">
                    ${escapeHtml(
                        value || "—"
                    )}
                </span>

            </div>

        `;
    }


    function formatHouse(
        house
    ) {

        if (
            house === null ||
            house === undefined ||
            !Number.isFinite(
                Number(house)
            )
        ) {
            return "";
        }

        return (
            " • House " +
            Number(house)
        );
    }


    /* =========================================================
       GUN MILAN
    ========================================================= */

    function getGunMilan(
        state
    ) {

        if (
            !state
        ) {
            return null;
        }

        const milan =
            state.milan ||
            state.gunMilan ||
            state.gunaMilan ||
            null;

        if (!milan) {
            return null;
        }

        let score = null;
        let max = 36;

        if (
            Number.isFinite(
                Number(
                    milan.totalScore
                )
            )
        ) {
            score =
                Number(
                    milan.totalScore
                );
        }

        if (
            Number.isFinite(
                Number(
                    milan.score
                )
            )
        ) {
            score =
                Number(
                    milan.score
                );
        }

        if (
            Number.isFinite(
                Number(
                    milan.total
                )
            )
        ) {
            score =
                Number(
                    milan.total
                );
        }

        if (
            Number.isFinite(
                Number(
                    milan.max
                )
            )
        ) {
            max =
                Number(
                    milan.max
                );
        }

        if (
            score === null
        ) {
            return null;
        }

        return {
            score,
            max
        };
    }


    function renderGunMilan(
        state
    ) {

        const data =
            getGunMilan(
                state
            );

        if (!data) {

            return `

                <div class="compatibility-gun-card">

                    <div>

                        <div class="compatibility-gun-score">

                            <span class="compatibility-gun-score-number">
                                —
                            </span>

                            <span class="compatibility-gun-score-max">
                                / 36
                            </span>

                        </div>

                    </div>

                    <div class="compatibility-gun-status">

                        Gun Milan score इस module में
                        saved state से उपलब्ध नहीं है।
                        कृपया Gun Milan module में actual
                        Ashtakoota result देखें।

                    </div>

                </div>

            `;
        }

        const percentage =
            (
                data.score /
                data.max *
                100
            );

        return `

            <div class="compatibility-gun-card">

                <div>

                    <div class="compatibility-gun-score">

                        <span class="compatibility-gun-score-number">
                            ${formatNumber(
                                data.score
                            )}
                        </span>

                        <span class="compatibility-gun-score-max">
                            / ${formatNumber(
                                data.max
                            )}
                        </span>

                    </div>

                    <div class="compatibility-gun-status">
                        Mathematical conversion:
                        ${percentage.toFixed(1)}%
                    </div>

                </div>


                <div class="compatibility-gun-status">

                    यह केवल Ashtakoota / 36 Gun score
                    का mathematical percentage है।
                    इसे independent marriage prediction
                    नहीं माना गया है।

                </div>

            </div>

        `;
    }


    /* =========================================================
       OVERALL
    ========================================================= */

    function renderOverall(
        state,
        dataA,
        dataB
    ) {

        const gun =
            getGunMilan(
                state
            );

        let text =
            "इस page पर कोई artificial compatibility percentage नहीं बनाया गया है।";

        if (gun) {

            text =
                "Saved Gun Milan result " +
                formatNumber(gun.score) +
                "/" +
                formatNumber(gun.max) +
                " है। इसका percentage केवल mathematical conversion है। " +
                "Marriage compatibility का final judgement D1, 7th House, " +
                "7th Lord, Venus, Jupiter, Mars/Manglik, Navamsa D9 और Dasha " +
                "को साथ में देखकर ही किया जाना चाहिए।";

        }

        return `

            <div class="compatibility-overall-card">

                <h4>
                    Verified Chart-Level Assessment
                </h4>

                <p>
                    ${escapeHtml(
                        text
                    )}
                </p>

            </div>

        `;
    }


    /* =========================================================
       FACTOR BUILDERS
    ========================================================= */

    function makeFactor(
        title,
        valueA,
        valueB,
        status,
        note
    ) {

        return {

            title,
            valueA:
                valueA || "—",

            valueB:
                valueB || "—",

            status:
                status || "Chart Data",

            note:
                note || ""

        };
    }


    function buildFactors(
        kundliA,
        kundliB,
        dataA,
        dataB
    ) {

        const factors = [];


        /* -----------------------------------------------------
           MOON
        ----------------------------------------------------- */

        const moonSame =
            sameRashi(
                getRashiFromPlanet(
                    dataA.moonObject
                ),
                getRashiFromPlanet(
                    dataB.moonObject
                )
            );

        factors.push(
            makeFactor(

                "Moon Sign / चंद्र राशि",

                dataA.moonRashi,

                dataB.moonRashi,

                moonSame
                    ? "Same / समान"
                    : "Different / अलग",

                moonSame
                    ? "दोनों charts में Moon Sign समान है। Emotional response patterns में कुछ समानता हो सकती है, लेकिन final compatibility केवल इसी आधार पर तय नहीं की जाती।"
                    : "दोनों charts में Moon Sign अलग है। यह अपने आप positive या negative नहीं है; Moon relationship को Gun Milan और पूरे chart context के साथ देखना चाहिए।"

            )
        );


        /* -----------------------------------------------------
           NAKSHATRA
        ----------------------------------------------------- */

        const nakA =
            dataA.nakObject;

        const nakB =
            dataB.nakObject;

        const nakSame =
            nakA &&
            nakB &&
            sameValue(
                nakA.index,
                nakB.index
            );

        factors.push(
            makeFactor(

                "Nakshatra / नक्षत्र",

                dataA.nakshatra +
                " • " +
                dataA.pada,

                dataB.nakshatra +
                " • " +
                dataB.pada,

                nakSame
                    ? "Same / समान"
                    : "Different / अलग",

                nakSame
                    ? "Janma Nakshatra समान है। Exact Ashtakoota assessment के लिए Tara, Yoni, Gana और Nadi अलग-अलग देखे जाते हैं।"
                    : "Janma Nakshatra अलग हैं। यह अपने आप negative नहीं है; traditional Nakshatra-based matching Gun Milan में अलग से calculate होता है।"

            )
        );


        /* -----------------------------------------------------
           LAGNA
        ----------------------------------------------------- */

        const lagnaSame =
            sameRashi(
                dataA.lagnaObject
                    ? dataA.lagnaObject.rashi
                    : null,

                dataB.lagnaObject
                    ? dataB.lagnaObject.rashi
                    : null
            );

        factors.push(
            makeFactor(

                "Lagna / लग्न",

                dataA.lagna,

                dataB.lagna,

                lagnaSame
                    ? "Same / समान"
                    : "Different / अलग",

                lagnaSame
                    ? "दोनों का Lagna समान है। Life approach और बाहरी व्यवहार में कुछ समान patterns हो सकते हैं; इसे complete chart context में देखना चाहिए।"
                    : "दोनों का Lagna अलग है। यह अपने आप incompatibility नहीं बताता।"

            )
        );


        /* -----------------------------------------------------
           7TH HOUSE
        ----------------------------------------------------- */

        const seventhA =
            getHouse(
                kundliA,
                7
            );

        const seventhB =
            getHouse(
                kundliB,
                7
            );

        const seventhRashiA =
            seventhA
                ? seventhA.rashi
                : null;

        const seventhRashiB =
            seventhB
                ? seventhB.rashi
                : null;

        const seventhSame =
            sameRashi(
                seventhRashiA,
                seventhRashiB
            );

        const seventhLordA =
            getSeventhLord(
                kundliA
            );

        const seventhLordB =
            getSeventhLord(
                kundliB
            );

        factors.push(
            makeFactor(

                "7th House / सप्तम भाव",

                seventhRashiA
                    ? (
                        "7th House: " +
                        bilingualRashi(
                            seventhRashiA
                        ) +
                        " • " +
                        seventhLordA
                    )
                    : "डेटा उपलब्ध नहीं",

                seventhRashiB
                    ? (
                        "7th House: " +
                        bilingualRashi(
                            seventhRashiB
                        ) +
                        " • " +
                        seventhLordB
                    )
                    : "डेटा उपलब्ध नहीं",

                seventhSame
                    ? "Same Sign / समान राशि"
                    : "Different Sign / अलग राशि",

                "7th House और 7th Lord marriage assessment के मुख्य factors हैं। यहाँ actual Whole Sign house structure का उपयोग किया गया है। Final judgement के लिए 7th lord की स्थिति, aspects, Venus/Jupiter, D9 और Dasha भी देखना जरूरी है।"

            )
        );


        /* -----------------------------------------------------
           VENUS
        ----------------------------------------------------- */

        const venusSame =
            sameRashi(
                getRashiFromPlanet(
                    dataA.venusObject
                ),
                getRashiFromPlanet(
                    dataB.venusObject
                )
            );

        factors.push(
            makeFactor(

                "Venus / शुक्र",

                dataA.venus +
                formatHouse(
                    dataA.venusHouse
                ),

                dataB.venus +
                formatHouse(
                    dataB.venusHouse
                ),

                venusSame
                    ? "Same / समान"
                    : "Different / अलग",

                "Venus relationship bonding, attraction और affection से जुड़ा महत्वपूर्ण factor है। अलग Rashi या House को अपने आप negative नहीं माना जाता।"

            )
        );


        /* -----------------------------------------------------
           MARS
        ----------------------------------------------------- */

        factors.push(
            makeFactor(

                "Mars / मंगल",

                dataA.mars +
                formatHouse(
                    dataA.marsHouse
                ),

                dataB.mars +
                formatHouse(
                    dataB.marsHouse
                ),

                "Chart Data / कुंडली डेटा",

                "Mars placement को Manglik assessment, 7th House और aspects के साथ देखना चाहिए। केवल Mars Rashi देखकर marriage conclusion नहीं निकाला गया है।"

            )
        );


        /* -----------------------------------------------------
           MANGLIK
        ----------------------------------------------------- */

        const manglikSame =
            sameValue(
                dataA.manglik,
                dataB.manglik
            );

        factors.push(
            makeFactor(

                "Manglik / मंगलिक",

                dataA.manglik,

                dataB.manglik,

                manglikSame
                    ? "Comparable / तुलनीय"
                    : "Different / अलग",

                manglikSame
                    ? "दोनों charts में engine की Manglik assessment समान है। फिर भी Mars placement और complete chart cross-check करना जरूरी है।"
                    : "दोनों charts की Manglik assessment अलग है। Exact judgement के लिए Mars placement और traditional exceptions भी देखे जाने चाहिए।"

            )
        );


        /* -----------------------------------------------------
           JUPITER
        ----------------------------------------------------- */

        const jupiterA =
            dataA.jupiterObject;

        const jupiterB =
            dataB.jupiterObject;

        const jupiterSame =
            sameRashi(
                getRashiFromPlanet(
                    jupiterA
                ),
                getRashiFromPlanet(
                    jupiterB
                )
            );

        factors.push(
            makeFactor(

                "Jupiter / गुरु",

                bilingualRashi(
                    getRashiFromPlanet(
                        jupiterA
                    )
                ) +
                formatHouse(
                    getPlanetHouse(
                        kundliA,
                        "Jupiter"
                    )
                ),

                bilingualRashi(
                    getRashiFromPlanet(
                        jupiterB
                    )
                ) +
                formatHouse(
                    getPlanetHouse(
                        kundliB,
                        "Jupiter"
                    )
                ),

                jupiterSame
                    ? "Same / समान"
                    : "Different / अलग",

                "Jupiter को traditional Jyotish में wisdom, guidance और marriage-supporting factors से जोड़ा जाता है। इसका assessment house, lordship और aspects के साथ करना चाहिए।"

            )
        );


        /* -----------------------------------------------------
           SATURN
        ----------------------------------------------------- */

        factors.push(
            makeFactor(

                "Saturn / शनि",

                "House " +
                (
                    dataA.saturnHouse ||
                    "—"
                ),

                "House " +
                (
                    dataB.saturnHouse ||
                    "—"
                ),

                sameNumber(
                    dataA.saturnHouse,
                    dataB.saturnHouse
                )
                    ? "Same House / समान भाव"
                    : "Different House / अलग भाव",

                "Saturn long-term responsibility, patience और endurance से जुड़ा factor है। House difference को अपने आप positive या negative नहीं माना गया है।"

            )
        );


        /* -----------------------------------------------------
           NAVAMSA
        ----------------------------------------------------- */

        const d9Same =
            sameValue(
                dataA.d9Lagna,
                dataB.d9Lagna
            );

        factors.push(
            makeFactor(

                "Navamsa D9 / नवांश",

                dataA.d9Lagna,

                dataB.d9Lagna,

                d9Same
                    ? "Same / समान"
                    : "Different / अलग",

                "D9 marriage assessment का deeper layer है। केवल D9 Lagna देखकर final conclusion नहीं निकाला जाता; D9 planetary placements और 7th-related factors भी देखे जाते हैं।"

            )
        );


        /* -----------------------------------------------------
           DASHA
        ----------------------------------------------------- */

        const dashaA =
            dataA.dasha
                ? dataA.dasha
                : "—";

        const dashaB =
            dataB.dasha
                ? dataB.dasha
                : "—";

        const antaraA =
            dataA.antardasha
                ? dataA.antardasha
                : "—";

        const antaraB =
            dataB.antardasha
                ? dataB.antardasha
                : "—";

        factors.push(
            makeFactor(

                "Dasha / दशा",

                dashaA +
                " / " +
                antaraA,

                dashaB +
                " / " +
                antaraB,

                "Current Period / वर्तमान अवधि",

                "Dasha timing individual chart level पर देखी जाती है। दोनों की current Mahadasha और Antardasha अलग हो सकती है; इससे अकेले compatibility score बनाना उचित नहीं है।"

            )
        );


        return factors;
    }


    /* =========================================================
       7TH LORD
    ========================================================= */

    function getSeventhLord(
        kundli
    ) {

        const house7 =
            getHouse(
                kundli,
                7
            );

        if (
            !house7 ||
            !house7.rashi
        ) {
            return "7th Lord: —";
        }

        const sign =
            house7.rashi;

        const signId =
            sign.id ||
            "";

        const lords = {

            aries:
                "Mars / मंगल",

            scorpio:
                "Mars / मंगल",

            taurus:
                "Venus / शुक्र",

            libra:
                "Venus / शुक्र",

            gemini:
                "Mercury / बुध",

            virgo:
                "Mercury / बुध",

            cancer:
                "Moon / चंद्र",

            leo:
                "Sun / सूर्य",

            sagittarius:
                "Jupiter / गुरु",

            pisces:
                "Jupiter / गुरु",

            capricorn:
                "Saturn / शनि",

            aquarius:
                "Saturn / शनि"

        };

        return (
            "7th Lord: " +
            (
                lords[
                    signId
                ] ||
                "—"
            )
        );
    }


    /* =========================================================
       RENDER FACTORS
    ========================================================= */

    function renderFactors(
        factors
    ) {

        return factors
            .map(
                function (factor) {

                    return `

                        <article class="compatibility-factor-card">

                            <div class="compatibility-factor-head">

                                <h4 class="compatibility-factor-title">
                                    ${escapeHtml(
                                        factor.title
                                    )}
                                </h4>

                                <span class="compatibility-factor-status">
                                    ${escapeHtml(
                                        factor.status
                                    )}
                                </span>

                            </div>


                            <div class="compatibility-factor-values">

                                <div class="compatibility-factor-person">

                                    <span class="compatibility-factor-person-label">
                                        Person A / व्यक्ति A
                                    </span>

                                    <span class="compatibility-factor-person-value">
                                        ${escapeHtml(
                                            factor.valueA
                                        )}
                                    </span>

                                </div>


                                <div class="compatibility-factor-person">

                                    <span class="compatibility-factor-person-label">
                                        Person B / व्यक्ति B
                                    </span>

                                    <span class="compatibility-factor-person-value">
                                        ${escapeHtml(
                                            factor.valueB
                                        )}
                                    </span>

                                </div>

                            </div>


                            <p class="compatibility-factor-note">
                                ${escapeHtml(
                                    factor.note
                                )}
                            </p>

                        </article>

                    `;

                }
            )
            .join("");
    }


    /* =========================================================
       VERIFIED SIMILARITIES
    ========================================================= */

    function buildStrongFactors(
        factors
    ) {

        const result = [];

        factors.forEach(
            function (factor) {

                if (
                    factor.status ===
                    "Same / समान" ||
                    factor.status ===
                    "Same Sign / समान राशि" ||
                    factor.status ===
                    "Comparable / तुलनीय" ||
                    factor.status ===
                    "Same House / समान भाव"
                ) {

                    result.push(
                        factor.title +
                        " में " +
                        factor.status.toLowerCase()
                    );

                }

            }
        );

        return result;
    }


    function buildAttentionAreas(
        factors
    ) {

        const result = [];

        factors.forEach(
            function (factor) {

                if (
                    factor.status ===
                    "Different / अलग" ||
                    factor.status ===
                    "Different Sign / अलग राशि" ||
                    factor.status ===
                    "Different House / अलग भाव"
                ) {

                    result.push(
                        factor.title +
                        " दोनों charts में अलग है। " +
                        "इसे अपने आप negative नहीं माना गया है; " +
                        "complete chart context देखना आवश्यक है।"
                    );

                }

            }
        );

        return result;
    }


    function renderList(
        containerId,
        items
    ) {

        const container =
            document.getElementById(
                containerId
            );

        if (!container) {
            return;
        }

        if (
            !items ||
            !items.length
        ) {

            container.innerHTML = `

                <div class="compatibility-list-empty">
                    इस comparison में कोई अलग verified flag नहीं मिला।
                </div>

            `;

            return;
        }

        container.innerHTML =
            items
                .map(
                    function (item) {

                        return `

                            <div class="compatibility-list-item">
                                ${escapeHtml(
                                    item
                                )}
                            </div>

                        `;

                    }
                )
                .join("");
    }


    /* =========================================================
       SOURCE
    ========================================================= */

    function renderSource(
        kundliA,
        kundliB
    ) {

        const source =
            document.getElementById(
                "compatibilitySource"
            );

        if (!source) {
            return;
        }

        const versionA =
            kundliA &&
            kundliA.version
                ? kundliA.version
                : "—";

        const versionB =
            kundliB &&
            kundliB.version
                ? kundliB.version
                : "—";

        const engineA =
            getEngineVersion(
                kundliA
            );

        const engineB =
            getEngineVersion(
                kundliB
            );

        source.innerHTML = `

            <strong>
                Calculation Source / गणना स्रोत
            </strong>

            <br>

            Person A / व्यक्ति A:
            saved <code>state.kundliA</code>
            • Engine version ${escapeHtml(
                versionA
            )}

            <br>

            Person B / व्यक्ति B:
            saved <code>state.kundliB</code>
            • Engine version ${escapeHtml(
                versionB
            )}

            <br>

            Planetary data:
            <code>kundli.planets</code>

            • Lagna:
            <code>kundli.lagna</code>

            • Houses:
            <code>kundli.houses</code>

            • Navamsa:
            <code>kundli.navamsa</code>

            • Manglik:
            <code>kundli.manglik</code>

            • Dasha:
            <code>kundli.dasha</code>

            • Aspects:
            <code>kundli.aspects</code>

            <br>

            ${escapeHtml(
                engineA
            )}
            / ${escapeHtml(
                engineB
            )}

            • No random, dummy या manually typed
            compatibility value.
        `;
    }


    /* =========================================================
       ENGINE BADGE
    ========================================================= */

    function renderEngineBadge(
        kundliA,
        kundliB
    ) {

        const badge =
            document.getElementById(
                "compatibilityEngineBadge"
            );

        if (!badge) {
            return;
        }

        const build =
            window.KUNDLI_ENGINE_BUILD ||
            "unknown";

        badge.textContent =
            "Kundli Engine / कुंडली इंजन • " +
            build;
    }


    /* =========================================================
       ESCAPE
    ========================================================= */

    function escapeHtml(
        value
    ) {

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


    function formatNumber(
        value
    ) {

        const number =
            Number(value);

        if (
            !Number.isFinite(
                number
            )
        ) {
            return "—";
        }

        return (
            Number.isInteger(
                number
            )
                ? String(number)
                : number.toFixed(1)
        );
    }


    /* =========================================================
       MAIN RENDER
    ========================================================= */

    function render() {

        const content =
            document.getElementById(
                "compatibilityModule"
            );

        if (!content) {
            return;
        }

        if (
            !window.KundliState ||
            typeof window.KundliState.getState !==
            "function"
        ) {

            content.innerHTML = `

                <div class="compatibility-empty">

                    <h3>
                        Kundli State उपलब्ध नहीं है
                    </h3>

                    <p>
                        पहले Kundli State load करें।
                    </p>

                </div>

            `;

            return;
        }

        const state =
            window.KundliState.getState();


        const kundliA =
            state &&
            state.kundliA
                ? state.kundliA
                : null;

        const kundliB =
            state &&
            state.kundliB
                ? state.kundliB
                : null;


        const personA =
            state &&
            state.personA
                ? state.personA
                : {};

        const personB =
            state &&
            state.personB
                ? state.personB
                : {};


        if (
            !kundliA ||
            !kundliB
        ) {

            content.innerHTML = `

                <div class="compatibility-empty">

                    <h3>
                        दोनों Kundli आवश्यक हैं
                    </h3>

                    <p>
                        Person A और Person B की saved
                        calculated Kundli उपलब्ध होने के बाद
                        Compatibility analysis यहाँ दिखाई देगा।
                    </p>

                </div>

            `;

            return;
        }


        /* -----------------------------------------------------
           PROFILE
        ----------------------------------------------------- */

        const profileGrid =
            document.getElementById(
                "compatibilityProfileGrid"
            );

        if (profileGrid) {

            profileGrid.innerHTML =

                renderProfile(
                    personA,
                    kundliA,
                    "Person A / व्यक्ति A",
                    "A"
                )

                +

                renderProfile(
                    personB,
                    kundliB,
                    "Person B / व्यक्ति B",
                    "B"
                );

        }


        /* -----------------------------------------------------
           DATA
        ----------------------------------------------------- */

        const dataA =
            profileData(
                personA,
                kundliA
            );

        const dataB =
            profileData(
                personB,
                kundliB
            );


        /* -----------------------------------------------------
           GUN MILAN
        ----------------------------------------------------- */

        const gunContainer =
            document.getElementById(
                "compatibilityGunContent"
            );

        if (gunContainer) {

            gunContainer.innerHTML =
                renderGunMilan(
                    state
                );

        }


        /* -----------------------------------------------------
           OVERALL
        ----------------------------------------------------- */

        const overall =
            document.getElementById(
                "compatibilityOverallContent"
            );

        if (overall) {

            overall.innerHTML =
                renderOverall(
                    state,
                    dataA,
                    dataB
                );

        }


        /* -----------------------------------------------------
           FACTORS
        ----------------------------------------------------- */

        const factors =
            buildFactors(
                kundliA,
                kundliB,
                dataA,
                dataB
            );


        const factorsContainer =
            document.getElementById(
                "compatibilityFactors"
            );

        if (factorsContainer) {

            factorsContainer.innerHTML =
                renderFactors(
                    factors
                );

        }


        /* -----------------------------------------------------
           STRONG / ATTENTION
        ----------------------------------------------------- */

        renderList(
            "compatibilityStrongFactors",
            buildStrongFactors(
                factors
            )
        );

        renderList(
            "compatibilityAttentionAreas",
            buildAttentionAreas(
                factors
            )
        );


        /* -----------------------------------------------------
           SOURCE
        ----------------------------------------------------- */

        renderSource(
            kundliA,
            kundliB
        );

        renderEngineBadge(
            kundliA,
            kundliB
        );

    }


    /* =========================================================
       INIT
    ========================================================= */

    function init() {

        render();

    }


    /* =========================================================
       PUBLIC REGISTRATION
    ========================================================= */

    window.KundliCompatibility = {

        init,

        render

    };


    window.KundliModules =
        window.KundliModules ||
        {};

    window.KundliModules[
        "compatibility"
    ] = {

        init

    };


})(window);