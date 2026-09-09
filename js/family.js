/* =========================================================
   FAMILY PAGE CONTROLLER
   Mukesh Sah Marriage Biodata
========================================================= */

(() => {

    "use strict";


    /* =======================================================
       CONFIG
    ======================================================= */

    const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;


    /* =======================================================
       FAMILY DATABASE
    ======================================================= */

    const familyMembersData = {

        paternal_grandparents: {
            name: "Late Shri Hajar Sah & Late Smt. Singaro Devi",
            relation: "Paternal Grandparents",
            side: "PATERNAL FAMILY",
            subtitle: "Paternal Lineage Founders • Dada Ji & Dadi Ji",
            lineage: "Hajar Sah Family Line",
            icon: "fa-hands-holding-child",

            father: "null",
            mother: "null",
            spouse: "null",

            occupation: "Agriculture & Family Foundations",
            children: "3 Sons • 1 Daughter",
            sons: "3 Sons — Parasnath, Baidyanath & Ramnath",
            daughters: "1 Daughter — Ramawati Devi",

            residence: "Rampur Bhaisahi, Gopalganj, Bihar",

            childrenDetails:
                "Their children carried forward the family legacy through three sons — Parasnath Sah, Baidyanath Sah and Ramnath Sah — and one daughter, Ramawati Devi.",

            notes:
                "Revered founders of the paternal family line in Rampur Bhaisahi. Their family values, integrity, hard work and traditions continue through the next generations."
        },


        parasnath: {
            name: "Shri Parasnath Sah",
            relation: "Paternal Uncle • Tauji",
            side: "PATERNAL FAMILY",
            subtitle: "Eldest Son of Late Shri Hajar Sah & Late Smt. Singaro Devi",
            lineage: "Hajar Sah → Parasnath Sah",
            icon: "fa-user-tie",

            father: "Late Shri Hajar Sah",
            mother: "Late Smt. Singaro Devi",
            spouse: "Late Smt. Rajmati Devi",

            occupation: "Agriculture",
            children: "4 Sons",
            sons: "4 Sons — All Married",
            daughters: "No Daughter",

            residence: "Rampur Bhaisahi, Gopalganj, Bihar",

            childrenDetails:
                "He has four sons, all married and settled with their respective families.",

            notes:
                "Eldest paternal uncle of Mukesh Sah. He has been associated with agriculture and remains an important member of the paternal family lineage."
        },


        baidyanath: {
            name: "Shri Baidyanath Sah",
            relation: "Paternal Uncle • Tauji",
            side: "PATERNAL FAMILY",
            subtitle: "Second Son of Late Shri Hajar Sah & Late Smt. Singaro Devi",
            lineage: "Hajar Sah → Baidyanath Sah",
            icon: "fa-user-doctor",

            father: "Late Shri Hajar Sah",
            mother: "Late Smt. Singaro Devi",
            spouse: "Smt. Lilawati Devi",

            occupation: "Doctor",
            children: "2 Sons",
            sons: "2 Sons — All Married",
            daughters: "No Daughter",

            residence: "Rampur Bhaisahi, Gopalganj, Bihar",

            childrenDetails:
                "He has two sons, both married and settled with their respective families.",

            notes:
                "Second eldest paternal uncle of Mukesh Sah and a doctor by profession."
        },


        ramnath: {
            name: "Shri Ramnath Sah & Late Smt. Shobha Devi",
            relation: "Mukesh Sah's Parents",
            side: "GROOM'S FAMILY",
            subtitle: "Parents of Mukesh Sah • Youngest Son of Late Shri Hajar Sah",
            lineage: "Hajar Sah → Ramnath Sah → Mukesh Sah",
            icon: "fa-hands-holding-child",

            father: "Late Shri Hajar Sah",
            mother: "Late Smt. Singaro Devi",
            spouse: "Late Smt. Shobha Devi",

            occupation: "Father: Farmer / Senior Family Head",
            children: "2 Sons • 1 Daughter",
            sons: "Nilesh Sah & Mukesh Sah",
            daughters: "Nitu Devi",

            residence: "Rampur Bhaisahi, Gopalganj, Bihar",

            childrenDetails:
                "Three children — Nilesh Sah, Mukesh Sah and Nitu Devi. Nilesh works as an HVAC Technician, Mukesh is a Technical & IT Professional, and Nitu Devi is a Homemaker.",

            notes:
                "Parents of the groom, Mukesh Sah, and the central family unit represented in this marriage biodata."
        },


        ramawati: {
            name: "Smt. Ramawati Devi",
            relation: "Paternal Aunt • Bua Ji",
            side: "PATERNAL FAMILY",
            subtitle: "Youngest Daughter of Late Shri Hajar Sah & Late Smt. Singaro Devi",
            lineage: "Hajar Sah → Ramawati Devi",
            icon: "fa-person-dress",

            father: "Late Shri Hajar Sah",
            mother: "Late Smt. Singaro Devi",
            spouse: "Shri Radheshyam Sah",

            occupation: "Homemaker",
            children: "3 Sons • 3 Daughters",
            sons: "3 Sons — 1 Married & 2 Unmarried",
            daughters: "3 Daughters — All Married",

            residence: "Harihara, Gopalganj, Bihar",

            childrenDetails:
                "She has three sons and three daughters. The daughters are married and the children are progressing in their respective family lives.",

            notes:
                "Paternal aunt of Mukesh Sah and an important member of the extended Sah family."
        },


        nilesh: {
            name: "Nilesh Sah",
            relation: "Elder Brother",
            side: "GROOM'S FAMILY",
            subtitle: "Eldest Son of Shri Ramnath Sah & Late Smt. Shobha Devi",
            lineage: "Ramnath Sah → Nilesh Sah",
            icon: "fa-user-gear",

            father: "Shri Ramnath Sah",
            mother: "Late Smt. Shobha Devi",
            spouse: "Smt. Aarti Devi",

            occupation: "HVAC Senior Technician",
            children: "1 Son • 1 Daughter",
            sons: "1 Son",
            daughters: "1 Daughter",

            residence: "Rampur Bhaisahi, Gopalganj, Bihar",

            childrenDetails:
           
                "He has one son and one daughter, both young and currently pursuing their school education.",

            notes:
                "Elder brother of Mukesh Sah, professionally working as an HVAC technician."
        },


        mukesh: {
            name: "Mukesh Sah",
            relation: "The Groom • Self Profile",
            side: "GROOM",
            subtitle: "Second Son of Shri Ramnath Sah & Late Smt. Shobha Devi",
            lineage: "Ramnath Sah → Mukesh Sah",
            icon: "fa-user-tie",

            father: "Shri Ramnath Sah",
            mother: "Late Smt. Shobha Devi",
            spouse: "Single / Seeking Suitable Match",

            occupation: "Technical & IT Professional",
            children: "Single — No Children",
            sons: "None",
            daughters: "None",

            residence: "Rampur Bhaisahi, Gopalganj, Bihar",

            childrenDetails:
                "Mukesh Sah is currently single and seeking a suitable life partner.",

            notes:
                "DOB: 05 July 1992 • Height: 5' 3\" • Kashyap Gotra • Non-Manglik • Rashi: Simha (Leo). Experienced in IT, front-end web development, data operations and MEP services."
        },


        nitu: {
            name: "Nitu Devi",
            relation: "Sister",
            side: "GROOM'S FAMILY",
            subtitle: "Daughter of Shri Ramnath Sah & Late Smt. Shobha Devi",
            lineage: "Ramnath Sah → Nitu Devi",
            icon: "fa-person-dress",

            father: "Shri Ramnath Sah",
            mother: "Late Smt. Shobha Devi",
            spouse: "Shri Ranjay Sah",

            occupation: "Homemaker",
            children: "1 Son • 1 Daughter",
            sons: "1 Son",
            daughters: "1 Daughter",

            residence: "Balbhadra Parsa, Gopalganj, Bihar",

            childrenDetails:
                "She has one son and one daughter, both young and currently attending school.",
            notes:
                "Younger sister of Mukesh Sah, married to Shri Ranjay Sah."
        },


        maternal_grandparents: {
            name: "Late Shri Sudama Sah & Late Smt. Sharda Devi",
            relation: "Maternal Grandparents",
            side: "MATERNAL FAMILY",
            subtitle: "Maternal Lineage Founders • Nana Ji & Nani Ji",
            lineage: "Sudama Sah Family Line",
            icon: "fa-hands-holding",

            father: "null",
            mother: "null",
            spouse: "null",

            occupation: "Agriculture & Business",
            children: "5 Daughters • 2 Sons",
            sons: "Shravan Sah & Shekhar Sah",
            daughters: "Shakuntla, Savitri, Sima, Shobha & Shushma",

            residence: "Mateya Khas, Kuchaikote, Gopalganj",

            childrenDetails:
                "Seven children in total — five daughters and two sons — forming a large and well-connected maternal family network.",

            notes:
                "Respected maternal grandparents who established the maternal family roots in Mateya Khas."
        },


        shakuntla: {
            name: "Late Smt. Shakuntla Devi",
            relation: "Maternal Aunt • Badi Masi",
            side: "MATERNAL FAMILY",
            subtitle: "First Child of Late Shri Sudama Sah",
            lineage: "Sudama Sah → Shakuntla Devi",
            icon: "fa-person-dress",

            father: "Late Shri Sudama Sah",
            mother: "Late Smt. Sharda Devi",
            spouse: "Shri Ramdev Sah",

            occupation: "Family / Homemaking",
            children: "2 Sons • 2 Daughters",
            sons: "2 Sons — All Married",
            daughters: "2 Daughters — All Married",

            residence: "Bhathwa, Panchdeori, Gopalganj, Bihar",

            childrenDetails:
                "Her sons and daughters are married and settled with their respective families.",

            notes:
                "Eldest maternal aunt (Badi Masi) of Mukesh Sah."
        },


        savitri: {
            name: "Smt. Savitri Devi",
            relation: "Maternal Aunt • Masi Ji",
            side: "MATERNAL FAMILY",
            subtitle: "Second Child of Late Shri Sudama Sah",
            lineage: "Sudama Sah → Savitri Devi",
            icon: "fa-person-dress",

            father: "Late Shri Sudama Sah",
            mother: "Late Smt. Sharda Devi",
            spouse: "null",

            occupation: "Homemaker",
            children: "3 Sons",
            sons: "3 Sons — Married & Settled",
            daughters: "No Daughter",

            residence: "Jamshedpur, Jharkhand",

            childrenDetails:
                "Her three sons are married, educated and settled.",

            notes:
                "Second maternal aunt of Mukesh Sah."

        },


        sima: {
            name: "Smt. Sima Devi",
            relation: "Maternal Aunt • Masi Ji",
            side: "MATERNAL FAMILY",
            subtitle: "Third Child of Late Shri Sudama Sah",
            lineage: "Sudama Sah → Sima Devi",
            icon: "fa-person-dress",

            father: "Late Shri Sudama Sah",
            mother: "Late Smt. Sharda Devi",
            spouse: "Shri Gyani Sah",

            occupation: "Homemaker",
            children: "2 Sons • 1 Daughter",
            sons: "Sikandar Sah — Married • Deepak Sah — Unmarried",
            daughters: "Prity Devi — Married",

            residence: "Sawanaha, Gopalganj, Bihar",

            childrenDetails:
                "She has two sons, Sikandar Sah and Deepak Sah, and one daughter, Prity Devi. Sikandar Sah is married, Deepak Sah is unmarried, and Prity Devi is married.",

            notes:
                "Third maternal aunt of Mukesh Sah and a close maternal family member, with a warm and affectionate bond."
        },


        shobha: {
            name: "Late Smt. Shobha Devi",
            relation: "Mukesh Sah's Mother",
            side: "GROOM'S FAMILY",
            subtitle: "Fourth Child of Late Shri Sudama Sah • Beloved Mother",
            lineage: "Sudama Sah → Shobha Devi → Mukesh Sah",
            icon: "fa-heart",


            father: "Late Shri Sudama Sah",
            mother: "Late Smt. Sharda Devi",
            spouse: "Shri Ramnath Sah",

            occupation: "Homemaker",
            children: "2 Sons • 1 Daughter",
            sons: "Nilesh Sah — Married & Mukesh Sah — Unmarried",
            daughters: "Nitu Devi — Married",

            residence: "Rampur Bhaisahi, Gopalganj, Bihar",

            childrenDetails:
                "She raised three children — Nilesh Sah, Mukesh Sah and Nitu Devi — with love, care and strong family values.",

            notes:
                "Beloved mother of Mukesh Sah. Her love, blessings and values continue to hold a special place in the family."


        },

        shushma: {
            name: "Smt. Shushma Devi",
            relation: "Maternal Aunt • Youngest Masi",
            side: "MATERNAL FAMILY",
            subtitle: "Fifth Child of Late Shri Sudama Sah",
            lineage: "Sudama Sah → Shushma Devi",
            icon: "fa-person-dress",

            father: "Late Shri Sudama Sah",
            mother: "Late Smt. Sharda Devi",
            spouse: "Shri Ravindra Sah",

            occupation: "Homemaker",
            children: "3 Sons • 1 Daughter",
            sons: "3 Sons — 1 Married & 2 Unmarried",
            daughters: "1 Daughter — Unmarried",

            residence: "Khajuri, Gopalganj, Bihar",

            childrenDetails:
                "Her family consists of three sons and one daughter.",

            notes:
                "Youngest maternal aunt of Mukesh Sah."
        },


        shravan: {
            name: "Shri Shravan Sah",
            relation: "Maternal Uncle • Mama Ji",
            side: "MATERNAL FAMILY",
            subtitle: "Elder Maternal Uncle • Sixth Child of Nana Ji",
            lineage: "Sudama Sah → Shravan Sah",
            icon: "fa-user-tie",

            father: "Late Shri Sudama Sah",
            mother: "Late Smt. Sharda Devi",
            spouse: "Smt. Sharda Devi",

            occupation: "Business",
            children: "1 Son • 3 Daughters",
            sons: "1 Son —  Currently Studying",
            daughters: "3 Daughters —  Currently Studying",

            residence: "Jojobera, East Singhbhum, Jharkhand",

            childrenDetails:
                "His children are currently pursuing their education in Jamshedpur, Jharkhand.",

            notes:
                 "Elder maternal uncle (Mama Ji) of Mukesh Sah, currently residing in Jojobera, East Singhbhum, Jharkhand."
        },


        shekhar: {
            name: "Shri Shekhar Sah",
            relation: "Maternal Uncle • Youngest Mama Ji",
            side: "MATERNAL FAMILY",
            subtitle: "Youngest Maternal Uncle • Seventh Child of Nana Ji",
            lineage: "Sudama Sah → Shekhar Sah",
            icon: "fa-user-tie",

            father: "Late Shri Sudama Sah",
            mother: "Late Smt. Sharda Devi",
            spouse: "Smt. Mira Devi",

            occupation: "Business / Enterprise",
            children: "2 Daughters",
            sons: "1 Son - Late",
            daughters: "2 Daughters — Currently Studying",

            residence: "Mateya Khas, Gopalganj, Bihar",

            childrenDetails:
                "He has two daughters, both currently pursuing their school education. He also had a son who is no longer with the family.",

            notes:
                "Youngest maternal uncle of Mukesh Sah, currently residing in Delhi."
        }

    };


    /* =======================================================
       MODAL ORDER
    ======================================================= */

    const paternalMembers = [
        "paternal_grandparents",
        "parasnath",
        "baidyanath",
        "ramnath",
        "ramawati",
        "nilesh",
        "mukesh",
        "nitu"
    ];

    const maternalMembers = [
        "maternal_grandparents",
        "shakuntla",
        "savitri",
        "sima",
        "shobha",
        "shushma",
        "shravan",
        "shekhar"
    ];


    let currentMemberId = null;


    /* =======================================================
       ELEMENTS
    ======================================================= */

    const modal = document.getElementById(
        "member-detail-modal"
    );

    const modalName = document.getElementById(
        "modal-person-name"
    );

    const modalSubtitle = document.getElementById(
        "modal-person-subtitle"
    );

    const modalRelation = document.getElementById(
        "modal-relation-badge"
    );

    const modalSide = document.getElementById(
        "modal-side-badge"
    );

    const modalIcon = document.getElementById(
        "modal-avatar-icon"
    );

    const detailsContainer = document.getElementById(
        "modal-details-container"
    );

    const modalNotes = document.getElementById(
        "modal-person-notes"
    );

    const modalChildren = document.getElementById(
        "modal-children-details"
    );

    const statOccupation = document.getElementById(
        "modal-stat-occupation"
    );

    const statChildren = document.getElementById(
        "modal-stat-children"
    );

    const statLocation = document.getElementById(
        "modal-stat-location"
    );

    const lineageText = document.getElementById(
        "modal-lineage-text"
    );

    const lineageRelation = document.getElementById(
        "modal-lineage-relation"
    );

    const prevButton = document.getElementById(
        "modal-prev"
    );

    const nextButton = document.getElementById(
        "modal-next"
    );

    const modalCount = document.getElementById(
        "modal-member-count"
    );


    /* =======================================================
       HELPERS
    ======================================================= */

    function escapeHTML(value) {

        if (value === null || value === undefined) {
            return "";
        }

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }


    function getActiveMemberList() {

        const paternalView =
            document.getElementById("paternal-tree-view");

        if (
            paternalView &&
            !paternalView.classList.contains("hidden")
        ) {
            return paternalMembers;
        }

        return maternalMembers;
    }


    function getMemberIndex() {

        const list = getActiveMemberList();

        return list.indexOf(currentMemberId);
    }


    /* =======================================================
       RENDER DETAILS
    ======================================================= */

    function renderMember(id) {

        const data = familyMembersData[id];

        if (!data) return;

        currentMemberId = id;


        /* Header */

        modalName.textContent = data.name;
        modalSubtitle.textContent = data.subtitle;
        modalRelation.textContent = data.relation;
        modalSide.textContent = data.side;


        /* Icon */

        modalIcon.className =
            `fa-solid ${data.icon}`;


        /* Lineage */

        lineageText.textContent =
            data.lineage || "Sah Family";

        lineageRelation.textContent =
            data.relation;


        /* Stats */

        statOccupation.textContent =
            data.occupation || "—";

        statChildren.textContent =
            data.children || "—";

        statLocation.textContent =
            data.residence || "—";


        /* Details */

        const details = [

            ["Father Name", data.father],
            ["Mother Name", data.mother],
            ["Spouse / Partner", data.spouse],
            ["Occupation & Work", data.occupation],
            ["Sons", data.sons],
            ["Daughters", data.daughters],
            ["Residence / Location", data.residence]

        ];


        detailsContainer.innerHTML = details
            .map(([label, value]) => {

                return `
                    <div class="modal-detail-card">
                        <small>
                            ${escapeHTML(label)}
                        </small>

                        <strong>
                            ${escapeHTML(value || "—")}
                        </strong>
                    </div>
                `;

            })
            .join("");


        /* Children */

        modalChildren.textContent =
            data.childrenDetails || "—";


        /* Notes */

        modalNotes.textContent =
            data.notes || "—";


        updateNavigation();

    }


    /* =======================================================
       NAVIGATION
    ======================================================= */

    function updateNavigation() {

        const list = getActiveMemberList();
        const index = list.indexOf(currentMemberId);

        if (index === -1) return;


        const previousId =
            list[index - 1];

        const nextId =
            list[index + 1];


        prevButton.disabled =
            !previousId;

        nextButton.disabled =
            !nextId;


        if (previousId) {

            prevButton.querySelector("strong").textContent =
                familyMembersData[previousId].name;

        } else {

            prevButton.querySelector("strong").textContent =
                "First Member";

        }


        if (nextId) {

            nextButton.querySelector("strong").textContent =
                familyMembersData[nextId].name;

        } else {

            nextButton.querySelector("strong").textContent =
                "Last Member";

        }


        modalCount.textContent =
            `${String(index + 1).padStart(2, "0")} / ${String(list.length).padStart(2, "0")}`;
    }


    function navigateMember(direction) {

        const list = getActiveMemberList();

        const index = list.indexOf(currentMemberId);

        if (index === -1) return;


        const newIndex =
            index + direction;


        if (
            newIndex < 0 ||
            newIndex >= list.length
        ) {
            return;
        }


        const newId =
            list[newIndex];


        renderMember(newId);


        const panel =
            modal.querySelector(".member-modal-panel");

        if (panel) {

            panel.scrollTo({
                top: 0,
                behavior: reduceMotion
                    ? "auto"
                    : "smooth"
            });

        }

    }


    /* =======================================================
       OPEN MODAL
    ======================================================= */

    window.showMemberDetails = function (id) {

        if (!modal) return;

        if (!familyMembersData[id]) return;


        renderMember(id);


        modal.classList.add("is-open");

        modal.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.classList.add(
            "member-modal-open"
        );

        document.body.style.overflow = "hidden";


        const closeButton =
            modal.querySelector(".modal-close");

        if (closeButton) {

            setTimeout(() => {
                closeButton.focus();
            }, 100);

        }

    };


    /* =======================================================
       CLOSE MODAL
    ======================================================= */

    window.closeMemberModal = function () {

        if (!modal) return;

        modal.classList.remove("is-open");

        modal.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.classList.remove(
            "member-modal-open"
        );

        document.body.style.overflow = "";


        currentMemberId = null;

    };


    /* =======================================================
       NAVIGATION GLOBAL
    ======================================================= */

    window.navigateMember = navigateMember;


    /* =======================================================
       ESC KEY
    ======================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (!modal ||
                !modal.classList.contains("is-open")) {
                return;
            }


            if (event.key === "Escape") {

                closeMemberModal();

            }


            if (event.key === "ArrowLeft") {

                navigateMember(-1);

            }


            if (event.key === "ArrowRight") {

                navigateMember(1);

            }

        }
    );


    /* =======================================================
       FAMILY TREE SWITCHER
    ======================================================= */

    window.switchFamilyTree = function (type) {

        const paternalView =
            document.getElementById(
                "paternal-tree-view"
            );

        const maternalView =
            document.getElementById(
                "maternal-tree-view"
            );

        const paternalBtn =
            document.getElementById(
                "paternal-tab-btn"
            );

        const maternalBtn =
            document.getElementById(
                "maternal-tab-btn"
            );


        if (
            type === "paternal"
        ) {

            paternalView.classList.remove(
                "hidden"
            );

            maternalView.classList.add(
                "hidden"
            );


            paternalBtn.classList.add(
                "active"
            );

            maternalBtn.classList.remove(
                "active"
            );

        } else {

            paternalView.classList.add(
                "hidden"
            );

            maternalView.classList.remove(
                "hidden"
            );


            maternalBtn.classList.add(
                "active"
            );

            paternalBtn.classList.remove(
                "active"
            );

        }

    };


    /* =======================================================
       SCROLL REVEAL
    ======================================================= */

    function initScrollReveal() {

        const elements =
            document.querySelectorAll(
                ".family-page .reveal"
            );


        if (!elements.length) {
            return;
        }


        if (
            reduceMotion ||
            !("IntersectionObserver" in window)
        ) {

            elements.forEach(
                element => {
                    element.classList.add(
                        "is-visible",
                        "visible"
                    );
                }
            );

            return;
        }


        const observer =
            new IntersectionObserver(
                (entries, obs) => {

                    entries.forEach(
                        entry => {

                            if (
                                !entry.isIntersecting
                            ) {
                                return;
                            }


                            entry.target.classList.add(
                                "is-visible",
                                "visible"
                            );


                            obs.unobserve(
                                entry.target
                            );

                        }
                    );

                },
                {
                    threshold: 0.08,
                    rootMargin:
                        "0px 0px -35px 0px"
                }
            );


        elements.forEach(
            element =>
                observer.observe(element)
        );

    }


    /* =======================================================
       CARD MOUSE EFFECT
    ======================================================= */

    function initCardEffects() {

        if (
            reduceMotion ||
            !window.matchMedia(
                "(pointer: fine)"
            ).matches
        ) {
            return;
        }


        const cards =
            document.querySelectorAll(
                ".family-member-card, .member-feature-card"
            );


        cards.forEach(card => {

            card.addEventListener(
                "pointermove",
                event => {

                    const rect =
                        card.getBoundingClientRect();


                    const x =
                        (event.clientX - rect.left) /
                        rect.width -
                        0.5;


                    const y =
                        (event.clientY - rect.top) /
                        rect.height -
                        0.5;


                    card.style.transform =
                        `perspective(900px)
                         rotateX(${(-y * 2.2).toFixed(2)}deg)
                         rotateY(${(x * 2.2).toFixed(2)}deg)
                         translateY(-6px)`;

                }
            );


            card.addEventListener(
                "pointerleave",
                () => {

                    card.style.transform = "";

                }
            );

        });

    }


    /* =======================================================
       INIT
    ======================================================= */

    function initFamilyPage() {

        if (
            document.body.dataset.page !==
            "family"
        ) {
            return;
        }


        initScrollReveal();

        initCardEffects();

    }


    document.addEventListener(
        "DOMContentLoaded",
        initFamilyPage
    );


})();