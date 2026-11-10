// ==========================================
// CAMPUSNEST SEARCH
// ==========================================

console.log("CampusNest search.js loaded.");


// ==========================================
// ELEMENTS
// ==========================================

const searchInput =
    document.getElementById("searchInput");

const searchButton =
    document.getElementById("searchButton");


// ==========================================
// INITIALIZE SEARCH
// ==========================================

function initializeCampusSearch(){

    console.log("Initializing CampusNest Search...");


    // --------------------------------------
    // LOAD SEARCH DATA
    // --------------------------------------

    campusSearch.setData(searchData);


    // --------------------------------------
    // INITIALIZE COMPONENTS
    // --------------------------------------

    SearchRenderer.init();

    SearchRecent.render();

    SearchSuggestions.init();

    SearchPopup.init();

    SearchFilters.updateUI();

    initializeMoreFilters();

    initializeMobileAdvancedFilters();


    // --------------------------------------
    // MORE FILTERS
    // --------------------------------------

    // ==========================================
// MORE FILTERS — DESKTOP + MOBILE
// ==========================================

function initializeMoreFilters(){

    console.log("Initializing More Filters...");


    // ======================================
    // DESKTOP
    // ======================================

    const desktopToggle =
        document.getElementById(
            "moreFiltersToggle"
        );

    const desktopWrapper =
        document.getElementById(
            "moreFiltersWrapper"
        );


    if(desktopToggle && desktopWrapper){

        desktopToggle.addEventListener(
            "click",
            function(e){

                e.preventDefault();

                e.stopPropagation();


                const isOpen =
                    desktopWrapper.classList.toggle(
                        "open"
                    );


                desktopToggle.setAttribute(
                    "aria-expanded",
                    isOpen
                );


                console.log(
                    "Desktop More Filters:",
                    isOpen
                        ? "OPEN"
                        : "CLOSED"
                );

            }
        );

    }else{

        console.warn(
            "Desktop More Filters elements not found."
        );

    }


    // ======================================
    // MOBILE
    // ======================================

    const mobileToggle =
        document.getElementById(
            "mobileMoreFiltersToggle"
        );

    const mobileAdvanced =
        document.getElementById(
            "mobileAdvancedFilters"
        );

    const mobileFiltersContainer =
        document.getElementById(
            "mobileFilters"
        );


    if(
        mobileToggle &&
        mobileAdvanced &&
        mobileFiltersContainer
    ){

        mobileToggle.addEventListener(
            "click",
            function(e){

                e.preventDefault();

                e.stopPropagation();


                const isOpen =
                    mobileFiltersContainer.classList.toggle(
                        "open"
                    );


                mobileToggle.setAttribute(
                    "aria-expanded",
                    isOpen
                );


                console.log(
                    "Mobile More Filters:",
                    isOpen
                        ? "OPEN"
                        : "CLOSED"
                );

            }
        );

    }else{

        console.warn(
            "Mobile More Filters elements not found."
        );

    }

}


    console.log(
        "CampusNest Search initialized successfully."
    );

}

// ==========================================
// MOBILE ADVANCED FILTER POPUPS
// ==========================================

function initializeMobileAdvancedFilters(){

    const mobileFilters = {

        mobileHousingType: "housingTypeFilter",

        mobileGender: "genderFilter",

        mobileLifestyle: "lifestyleFilter",

        mobilePets: "petsFilter",

        mobileSmoking: "smokingFilter",

        mobileFurnished: "furnishedFilter",

        mobileParking: "parkingFilter",

        mobileUtilities: "utilitiesFilter",

        mobileCategory: "categoryFilter"

    };


    Object.entries(mobileFilters).forEach(
        ([mobileId, popupFilter]) => {

            const element =
                document.getElementById(
                    mobileId
                );


            if(!element){

                console.warn(
                    "Mobile filter not found:",
                    mobileId
                );

                return;

            }


            element.addEventListener(
                "click",
                function(e){

                    e.preventDefault();

                    e.stopPropagation();


                    console.log(
                        "Opening mobile filter:",
                        popupFilter
                    );


                    SearchPopup.open(
                        popupFilter,
                        element
                    );

                }
            );

        }
    );

}
// ==========================================
// RUN SEARCH
// ==========================================

function renderResults(keyword = "") {
    const filters = SearchFilters.getAll();

    filters.keyword = keyword.trim();

    const results = campusSearch.search(filters);

    console.log("Search filters:", filters);
    console.log("Search results:", results);

    const campusSearchContainer =
        document.getElementById("campusSearch");

    // On category pages, use that page's own listing cards.
    if (
        campusSearchContainer &&
        campusSearchContainer.dataset.category === "Housing" &&
        typeof renderHousingListings === "function"
    ) {
        renderHousingListings(results);
        return;
    }

    // On the homepage and other pages, keep the existing renderer.
    SearchRenderer.render(results, keyword);
}


// ==========================================
// DESKTOP SEARCH INPUT
// ==========================================

if(searchInput){

    searchInput.addEventListener(
        "input",
        (e) => {

            const keyword =
                e.target.value.trim();


            SearchFilters.set(
                "keyword",
                keyword
            );


            SearchSuggestions.render(
                keyword
            );

        }
    );

}


// ==========================================
// DESKTOP SEARCH BUTTON
// ==========================================

if(searchButton){

    searchButton.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();


            console.log(
                "SEARCH BUTTON CLICKED"
            );


            const keyword =
                searchInput
                    ? searchInput.value.trim()
                    : "";


            SearchFilters.set(
                "keyword",
                keyword
            );


            renderResults(
                keyword
            );


            // Save search
            SearchRecent.save();

        }
    );

}



/* ==========================================
   MOBILE SEARCH INPUT — LIVE RESULTS
========================================== */

const mobileInput = document.getElementById("mobileSearchInput");

if (mobileInput) {
    mobileInput.addEventListener("input", (e) => {
        const keyword = e.target.value.trim();

        SearchFilters.set("keyword", keyword);

        const recentContainer =
            document.getElementById("mobileRecentContainer");

        const mobileResults =
            document.getElementById("mobileSearchResults");

        const mobileFilters =
            document.getElementById("mobileFilters");

        if (keyword) {
            // Hide recent searches and filters while searching.
            if (recentContainer) {
                recentContainer.style.display = "none";
            }

            if (mobileFilters) {
                mobileFilters.classList.add("hide");
            }

            // Make the results container visible.
            if (mobileResults) {
                mobileResults.classList.remove("hide-results");
                mobileResults.classList.add("show-results");
                mobileResults.style.display = "flex";
            }

            // Search and render matching listings.
            const filters = SearchFilters.getAll();
            filters.keyword = keyword;

            const results = campusSearch.search(filters);

            console.log("Mobile live search:", {
                keyword,
                resultCount: results.length
            });

            SearchRenderer.render(results, keyword);

            // Hide suggestions while showing actual results.
            if (typeof SearchSuggestions !== "undefined") {
                SearchSuggestions.hide();
            }
        } else {
            // Restore the default mobile search screen.
            if (recentContainer) {
                recentContainer.style.display = "";
            }

            if (mobileResults) {
                mobileResults.innerHTML = "";
                mobileResults.classList.remove("show-results");
                mobileResults.classList.add("hide-results");
                mobileResults.style.display = "none";
            }

            if (mobileFilters) {
                mobileFilters.classList.remove("hide");
            }

            if (typeof SearchRecent !== "undefined") {
                SearchRecent.render();
            }

            if (typeof SearchSuggestions !== "undefined") {
                SearchSuggestions.render("");
            }
        }
    });
}



// ==========================================
// MOBILE SEARCH BUTTON
// ==========================================

const mobileSearchButton =
    document.getElementById(
        "mobileSearchButton"
    );


if(mobileSearchButton){

    mobileSearchButton.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();


            console.log(
                "MOBILE SEARCH BUTTON CLICKED"
            );


            const keyword =
                mobileInput
                    ? mobileInput.value.trim()
                    : "";


            SearchFilters.set(
                "keyword",
                keyword
            );


            const filters =
                SearchFilters.getAll();


            const results =
                campusSearch.search(
                    filters
                );


            SearchRenderer.render(
                results,
                keyword
            );


            if (keyword) {
    SearchRecent.save(keyword);
}


            SearchSuggestions.hide();

        }
    );

    // ==========================================
// MOBILE FILTERS
// ==========================================

const mobileLocation =
    document.getElementById("mobileLocation");

const mobileUniversity =
    document.getElementById("mobileUniversity");

const mobileMoveIn =
    document.getElementById("mobileMoveIn");

const mobileBudget =
    document.getElementById("mobileBudget");


// ==========================================
// MOBILE LOCATION
// ==========================================

if(mobileLocation){

    mobileLocation.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            SearchPopup.open(
                "locationFilter",
                mobileLocation
            );

        }
    );

}


// ==========================================
// MOBILE UNIVERSITY
// ==========================================

if(mobileUniversity){

    mobileUniversity.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            SearchPopup.open(
                "universityFilter",
                mobileUniversity
            );

        }
    );

}


// ==========================================
// MOBILE MOVE-IN
// ==========================================

if(mobileMoveIn){

    mobileMoveIn.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            SearchPopup.open(
                "moveInFilter",
                mobileMoveIn
            );

        }
    );

}


// ==========================================
// MOBILE BUDGET
// ==========================================

if(mobileBudget){

    mobileBudget.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            SearchPopup.open(
                "budgetFilter",
                mobileBudget
            );

        }
    );

}

// ==========================================
// MOBILE MORE FILTERS
// ==========================================

const mobileMoreFiltersToggle =
    document.getElementById(
        "mobileMoreFiltersToggle"
    );

const mobileAdvancedFilters =
    document.getElementById(
        "mobileAdvancedFilters"
    );


if(
    mobileMoreFiltersToggle &&
    mobileAdvancedFilters
){

    mobileMoreFiltersToggle.addEventListener(
        "click",
        (e) => {

            e.stopPropagation();

            mobileAdvancedFilters.classList.toggle(
                "open"
            );

            mobileMoreFiltersToggle.classList.toggle(
                "open"
            );

        }
    );

}

// ==========================================
// MOBILE ADVANCED FILTERS
// ==========================================

const mobileAdvancedFilterMap = {

    mobileHousingType: "housingTypeFilter",

    mobileGender: "genderFilter",

    mobileLifestyle: "lifestyleFilter",

    mobilePets: "petsFilter",

    mobileSmoking: "smokingFilter",

    mobileFurnished: "furnishedFilter",

    mobileParking: "parkingFilter",

    mobileUtilities: "utilitiesFilter",

    mobileCategory: "categoryFilter"

};


Object.entries(
    mobileAdvancedFilterMap
).forEach(
    ([mobileId, popupFilter]) => {

        const element =
            document.getElementById(
                mobileId
            );


        if(!element){

            return;

        }


        element.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                SearchPopup.open(
                    popupFilter,
                    element
                );

            }
        );

    }
);

}
