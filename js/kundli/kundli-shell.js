/* =========================================================
   VEDIC KUNDLI
   Main Application Shell
   ---------------------------------------------------------
   File:
   js/kundli/kundli-shell.js

   Purpose:
   - Manage all 17 Kundli modules
   - Build module navigation
   - Load module HTML dynamically
   - Load module CSS dynamically
   - Load module JS dynamically
   - Handle Previous / Next navigation
   - Maintain active module
   - Connect with KundliState
   ========================================================= */

(function () {
    "use strict";

    /* =====================================================
       1. MODULE CONFIGURATION
       -----------------------------------------------------
       IMPORTANT:
       Every module has:
       - id
       - number
       - label
       - title
       - html
       - css
       - js

       These names MUST remain consistent with actual files.
       ===================================================== */

    const MODULES = [

        /* -------------------------------------------------
           01. BIRTH DETAILS
           ------------------------------------------------- */
        {
            id: "birth-details",
            number: "01",
            label: "जन्म विवरण",
            title: "Birth Details",
            html: "kundli/birth-details.html",
            css: "../css/kundli/birth-details.css",
            js: "../js/kundli/birth-details.js"
        },

        /* -------------------------------------------------
           02. DASHBOARD
           ------------------------------------------------- */
        {
            id: "dashboard",
            number: "02",
            label: "Dashboard",
            title: "Kundli Dashboard",
            html: "kundli/dashboard.html",
            css: "../css/kundli/dashboard.css",
            js: "../js/kundli/dashboard.js"
        },

        /* -------------------------------------------------
           03. D1 RASHI
           ------------------------------------------------- */
        {
            id: "d1-rashi",
            number: "03",
            label: "D1 Rashi",
            title: "D1 Rashi Chart",
            html: "kundli/d1-rashi.html",
            css: "../css/kundli/d1-rashi.css",
            js: "../js/kundli/d1-rashi.js"
        },

        /* -------------------------------------------------
           04. BHAVA
           ------------------------------------------------- */
        {
            id: "bhava",
            number: "04",
            label: "Bhava",
            title: "Bhava / Houses",
            html: "kundli/bhava.html",
            css: "../css/kundli/bhava.css",
            js: "../js/kundli/bhava.js"
        },

        /* -------------------------------------------------
           05. GRAH STHITI
           ------------------------------------------------- */
        {
            id: "grah-sthiti",
            number: "05",
            label: "Grah Sthiti",
            title: "Planetary Positions",
            html: "kundli/grah-sthiti.html",
            css: "../css/kundli/grah-sthiti.css",
            js: "../js/kundli/grah-sthiti.js"
        },

        /* -------------------------------------------------
           06. NAKSHATRA
           ------------------------------------------------- */
        {
            id: "nakshatra",
            number: "06",
            label: "Nakshatra",
            title: "Nakshatra Details",
            html: "kundli/nakshatra.html",
            css: "../css/kundli/nakshatra.css",
            js: "../js/kundli/nakshatra.js"
        },

        /* -------------------------------------------------
           07. NAVAMSA D9
           ------------------------------------------------- */
        {
            id: "navamsa-d9",
            number: "07",
            label: "Navamsa D9",
            title: "Navamsa D9",
            html: "kundli/navamsa-d9.html",
            css: "../css/kundli/navamsa-d9.css",
            js: "../js/kundli/navamsa-d9.js"
        },

        /* -------------------------------------------------
           08. DASHA
           ------------------------------------------------- */
        {
            id: "dasha",
            number: "08",
            label: "Dasha",
            title: "Vimshottari Dasha",
            html: "kundli/dasha.html",
            css: "../css/kundli/dasha.css",
            js: "../js/kundli/dasha.js"
        },

        /* -------------------------------------------------
           09. YOG
           ------------------------------------------------- */
        {
            id: "yog",
            number: "09",
            label: "Yog",
            title: "Yoga Analysis",
            html: "kundli/yog.html",
            css: "../css/kundli/yog.css",
            js: "../js/kundli/yog.js"
        },

        /* -------------------------------------------------
           10. DOSHA
           ------------------------------------------------- */
        {
            id: "dosha",
            number: "10",
            label: "Dosha",
            title: "Dosha Analysis",
            html: "kundli/dosha.html",
            css: "../css/kundli/dosha.css",
            js: "../js/kundli/dosha.js"
        },

        /* -------------------------------------------------
           11. MANGLIK
           ------------------------------------------------- */
        {
            id: "manglik",
            number: "11",
            label: "Manglik",
            title: "Manglik Analysis",
            html: "kundli/manglik.html",
            css: "../css/kundli/manglik.css",
            js: "../js/kundli/manglik.js"
        },

        /* -------------------------------------------------
           12. MARRIAGE
           ------------------------------------------------- */
        {
            id: "marriage",
            number: "12",
            label: "Marriage",
            title: "Marriage Analysis",
            html: "kundli/marriage.html",
            css: "../css/kundli/marriage.css",
            js: "../js/kundli/marriage.js"
        },

        /* -------------------------------------------------
           13. TIMING
           ------------------------------------------------- */
        {
            id: "timing",
            number: "13",
            label: "Timing",
            title: "Marriage Timing",
            html: "kundli/timing.html",
            css: "../css/kundli/timing.css",
            js: "../js/kundli/timing.js"
        },

        /* -------------------------------------------------
           14. KUNDLI MILAN
           ------------------------------------------------- */
        {
            id: "kundli-milan",
            number: "14",
            label: "Kundli Milan",
            title: "Kundli Milan",
            html: "kundli/kundli-milan.html",
            css: "../css/kundli/kundli-milan.css",
            js: "../js/kundli/kundli-milan.js"
        },

        /* -------------------------------------------------
           15. GUN MILAN
           ------------------------------------------------- */
        {
            id: "gun-milan",
            number: "15",
            label: "Gun Milan",
            title: "Ashtakoota Gun Milan",
            html: "kundli/gun-milan.html",
            css: "../css/kundli/gun-milan.css",
            js: "../js/kundli/gun-milan.js"
        },

        /* -------------------------------------------------
           16. COMPATIBILITY
           ------------------------------------------------- */
        {
            id: "compatibility",
            number: "16",
            label: "Compatibility",
            title: "Relationship Compatibility",
            html: "kundli/compatibility.html",
            css: "../css/kundli/compatibility.css",
            js: "../js/kundli/compatibility.js"
        },

        /* -------------------------------------------------
           17. DETAILED REPORT
           ------------------------------------------------- */
        {
            id: "detailed-report",
            number: "17",
            label: "Detailed Report",
            title: "Detailed Kundli Report",
            html: "kundli/detailed-report.html",
            css: "../css/kundli/detailed-report.css",
            js: "../js/kundli/detailed-report.js"
        }

    ];


    /* =====================================================
       2. SHELL DOM REFERENCES
       ===================================================== */

    const app = document.getElementById("kundliApp");
    const header = document.getElementById("kundliHeader");
    const headerActions = document.getElementById("kundliHeaderActions");
    const navigation = document.getElementById("kundliNavigation");
    const screen = document.getElementById("kundliScreen");
    const pager = document.getElementById("kundliPager");


    /* =====================================================
       3. BASIC DOM VALIDATION
       -----------------------------------------------------
       If one required shell element is missing, stop here
       instead of creating silent errors.
       ===================================================== */

    if (!app) {
        console.error(
            "[Kundli Shell] Missing #kundliApp"
        );
        return;
    }

    if (!header) {
        console.error(
            "[Kundli Shell] Missing #kundliHeader"
        );
        return;
    }

    if (!headerActions) {
        console.error(
            "[Kundli Shell] Missing #kundliHeaderActions"
        );
        return;
    }

    if (!navigation) {
        console.error(
            "[Kundli Shell] Missing #kundliNavigation"
        );
        return;
    }

    if (!screen) {
        console.error(
            "[Kundli Shell] Missing #kundliScreen"
        );
        return;
    }

    if (!pager) {
        console.error(
            "[Kundli Shell] Missing #kundliPager"
        );
        return;
    }


    /* =====================================================
       4. SHELL STATE
       ===================================================== */

    let currentModuleIndex = 0;

    let isModuleLoading = false;

    const loadedCssModules = new Set();

    const loadedJsModules = new Set();


    /* =====================================================
       5. FIND MODULE
       ===================================================== */

    function getModuleById(moduleId) {

        return MODULES.find(function (module) {
            return module.id === moduleId;
        }) || null;

    }


    /* =====================================================
       6. BUILD NAVIGATION
       -----------------------------------------------------
       Creates all 17 navigation buttons dynamically.
       ===================================================== */

    function renderNavigation() {

        navigation.innerHTML = "";

        const navigationList = document.createElement("div");

        navigationList.id = "kundliNavigationList";

        navigationList.className = "kundli-navigation-list";


        MODULES.forEach(function (module, index) {

            const button = document.createElement("button");

            button.type = "button";

            button.id = "kundliNav-" + module.id;

            button.className = "kundli-nav-item";

            button.dataset.moduleId = module.id;

            button.dataset.moduleIndex = String(index);

            button.setAttribute(
                "aria-controls",
                "kundliScreen"
            );

            button.setAttribute(
                "aria-label",
                module.number + ". " + module.label
            );

            button.innerHTML = `
                <span class="kundli-nav-number">
                    ${module.number}
                </span>

                <span class="kundli-nav-label">
                    ${module.label}
                </span>
            `;


            button.addEventListener(
                "click",
                function () {

                    goToModule(index);

                }
            );


            navigationList.appendChild(button);

        });


        navigation.appendChild(navigationList);

    }


    /* =====================================================
       7. HEADER ACTIONS
       -----------------------------------------------------
       Reserved area for future actions:
       - Save
       - Print
       - Reset
       - Person A/B
       ===================================================== */

    function renderHeaderActions() {

        headerActions.innerHTML = `
            <div
                id="kundliHeaderStatus"
                class="kundli-header-status"
                aria-live="polite"
            >
                <span
                    id="kundliHeaderStatusText"
                    class="kundli-header-status-text"
                >
                    Kundli तैयार करें
                </span>
            </div>
        `;

    }


    /* =====================================================
       8. UPDATE HEADER STATUS
       ===================================================== */

    function updateHeaderStatus() {

        const statusText = document.getElementById(
            "kundliHeaderStatusText"
        );

        if (!statusText) {
            return;
        }

        const activeModule = MODULES[currentModuleIndex];

        if (!activeModule) {
            statusText.textContent = "Kundli";
            return;
        }

        statusText.textContent =
            activeModule.number +
            ". " +
            activeModule.label;

    }


    /* =====================================================
       9. UPDATE ACTIVE NAVIGATION
       ===================================================== */

    function updateNavigationState() {

        const buttons =
            navigation.querySelectorAll(
                ".kundli-nav-item"
            );


        buttons.forEach(function (button, index) {

            const isActive =
                index === currentModuleIndex;

            button.classList.toggle(
                "is-active",
                isActive
            );

            button.setAttribute(
                "aria-current",
                isActive ? "page" : "false"
            );

        });

    }


    /* =====================================================
       10. LOAD MODULE CSS
       -----------------------------------------------------
       CSS is loaded only once.
       ===================================================== */

    function loadModuleCss(module) {

        if (
            !module ||
            !module.css ||
            loadedCssModules.has(module.id)
        ) {
            return Promise.resolve();
        }


        return new Promise(function (resolve, reject) {

            const existingLink =
                document.querySelector(
                    'link[data-kundli-module-css="' +
                    module.id +
                    '"]'
                );


            if (existingLink) {

                loadedCssModules.add(module.id);

                resolve();

                return;

            }


            const link = document.createElement("link");

            link.rel = "stylesheet";

            link.href = module.css;

            link.dataset.kundliModuleCss =
                module.id;


            link.onload = function () {

                loadedCssModules.add(module.id);

                resolve();

            };


            link.onerror = function () {

                console.error(
                    "[Kundli Shell] CSS load failed:",
                    module.css
                );

                reject(
                    new Error(
                        "Module CSS failed to load: " +
                        module.css
                    )
                );

            };


            document.head.appendChild(link);

        });

    }


    /* =====================================================
       11. LOAD MODULE JAVASCRIPT
       -----------------------------------------------------
       JS is loaded only once.
       ===================================================== */

    function loadModuleJs(module) {

        if (
            !module ||
            !module.js ||
            loadedJsModules.has(module.id)
        ) {
            return Promise.resolve();
        }


        return new Promise(function (resolve, reject) {

            const existingScript =
                document.querySelector(
                    'script[data-kundli-module-js="' +
                    module.id +
                    '"]'
                );


            if (existingScript) {

                loadedJsModules.add(module.id);

                resolve();

                return;

            }


            const script =
                document.createElement("script");


            script.src = module.js;

            script.defer = true;

            script.dataset.kundliModuleJs =
                module.id;


            script.onload = function () {

                loadedJsModules.add(module.id);

                resolve();

            };


            script.onerror = function () {

                console.error(
                    "[Kundli Shell] JS load failed:",
                    module.js
                );

                reject(
                    new Error(
                        "Module JS failed to load: " +
                        module.js
                    )
                );

            };


            document.body.appendChild(script);

        });

    }


    /* =====================================================
       12. INITIALIZE MODULE JAVASCRIPT
       -----------------------------------------------------
       Every module JS will eventually register itself as:

       window.KundliModules["module-id"] = {
           init: function () {}
       };
       ===================================================== */

    function initializeModule(module) {

        if (!module) {
            return;
        }


        const moduleRegistry =
            window.KundliModules;


        if (
            !moduleRegistry ||
            !moduleRegistry[module.id]
        ) {
            console.warn(
                "[Kundli Shell] Module init not found yet:",
                module.id
            );

            return;

        }


        const moduleController =
            moduleRegistry[module.id];


        if (
            typeof moduleController.init !==
            "function"
        ) {
            console.warn(
                "[Kundli Shell] init() missing for:",
                module.id
            );

            return;

        }


        try {

            moduleController.init({
                module: module,
                state:
                    window.KundliState || null,
                engine:
                    window.KundliEngine || null,
                screen: screen,
                app: app
            });

        } catch (error) {

            console.error(
                "[Kundli Shell] Module initialization error:",
                module.id,
                error
            );

            showModuleError(
                module,
                "Module initialize करते समय error आया।"
            );

        }

    }


    /* =====================================================
       13. LOAD MODULE HTML
       ===================================================== */

    async function loadModuleHtml(module) {

        if (!module || !module.html) {

            throw new Error(
                "Module HTML path is missing."
            );

        }


        const response =
            await fetch(module.html, {
                method: "GET",
                cache: "no-cache"
            });


        if (!response.ok) {

            throw new Error(
                "HTTP " +
                response.status +
                " while loading " +
                module.html
            );

        }


        const html =
            await response.text();


        if (!html.trim()) {

            throw new Error(
                "Module HTML is empty: " +
                module.html
            );

        }


        return html;

    }


    /* =====================================================
       14. MODULE LOADING MESSAGE
       ===================================================== */

    function showModuleLoading(module) {

        screen.innerHTML = `
            <section
                id="kundliModuleLoading"
                class="kundli-module-loading"
                aria-live="polite"
            >
                <div
                    class="kundli-module-loading-card"
                >
                    <div
                        class="kundli-module-loading-number"
                    >
                        ${module.number}
                    </div>

                    <div
                        class="kundli-module-loading-content"
                    >
                        <h2>
                            ${module.label}
                        </h2>

                        <p>
                            Module load हो रहा है...
                        </p>
                    </div>
                </div>
            </section>
        `;

    }


    /* =====================================================
       15. MODULE ERROR
       ===================================================== */

    function showModuleError(module, message) {

        screen.innerHTML = `
            <section
                id="kundliModuleError"
                class="kundli-module-error"
                role="alert"
            >
                <div
                    class="kundli-module-error-card"
                >
                    <div
                        class="kundli-module-error-number"
                    >
                        ${module ? module.number : "!"}
                    </div>

                    <div
                        class="kundli-module-error-content"
                    >
                        <h2>
                            Module Load Error
                        </h2>

                        <p>
                            ${message}
                        </p>

                        <button
                            id="kundliModuleRetry"
                            class="kundli-module-retry"
                            type="button"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </section>
        `;


        const retryButton =
            document.getElementById(
                "kundliModuleRetry"
            );


        if (retryButton) {

            retryButton.addEventListener(
                "click",
                function () {

                    loadCurrentModule();

                }
            );

        }

    }


    /* =====================================================
       16. LOAD CURRENT MODULE
       ===================================================== */

    async function loadCurrentModule() {

        const module =
            MODULES[currentModuleIndex];


        if (!module) {

            console.error(
                "[Kundli Shell] Invalid module index:",
                currentModuleIndex
            );

            return;

        }


        if (isModuleLoading) {
            return;
        }


        isModuleLoading = true;


        updateNavigationState();

        updateHeaderStatus();

        showModuleLoading(module);


        try {

            /*
             * Load CSS first.
             */
            await loadModuleCss(module);


            /*
             * Fetch module HTML.
             */
            const html =
                await loadModuleHtml(module);


            /*
             * Insert module HTML into shell screen.
             */
            screen.innerHTML = html;


            /*
             * Load module JavaScript.
             */
            await loadModuleJs(module);


            /*
             * Initialize module.
             */
            initializeModule(module);


            /*
             * Update pager.
             */
            renderPager();


        } catch (error) {

            console.error(
                "[Kundli Shell] Module loading failed:",
                module.id,
                error
            );


            showModuleError(
                module,
                "इस module को load नहीं किया जा सका। Console में error details देख सकते हैं।"
            );

        } finally {

            isModuleLoading = false;

        }

    }


    /* =====================================================
       17. PAGER
       -----------------------------------------------------
       Previous / Next navigation
       ===================================================== */

    function renderPager() {

        const module =
            MODULES[currentModuleIndex];


        const isFirst =
            currentModuleIndex === 0;


        const isLast =
            currentModuleIndex ===
            MODULES.length - 1;


        pager.innerHTML = `
            <div
                id="kundliPagerInner"
                class="kundli-pager-inner"
            >

                <button
                    id="kundliPreviousButton"
                    class="kundli-pager-button kundli-pager-previous"
                    type="button"
                    ${isFirst ? "disabled" : ""}
                    aria-label="Previous module"
                >
                    <span
                        class="kundli-pager-arrow"
                        aria-hidden="true"
                    >
                        ←
                    </span>

                    <span
                        class="kundli-pager-text"
                    >
                        Previous
                    </span>
                </button>


                <div
                    id="kundliPagerStatus"
                    class="kundli-pager-status"
                    aria-live="polite"
                >
                    <span
                        id="kundliPagerCurrent"
                        class="kundli-pager-current"
                    >
                        ${module.number}
                    </span>

                    <span
                        class="kundli-pager-separator"
                    >
                        /
                    </span>

                    <span
                        id="kundliPagerTotal"
                        class="kundli-pager-total"
                    >
                        ${MODULES.length}
                    </span>

                    <span
                        id="kundliPagerModuleName"
                        class="kundli-pager-module-name"
                    >
                        ${module.label}
                    </span>
                </div>


                <button
                    id="kundliNextButton"
                    class="kundli-pager-button kundli-pager-next"
                    type="button"
                    ${isLast ? "disabled" : ""}
                    aria-label="Next module"
                >
                    <span
                        class="kundli-pager-text"
                    >
                        Next
                    </span>

                    <span
                        class="kundli-pager-arrow"
                        aria-hidden="true"
                    >
                        →
                    </span>
                </button>

            </div>
        `;


        const previousButton =
            document.getElementById(
                "kundliPreviousButton"
            );


        const nextButton =
            document.getElementById(
                "kundliNextButton"
            );


        if (previousButton) {

            previousButton.addEventListener(
                "click",
                function () {

                    goToPreviousModule();

                }
            );

        }


        if (nextButton) {

            nextButton.addEventListener(
                "click",
                function () {

                    goToNextModule();

                }
            );

        }

    }


    /* =====================================================
       18. GO TO MODULE BY INDEX
       ===================================================== */

    function goToModule(index) {

        if (
            typeof index !== "number" ||
            index < 0 ||
            index >= MODULES.length
        ) {
            console.warn(
                "[Kundli Shell] Invalid module index:",
                index
            );

            return;

        }


        if (isModuleLoading) {
            return;
        }


        currentModuleIndex = index;


        saveCurrentModule();


        loadCurrentModule();

    }


    /* =====================================================
       19. GO TO MODULE BY ID
       ===================================================== */

    function goToModuleById(moduleId) {

        const index =
            MODULES.findIndex(function (module) {

                return module.id === moduleId;

            });


        if (index === -1) {

            console.warn(
                "[Kundli Shell] Unknown module ID:",
                moduleId
            );

            return;

        }


        goToModule(index);

    }


    /* =====================================================
       20. PREVIOUS MODULE
       ===================================================== */

    function goToPreviousModule() {

        if (currentModuleIndex <= 0) {
            return;
        }


        goToModule(
            currentModuleIndex - 1
        );

    }


    /* =====================================================
       21. NEXT MODULE
       ===================================================== */

    function goToNextModule() {

        if (
            currentModuleIndex >=
            MODULES.length - 1
        ) {
            return;
        }


        goToModule(
            currentModuleIndex + 1
        );

    }


    /* =====================================================
       22. SAVE CURRENT MODULE
       -----------------------------------------------------
       Uses KundliState if available.
       ===================================================== */

    function saveCurrentModule() {

        if (
            !window.KundliState ||
            typeof window.KundliState.patch !==
            "function"
        ) {
            return;
        }


        try {

            window.KundliState.patch({
                currentModule:
                    MODULES[currentModuleIndex].id
            });

        } catch (error) {

            console.warn(
                "[Kundli Shell] Could not save current module:",
                error
            );

        }

    }


    /* =====================================================
       23. RESTORE CURRENT MODULE
       -----------------------------------------------------
       If state has a valid module ID, restore it.
       Otherwise default = Birth Details.
       ===================================================== */

    function restoreCurrentModule() {

        if (
            !window.KundliState ||
            typeof window.KundliState.getState !==
            "function"
        ) {

            currentModuleIndex = 0;

            return;

        }


        try {

            const state =
                window.KundliState.getState();


            const savedModule =
                state &&
                state.currentModule;


            if (!savedModule) {

                currentModuleIndex = 0;

                return;

            }


            const savedIndex =
                MODULES.findIndex(function (module) {

                    return module.id ===
                        savedModule;

                });


            if (savedIndex === -1) {

                currentModuleIndex = 0;

                return;

            }


            currentModuleIndex =
                savedIndex;

        } catch (error) {

            console.warn(
                "[Kundli Shell] State restore failed:",
                error
            );

            currentModuleIndex = 0;

        }

    }


    /* =====================================================
       24. KEYBOARD NAVIGATION
       -----------------------------------------------------
       ArrowLeft  = Previous
       ArrowRight = Next
       ===================================================== */

    function bindKeyboardNavigation() {

        document.addEventListener(
            "keydown",
            function (event) {

                /*
                 * Do not change module while the user is
                 * typing inside form fields.
                 */
                const activeElement =
                    document.activeElement;


                if (
                    activeElement &&
                    (
                        activeElement.tagName ===
                        "INPUT" ||
                        activeElement.tagName ===
                        "TEXTAREA" ||
                        activeElement.tagName ===
                        "SELECT" ||
                        activeElement.isContentEditable
                    )
                ) {
                    return;
                }


                if (event.key === "ArrowLeft") {

                    goToPreviousModule();

                }


                if (event.key === "ArrowRight") {

                    goToNextModule();

                }

            }
        );

    }


    /* =====================================================
       25. PUBLIC SHELL API
       -----------------------------------------------------
       Other modules can access:

       window.KundliShell.getModules()
       window.KundliShell.getCurrentModule()
       window.KundliShell.goTo("d1-rashi")
       ===================================================== */

    window.KundliShell = {

        getModules: function () {

            return MODULES.slice();

        },


        getCurrentModule: function () {

            return MODULES[
                currentModuleIndex
            ] || null;

        },


        getCurrentIndex: function () {

            return currentModuleIndex;

        },


        goTo: function (moduleId) {

            goToModuleById(moduleId);

        },


        next: function () {

            goToNextModule();

        },


        previous: function () {

            goToPreviousModule();

        },


        reload: function () {

            loadCurrentModule();

        }

    };


    /* =====================================================
       26. INITIALIZE SHELL
       ===================================================== */

    function initShell() {

        console.log(
            "[Kundli Shell] Initializing..."
        );


        /*
         * Restore saved module.
         */
        restoreCurrentModule();


        /*
         * Build 17-module navigation.
         */
        renderNavigation();


        /*
         * Build header actions area.
         */
        renderHeaderActions();


        /*
         * Build Previous / Next controls.
         */
        renderPager();


        /*
         * Keyboard navigation.
         */
        bindKeyboardNavigation();


        /*
         * Load first/current module.
         */
        loadCurrentModule();


        console.log(
            "[Kundli Shell] Ready.",
            MODULES.length + " modules registered."
        );

    }


    /* =====================================================
       27. START
       ===================================================== */

    if (
        document.readyState === "loading"
    ) {

        document.addEventListener(
            "DOMContentLoaded",
            initShell
        );

    } else {

        initShell();

    }

})();