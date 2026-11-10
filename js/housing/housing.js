// ==========================================================
// CAMPUSNEST HOUSING DISCOVERY
// PHASE 6
// ==========================================================

console.log(
    "CampusNest housing.js loaded."
);


// ==========================================================
// GLOBAL DATA
// ==========================================================

let allHousingListings = [];

let filteredHousingListings = [];

let housingSaveStudent = undefined;

let housingSavedListingIds = new Set();

// ==========================================================
// DOM ELEMENTS
// ==========================================================

let housingListingsContainer;

let housingResultsCount;


// ==========================================================
// INITIALIZE
// ==========================================================

async function initializeHousingPage() {

    console.log(
        "Initializing CampusNest Housing Discovery..."
    );


    // ------------------------------------------------------
    // GET ELEMENTS
    // ------------------------------------------------------

    housingListingsContainer =
        document.getElementById(
            "housingListings"
        );


    housingResultsCount =
        document.getElementById(
            "housingResultsCount"
        );


    housingSearchInput =
        document.getElementById(
            "housingSearch"
        );


    housingLocationFilter =
        document.getElementById(
            "housingLocation"
        );


    housingTypeFilter =
        document.getElementById(
            "housingTypeFilter"
        );


    housingSearchButton =
        document.getElementById(
            "housingSearchBtn"
        );


    // ------------------------------------------------------
    // VERIFY CONTAINER
    // ------------------------------------------------------

    if (!housingListingsContainer) {

        console.error(
            "Housing listings container was not found."
        );

        return;

    }


    console.log(
        "Housing listings container found."
    );


    // ------------------------------------------------------
    // SHOW LOADING
    // ------------------------------------------------------

    showHousingLoading();


    // ------------------------------------------------------
    // LOAD LISTINGS
    // ------------------------------------------------------

    try {

        if (
            typeof HousingListings === "undefined"
        ) {

            throw new Error(
                "HousingListings is not available. Check housingListings.js."
            );

        }


        if (
            typeof HousingListings.getListings !== "function"
        ) {

            throw new Error(
                "HousingListings.getListings() was not found."
            );

        }


        console.log(
            "Loading housing listings from Supabase..."
        );

        const listings = await HousingListings.getListings();

        console.log(
            "Real housing listings:",
            listings
        );


        // --------------------------------------------------
        // NORMALIZE DATA
        // --------------------------------------------------

        allHousingListings =
            Array.isArray(listings)
                ? listings
                : [];


        filteredHousingListings =
            [...allHousingListings];


        console.log(
            "Number of listings:",
            allHousingListings.length
        );


        // --------------------------------------------------
        // RENDER
        // --------------------------------------------------

        renderHousingListings(
            filteredHousingListings
        );


        // --------------------------------------------------
        // EVENTS
        // --------------------------------------------------

        setupHousingSearch();


        console.log(
            "CampusNest Housing Discovery initialized."
        );

    } catch (error) {

        console.error(
            "Housing discovery initialization failed:",
            error
        );


        showHousingError(
            error
        );

    }

}


// ==========================================================
// LOADING
// ==========================================================

function showHousingLoading() {

    if (!housingListingsContainer) {
        return;
    }


    housingListingsContainer.innerHTML = `

        <div class="housing-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading housing...
            </p>

        </div>

    `;


    if (housingResultsCount) {

        housingResultsCount.textContent =
            "Loading listings...";

    }

}


// ==========================================================
// ERROR
// ==========================================================

function showHousingError(error) {

    console.error(
        "Housing error:",
        error
    );


    if (!housingListingsContainer) {
        return;
    }


    housingListingsContainer.innerHTML = `

        <div class="housing-error">

            <div class="housing-error-icon">

                <i class="fa-solid fa-triangle-exclamation"></i>

            </div>


            <h3>
                We couldn't load housing
            </h3>


            <p>
                Something went wrong while loading
                the available housing listings.
                Please try again.
            </p>


            <button
                type="button"
                class="housing-retry-btn"
                id="housingRetryBtn"
            >
                Try Again
            </button>

        </div>

    `;


    if (housingResultsCount) {

        housingResultsCount.textContent =
            "Unable to load listings";

    }


    const retryButton =
        document.getElementById(
            "housingRetryBtn"
        );


    if (retryButton) {

        retryButton.addEventListener(
            "click",
            function () {

                window.location.reload();

            }
        );

    }

}


// ==========================================================
// RENDER LISTINGS
// ==========================================================

function renderHousingListings(listings) {

    if (!housingListingsContainer) {
        return;
    }


    // ------------------------------------------------------
    // EMPTY
    // ------------------------------------------------------

    if (!listings || listings.length === 0) {

        showHousingEmpty();

        return;

    }


    // ------------------------------------------------------
    // UPDATE COUNT
    // ------------------------------------------------------

    updateResultsCount(
        listings.length
    );


    // ------------------------------------------------------
    // RENDER CARDS
    // ------------------------------------------------------

    housingListingsContainer.innerHTML =
        listings
            .map(
                (
                    listing,
                    index
                ) =>
                    createHousingCard(
                        listing,
                        index
                    )
            )
            .join("");


    // ------------------------------------------------------
    // CARD EVENTS
    // ------------------------------------------------------

    setupCardEvents();

}


// ==========================================================
// EMPTY
// ==========================================================

function showHousingEmpty() {

    housingListingsContainer.innerHTML = `

        <div class="housing-empty">

            <div class="housing-empty-icon">

                <i class="fa-solid fa-house"></i>

            </div>


            <h3>
                No housing found
            </h3>


            <p>
                We couldn't find listings matching
                your current search. Try changing
                your search or filters.
            </p>


            <button
                type="button"
                class="housing-empty-reset"
                id="resetHousingSearch"
            >
                Clear Filters
            </button>

        </div>

    `;


    updateResultsCount(
        0
    );


    const resetButton =
        document.getElementById(
            "resetHousingSearch"
        );


    if (resetButton) {

        resetButton.addEventListener(
            "click",
            resetHousingSearch
        );

    }

}


// ==========================================================
// RESULTS COUNT
// ==========================================================

function updateResultsCount(count) {

    if (!housingResultsCount) {
        return;
    }


    if (count === 1) {

        housingResultsCount.textContent =
            "1 listing";

    } else {

        housingResultsCount.textContent =
            `${count} listings`;

    }

}


// ==========================================================
// CREATE CARD
// ==========================================================

function createHousingCard(
    listing,
    index
) {

    // ------------------------------------------------------
    // FLEXIBLE FIELD SUPPORT
    // ------------------------------------------------------

    const id =
        listing.id ||
        listing.listing_id ||
        index;


    const title =
        listing.title ||
        listing.name ||
        listing.property_title ||
        "Student Housing";


    const location =
        listing.location ||
        listing.neighborhood ||
        listing.area ||
        listing.city ||
        "Calgary";


    const university =
        listing.university ||
        listing.school ||
        listing.university_name ||
        "University of Calgary";


    const type =
        listing.housing_type ||
        listing.property_type ||
        listing.type ||
        "Housing";


    const budget =
        listing.monthly_rent ||
        listing.rent ||
        listing.price ||
        listing.monthly_budget ||
        listing.budget ||
        null;


    const moveIn =
        listing.move_in_date ||
        listing.move_in ||
        listing.available_from ||
        null;


    const furnished =
        listing.furnished;


    const parking =
        listing.parking;


    const image =
        listing.image_url ||
        listing.image ||
        listing.photo_url ||
        listing.cover_image ||
        listing.thumbnail ||
        "";


    const verified =
        listing.verified === true ||
        listing.is_verified === true ||
        listing.verified_listing === true;


    // ------------------------------------------------------
    // FORMAT VALUES
    // ------------------------------------------------------

    const formattedPrice =
        formatPrice(
            budget
        );


    const formattedMoveIn =
        formatMoveIn(
            moveIn
        );


    const furnishedText =
        formatBoolean(
            furnished,
            "Furnished",
            "Unfurnished"
        );


    const parkingText =
        formatBoolean(
            parking,
            "Parking",
            "No parking"
        );


    // ------------------------------------------------------
    // IMAGE
    // ------------------------------------------------------

    const imageHTML =
        image
            ? `

                <img
                    src="${escapeHTML(image)}"
                    alt="${escapeHTML(title)}"
                    class="housing-card-image-real"
                    loading="lazy"
                    onerror="this.parentElement.innerHTML = createHousingImagePlaceholderHTML()"
                >

            `
            : createHousingImagePlaceholderHTML();


    // ------------------------------------------------------
    // VERIFIED
    // ------------------------------------------------------

    const verifiedHTML =
        verified
            ? `

                <div class="housing-verified-badge">

                    <i class="fa-solid fa-circle-check"></i>

                    Verified

                </div>

            `
            : "";


    // ------------------------------------------------------
    // CARD
    // ------------------------------------------------------

    return `

        <article
            class="housing-listing-card"
            data-listing-id="${escapeHTML(String(id))}"
        >


            <!-- IMAGE -->

            <div class="housing-card-image-wrapper">

                ${imageHTML}


                ${verifiedHTML}


                <!-- HEART -->

                <button
                    type="button"
                    class="housing-card-heart"
                    data-save-id="${escapeHTML(String(id))}"
                    aria-label="Save listing"
                >

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>



            <!-- CONTENT -->

            <div class="housing-card-content">


                <!-- TITLE -->

                <div class="housing-card-heading">

                    <h3>
                        ${escapeHTML(title)}
                    </h3>


                    <div class="housing-card-location">

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeHTML(location)}

                    </div>

                </div>



                <!-- UNIVERSITY -->

                <div class="housing-card-university">

                    <i class="fa-solid fa-graduation-cap"></i>

                    ${escapeHTML(university)}

                </div>



                <!-- META -->

                <div class="housing-card-meta">

                    <span>

                        <i class="fa-solid fa-house"></i>

                        ${escapeHTML(type)}

                    </span>


                    ${
                        formattedMoveIn
                            ? `

                                <span>

                                    <i class="fa-regular fa-calendar"></i>

                                    ${escapeHTML(formattedMoveIn)}

                                </span>

                            `
                            : ""
                    }


                    ${
                        furnished !== undefined &&
                        furnished !== null
                            ? `

                                <span>

                                    <i class="fa-solid fa-couch"></i>

                                    ${escapeHTML(furnishedText)}

                                </span>

                            `
                            : ""
                    }


                    ${
                        parking !== undefined &&
                        parking !== null
                            ? `

                                <span>

                                    <i class="fa-solid fa-square-parking"></i>

                                    ${escapeHTML(parkingText)}

                                </span>

                            `
                            : ""
                    }

                </div>



                <!-- BOTTOM -->

                <div class="housing-card-bottom">


                    <div class="housing-price">

                        <strong>
                            ${escapeHTML(formattedPrice)}
                        </strong>

                        ${
                            budget
                                ? `<span>/ month</span>`
                                : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="view-housing-btn"
                        data-view-id="${escapeHTML(String(id))}"
                    >

                        View Details

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>

                </div>

            </div>

        </article>

    `;

}


// ==========================================================
// IMAGE PLACEHOLDER
// ==========================================================

function createHousingImagePlaceholderHTML() {

    return `

        <div class="housing-card-placeholder">

            <i class="fa-solid fa-house"></i>

            <span>
                Housing image
            </span>

        </div>

    `;

}


// ==========================================================
// CARD EVENTS
// ==========================================================

// ==========================================================
// CARD EVENTS
// PHASE 6.5.1 — PERSISTENT HOUSING FAVORITES
// ==========================================================


// ==========================================================
// PHASE 7.7.4.4 — SUPABASE HOUSING CARD SAVES
// ==========================================================

// ----------------------------------------------------------
// GET CURRENT STUDENT
// ----------------------------------------------------------

async function getHousingSaveStudent() {

    if (housingSaveStudent !== undefined) {
        return housingSaveStudent;
    }

    if (
        typeof campusSupabase === "undefined" ||
        !campusSupabase
    ) {
        throw new Error("Supabase client is unavailable.");
    }

    const {
        data: { user },
        error: authError
    } = await campusSupabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!user) {
        housingSaveStudent = null;
        return null;
    }

    const { data: profile, error: profileError } =
        await campusSupabase
            .from("profiles")
            .select("role")
            .eq("id", user.id)
            .maybeSingle();

    if (profileError) {
        throw profileError;
    }

    housingSaveStudent = {
        id: user.id,
        role: profile?.role || null
    };

    return housingSaveStudent;
}


// ----------------------------------------------------------
// UPDATE A HEART BUTTON
// ----------------------------------------------------------

function setHousingSaveButtonState(button, isSaved) {

    if (!button) return;

    button.classList.toggle("saved", isSaved);

    button.setAttribute(
        "aria-pressed",
        String(isSaved)
    );

    button.setAttribute(
        "aria-label",
        isSaved
            ? "Remove saved housing"
            : "Save housing"
    );

    button.setAttribute(
        "title",
        isSaved
            ? "Remove from saved properties"
            : "Save property"
    );

    const icon = button.querySelector("i");

    if (icon) {

        icon.classList.toggle("fa-solid", isSaved);

        icon.classList.toggle("fa-regular", !isSaved);

    }

}


// ----------------------------------------------------------
// SYNCHRONIZE HEARTS WITH SUPABASE
// ----------------------------------------------------------

async function syncHousingSaveButtons() {

    const buttons = document.querySelectorAll(
        ".housing-card-heart"
    );

    if (!buttons.length) return;

    // Prevent clicks while saved states are loading.
    buttons.forEach(function (button) {
        button.disabled = true;
        button.setAttribute("aria-busy", "true");
    });

    try {

        const student = await getHousingSaveStudent();

        housingSavedListingIds = new Set();

        // Logged-out visitors and non-students
        // cannot have student saved-property states.
        if (!student || student.role !== "student") {

            buttons.forEach(function (button) {

                setHousingSaveButtonState(button, false);

                button.disabled = false;
                button.removeAttribute("aria-busy");

            });

            return;
        }

        // Get the actual listing IDs currently displayed.
        const listingIds = [
            ...new Set(
                Array.from(buttons)
                    .map(button => Number(button.dataset.saveId))
                    .filter(id => Number.isSafeInteger(id) && id > 0)
            )
        ];

        if (!listingIds.length) {
            throw new Error("No valid housing listing IDs were found.");
        }

        // One query loads all saved states for this page.
        const { data, error } = await campusSupabase
            .from("property_saves")
            .select("listing_id")
            .eq("student_id", student.id)
            .in("listing_id", listingIds);

        if (error) {
            throw error;
        }

        housingSavedListingIds = new Set(
            (data || []).map(function (item) {
                return String(item.listing_id);
            })
        );

        // Update every visible heart.
        buttons.forEach(function (button) {

            const listingId = String(button.dataset.saveId);

            setHousingSaveButtonState(
                button,
                housingSavedListingIds.has(listingId)
            );

            button.disabled = false;
            button.removeAttribute("aria-busy");

        });

    } catch (error) {

        console.error(
            "Could not synchronize housing saves:",
            error
        );

        // Allow the visitor to retry by clicking a heart.
        buttons.forEach(function (button) {
            button.disabled = false;
            button.removeAttribute("aria-busy");
        });

    }

}


// ----------------------------------------------------------
// TOGGLE PROPERTY SAVE
// ----------------------------------------------------------

async function toggleHousingSave(button) {

    if (!button || button.disabled) return;

    const listingId = String(
        button.dataset.saveId || ""
    );

    const numericListingId = Number(listingId);

    if (
        !Number.isSafeInteger(numericListingId) ||
        numericListingId <= 0
    ) {

        console.error(
            "Invalid housing listing ID:",
            listingId
        );

        return;
    }

    // Confirm that this listing exists in our loaded data.
    const listing = allHousingListings.find(function (item) {

        return String(item.id || item.listing_id) === listingId;

    });

    if (!listing) {

        console.error(
            "Housing listing could not be found:",
            listingId
        );

        return;
    }

    const originalText = button.innerHTML;

    button.disabled = true;

    try {

        const student = await getHousingSaveStudent();

        // Require student login.
        if (!student) {

            const returnUrl =
                window.location.pathname +
                window.location.search;

            window.location.href =
                `student-login.html?redirect=${encodeURIComponent(returnUrl)}`;

            return;
        }

        // Only student accounts can save properties.
        if (student.role !== "student") {

            alert(
                "Only student accounts can save housing properties."
            );

            return;
        }

        const isAlreadySaved =
            housingSavedListingIds.has(listingId);

        if (isAlreadySaved) {

            // REMOVE SAVE FROM SUPABASE
            const { error } = await campusSupabase
                .from("property_saves")
                .delete()
                .eq("student_id", student.id)
                .eq("listing_id", numericListingId);

            if (error) {
                throw error;
            }

            housingSavedListingIds.delete(listingId);

            console.log(
                "Housing removed from saved properties:",
                listingId
            );

        } else {

            // SAVE PROPERTY IN SUPABASE
            const { error } = await campusSupabase
                .from("property_saves")
                .insert({
                    student_id: student.id,
                    listing_id: numericListingId
                });

            // A duplicate save means it is already saved.
            if (error && error.code !== "23505") {
                throw error;
            }

            housingSavedListingIds.add(listingId);

            console.log(
                "Housing added to saved properties:",
                listingId
            );

        }

        // Synchronize every matching heart on the page.
        document
            .querySelectorAll(".housing-card-heart")
            .forEach(function (heart) {

                const heartListingId = String(
                    heart.dataset.saveId
                );

                setHousingSaveButtonState(
                    heart,
                    housingSavedListingIds.has(heartListingId)
                );

            });

    } catch (error) {

        console.error(
            "Housing save operation failed:",
            error
        );

        alert(
            "We couldn't update your saved property. Please try again."
        );

        // Restore the previous heart state.
        setHousingSaveButtonState(
            button,
            housingSavedListingIds.has(listingId)
        );

    } finally {

        button.disabled = false;

        button.innerHTML = originalText;

    }

}


// ----------------------------------------------------------
// CARD EVENTS
// ----------------------------------------------------------

function setupCardEvents() {

    // ------------------------------------------
    // SAVE BUTTONS
    // ------------------------------------------

    const saveButtons = document.querySelectorAll(
        ".housing-card-heart"
    );

    saveButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            toggleHousingSave(button);

        });

    });

    // Restore saved states from Supabase.
    syncHousingSaveButtons();


    // ------------------------------------------
    // VIEW DETAILS BUTTONS
    // ------------------------------------------

    const viewButtons = document.querySelectorAll(
        ".view-housing-btn"
    );

    viewButtons.forEach(function (button) {

        button.addEventListener("click", function (event) {

            event.preventDefault();
            event.stopPropagation();

            const id = button.dataset.viewId;

            openHousingListing(id);

        });

    });


    // ------------------------------------------
    // CARD CLICK
    // ------------------------------------------

    const cards = document.querySelectorAll(
        ".housing-listing-card"
    );

    cards.forEach(function (card) {

        card.addEventListener("click", function () {

            const id = card.dataset.listingId;

            openHousingListing(id);

        });

    });

}

// ==========================================================
// OPEN LISTING
// ==========================================================

function openHousingListing(id) {

    console.log("Opening housing listing:", id);

    if (!id) {
        console.error("No housing listing ID was provided.");
        return;
    }

    const detailsUrl =
        `housing-details.html?id=${encodeURIComponent(id)}`;

    window.location.href = detailsUrl;
}


// ==========================================================
// SEARCH SETUP
// ==========================================================

// ==========================================================
// SEARCH SETUP — UNIVERSAL CAMPUSNEST SEARCH
// PHASE 6 — STEP 6.3.4
// ==========================================================

function setupHousingSearch() {
    console.log(
        "Housing is using the Universal CampusNest Search."
    );

    /*
     * The universal search engine handles searching
     * and filtering. Housing.js only renders results
     * using the existing Housing listing cards.
     *
     * Do not attach the old Housing-specific filters here.
     */
}


// ==========================================================
// RESET SEARCH
// ==========================================================

// ==========================================================
// RESET SEARCH — UNIVERSAL CAMPUSNEST SEARCH
// ==========================================================

function resetHousingSearch() {
    console.log("Resetting Universal Housing Search...");

    // Reset the shared search filters.
    if (
        typeof SearchFilters !== "undefined" &&
        typeof SearchFilters.reset === "function"
    ) {
        SearchFilters.reset();
    }

    // Clear the desktop search input.
    const desktopInput =
        document.getElementById("searchInput");

    if (desktopInput) {
        desktopInput.value = "";
    }

    // Clear the mobile search input.
    const mobileInput =
        document.getElementById("mobileSearchInput");

    if (mobileInput) {
        mobileInput.value = "";
    }

    // Restore all Housing listings through the universal engine.
    if (
        typeof campusSearch !== "undefined" &&
        typeof SearchFilters !== "undefined"
    ) {
        const filters = SearchFilters.getAll();

        const results = campusSearch.search(filters);

        filteredHousingListings = results;

        renderHousingListings(results);
    } else {
        // Safe fallback if the universal search is unavailable.
        filteredHousingListings = [
            ...allHousingListings
        ];

        renderHousingListings(filteredHousingListings);
    }

    console.log("Housing search reset completed.");
}


// ==========================================================
// FORMAT PRICE
// ==========================================================

function formatPrice(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "Price unavailable";

    }


    const numericValue =
        Number(
            String(value)
                .replace(
                    /[^0-9.]/g,
                    ""
                )
        );


    if (
        Number.isNaN(
            numericValue
        )
    ) {

        return String(value);

    }


    return new Intl.NumberFormat(
        "en-CA",
        {
            style: "currency",
            currency: "CAD",
            maximumFractionDigits: 0
        }
    ).format(
        numericValue
    );

}


// ==========================================================
// FORMAT MOVE-IN
// ==========================================================

function formatMoveIn(value) {

    if (!value) {
        return "";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return String(value);

    }


    return date.toLocaleDateString(
        "en-CA",
        {
            month: "short",
            day: "numeric",
            year: "numeric"
        }
    );

}


// ==========================================================
// FORMAT BOOLEAN
// ==========================================================

function formatBoolean(
    value,
    trueText,
    falseText
) {

    if (
        value === true ||
        value === "true" ||
        value === 1 ||
        value === "1"
    ) {

        return trueText;

    }


    return falseText;

}

function applyUniversalHousingSearch() {

    const filters =
        SearchFilters.getAll();

    const results =
        campusSearch.search(filters);

    console.log(
        "Universal Housing Search Results:",
        results
    );

    renderHousingListings(results);
}
// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeHTML(value) {

    return String(
        value ?? ""
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


// ==========================================================
// START
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    initializeHousingPage
);

