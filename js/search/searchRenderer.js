const SearchRenderer = {

    resultsContainer: null,

    mobileResultsContainer: null,


    // ======================================
    // INITIALIZE
    // ======================================

    init(){

        this.resultsContainer =
            document.getElementById("searchResults");

        this.mobileResultsContainer =
            document.getElementById("mobileSearchResults");

    },


    // ======================================
    // RENDER RESULTS
    // ======================================

    // ======================================
// RENDER RESULTS — DESKTOP + MOBILE
// ======================================

render(results, keyword = "") {
    const desktopContainer =
        document.getElementById("searchResults");

    const mobileContainer =
        document.getElementById("mobileSearchResults");

    // Refresh cached references.
    this.resultsContainer = desktopContainer;
    this.mobileResultsContainer = mobileContainer;

    if (!desktopContainer && !mobileContainer) {
        console.error("Search results containers not found.");
        return;
    }

    // Clear previous results.
    if (desktopContainer) {
        desktopContainer.replaceChildren();
    }

    if (mobileContainer) {
        mobileContainer.replaceChildren();
    }

    // Show the mobile results area when the overlay is open.
    const mobileOverlay =
        document.getElementById("mobileSearchOverlay");

    if (mobileOverlay?.classList.contains("active")) {
        if (mobileContainer) {
            mobileContainer.classList.remove("hide-results");
            mobileContainer.classList.add("show-results");
            mobileContainer.style.display = "flex";
        }

        const recentContainer =
            document.getElementById("mobileRecentContainer");

        if (recentContainer) {
            recentContainer.style.display =
                keyword.trim() ? "none" : "";
        }

        const filters =
            document.getElementById("mobileFilters");

        if (filters) {
            filters.classList.toggle(
                "hide",
                Boolean(keyword.trim())
            );
        }
    }

    // Handle an empty result list.
    if (!Array.isArray(results) || results.length === 0) {
        this.renderEmpty(
            desktopContainer,
            mobileContainer
        );

        return;
    }

    // Create a card in each relevant container.
    results.forEach(item => {
        if (desktopContainer) {
            desktopContainer.appendChild(
                this.createCard(item, keyword)
            );
        }

        if (mobileContainer) {
            mobileContainer.appendChild(
                this.createCard(item, keyword)
            );
        }
    });

    console.log("Search results rendered:", {
        keyword,
        resultCount: results.length,
        desktopCards: desktopContainer?.children.length ?? 0,
        mobileCards: mobileContainer?.children.length ?? 0
    });
},


    // ======================================
    // EMPTY RESULTS
    // ======================================

    renderEmpty(
        container,
        mobileContainer
    ){

        const html = `

            <div class="empty-search">

                <div class="empty-search-icon">

                    <i class="fa-solid fa-magnifying-glass"></i>

                </div>

                <h3>
                    No Results Found
                </h3>

                <p>
                    We couldn't find anything
                    matching your current search.
                    Try changing your filters.
                </p>

                <button
                    type="button"
                    class="clear-search-btn"
                    id="clearSearchBtn"
                >
                    Clear Filters
                </button>

            </div>

        `;


        // ----------------------------------
        // DESKTOP
        // ----------------------------------

        if(container){

            container.innerHTML = html;

            container.style.display = "block";

        }


        // ----------------------------------
        // MOBILE
        // ----------------------------------

        if(mobileContainer){

            mobileContainer.innerHTML = html;

            mobileContainer.style.display = "block";

        }


        // ==================================
        // CLEAR FILTERS
        // ==================================

        const clearButton =
            document.getElementById(
                "clearSearchBtn"
            );


        if(clearButton){

            clearButton.addEventListener(
                "click",
                () => {

                    // Reset all filters
                    SearchFilters.reset();


                   // Clear desktop search input
const input =
    document.getElementById(
        "searchInput"
    );

if(input){

    input.value = "";

}


// Clear mobile search input
const mobileInput =
    document.getElementById(
        "mobileSearchInput"
    );

if(mobileInput){

    mobileInput.value = "";

}


                    // Search again using defaults
                    const filters =
                        SearchFilters.getAll();

                    const results =
                        campusSearch.search(
                            filters
                        );


                    // Render results
                    this.render(
                        results,
                        ""
                    );

                }
            );

        }

    },


    // ======================================
    // CREATE RESULT CARD
    // ======================================

    // ======================================
// CREATE RESULT CARD
// ======================================

createCard(item, keyword = ""){

    const card =
        document.createElement("div");


    card.className =
        "search-result";


    card.dataset.page =
        item.page;


    // ==================================
    // BUILD OPTIONAL INFORMATION
    // ==================================

    let priceHTML = "";

    if(
        item.budget &&
        Number(item.budget) > 0 &&
        (
            item.category === "Housing" ||
            item.category === "Roommates"
        )
    ){

        priceHTML = `

            <span class="result-price">

                $${Number(item.budget).toLocaleString()}

                <small>/ month</small>

            </span>

        `;

    }


    // ==================================
    // UNIVERSITY
    // ==================================

    let universityHTML = "";

    if(
        item.university &&
        item.university !== "Any"
    ){

        universityHTML = `

            <span class="result-university">

                <i class="fa-solid fa-graduation-cap"></i>

                ${this.escapeHTML(
                    item.university
                )}

            </span>

        `;

    }


    // ==================================
    // MOVE-IN DATE
    // ==================================

    let moveInHTML = "";

    if(item.moveIn){

        const moveInDate =
            new Date(item.moveIn);


        if(!isNaN(moveInDate)){

            const formattedDate =
                moveInDate.toLocaleDateString(
                    "en-US",
                    {
                        month: "short",
                        day: "numeric"
                    }
                );


            moveInHTML = `

                <span class="result-movein">

                    <i class="fa-regular fa-calendar"></i>

                    ${formattedDate}

                </span>

            `;

        }

    }


    // ==================================
    // AVAILABILITY
    // ==================================

    let availabilityHTML = "";

    if(item.availability){

        availabilityHTML = `

            <span class="result-availability">

                ${this.escapeHTML(
                    item.availability
                )}

            </span>

        `;

    }


    // ==================================
    // HOUSING TYPE
    // ==================================

    let housingTypeHTML = "";

    if(
        item.housingType &&
        item.housingType !== ""
    ){

        housingTypeHTML = `

            <span class="result-housing-type">

                ${this.escapeHTML(
                    item.housingType
                )}

            </span>

        `;

    }


    // ==================================
    // BEST MATCH
    // ==================================

    const bestMatchHTML =

        item.score >= 80

        ? `

            <span class="best-match">

                Best Match

            </span>

        `

        : "";


    // ==================================
    // RESULT CARD
    // ==================================

    card.innerHTML = `

        <div class="result-left">

            <div class="result-icon">

                <i class="${item.icon || "fa-solid fa-house"}"></i>

            </div>


            <div class="result-content">

                ${bestMatchHTML}


                <div class="result-title">

                    ${this.highlight(
                        this.escapeHTML(item.title),
                        keyword
                    )}

                </div>


                <div class="result-meta">

                    <span>

                        ${this.escapeHTML(
                            item.category
                        )}

                    </span>


                    <span>•</span>


                    <span>

                        ${this.escapeHTML(
                            item.location
                        )}

                    </span>

                </div>


                ${universityHTML}


                ${housingTypeHTML}


                <div class="result-details">

                    ${priceHTML}

                    ${moveInHTML}

                    ${availabilityHTML}

                </div>

            </div>

        </div>


        <i
            class="fa-solid fa-chevron-right result-arrow"
        ></i>

    `;


    // ==================================
    // CARD CLICK
    // ==================================

    // ======================================
// CARD CLICK
// ======================================

card.addEventListener(
    "click",
    () => {

        // ==================================
        // SAVE CURRENT SEARCH
        // ==================================

        SearchRecent.save();


        // ==================================
        // GET RESULT PAGE
        // ==================================

        const page =
            item.page;

        const id =
            item.id;


        // ==================================
        // MAKE SURE PAGE EXISTS
        // ==================================

        if(!page){

            console.error(
                "No page defined for search result:",
                item
            );

            return;

        }


        // ==================================
        // BUILD CORRECT URL
        // ==================================

        let targetURL;


        if(
            page.includes("?")
        ){

            // ----------------------------------
            // Page already contains query string
            // ----------------------------------

            targetURL =
                page;

        }else if(id){

            // ----------------------------------
            // Page does not contain ID
            // ----------------------------------

            targetURL =
                `${page}?id=${encodeURIComponent(id)}`;

        }else{

            // ----------------------------------
            // No ID available
            // ----------------------------------

            targetURL =
                page;

        }


        // ==================================
        // OPEN RESULT
        // ==================================

        console.log(
            "Opening search result:",
            targetURL
        );


        window.location.href =
            targetURL;

    }
);


    return card;

},

// ======================================
// ESCAPE HTML
// ======================================

escapeHTML(value){

    return String(value ?? "")
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

},


    // ======================================
    // HIGHLIGHT KEYWORD
    // ======================================

    highlight(text, keyword){

        if(!keyword){

            return text;

        }


        // Escape special regex characters
        const escapedKeyword =
            keyword.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );


        const regex =
            new RegExp(
                `(${escapedKeyword})`,
                "gi"
            );


        return text.replace(
            regex,
            "<mark>$1</mark>"
        );

    }

};