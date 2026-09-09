/* =========================================================
   VEDIC KUNDLI
   Central State Manager
   ---------------------------------------------------------
   File:
   js/kundli/kundli-state.js

   Purpose:
   - Person A birth data store karna
   - Person B birth data store karna
   - Kundli calculation results store karna
   - Kundli Milan data store karna
   - Current module remember karna
   - localStorage persistence
   - Sabhi Kundli modules ko same data provide karna

   IMPORTANT:
   Is file mein astrology calculation nahi hoti.
   Calculation KundliEngine karega.
   ========================================================= */

(function () {
    "use strict";


    /* =====================================================
       1. STORAGE CONFIGURATION
       ===================================================== */

    const STORAGE_KEY = "vedicKundliStateV1";


    /* =====================================================
       2. DEFAULT PERSON STRUCTURE
       ===================================================== */

    function createEmptyPerson() {

        return {
            name: "",
            gender: "",

            date: "",
            time: "",

            place: "",
            state: "",
            country: "",

            latitude: null,
            longitude: null,

            timezone: "",

            birthTimeAccuracy: "",

            notes: ""
        };

    }


    /* =====================================================
       3. DEFAULT APPLICATION STATE
       ===================================================== */

    function createDefaultState() {

        return {
            personA: createEmptyPerson(),

            personB: null,

            kundliA: null,

            kundliB: null,

            milan: null,

            currentModule: "birth-details"
        };

    }


    /* =====================================================
       4. INTERNAL STATE
       ===================================================== */

    let state = createDefaultState();


    /* =====================================================
       5. SAFE CLONE
       -----------------------------------------------------
       State ko direct reference ke through modify hone se
       bachata hai.
       ===================================================== */

    function cloneData(data) {

        if (data === undefined) {
            return undefined;
        }

        if (data === null) {
            return null;
        }

        return JSON.parse(
            JSON.stringify(data)
        );

    }


    /* =====================================================
       6. NORMALIZE PERSON
       -----------------------------------------------------
       Missing properties ko default values deta hai.
       ===================================================== */

    function normalizePerson(person) {

        const emptyPerson =
            createEmptyPerson();


        if (!person || typeof person !== "object") {

            return emptyPerson;

        }


        return {

            name:
                typeof person.name === "string"
                    ? person.name
                    : emptyPerson.name,

            gender:
                typeof person.gender === "string"
                    ? person.gender
                    : emptyPerson.gender,

            date:
                typeof person.date === "string"
                    ? person.date
                    : emptyPerson.date,

            time:
                typeof person.time === "string"
                    ? person.time
                    : emptyPerson.time,

            place:
                typeof person.place === "string"
                    ? person.place
                    : emptyPerson.place,

            state:
                typeof person.state === "string"
                    ? person.state
                    : emptyPerson.state,

            country:
                typeof person.country === "string"
                    ? person.country
                    : emptyPerson.country,

            latitude:
                isValidNumber(person.latitude)
                    ? Number(person.latitude)
                    : null,

            longitude:
                isValidNumber(person.longitude)
                    ? Number(person.longitude)
                    : null,

            timezone:
                typeof person.timezone === "string"
                    ? person.timezone
                    : emptyPerson.timezone,

            birthTimeAccuracy:
                typeof person.birthTimeAccuracy === "string"
                    ? person.birthTimeAccuracy
                    : emptyPerson.birthTimeAccuracy,

            notes:
                typeof person.notes === "string"
                    ? person.notes
                    : emptyPerson.notes

        };

    }


    /* =====================================================
       7. NUMBER VALIDATION
       ===================================================== */

    function isValidNumber(value) {

        return (
            value !== null &&
            value !== "" &&
            typeof value !== "boolean" &&
            Number.isFinite(Number(value))
        );

    }


    /* =====================================================
       8. NORMALIZE STATE
       -----------------------------------------------------
       localStorage se purana/incomplete data aaye to bhi
       application crash na ho.
       ===================================================== */

    function normalizeState(savedState) {

        const defaultState =
            createDefaultState();


        if (
            !savedState ||
            typeof savedState !== "object"
        ) {

            return defaultState;

        }


        const kundliA =
            savedState.kundliA !== undefined
                ? cloneData(savedState.kundliA)
                : null;

        const kundliB =
            savedState.kundliB !== undefined
                ? cloneData(savedState.kundliB)
                : null;

        if (window.KundliEngine?.utils?.enrichKundli) {
            window.KundliEngine.utils.enrichKundli(kundliA);
            window.KundliEngine.utils.enrichKundli(kundliB);
        }

        return {

            personA:
                normalizePerson(savedState.personA),

            personB:
                savedState.personB
                    ? normalizePerson(savedState.personB)
                    : null,

            kundliA,

            kundliB,

            milan:
                savedState.milan !== undefined
                    ? cloneData(
                        savedState.milan
                    )
                    : null,

            currentModule:
                typeof savedState.currentModule === "string"
                    ? savedState.currentModule
                    : defaultState.currentModule

        };

    }


    /* =====================================================
       9. SAVE TO LOCAL STORAGE
       ===================================================== */

    function persist() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(state)
            );

            return true;

        } catch (error) {

            console.error(
                "[Kundli State] localStorage save failed:",
                error
            );

            return false;

        }

    }


    /* =====================================================
       10. LOAD FROM LOCAL STORAGE
       ===================================================== */

    function load() {

        try {

            const stored =
                localStorage.getItem(
                    STORAGE_KEY
                );


            if (!stored) {

                state =
                    createDefaultState();

                return cloneData(state);

            }


            const parsed =
                JSON.parse(stored);


            state =
                normalizeState(parsed);


            return cloneData(state);

        } catch (error) {

            console.error(
                "[Kundli State] localStorage load failed:",
                error
            );


            state =
                createDefaultState();


            return cloneData(state);

        }

    }


    /* =====================================================
       11. GET COMPLETE STATE
       ===================================================== */

    function getState() {

        return cloneData(state);

    }


    /* =====================================================
       12. REPLACE COMPLETE STATE
       -----------------------------------------------------
       Rarely required, but useful for importing/restoring
       complete Kundli data.
       ===================================================== */

    function setState(nextState) {

        state =
            normalizeState(nextState);


        persist();


        return getState();

    }


    /* =====================================================
       13. PATCH STATE
       -----------------------------------------------------
       Partial state update.

       Example:

       KundliState.patch({
           currentModule: "dashboard"
       });
       ===================================================== */

    function patch(nextPatch) {

        if (
            !nextPatch ||
            typeof nextPatch !== "object"
        ) {

            return getState();

        }


        const mergedState = {

            ...state,

            ...nextPatch

        };


        state =
            normalizeState(
                mergedState
            );


        persist();


        return getState();

    }


    /* =====================================================
       14. SAVE PERSON A
       -----------------------------------------------------
       Birth Details module ka main save function.
       ===================================================== */

    function savePersonA(personA, kundliA) {

        state.personA =
            normalizePerson(personA);


        if (kundliA !== undefined) {
            state.kundliA = cloneData(kundliA);
            if (window.KundliEngine?.utils?.enrichKundli) {
                window.KundliEngine.utils.enrichKundli(state.kundliA);
            }
        }


        persist();


        return getState();

    }


    /* =====================================================
       15. SAVE PERSON B
       -----------------------------------------------------
       Kundli Milan ke liye second person's data.
       ===================================================== */

    function savePersonB(personB, kundliB) {

        state.personB =
            personB
                ? normalizePerson(personB)
                : null;


        if (kundliB !== undefined) {
            state.kundliB = cloneData(kundliB);
            if (window.KundliEngine?.utils?.enrichKundli) {
                window.KundliEngine.utils.enrichKundli(state.kundliB);
            }
        }


        persist();


        return getState();

    }


    /* =====================================================
       16. SAVE KUNDLI A
       -----------------------------------------------------
       Engine se calculated complete result.
       ===================================================== */

    function saveKundliA(kundliA) {

        state.kundliA =
            cloneData(kundliA);


        persist();


        return getState();

    }


    /* =====================================================
       17. SAVE KUNDLI B
       ===================================================== */

    function saveKundliB(kundliB) {

        state.kundliB =
            cloneData(kundliB);


        persist();


        return getState();

    }


    /* =====================================================
       18. SAVE MILAN RESULT
       -----------------------------------------------------
       Gun Milan / Compatibility / Kundli Milan ka result.
       ===================================================== */

    function saveMilan(milan) {

        state.milan =
            cloneData(milan);


        persist();


        return getState();

    }


    /* =====================================================
       19. SET CURRENT MODULE
       ===================================================== */

    function setCurrentModule(moduleId) {

        if (
            typeof moduleId !== "string" ||
            !moduleId.trim()
        ) {

            return getState();

        }


        state.currentModule =
            moduleId.trim();


        persist();


        return getState();

    }


    /* =====================================================
       20. CHECK PERSON A
       -----------------------------------------------------
       Sirf ye check karta hai ki basic birth data
       available hai ya nahi.
       ===================================================== */

    function hasPersonA() {

        const person =
            state.personA;


        if (!person) {
            return false;
        }


        return (
            Boolean(person.name) &&
            Boolean(person.gender) &&
            Boolean(person.date) &&
            Boolean(person.time) &&
            Boolean(person.place) &&
            isValidNumber(person.latitude) &&
            isValidNumber(person.longitude) &&
            Boolean(person.timezone)
        );

    }


    /* =====================================================
       21. CHECK PERSON B
       ===================================================== */

    function hasPersonB() {

        const person =
            state.personB;


        if (!person) {
            return false;
        }


        return (
            Boolean(person.name) &&
            Boolean(person.gender) &&
            Boolean(person.date) &&
            Boolean(person.time) &&
            Boolean(person.place) &&
            isValidNumber(person.latitude) &&
            isValidNumber(person.longitude) &&
            Boolean(person.timezone)
        );

    }


    /* =====================================================
       22. CHECK KUNDLI A
       ===================================================== */

    function hasKundliA() {

        return (
            state.kundliA !== null &&
            typeof state.kundliA === "object"
        );

    }


    /* =====================================================
       23. CHECK KUNDLI B
       ===================================================== */

    function hasKundliB() {

        return (
            state.kundliB !== null &&
            typeof state.kundliB === "object"
        );

    }


    /* =====================================================
       24. CHECK MILAN
       ===================================================== */

    function hasMilan() {

        return (
            state.milan !== null &&
            typeof state.milan === "object"
        );

    }


    /* =====================================================
       25. CLEAR COMPLETE STATE
       -----------------------------------------------------
       New Kundli start karne ke liye.
       ===================================================== */

    function clear() {

        state =
            createDefaultState();


        try {

            localStorage.removeItem(
                STORAGE_KEY
            );

        } catch (error) {

            console.error(
                "[Kundli State] localStorage clear failed:",
                error
            );

        }


        return getState();

    }


    /* =====================================================
       26. CLEAR PERSON A
       ===================================================== */

    function clearPersonA() {

        state.personA =
            createEmptyPerson();

        state.kundliA =
            null;

        persist();


        return getState();

    }


    /* =====================================================
       27. CLEAR PERSON B
       ===================================================== */

    function clearPersonB() {

        state.personB =
            null;

        state.kundliB =
            null;

        state.milan =
            null;

        persist();


        return getState();

    }


    /* =====================================================
       28. EXPORT PUBLIC API
       ===================================================== */

    window.KundliState = {

        /*
         * Complete state
         */
        getState: getState,

        setState: setState,

        patch: patch,


        /*
         * Persons
         */
        savePersonA: savePersonA,

        savePersonB: savePersonB,

        hasPersonA: hasPersonA,

        hasPersonB: hasPersonB,


        /*
         * Kundli calculations
         */
        saveKundliA: saveKundliA,

        saveKundliB: saveKundliB,

        hasKundliA: hasKundliA,

        hasKundliB: hasKundliB,


        /*
         * Milan
         */
        saveMilan: saveMilan,

        hasMilan: hasMilan,


        /*
         * Navigation
         */
        setCurrentModule: setCurrentModule,


        /*
         * Reset
         */
        clear: clear,

        clearPersonA: clearPersonA,

        clearPersonB: clearPersonB

    };


    /* =====================================================
       29. INITIAL LOAD
       ===================================================== */

    load();


    /* =====================================================
       30. DEBUG INFORMATION
       ===================================================== */

    console.log(
        "[Kundli State] Initialized.",
        getState()
    );

})();