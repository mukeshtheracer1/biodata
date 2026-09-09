/* =========================================================
   VEDIC KUNDLI
   MODULE 01 - BIRTH DETAILS
   ---------------------------------------------------------
   File:
   js/kundli/birth-details.js

   Responsibilities:
   - Birth Details form
   - Location search
   - Location selection
   - Coordinates
   - Timezone
   - Local time -> UTC conversion
   - Form validation
   - KundliEngine.calculate()
   - KundliState.savePersonA()
   - Restore saved Person A
   ========================================================= */

(function () {

    "use strict";


    /* =====================================================
       01. MODULE REGISTRY
       ===================================================== */

    window.KundliModules =
        window.KundliModules || {};


    /* =====================================================
       02. MODULE VARIABLES
       ===================================================== */

    let moduleContext = null;

    let form = null;

    let nameInput = null;

    let genderInput = null;

    let birthDateInput = null;

    let birthTimeInput = null;

    let timeAccuracyInput = null;

    let placeSearchInput = null;

    let stateInput = null;

    let countryInput = null;

    let latitudeInput = null;

    let longitudeInput = null;

    let timezoneInput = null;

    let notesInput = null;

    let notesCounter = null;

    let locationResults = null;

    let locationSpinner = null;

    let selectedLocationPanel = null;

    let selectedLocationName = null;

    let selectedLocationMeta = null;

    let changeLocationButton = null;

    let locationMessage = null;

    let utcPreview = null;

    let utcPreviewText = null;

    let formMessage = null;

    let resetButton = null;

    let saveButton = null;

    let saveButtonText = null;

    let saveButtonSpinner = null;

    let savedPanel = null;

    let savedSummary = null;


    /*
     * The exact location selected from geocoder.
     */
    let selectedLocation = null;


    /*
     * Prevent old location request from updating
     * the current search results.
     */
    let locationRequestSequence = 0;


    /*
     * Current calculated Kundli result.
     */
    let currentKundli = null;


    /* =====================================================
       03. INITIALIZE
       ===================================================== */

    function init(context) {

        moduleContext = context || {};


        collectElements();


        if (!form) {

            console.error(
                "[Birth Details] #birthDetailsForm not found."
            );

            return;

        }


        bindEvents();


        restoreSavedData();


        updateNotesCounter();


        updateUtcPreview();


        console.log(
            "[Birth Details] Module initialized."
        );

    }


    /* =====================================================
       04. COLLECT DOM ELEMENTS
       ===================================================== */

    function collectElements() {

        form =
            document.getElementById(
                "birthDetailsForm"
            );


        nameInput =
            document.getElementById(
                "birthPersonName"
            );


        genderInput =
            document.getElementById(
                "birthGender"
            );


        birthDateInput =
            document.getElementById(
                "birthDate"
            );


        birthTimeInput =
            document.getElementById(
                "birthTime"
            );


        timeAccuracyInput =
            document.getElementById(
                "birthTimeAccuracy"
            );


        placeSearchInput =
            document.getElementById(
                "birthPlaceSearch"
            );


        stateInput =
            document.getElementById(
                "birthState"
            );


        countryInput =
            document.getElementById(
                "birthCountry"
            );


        latitudeInput =
            document.getElementById(
                "birthLatitude"
            );


        longitudeInput =
            document.getElementById(
                "birthLongitude"
            );


        timezoneInput =
            document.getElementById(
                "birthTimezone"
            );


        notesInput =
            document.getElementById(
                "birthNotes"
            );


        notesCounter =
            document.getElementById(
                "birthNotesCounter"
            );


        locationResults =
            document.getElementById(
                "birthLocationResults"
            );


        locationSpinner =
            document.getElementById(
                "birthLocationSearchSpinner"
            );


        selectedLocationPanel =
            document.getElementById(
                "birthSelectedLocation"
            );


        selectedLocationName =
            document.getElementById(
                "birthSelectedLocationName"
            );


        selectedLocationMeta =
            document.getElementById(
                "birthSelectedLocationMeta"
            );


        changeLocationButton =
            document.getElementById(
                "birthChangeLocationButton"
            );


        locationMessage =
            document.getElementById(
                "birthLocationMessage"
            );


        utcPreview =
            document.getElementById(
                "birthUtcPreview"
            );


        utcPreviewText =
            document.getElementById(
                "birthUtcPreviewText"
            );


        formMessage =
            document.getElementById(
                "birthDetailsFormMessage"
            );


        resetButton =
            document.getElementById(
                "birthDetailsResetButton"
            );


        saveButton =
            document.getElementById(
                "birthDetailsSaveButton"
            );


        saveButtonText =
            document.getElementById(
                "birthDetailsSaveButtonText"
            );


        saveButtonSpinner =
            document.getElementById(
                "birthDetailsSaveButtonSpinner"
            );


        savedPanel =
            document.getElementById(
                "birthDetailsSavedPanel"
            );


        savedSummary =
            document.getElementById(
                "birthDetailsSavedSummary"
            );

    }


    /* =====================================================
       05. BIND EVENTS
       ===================================================== */

    function bindEvents() {

        form.addEventListener(
            "submit",
            handleSubmit
        );


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                handleReset
            );

        }


        if (placeSearchInput) {

            placeSearchInput.addEventListener(
                "input",
                handleLocationInput
            );


            placeSearchInput.addEventListener(
                "keydown",
                handleLocationKeydown
            );


            placeSearchInput.addEventListener(
                "blur",
                function () {

                    /*
                     * Give result button click enough time
                     * to execute before hiding results.
                     */
                    setTimeout(
                        function () {

                            hideLocationResults();

                        },
                        180
                    );

                }
            );

        }


        if (changeLocationButton) {

            changeLocationButton.addEventListener(
                "click",
                handleChangeLocation
            );

        }


        if (birthDateInput) {

            birthDateInput.addEventListener(
                "change",
                updateUtcPreview
            );

        }


        if (birthTimeInput) {

            birthTimeInput.addEventListener(
                "change",
                updateUtcPreview
            );

        }


        if (timezoneInput) {

            timezoneInput.addEventListener(
                "input",
                updateUtcPreview
            );

            timezoneInput.addEventListener(
                "change",
                updateUtcPreview
            );

        }


        if (notesInput) {

            notesInput.addEventListener(
                "input",
                updateNotesCounter
            );

        }


        /*
         * If coordinates/timezone are manually changed,
         * UTC preview should update.
         */

        if (latitudeInput) {

            latitudeInput.addEventListener(
                "input",
                clearSavedResultIfInputChanges
            );

        }


        if (longitudeInput) {

            longitudeInput.addEventListener(
                "input",
                clearSavedResultIfInputChanges
            );

        }

    }


    /* =====================================================
       06. LOCATION SEARCH INPUT
       ===================================================== */

    function handleLocationInput(event) {

        const query =
            event.target.value.trim();


        /*
         * User changed the place after selecting one.
         * Previous selected location is no longer guaranteed.
         */

        if (
            selectedLocation &&
            query !== selectedLocation.displayName
        ) {

            clearSelectedLocation();

        }


        if (query.length < 2) {

            hideLocationResults();

            clearLocationMessage();

            return;

        }


        searchLocations(query);

    }


    /* =====================================================
       07. LOCATION KEYBOARD
       ===================================================== */

    function handleLocationKeydown(event) {

        if (event.key === "Escape") {

            hideLocationResults();

            return;

        }

    }


    /* =====================================================
       08. SEARCH LOCATIONS
       -----------------------------------------------------
       Open-Meteo Geocoding API.
       No fake location data is generated.
       ===================================================== */

    async function searchLocations(query) {

        const requestId =
            ++locationRequestSequence;


        setLocationLoading(true);


        try {

            const url =
                "https://geocoding-api.open-meteo.com/v1/search" +
                "?name=" +
                encodeURIComponent(query) +
                "&count=8" +
                "&language=en" +
                "&format=json";


            const response =
                await fetch(url, {
                    method: "GET"
                });


            if (!response.ok) {

                throw new Error(
                    "Location service HTTP error: " +
                    response.status
                );

            }


            const data =
                await response.json();


            /*
             * Ignore an old request if a newer search
             * has already completed.
             */

            if (
                requestId !== locationRequestSequence
            ) {
                return;
            }


            const results =
                Array.isArray(data.results)
                    ? data.results
                    : [];


            renderLocationResults(results);


        } catch (error) {

            console.error(
                "[Birth Details] Location search failed:",
                error
            );


            if (
                requestId === locationRequestSequence
            ) {

                renderLocationSearchError();

            }

        } finally {

            if (
                requestId === locationRequestSequence
            ) {

                setLocationLoading(false);

            }

        }

    }


    /* =====================================================
       09. RENDER LOCATION RESULTS
       ===================================================== */

    function renderLocationResults(results) {

        if (!locationResults) {
            return;
        }


        locationResults.innerHTML = "";


        if (!results.length) {

            const empty =
                document.createElement("div");


            empty.className =
                "birth-details-location-empty";


            empty.textContent =
                "कोई matching location नहीं मिली।";


            locationResults.appendChild(
                empty
            );


            showLocationResults();

            return;

        }


        results.forEach(
            function (result, index) {

                const button =
                    document.createElement("button");


                button.type = "button";

                button.className =
                    "birth-details-location-result";


                button.dataset.locationIndex =
                    String(index);


                button.setAttribute(
                    "role",
                    "option"
                );


                const icon =
                    document.createElement("span");


                icon.className =
                    "birth-details-location-result-icon";


                icon.setAttribute(
                    "aria-hidden",
                    "true"
                );


                icon.textContent =
                    "⌖";


                const content =
                    document.createElement("span");


                content.className =
                    "birth-details-location-result-content";


                const name =
                    document.createElement("strong");


                name.className =
                    "birth-details-location-result-name";


                name.textContent =
                    getLocationDisplayName(
                        result
                    );


                const meta =
                    document.createElement("span");


                meta.className =
                    "birth-details-location-result-meta";


                meta.textContent =
                    getLocationMeta(
                        result
                    );


                content.appendChild(
                    name
                );

                content.appendChild(
                    meta
                );


                button.appendChild(
                    icon
                );

                button.appendChild(
                    content
                );


                button.addEventListener(
                    "click",
                    function () {

                        selectLocation(
                            result
                        );

                    }
                );


                locationResults.appendChild(
                    button
                );

            }
        );


        showLocationResults();

    }


    /* =====================================================
       10. LOCATION DISPLAY NAME
       ===================================================== */

    function getLocationDisplayName(result) {

        return (
            result.name ||
            result.admin2 ||
            result.admin1 ||
            "Selected Location"
        );

    }


    /* =====================================================
       11. LOCATION META
       ===================================================== */

    function getLocationMeta(result) {

        const parts = [];


        if (result.admin1) {

            parts.push(
                result.admin1
            );

        }


        if (
            result.country &&
            result.admin1 !== result.country
        ) {

            parts.push(
                result.country
            );

        }


        if (result.latitude !== undefined) {

            parts.push(
                "Lat " +
                Number(result.latitude).toFixed(4)
            );

        }


        if (result.longitude !== undefined) {

            parts.push(
                "Lon " +
                Number(result.longitude).toFixed(4)
            );

        }


        return parts.join(" • ");

    }


    /* =====================================================
       12. SELECT LOCATION
       ===================================================== */

    function selectLocation(result) {

        const latitude =
            Number(result.latitude);


        const longitude =
            Number(result.longitude);


        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {

            showLocationMessage(
                "इस location के valid coordinates उपलब्ध नहीं हैं। दूसरा result चुनें।",
                "error"
            );

            return;

        }


        selectedLocation = {

            name:
                result.name || "",

            displayName:
                getLocationDisplayName(
                    result
                ),

            state:
                result.admin1 || "",

            country:
                result.country || "",

            latitude:
                latitude,

            longitude:
                longitude,

            timezone:
                result.timezone || ""

        };


        /*
         * Fill form fields.
         */

        placeSearchInput.value =
            selectedLocation.displayName;


        stateInput.value =
            selectedLocation.state;


        countryInput.value =
            selectedLocation.country;


        latitudeInput.value =
            formatCoordinate(
                selectedLocation.latitude
            );


        longitudeInput.value =
            formatCoordinate(
                selectedLocation.longitude
            );


        timezoneInput.value =
            selectedLocation.timezone;


        /*
         * Show selected location.
         */

        if (selectedLocationName) {

            selectedLocationName.textContent =
                selectedLocation.displayName;

        }


        if (selectedLocationMeta) {

            selectedLocationMeta.textContent =
                buildSelectedLocationMeta(
                    selectedLocation
                );

        }


        if (selectedLocationPanel) {

            selectedLocationPanel.hidden =
                false;

        }


        /*
         * Hide results.
         */

        hideLocationResults();


        /*
         * Timezone may have changed.
         */

        updateUtcPreview();


        showLocationMessage(
            "Location select हो गया। Coordinates और timezone भर दिए गए हैं।",
            "success"
        );


        clearFieldInvalidState(
            placeSearchInput
        );

        clearFieldInvalidState(
            latitudeInput
        );

        clearFieldInvalidState(
            longitudeInput
        );

        clearFieldInvalidState(
            timezoneInput
        );

    }


    /* =====================================================
       13. SELECTED LOCATION META
       ===================================================== */

    function buildSelectedLocationMeta(location) {

        const parts = [];


        if (location.state) {

            parts.push(
                location.state
            );

        }


        if (location.country) {

            parts.push(
                location.country
            );

        }


        parts.push(
            "Lat " +
            Number(location.latitude)
                .toFixed(4)
        );


        parts.push(
            "Lon " +
            Number(location.longitude)
                .toFixed(4)
        );


        if (location.timezone) {

            parts.push(
                location.timezone
            );

        }


        return parts.join(" • ");

    }


    /* =====================================================
       14. CHANGE LOCATION
       ===================================================== */

    function handleChangeLocation() {

        clearSelectedLocation();

        clearLocationMessage();

        placeSearchInput.focus();

        placeSearchInput.select();

    }


    /* =====================================================
       15. CLEAR SELECTED LOCATION
       ===================================================== */

    function clearSelectedLocation() {

        selectedLocation =
            null;


        if (selectedLocationPanel) {

            selectedLocationPanel.hidden =
                true;

        }


        if (selectedLocationName) {

            selectedLocationName.textContent =
                "";

        }


        if (selectedLocationMeta) {

            selectedLocationMeta.textContent =
                "";

        }

    }


    /* =====================================================
       16. SHOW LOCATION RESULTS
       ===================================================== */

    function showLocationResults() {

        if (!locationResults) {
            return;
        }


        locationResults.hidden =
            false;


        if (placeSearchInput) {

            placeSearchInput.setAttribute(
                "aria-expanded",
                "true"
            );

        }

    }


    /* =====================================================
       17. HIDE LOCATION RESULTS
       ===================================================== */

    function hideLocationResults() {

        if (!locationResults) {
            return;
        }


        locationResults.hidden =
            true;


        if (placeSearchInput) {

            placeSearchInput.setAttribute(
                "aria-expanded",
                "false"
            );

        }

    }


    /* =====================================================
       18. LOCATION LOADING
       ===================================================== */

    function setLocationLoading(isLoading) {

        if (locationSpinner) {

            locationSpinner.hidden =
                !isLoading;

        }


        if (placeSearchInput) {

            placeSearchInput.setAttribute(
                "aria-busy",
                isLoading ? "true" : "false"
            );

        }

    }


    /* =====================================================
       19. LOCATION SEARCH ERROR
       ===================================================== */

    function renderLocationSearchError() {

        if (!locationResults) {
            return;
        }


        locationResults.innerHTML = "";


        const empty =
            document.createElement("div");


        empty.className =
            "birth-details-location-empty";


        empty.textContent =
            "Location search उपलब्ध नहीं है। Internet connection check करें या coordinates/timezone manually भरें।";


        locationResults.appendChild(
            empty
        );


        showLocationResults();

    }


    /* =====================================================
       20. LOCATION MESSAGE
       ===================================================== */

    function showLocationMessage(
        message,
        type
    ) {

        if (!locationMessage) {
            return;
        }


        locationMessage.hidden =
            false;


        locationMessage.textContent =
            message;


        locationMessage.className =
            "birth-details-location-message";


        if (type === "success") {

            locationMessage.classList.add(
                "is-success"
            );

        } else if (type === "error") {

            locationMessage.classList.add(
                "is-error"
            );

        }

    }


    /* =====================================================
       21. CLEAR LOCATION MESSAGE
       ===================================================== */

    function clearLocationMessage() {

        if (!locationMessage) {
            return;
        }


        locationMessage.hidden =
            true;


        locationMessage.textContent =
            "";


        locationMessage.className =
            "birth-details-location-message";

    }


    /* =====================================================
       22. FORMAT COORDINATE
       ===================================================== */

    function formatCoordinate(value) {

        return Number(value)
            .toFixed(6);

    }


    /* =====================================================
       23. UTC PREVIEW
       ===================================================== */

    function updateUtcPreview() {

        if (
            !birthDateInput ||
            !birthTimeInput ||
            !timezoneInput ||
            !utcPreview ||
            !utcPreviewText
        ) {
            return;
        }


        const date =
            birthDateInput.value;


        const time =
            birthTimeInput.value;


        const timezone =
            timezoneInput.value.trim();


        if (
            !date ||
            !time ||
            !timezone
        ) {

            utcPreview.hidden =
                true;

            return;

        }


        try {

            const utcDate =
                convertLocalDateTimeToUTC(
                    date,
                    time,
                    timezone
                );


            utcPreviewText.textContent =
                utcDate.toISOString();


            utcPreview.hidden =
                false;


        } catch (error) {

            utcPreview.hidden =
                true;

        }

    }


    /* =====================================================
       24. LOCAL DATE/TIME -> UTC
       -----------------------------------------------------
       Uses IANA timezone.
       No browser-local timezone assumption.
       ===================================================== */

    function convertLocalDateTimeToUTC(
        dateString,
        timeString,
        timezone
    ) {

        if (
            !dateString ||
            !timeString ||
            !timezone
        ) {

            throw new Error(
                "Date, time और timezone required हैं।"
            );

        }


        const dateParts =
            dateString.split("-");


        const timeParts =
            timeString.split(":");


        if (
            dateParts.length !== 3 ||
            timeParts.length < 2
        ) {

            throw new Error(
                "Birth date/time format invalid है।"
            );

        }


        const year =
            Number(dateParts[0]);


        const month =
            Number(dateParts[1]);


        const day =
            Number(dateParts[2]);


        const hour =
            Number(timeParts[0]);


        const minute =
            Number(timeParts[1]);


        const second =
            timeParts.length >= 3
                ? Number(timeParts[2])
                : 0;


        if (
            !Number.isInteger(year) ||
            !Number.isInteger(month) ||
            !Number.isInteger(day) ||
            !Number.isInteger(hour) ||
            !Number.isInteger(minute) ||
            !Number.isInteger(second)
        ) {

            throw new Error(
                "Birth date/time invalid है।"
            );

        }


        const testDate =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day,
                    hour,
                    minute,
                    second
                )
            );


        if (
            testDate.getUTCFullYear() !== year ||
            testDate.getUTCMonth() !== month - 1 ||
            testDate.getUTCDate() !== day ||
            testDate.getUTCHours() !== hour ||
            testDate.getUTCMinutes() !== minute ||
            testDate.getUTCSeconds() !== second
        ) {

            throw new Error(
                "Birth date/time valid calendar date नहीं है।"
            );

        }


        const offsetMinutes =
            getTimezoneOffsetMinutes(
                testDate,
                timezone
            );


        const utcMillis =
            Date.UTC(
                year,
                month - 1,
                day,
                hour,
                minute,
                second
            ) -
            offsetMinutes * 60000;


        const utcDate =
            new Date(utcMillis);


        if (
            Number.isNaN(
                utcDate.getTime()
            )
        ) {

            throw new Error(
                "Birth date/time को UTC में convert नहीं किया जा सका।"
            );

        }


        return utcDate;

    }


    /* =====================================================
       25. TIMEZONE OFFSET
       -----------------------------------------------------
       Reads IANA timezone offset using Intl.
       ===================================================== */

    function getTimezoneOffsetMinutes(
        utcLikeDate,
        timezone
    ) {

        let formatter;


        try {

            formatter =
                new Intl.DateTimeFormat(
                    "en-US",
                    {
                        timeZone:
                            timezone,

                        timeZoneName:
                            "longOffset",

                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",

                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",

                        hourCycle: "h23"
                    }
                );

        } catch (error) {

            throw new Error(
                "Timezone invalid या browser में available नहीं है: " +
                timezone
            );

        }


        const parts =
            formatter.formatToParts(
                utcLikeDate
            );


        const timezoneNamePart =
            parts.find(
                function (part) {

                    return (
                        part.type ===
                        "timeZoneName"
                    );

                }
            );


        if (!timezoneNamePart) {

            throw new Error(
                "Timezone offset पढ़ा नहीं जा सका।"
            );

        }


        const offsetText =
            timezoneNamePart.value;


        if (
            offsetText === "GMT" ||
            offsetText === "UTC"
        ) {

            return 0;

        }


        /*
         * Expected examples:
         *
         * GMT+05:30
         * GMT-04:00
         * GMT+05
         */

        const match =
            offsetText.match(
                /^GMT([+-])(\d{1,2})(?::?(\d{2}))?$/
            );


        if (!match) {

            throw new Error(
                "Timezone offset format समझ नहीं आया: " +
                offsetText
            );

        }


        const sign =
            match[1] === "+"
                ? 1
                : -1;


        const hours =
            Number(match[2]);


        const minutes =
            match[3]
                ? Number(match[3])
                : 0;


        return (
            sign *
            (
                hours * 60 +
                minutes
            )
        );

    }


    /* =====================================================
       26. VALIDATE FORM
       ===================================================== */

    function validateForm() {

        clearInvalidStates();


        if (
            !nameInput.value.trim()
        ) {

            return invalid(
                nameInput,
                "कृपया नाम दर्ज करें।"
            );

        }


        if (
            !genderInput.value
        ) {

            return invalid(
                genderInput,
                "कृपया gender select करें।"
            );

        }


        if (
            !birthDateInput.value
        ) {

            return invalid(
                birthDateInput,
                "कृपया जन्म तारीख दर्ज करें।"
            );

        }


        if (
            !birthTimeInput.value
        ) {

            return invalid(
                birthTimeInput,
                "कृपया जन्म समय दर्ज करें।"
            );

        }


        if (
            !placeSearchInput.value.trim()
        ) {

            return invalid(
                placeSearchInput,
                "कृपया जन्म स्थान दर्ज/select करें।"
            );

        }


        const latitude =
            Number(
                latitudeInput.value
            );


        if (
            !Number.isFinite(latitude) ||
            latitude < -90 ||
            latitude > 90
        ) {

            return invalid(
                latitudeInput,
                "Latitude -90 से 90 के बीच होना चाहिए।"
            );

        }


        const longitude =
            Number(
                longitudeInput.value
            );


        if (
            !Number.isFinite(longitude) ||
            longitude < -180 ||
            longitude > 180
        ) {

            return invalid(
                longitudeInput,
                "Longitude -180 से 180 के बीच होना चाहिए।"
            );

        }


        const timezone =
            timezoneInput.value.trim();


        if (!timezone) {

            return invalid(
                timezoneInput,
                "Timezone required है।"
            );

        }


        /*
         * Verify actual IANA timezone.
         */

        try {

            convertLocalDateTimeToUTC(
                birthDateInput.value,
                birthTimeInput.value,
                timezone
            );

        } catch (error) {

            return invalid(
                timezoneInput,
                error.message ||
                "Timezone valid नहीं है।"
            );

        }


        /*
         * Birth date should not be in future.
         */

        const localDate =
            parseDateInput(
                birthDateInput.value
            );


        if (!localDate) {

            return invalid(
                birthDateInput,
                "जन्म तारीख valid नहीं है।"
            );

        }


        const now =
            new Date();


        const todayUTC =
            new Date(
                Date.UTC(
                    now.getUTCFullYear(),
                    now.getUTCMonth(),
                    now.getUTCDate()
                )
            );


        if (
            localDate.getTime() >
            todayUTC.getTime()
        ) {

            return invalid(
                birthDateInput,
                "Birth date future की नहीं हो सकती।"
            );

        }


        return {
            valid: true,
            message: ""
        };

    }


    /* =====================================================
       27. DATE PARSER
       ===================================================== */

    function parseDateInput(
        dateString
    ) {

        const parts =
            dateString.split("-");


        if (parts.length !== 3) {
            return null;
        }


        const year =
            Number(parts[0]);


        const month =
            Number(parts[1]);


        const day =
            Number(parts[2]);


        const date =
            new Date(
                Date.UTC(
                    year,
                    month - 1,
                    day
                )
            );


        if (
            date.getUTCFullYear() !== year ||
            date.getUTCMonth() !== month - 1 ||
            date.getUTCDate() !== day
        ) {

            return null;

        }


        return date;

    }


    /* =====================================================
       28. INVALID HELPER
       ===================================================== */

    function invalid(
        element,
        message
    ) {

        markInvalid(
            element
        );


        showFormMessage(
            message,
            "error"
        );


        if (element) {

            element.focus();

        }


        return {
            valid: false,
            message: message
        };

    }


    /* =====================================================
       29. MARK INVALID
       ===================================================== */

    function markInvalid(element) {

        if (!element) {
            return;
        }


        element.classList.add(
            "is-invalid"
        );

    }


    /* =====================================================
       30. CLEAR INVALID
       ===================================================== */

    function clearFieldInvalidState(
        element
    ) {

        if (!element) {
            return;
        }


        element.classList.remove(
            "is-invalid"
        );

    }


    function clearInvalidStates() {

        const fields =
            form.querySelectorAll(
                ".is-invalid"
            );


        fields.forEach(
            function (field) {

                field.classList.remove(
                    "is-invalid"
                );

            }
        );

    }


    /* =====================================================
       31. SHOW FORM MESSAGE
       ===================================================== */

    function showFormMessage(
        message,
        type
    ) {

        if (!formMessage) {
            return;
        }


        formMessage.hidden =
            false;


        formMessage.textContent =
            message;


        formMessage.className =
            "birth-details-form-message";


        if (type === "error") {

            formMessage.classList.add(
                "is-error"
            );

        } else if (type === "success") {

            formMessage.classList.add(
                "is-success"
            );

        } else {

            formMessage.classList.add(
                "is-info"
            );

        }

    }


    /* =====================================================
       32. CLEAR FORM MESSAGE
       ===================================================== */

    function clearFormMessage() {

        if (!formMessage) {
            return;
        }


        formMessage.hidden =
            true;


        formMessage.textContent =
            "";


        formMessage.className =
            "birth-details-form-message";

    }


    /* =====================================================
       33. COLLECT PERSON A DATA
       ===================================================== */

    function collectPersonData() {

        return {

            name:
                nameInput.value.trim(),

            gender:
                genderInput.value,

            date:
                birthDateInput.value,

            time:
                birthTimeInput.value,

            place:
                placeSearchInput.value.trim(),

            state:
                stateInput.value.trim(),

            country:
                countryInput.value.trim(),

            latitude:
                Number(
                    latitudeInput.value
                ),

            longitude:
                Number(
                    longitudeInput.value
                ),

            timezone:
                timezoneInput.value.trim(),

            birthTimeAccuracy:
                timeAccuracyInput.value,

            notes:
                notesInput.value.trim()

        };

    }


    /* =====================================================
       34. BUILD ENGINE INPUT
       ===================================================== */

    function buildEngineInput(
        person
    ) {

        const utcDate =
            convertLocalDateTimeToUTC(
                person.date,
                person.time,
                person.timezone
            );


        return {

            name:
                person.name,

            gender:
                person.gender,

            birthDate:
                person.date,

            birthTime:
                person.time,

            birthPlace:
                person.place,

            city:
                person.place,

            state:
                person.state,

            country:
                person.country,

            latitude:
                person.latitude,

            longitude:
                person.longitude,

            timezone:
                person.timezone,

            notes:
                person.notes,

            utcDate:
                utcDate

        };

    }


    /* =====================================================
       35. SUBMIT
       ===================================================== */

    async function handleSubmit(
        event
    ) {

        event.preventDefault();


        clearFormMessage();


        const validation =
            validateForm();


        if (!validation.valid) {

            return;

        }


        setSaving(true);


        try {

            const person =
                collectPersonData();


            const engineInput =
                buildEngineInput(
                    person
                );


            /*
             * Existing calculation engine must be available.
             */

            const engine =
                window.KundliEngine;


            if (
                !engine ||
                typeof engine.calculate !==
                "function"
            ) {

                throw new Error(
                    "KundliEngine load नहीं हुआ। kundli-engine.js check करें।"
                );

            }


            /*
             * ACTUAL KUNDLI CALCULATION.
             * No dummy result.
             * Swiss Ephemeris WASM + official ephemeris files are
             * initialized/fetched here on first calculation.
             */

            if (saveButtonText) {
                saveButtonText.textContent =
                    "Swiss Ephemeris calculate कर रहा है...";
            }

            const result =
                await Promise.resolve(
                    engine.calculate(
                        engineInput
                    )
                );


            if (
                !result ||
                typeof result !== "object"
            ) {

                throw new Error(
                    "KundliEngine ने valid calculation result नहीं दिया।"
                );

            }


            currentKundli =
                result;


            /*
             * Save Person A + calculated Kundli
             * into central state.
             */

            const stateManager =
                window.KundliState;


            if (
                !stateManager ||
                typeof stateManager.savePersonA !==
                "function"
            ) {

                throw new Error(
                    "KundliState load नहीं हुआ। kundli-state.js check करें।"
                );

            }


            stateManager.savePersonA(
                person,
                result
            );


            /*
             * Ensure current module remains Birth Details.
             */

            if (
                typeof stateManager.setCurrentModule ===
                "function"
            ) {

                stateManager.setCurrentModule(
                    "birth-details"
                );

            }


            /*
             * Render successful save status.
             */

            renderSavedPanel(
                person
            );


            showFormMessage(
                "जन्म विवरण सेव हो गया और Kundli calculation सफलतापूर्वक तैयार हो गई।",
                "success"
            );


        } catch (error) {

            console.error(
                "[Birth Details] Kundli calculation error:",
                error
            );


            showFormMessage(
                error &&
                error.message
                    ? error.message
                    : "Kundli calculate करते समय error आया।",
                "error"
            );

        } finally {

            setSaving(false);

        }

    }


    /* =====================================================
       36. SET SAVING STATE
       ===================================================== */

    function setSaving(
        isSaving
    ) {

        if (saveButton) {

            saveButton.disabled =
                isSaving;

        }


        if (resetButton) {

            resetButton.disabled =
                isSaving;

        }


        if (saveButtonText) {

            saveButtonText.textContent =
                isSaving
                    ? "Kundli बन रही है..."
                    : "Save & Generate Kundli";

        }


        if (saveButtonSpinner) {

            saveButtonSpinner.hidden =
                !isSaving;

        }

    }


    /* =====================================================
       37. RENDER SAVED PANEL
       ===================================================== */

    function renderSavedPanel(
        person
    ) {

        if (
            !savedPanel ||
            !savedSummary
        ) {
            return;
        }


        savedSummary.innerHTML = "";


        const items = [

            {
                label: "नाम",
                value: person.name
            },

            {
                label: "जन्म स्थान",
                value: person.place
            },

            {
                label: "जन्म तारीख",
                value: person.date
            },

            {
                label: "जन्म समय",
                value: person.time
            },

            {
                label: "Timezone",
                value: person.timezone
            },

            {
                label: "Coordinates",
                value:
                    Number(person.latitude)
                        .toFixed(4) +
                    ", " +
                    Number(person.longitude)
                        .toFixed(4)
            }

        ];


        items.forEach(
            function (item) {

                const wrapper =
                    document.createElement(
                        "div"
                    );


                wrapper.className =
                    "birth-details-saved-summary-item";


                const label =
                    document.createElement(
                        "span"
                    );


                label.className =
                    "birth-details-saved-summary-label";


                label.textContent =
                    item.label;


                const value =
                    document.createElement(
                        "span"
                    );


                value.className =
                    "birth-details-saved-summary-value";


                value.textContent =
                    item.value || "—";


                wrapper.appendChild(
                    label
                );

                wrapper.appendChild(
                    value
                );


                savedSummary.appendChild(
                    wrapper
                );

            }
        );


        savedPanel.hidden =
            false;

    }


    /* =====================================================
       38. RESTORE SAVED DATA
       ===================================================== */

    function restoreSavedData() {

        const stateManager =
            window.KundliState;


        if (
            !stateManager ||
            typeof stateManager.getState !==
            "function"
        ) {

            return;

        }


        try {

            const state =
                stateManager.getState();


            if (
                !state ||
                !state.personA
            ) {

                return;

            }


            const person =
                state.personA;


            if (person.name) {

                nameInput.value =
                    person.name;

            }


            if (person.gender) {

                genderInput.value =
                    person.gender;

            }


            if (person.date) {

                birthDateInput.value =
                    person.date;

            }


            if (person.time) {

                birthTimeInput.value =
                    person.time;

            }


            if (person.birthTimeAccuracy) {

                timeAccuracyInput.value =
                    person.birthTimeAccuracy;

            }


            if (person.place) {

                placeSearchInput.value =
                    person.place;

            }


            if (person.state) {

                stateInput.value =
                    person.state;

            }


            if (person.country) {

                countryInput.value =
                    person.country;

            }


            if (
                Number.isFinite(
                    Number(person.latitude)
                )
            ) {

                latitudeInput.value =
                    formatCoordinate(
                        person.latitude
                    );

            }


            if (
                Number.isFinite(
                    Number(person.longitude)
                )
            ) {

                longitudeInput.value =
                    formatCoordinate(
                        person.longitude
                    );

            }


            if (person.timezone) {

                timezoneInput.value =
                    person.timezone;

            }


            if (person.notes) {

                notesInput.value =
                    person.notes;

            }


            /*
             * If existing data contains coordinates,
             * display a selected-location style panel.
             */

            if (
                person.place &&
                Number.isFinite(
                    Number(person.latitude)
                ) &&
                Number.isFinite(
                    Number(person.longitude)
                )
            ) {

                selectedLocation = {

                    name:
                        person.place,

                    displayName:
                        person.place,

                    state:
                        person.state || "",

                    country:
                        person.country || "",

                    latitude:
                        Number(person.latitude),

                    longitude:
                        Number(person.longitude),

                    timezone:
                        person.timezone || ""

                };


                if (selectedLocationName) {

                    selectedLocationName.textContent =
                        person.place;

                }


                if (selectedLocationMeta) {

                    selectedLocationMeta.textContent =
                        buildSelectedLocationMeta(
                            selectedLocation
                        );

                }


                if (selectedLocationPanel) {

                    selectedLocationPanel.hidden =
                        false;

                }

            }


            /*
             * If a calculation result already exists,
             * show saved status.
             */

            if (
                state.kundliA &&
                typeof state.kundliA ===
                "object"
            ) {

                currentKundli =
                    state.kundliA;


                renderSavedPanel(
                    person
                );

            }


        } catch (error) {

            console.warn(
                "[Birth Details] Saved data restore failed:",
                error
            );

        }

    }


    /* =====================================================
       39. RESET
       ===================================================== */

    function handleReset() {

        if (
            !window.confirm(
                "क्या आप Birth Details का saved data भी हटाना चाहते हैं?"
            )
        ) {

            return;

        }


        form.reset();


        clearSelectedLocation();


        hideLocationResults();


        clearLocationMessage();


        clearFormMessage();


        clearInvalidStates();


        currentKundli =
            null;


        if (savedPanel) {

            savedPanel.hidden =
                true;

        }


        updateNotesCounter();


        updateUtcPreview();


        /*
         * Clear Person A and its calculation.
         */

        if (
            window.KundliState &&
            typeof window.KundliState.clearPersonA ===
            "function"
        ) {

            window.KundliState.clearPersonA();

        }


        showFormMessage(
            "Birth Details reset कर दिए गए हैं।",
            "success"
        );

    }


    /* =====================================================
       40. NOTES COUNTER
       ===================================================== */

    function updateNotesCounter() {

        if (
            !notesInput ||
            !notesCounter
        ) {
            return;
        }


        const length =
            notesInput.value.length;


        notesCounter.textContent =
            length +
            " / 1000";

    }


    /* =====================================================
       41. CLEAR SAVED RESULT WHEN CRITICAL INPUT CHANGES
       ===================================================== */

    function clearSavedResultIfInputChanges() {

        /*
         * We do not delete the saved state automatically.
         * We only hide the success panel because current
         * visible form data may differ from saved calculation.
         */

        if (
            savedPanel &&
            !savedPanel.hidden
        ) {

            savedPanel.hidden =
                true;

        }

    }


    /* =====================================================
       42. PUBLIC MODULE
       ===================================================== */

    window.KundliModules[
        "birth-details"
    ] = {

        init: init

    };


})();