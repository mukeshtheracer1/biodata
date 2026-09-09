/* =========================================================
   MANGLIK MODULE
   Uses ONLY actual KundliState / Kundli Engine data.
   No dummy/sample/random data.
   ========================================================= */

(function () {
    "use strict";

    const MODULE_ID = "manglik";

    const TRADITIONAL_HOUSES = [1, 2, 4, 7, 8, 12];

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
        return state && state.kundliA ? state.kundliA : null;
    }

    function getPlanet(kundli, id) {
        if (!kundli || !kundli.planets) return null;

        const planets = kundli.planets;

        if (planets[id]) return planets[id];

        const wanted = String(id).toLowerCase();

        for (const key of Object.keys(planets)) {
            if (String(key).toLowerCase() === wanted) {
                return planets[key];
            }
        }

        return null;
    }

    function normalizeSignIndex(value) {
        if (typeof value === "number" && Number.isFinite(value)) {
            const index = Math.round(value);
            if (index >= 0 && index <= 11) {
                return index;
            }
        }

        if (!value) return null;

        const text = String(value).trim().toLowerCase();

        const byName = RASHIS.findIndex(
            r => r.name.toLowerCase() === text
        );

        if (byName >= 0) return byName;

        const byHindi = RASHIS.findIndex(
            r => r.hindi === String(value).trim()
        );

        if (byHindi >= 0) return byHindi;

        return null;
    }

    function getSignIndex(entity) {
        if (!entity) return null;

        if (typeof entity.rashiIndex === "number") {
            return normalizeSignIndex(entity.rashiIndex);
        }

        if (typeof entity.signIndex === "number") {
            return normalizeSignIndex(entity.signIndex);
        }

        if (typeof entity.rashiNumber === "number") {
            return normalizeSignIndex(entity.rashiNumber - 1);
        }

        if (typeof entity.signNumber === "number") {
            return normalizeSignIndex(entity.signNumber - 1);
        }

        if (typeof entity.rashi === "number") {
            return normalizeSignIndex(entity.rashi);
        }

        if (typeof entity.sign === "number") {
            return normalizeSignIndex(entity.sign);
        }

        if (entity.rashi) {
            const nested = normalizeSignIndex(
                entity.rashi.name || entity.rashi.hindi || entity.rashi
            );

            if (nested !== null) return nested;
        }

        return normalizeSignIndex(entity.sign);
    }

    function getHouse(entity) {
        if (!entity) return null;

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

    function getDegree(entity) {
        if (!entity) return null;

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
        if (!Number.isFinite(Number(value))) {
            return "—";
        }

        let degree = Number(value) % 360;

        if (degree < 0) {
            degree += 360;
        }

        const signIndex = Math.floor(degree / 30);
        const degreeInSign = degree - signIndex * 30;

        const whole = Math.floor(degreeInSign);
        const minutes = Math.round(
            (degreeInSign - whole) * 60
        );

        if (minutes === 60) {
            return `${whole + 1}° 00′`;
        }

        return `${whole}° ${String(minutes).padStart(2, "0")}′`;
    }

    function getRashiLabel(entity) {
        if (!entity) return "—";

        if (entity.rashi) {
            if (typeof entity.rashi === "object") {
                const hindi =
                    entity.rashi.hindi ||
                    entity.rashi.nameHindi;

                const name =
                    entity.rashi.name ||
                    entity.rashi.id;

                if (hindi && name) {
                    return `${hindi} (${name})`;
                }

                return hindi || name || "—";
            }

            const index = normalizeSignIndex(entity.rashi);

            if (index !== null) {
                return `${RASHIS[index].hindi} (${RASHIS[index].name})`;
            }

            return String(entity.rashi);
        }

        const signIndex = getSignIndex(entity);

        if (signIndex !== null) {
            return `${RASHIS[signIndex].hindi} (${RASHIS[signIndex].name})`;
        }

        return "—";
    }

    function getRashiIndexFromPlanet(planet) {
        const signIndex = getSignIndex(planet);

        if (signIndex !== null) {
            return signIndex;
        }

        const longitude = getDegree(planet);

        if (longitude !== null) {
            return Math.floor(
                ((longitude % 360) + 360) % 360 / 30
            );
        }

        return null;
    }

    function getLagna(kundli) {
        if (!kundli) return null;

        return kundli.lagna ||
            kundli.ascendant ||
            kundli.asc ||
            null;
    }

    function houseFromReference(mars, reference) {
        const marsSign = getRashiIndexFromPlanet(mars);
        const referenceSign = getRashiIndexFromPlanet(reference);

        if (
            marsSign === null ||
            referenceSign === null
        ) {
            return null;
        }

        return ((marsSign - referenceSign + 12) % 12) + 1;
    }

    function buildReferenceResult(mars, reference, label, hindi) {
        const house = houseFromReference(mars, reference);

        if (house === null) {
            return {
                label,
                hindi,
                house: null,
                affected: null,
                reason: "Required planetary/sign data unavailable."
            };
        }

        const affected = TRADITIONAL_HOUSES.includes(house);

        return {
            label,
            hindi,
            house,
            affected,
            reason: affected
                ? `Mars is in traditional Manglik house ${house} from ${label}.`
                : `Mars is in house ${house} from ${label}, outside the traditional Manglik houses.`
        };
    }

    function buildIndependentAnalysis(kundli) {
        const mars = getPlanet(kundli, "Mars");
        const moon = getPlanet(kundli, "Moon");
        const venus = getPlanet(kundli, "Venus");
        const lagna = getLagna(kundli);

        if (!mars) {
            return null;
        }

        const fromLagna = buildReferenceResult(
            mars,
            lagna,
            "Lagna",
            "लग्न"
        );

        const fromMoon = buildReferenceResult(
            mars,
            moon,
            "Moon",
            "चंद्र"
        );

        const fromVenus = buildReferenceResult(
            mars,
            venus,
            "Venus",
            "शुक्र"
        );

        const references = [
            fromLagna,
            fromMoon,
            fromVenus
        ];

        const available = references.filter(
            item => item.affected !== null
        );

        const affectedCount = available.filter(
            item => item.affected === true
        ).length;

        let isManglik = null;

        if (available.length > 0) {
            isManglik = affectedCount > 0;
        }

        return {
            isManglik,
            fromLagna,
            fromMoon,
            fromVenus,
            references,
            affectedCount,
            availableCount: available.length
        };
    }

    function normalizeEngineResult(kundli) {
        const engine = kundli && kundli.manglik;

        if (!engine) {
            return buildIndependentAnalysis(kundli);
        }

        const independent = buildIndependentAnalysis(kundli);

        return {
            isManglik:
                typeof engine.isManglik === "boolean"
                    ? engine.isManglik
                    : independent
                        ? independent.isManglik
                        : null,

            fromLagna:
                engine.fromLagna ||
                independent?.fromLagna ||
                null,

            fromMoon:
                engine.fromMoon ||
                independent?.fromMoon ||
                null,

            fromVenus:
                engine.fromVenus ||
                independent?.fromVenus ||
                null,

            rules:
                Array.isArray(engine.rules)
                    ? engine.rules
                    : [],

            independent
        };
    }

    function getStatusText(result) {
        if (!result || result.isManglik === null) {
            return "Data Unavailable";
        }

        return result.isManglik
            ? "Manglik: Yes"
            : "Manglik: No";
    }

    function getStatusClass(result) {
        if (!result || result.isManglik === null) {
            return "";
        }

        return result.isManglik
            ? "is-manglik"
            : "is-non-manglik";
    }

    function getReferenceStatus(reference) {
        if (!reference || reference.affected === null) {
            return {
                text: "Data Unavailable",
                className: ""
            };
        }

        return reference.affected
            ? {
                text: "Affected",
                className: "is-affected"
            }
            : {
                text: "Clear",
                className: "is-clear"
            };
    }

    function renderEmpty(container, message) {
        container.innerHTML = `
            <div class="manglik-empty">
                <h3>Manglik data unavailable</h3>
                <p>
                    ${escapeHTML(
                        message ||
                        "पहले Birth Details से Kundli Generate करें।"
                    )}
                </p>
            </div>
        `;
    }

    function renderMarsSummary(kundli, mars) {
        const house = getHouse(mars);

        return `
            <section class="manglik-card">
                <div class="manglik-card-title">
                    <h3>Mars / मंगल Position</h3>
                    <span>Actual calculated position</span>
                </div>

                <div class="manglik-mars-summary">

                    <div class="manglik-stat">
                        <span class="manglik-stat-label">
                            Rashi
                        </span>
                        <strong class="manglik-stat-value">
                            ${escapeHTML(getRashiLabel(mars))}
                        </strong>
                    </div>

                    <div class="manglik-stat">
                        <span class="manglik-stat-label">
                            Degree
                        </span>
                        <strong class="manglik-stat-value">
                            ${escapeHTML(
                                formatDegree(
                                    mars.siderealLongitude ??
                                    mars.longitude ??
                                    mars.degree
                                )
                            )}
                        </strong>
                    </div>

                    <div class="manglik-stat">
                        <span class="manglik-stat-label">
                            House from Lagna
                        </span>
                        <strong class="manglik-stat-value">
                            ${house !== null ? house : "—"}
                        </strong>
                    </div>

                    <div class="manglik-stat">
                        <span class="manglik-stat-label">
                            Motion
                        </span>
                        <strong class="manglik-stat-value">
                            ${escapeHTML(
                                mars.motion ||
                                mars.movement ||
                                "—"
                            )}
                        </strong>
                    </div>

                </div>
            </section>
        `;
    }

    function renderStatus(result) {
        const status = getStatusText(result);
        const statusClass = getStatusClass(result);

        const references = [
            result?.fromLagna,
            result?.fromMoon,
            result?.fromVenus
        ].filter(Boolean);

        const affectedCount = references.filter(
            item => item.affected === true
        ).length;

        return `
            <section class="manglik-card manglik-status-card ${statusClass}">

                <div class="manglik-status-icon">
                    ${result?.isManglik === true
                        ? "M"
                        : result?.isManglik === false
                            ? "✓"
                            : "—"}
                </div>

                <div>
                    <p class="manglik-status-label">
                        Overall Traditional Manglik Status
                    </p>

                    <p class="manglik-status-value">
                        ${escapeHTML(status)}
                    </p>
                </div>

                <div class="manglik-status-meta">
                    <strong>${affectedCount}</strong>
                    <span>
                        affected reference
                        ${affectedCount === 1 ? "" : "s"}
                    </span>
                </div>

            </section>
        `;
    }

    function renderReferenceCard(reference) {
        const status = getReferenceStatus(reference);

        return `
            <article class="manglik-card manglik-reference ${status.className}">

                <div class="manglik-reference-head">

                    <div>
                        <div class="manglik-reference-name">
                            ${escapeHTML(reference.label)}
                        </div>

                        <div class="manglik-reference-hindi">
                            ${escapeHTML(reference.hindi)}
                        </div>
                    </div>

                    <span class="manglik-reference-result">
                        ${escapeHTML(status.text)}
                    </span>

                </div>

                <div class="manglik-reference-body">

                    <div class="manglik-mini-stat">
                        <span>House from Reference</span>
                        <strong>
                            ${reference.house !== null
                                ? reference.house
                                : "—"}
                        </strong>
                    </div>

                    <div class="manglik-mini-stat">
                        <span>Traditional Rule</span>
                        <strong>
                            ${reference.affected === true
                                ? "Applicable"
                                : reference.affected === false
                                    ? "Not Applicable"
                                    : "Unavailable"}
                        </strong>
                    </div>

                    <div class="manglik-mini-stat">
                        <span>Basis</span>
                        <strong>
                            ${reference.affected === true
                                ? "1 / 2 / 4 / 7 / 8 / 12"
                                : "Outside listed houses"}
                        </strong>
                    </div>

                </div>

            </article>
        `;
    }

    function renderTraditionalHouses() {
        return `
            <section class="manglik-card">

                <div class="manglik-card-title">
                    <h3>Traditional Manglik Houses</h3>
                    <span>From each reference point</span>
                </div>

                <div class="manglik-houses">
                    ${TRADITIONAL_HOUSES.map(house => `
                        <span class="manglik-house-chip">
                            ${house}
                        </span>
                    `).join("")}
                </div>

            </section>
        `;
    }

    function renderCrossCheck(result) {
        const engine = result || {};

        const items = [
            {
                label: "From Lagna",
                value: engine.fromLagna
            },
            {
                label: "From Moon",
                value: engine.fromMoon
            },
            {
                label: "From Venus",
                value: engine.fromVenus
            },
            {
                label: "Engine Status",
                value: {
                    affected:
                        typeof engine.isManglik === "boolean"
                            ? engine.isManglik
                            : null
                }
            }
        ];

        return `
            <section class="manglik-card">

                <div class="manglik-card-title">
                    <h3>Engine Cross-Check</h3>
                    <span>Calculated Kundli data</span>
                </div>

                <div class="manglik-crosscheck">

                    ${items.map(item => {
                        let text = "Unavailable";

                        if (item.label === "Engine Status") {
                            if (item.value.affected === true) {
                                text = "Manglik: Yes";
                            } else if (item.value.affected === false) {
                                text = "Manglik: No";
                            }
                        } else if (
                            item.value &&
                            item.value.affected !== null
                        ) {
                            text = item.value.affected
                                ? `Affected — House ${item.value.house}`
                                : `Clear — House ${item.value.house}`;
                        }

                        return `
                            <div class="manglik-cross-item">
                                <span>
                                    ${escapeHTML(item.label)}
                                </span>

                                <strong>
                                    ${escapeHTML(text)}
                                </strong>
                            </div>
                        `;
                    }).join("")}

                </div>

            </section>
        `;
    }

    function renderRules(result) {
        const rules = Array.isArray(result?.rules)
            ? result.rules
            : [];

        if (!rules.length) {
            return "";
        }

        return `
            <section class="manglik-card">

                <div class="manglik-card-title">
                    <h3>Engine Rule Details</h3>
                    <span>Rules returned by Kundli engine</span>
                </div>

                <div class="manglik-table-wrap">
                    <table class="manglik-table">

                        <thead>
                            <tr>
                                <th>Reference</th>
                                <th>House</th>
                                <th>Status</th>
                                <th>Reason</th>
                            </tr>
                        </thead>

                        <tbody>

                            ${rules.map(rule => {

                                const affected =
                                    rule.affected === true;

                                const status =
                                    rule.affected === true
                                        ? "Affected"
                                        : rule.affected === false
                                            ? "Clear"
                                            : "Unavailable";

                                const statusClass =
                                    rule.affected === true
                                        ? "affected"
                                        : rule.affected === false
                                            ? "clear"
                                            : "";

                                return `
                                    <tr>
                                        <td>
                                            ${escapeHTML(
                                                rule.reference || "—"
                                            )}
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                rule.house ?? "—"
                                            )}
                                        </td>

                                        <td>
                                            <span class="manglik-rule-status ${statusClass}">
                                                ${escapeHTML(status)}
                                            </span>
                                        </td>

                                        <td>
                                            ${escapeHTML(
                                                rule.reason || "—"
                                            )}
                                        </td>
                                    </tr>
                                `;
                            }).join("")}

                        </tbody>

                    </table>
                </div>

            </section>
        `;
    }

    function renderNote() {
        return `
            <div class="manglik-note">
                <strong>
                    Important Interpretation Note
                </strong>

                <p>
                    Manglik status alone does not automatically mean
                    marriage problems or marriage failure. This module
                    reports the traditional Mars-house indication only.
                    Cancellation, exceptions, strength of Mars, other
                    planetary combinations and complete marriage analysis
                    should be considered separately.
                </p>
            </div>
        `;
    }

    function render(kundli) {
        const container =
            document.getElementById("manglikContent");

        if (!container) return;

        if (!kundli) {
            renderEmpty(
                container,
                "Kundli data available नहीं है। पहले Birth Details से Kundli Generate करें।"
            );
            return;
        }

        const mars = getPlanet(kundli, "Mars");

        if (!mars) {
            renderEmpty(
                container,
                "Calculated Kundli में Mars / मंगल की planetary data उपलब्ध नहीं है।"
            );
            return;
        }

        const result = normalizeEngineResult(kundli);

        if (!result) {
            renderEmpty(
                container,
                "Manglik analysis के लिए पर्याप्त calculated planetary data उपलब्ध नहीं है।"
            );
            return;
        }

        const references = [
            result.fromLagna,
            result.fromMoon,
            result.fromVenus
        ].filter(Boolean);

        container.innerHTML = `
            ${renderStatus(result)}

            ${renderMarsSummary(kundli, mars)}

            <div class="manglik-grid">
                ${references
                    .map(renderReferenceCard)
                    .join("")}
            </div>

            ${renderTraditionalHouses()}

            ${renderCrossCheck(result)}

            ${renderRules(result)}

            ${renderNote()}
        `;

        updateEngineBadge(kundli);
    }

    function updateEngineBadge(kundli) {
        const badge =
            document.getElementById("manglikEngineBadge");

        if (!badge) return;

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

    function init() {
        const kundli = getKundli();

        render(kundli);

        console.log(
            "[Kundli Manglik] Initialized with actual Kundli data."
        );
    }

    window.KundliManglik = {
        init
    };

    window.KundliModules =
        window.KundliModules || {};

    window.KundliModules[MODULE_ID] = {
        init
    };

})();