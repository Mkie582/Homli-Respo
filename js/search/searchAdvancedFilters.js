// =========================================================
// CAMPUSNEST
// ADVANCED FILTER CONTROLLER
// =========================================================


const SearchAdvancedFilters = {

    // =====================================================
    // INITIALIZE
    // =====================================================

    init() {

        console.log(
            "Advanced Filters initialized."
        );


        this.initDesktop();

        this.initMobile();

        this.initDesktopFilterCards();

        this.initMobileFilterCards();

    },


    // =====================================================
    // DESKTOP MORE FILTERS
    // =====================================================

    initDesktop() {

        const toggle =
            document.getElementById(
                "moreFiltersToggle"
            );


        const wrapper =
            document.querySelector(
                ".more-filters-wrapper"
            );


        if (!toggle || !wrapper) {

            console.log(
                "Desktop More Filters not found."
            );

            return;

        }


        // Prevent duplicate listeners

        if (
            toggle.dataset.advancedReady === "true"
        ) {

            return;

        }


        toggle.dataset.advancedReady = "true";


        toggle.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();


                wrapper.classList.toggle(
                    "open"
                );


                console.log(
                    "Desktop More Filters:",
                    wrapper.classList.contains("open")
                        ? "OPEN"
                        : "CLOSED"
                );

            }
        );

    },


    // =====================================================
    // MOBILE MORE FILTERS
    // =====================================================

    initMobile() {

        const toggle =
            document.getElementById(
                "mobileMoreFiltersToggle"
            );


        const wrapper =
            document.querySelector(
                ".mobile-more-filters"
            );


        if (!toggle || !wrapper) {

            console.log(
                "Mobile More Filters not found."
            );

            return;

        }


        // Prevent duplicate listeners

        if (
            toggle.dataset.advancedReady === "true"
        ) {

            return;

        }


        toggle.dataset.advancedReady = "true";


        toggle.addEventListener(
            "click",
            (event) => {

                event.preventDefault();

                event.stopPropagation();


                wrapper.classList.toggle(
                    "open"
                );


                console.log(
                    "Mobile More Filters:",
                    wrapper.classList.contains("open")
                        ? "OPEN"
                        : "CLOSED"
                );

            }
        );

    },


    // =====================================================
    // DESKTOP ADVANCED FILTER CARDS
    // =====================================================

    initDesktopFilterCards() {

        const filters = document.querySelectorAll(
            ".advanced-filter"
        );


        filters.forEach(
            (filter) => {

                if (
                    filter.dataset.popupReady === "true"
                ) {

                    return;

                }


                filter.dataset.popupReady = "true";


                filter.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();

                        event.stopPropagation();


                        const filterId =
                            filter.id;


                        if (!filterId) {

                            return;

                        }


                        if (
                            typeof SearchPopup ===
                            "undefined"
                        ) {

                            console.error(
                                "SearchPopup is not available."
                            );

                            return;

                        }


                        SearchPopup.open(
                            filterId,
                            filter
                        );

                    }
                );

            }
        );

    },


    // =====================================================
    // MOBILE ADVANCED FILTER CARDS
    // =====================================================

    initMobileFilterCards() {

        const filters =
            document.querySelectorAll(
                ".mobile-advanced-filter"
            );


        filters.forEach(
            (filter) => {

                if (
                    filter.dataset.popupReady === "true"
                ) {

                    return;

                }


                filter.dataset.popupReady = "true";


                filter.addEventListener(
                    "click",
                    (event) => {

                        event.preventDefault();

                        event.stopPropagation();


                        const filterId =
                            filter.dataset.filter;


                        if (!filterId) {

                            return;

                        }


                        if (
                            typeof SearchPopup ===
                            "undefined"
                        ) {

                            console.error(
                                "SearchPopup is not available."
                            );

                            return;

                        }


                        SearchPopup.open(
                            filterId,
                            filter
                        );

                    }
                );

            }
        );

    }

};