
/* ==========================================================
   HOMLI — SAVED PROPERTIES
   PHASE 7.7.4.3
   Supabase Integration
========================================================== */

console.log("Homli Saved Properties loaded.");


// ==========================================================
// CONFIGURATION
// ==========================================================

const savedHousingContainer = document.getElementById(
    "savedHousingListings"
);

const savedHousingCount = document.getElementById(
    "savedHousingCount"
);

let currentStudentId = null;


// ==========================================================
// INITIALIZE SAVED PROPERTIES
// ==========================================================

async function initializeSavedHousing() {

    console.log("Initializing Supabase Saved Properties...");

    if (!savedHousingContainer) {
        console.error("Saved properties container not found.");
        return;
    }

    showSavedHousingLoading();

    try {

        // ----------------------------------------------
        // 1. VERIFY AUTHENTICATED USER
        // ----------------------------------------------

        const {
            data: authData,
            error: authError
        } = await campusSupabase.auth.getUser();

        if (authError) {
            throw authError;
        }

        if (!authData?.user) {

            const redirectURL =
                window.location.pathname +
                window.location.search;

            window.location.href =
                "student-login.html?redirect=" +
                encodeURIComponent(redirectURL);

            return;
        }

        const user = authData.user;


        // ----------------------------------------------
        // 2. VERIFY STUDENT ROLE
        // ----------------------------------------------

        const {
            data: profile,
            error: profileError
        } = await campusSupabase
            .from("profiles")
            .select("id, role")
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
            throw profileError;
        }

        if (
            !profile ||
            String(profile.role).toLowerCase() !== "student"
        ) {

            savedHousingContainer.innerHTML = `
                <div class="housing-error">
                    <div class="housing-error-icon">
                        <i class="fa-solid fa-lock"></i>
                    </div>

                    <h3>Student access required</h3>

                    <p>
                        Saved properties are available through
                        student accounts.
                    </p>

                    <a href="index.html" class="housing-empty-reset">
                        Return to Homli
                    </a>
                </div>
            `;

            if (savedHousingCount) {
                savedHousingCount.textContent =
                    "Student account required";
            }

            return;
        }

        currentStudentId = user.id;


        // ----------------------------------------------
        // 3. LOAD SAVES FROM SUPABASE
        // ----------------------------------------------

        console.log("Loading student's saved properties...");

        const {
            data: savedRecords,
            error: savesError
        } = await campusSupabase
            .from("property_saves")
            .select("listing_id, saved_at")
            .eq("student_id", currentStudentId)
            .order("saved_at", {
                ascending: false
            });

        if (savesError) {
            throw savesError;
        }


        // ----------------------------------------------
        // 4. CHECK EMPTY STATE
        // ----------------------------------------------

        if (!savedRecords || savedRecords.length === 0) {

            showSavedHousingEmpty();
            return;
        }


        // ----------------------------------------------
        // 5. LOAD ACTIVE HOUSING LISTINGS
        // ----------------------------------------------

        if (
            typeof HousingListings === "undefined" ||
            typeof HousingListings.getListings !== "function"
        ) {
            throw new Error(
                "HousingListings service is unavailable."
            );
        }

        const activeListings =
            await HousingListings.getListings();


        // ----------------------------------------------
        // 6. MATCH SAVES WITH LISTINGS
        // ----------------------------------------------

        const savedListingIds = new Set(
            savedRecords.map(function (record) {
                return String(record.listing_id);
            })
        );

        const matchingListings = activeListings.filter(
            function (listing) {
                return savedListingIds.has(String(listing.id));
            }
        );


        console.log(
            "Saved properties loaded:",
            matchingListings.length
        );


        // ----------------------------------------------
        // 7. DISPLAY RESULTS
        // ----------------------------------------------

        if (matchingListings.length === 0) {

            showSavedHousingEmpty(
                savedRecords.length
            );

            return;
        }

        renderSavedHousing(matchingListings);

        if (savedRecords.length > matchingListings.length) {

            console.log(
                "Some saved properties are no longer active."
            );

        }

    } catch (error) {

        console.error(
            "Could not load saved properties:",
            error
        );

        showSavedHousingError();

    }

}


// ==========================================================
// RENDER SAVED PROPERTIES
// ==========================================================

function renderSavedHousing(listings) {

    savedHousingContainer.innerHTML = listings.map(
        function (listing) {
            return createSavedHousingCard(listing);
        }
    ).join("");

    updateSavedHousingCount(listings.length);

}


// ==========================================================
// CREATE SAVED PROPERTY CARD
// ==========================================================

function createSavedHousingCard(listing) {

    const id = String(listing.id);

    const title =
        listing.title || "Student Housing";

    const location =
        listing.location || "Calgary";

    const image =
        listing.image_url ||
        (Array.isArray(listing.image_urls)
            ? listing.image_urls[0]
            : "");

    const budget = listing.budget;

    const verified =
        listing.is_verified === true;

    const formattedPrice =
        formatSavedHousingPrice(budget);


    const imageHTML = image
        ? `
            <img
                src="${escapeSavedHousingHTML(image)}"
                alt="${escapeSavedHousingHTML(title)}"
                class="housing-card-image-real"
                loading="lazy"
                onerror="
                    this.style.display='none';
                    this.nextElementSibling.style.display='flex';
                "
            >

            <div
                class="housing-card-placeholder"
                style="display:none;"
            >
                <i class="fa-solid fa-house"></i>
                <span>Housing image unavailable</span>
            </div>
        `
        : `
            <div class="housing-card-placeholder">
                <i class="fa-solid fa-house"></i>
                <span>Housing image unavailable</span>
            </div>
        `;


    const verifiedHTML = verified
        ? `
            <div class="housing-verified-badge">
                <i class="fa-solid fa-circle-check"></i>
                Verified
            </div>
        `
        : "";


    return `
        <article
            class="housing-listing-card"
            data-listing-id="${escapeSavedHousingHTML(id)}"
        >

            <div class="housing-card-image-wrapper">

                ${imageHTML}

                ${verifiedHTML}

                <button
                    type="button"
                    class="housing-card-heart saved"
                    data-remove-saved-id="${escapeSavedHousingHTML(id)}"
                    aria-label="Remove saved property"
                    aria-pressed="true"
                >
                    <i class="fa-solid fa-heart"></i>
                </button>

            </div>


            <div class="housing-card-content">

                <div class="housing-card-heading">

                    <h3>
                        ${escapeSavedHousingHTML(title)}
                    </h3>

                    <div class="housing-card-location">

                        <i class="fa-solid fa-location-dot"></i>

                        ${escapeSavedHousingHTML(location)}

                    </div>

                </div>


                <div class="housing-card-bottom">

                    <div class="housing-price">

                        <strong>
                            ${escapeSavedHousingHTML(formattedPrice)}
                        </strong>

                        ${
                            budget !== null &&
                            budget !== undefined &&
                            budget !== ""
                                ? "<span>/ month</span>"
                                : ""
                        }

                    </div>


                    <button
                        type="button"
                        class="view-housing-btn"
                        data-view-saved-id="${escapeSavedHousingHTML(id)}"
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
// SAVED PROPERTY EVENTS
// ==========================================================

function setupSavedHousingEvents() {

    // Use event delegation so dynamically rendered cards
    // continue working after a property is removed.

    savedHousingContainer.addEventListener(
        "click",
        async function (event) {

            // ------------------------------------------
            // REMOVE PROPERTY
            // ------------------------------------------

            const removeButton = event.target.closest(
                "[data-remove-saved-id]"
            );

            if (removeButton) {

                event.preventDefault();
                event.stopPropagation();

                const listingId =
                    removeButton.dataset.removeSavedId;

                await removeSavedHousing(
                    listingId,
                    removeButton
                );

                return;
            }


            // ------------------------------------------
            // VIEW PROPERTY
            // ------------------------------------------

            const viewButton = event.target.closest(
                "[data-view-saved-id]"
            );

            if (viewButton) {

                event.preventDefault();
                event.stopPropagation();

                const listingId =
                    viewButton.dataset.viewSavedId;

                window.location.href =
                    `housing-details.html?id=${encodeURIComponent(listingId)}`;

                return;
            }


            // ------------------------------------------
            // CLICK PROPERTY CARD
            // ------------------------------------------

            const card = event.target.closest(
                ".housing-listing-card"
            );

            if (card) {

                const listingId =
                    card.dataset.listingId;

                if (listingId) {

                    window.location.href =
                        `housing-details.html?id=${encodeURIComponent(listingId)}`;

                }

            }

        }
    );

}


// ==========================================================
// REMOVE PROPERTY FROM SUPABASE
// ==========================================================

async function removeSavedHousing(
    listingId,
    button
) {

    if (!currentStudentId) {
        return;
    }

    button.disabled = true;

    try {

        const {
            error
        } = await campusSupabase
            .from("property_saves")
            .delete()
            .eq("listing_id", Number(listingId))
            .eq("student_id", currentStudentId);

        if (error) {
            throw error;
        }


        console.log(
            "Property removed from saved properties:",
            listingId
        );


        // Remove the card from the page.
        const card = button.closest(
            ".housing-listing-card"
        );

        if (card) {
            card.remove();
        }


        // Update the visible count.
        const remainingCards =
            savedHousingContainer.querySelectorAll(
                ".housing-listing-card"
            );

        if (remainingCards.length === 0) {

            showSavedHousingEmpty();

        } else {

            updateSavedHousingCount(
                remainingCards.length
            );

        }

    } catch (error) {

        console.error(
            "Could not remove saved property:",
            error
        );

        alert(
            "We couldn't remove this property. Please try again."
        );

        button.disabled = false;

    }

}


// ==========================================================
// FORMAT PRICE
// ==========================================================

function formatSavedHousingPrice(price) {

    if (
        price === null ||
        price === undefined ||
        price === ""
    ) {
        return "Price not listed";
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
        return String(price);
    }

    return new Intl.NumberFormat("en-CA", {
        style: "currency",
        currency: "CAD",
        maximumFractionDigits: 0
    }).format(numericPrice);

}


// ==========================================================
// ESCAPE HTML
// ==========================================================

function escapeSavedHousingHTML(value) {

    return String(value).replace(/[&<>"']/g, function (character) {

        const replacements = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#39;"
        };

        return replacements[character];

    });

}


// ==========================================================
// LOADING STATE
// ==========================================================

function showSavedHousingLoading() {

    savedHousingContainer.innerHTML = `
        <div class="housing-loading">

            <div class="loading-spinner"></div>

            <p>
                Loading your saved properties...
            </p>

        </div>
    `;

    if (savedHousingCount) {
        savedHousingCount.textContent = "Loading...";
    }

}


// ==========================================================
// EMPTY STATE
// ==========================================================

function showSavedHousingEmpty(totalSaved = 0) {

    const unavailableMessage = totalSaved > 0
        ? `
            <p>
                Your saved properties are currently unavailable.
                Explore other available homes in Calgary.
            </p>
        `
        : `
            <p>
                When you find a place you like, tap the
                heart on its housing card. Your saved
                properties will appear here.
            </p>
        `;

    savedHousingContainer.innerHTML = `
        <div class="housing-empty">

            <div class="housing-empty-icon">
                <i class="fa-regular fa-heart"></i>
            </div>

            <h3>
                No saved homes yet
            </h3>

            ${unavailableMessage}

            <a
                href="housing.html"
                class="housing-empty-reset"
            >
                Explore Housing
            </a>

        </div>
    `;

    if (savedHousingCount) {
        savedHousingCount.textContent = "0 saved homes";
    }

}


// ==========================================================
// ERROR STATE
// ==========================================================

function showSavedHousingError() {

    savedHousingContainer.innerHTML = `
        <div class="housing-error">

            <div class="housing-error-icon">
                <i class="fa-solid fa-triangle-exclamation"></i>
            </div>

            <h3>
                We couldn't load your saved properties
            </h3>

            <p>
                Please check your connection and try again.
            </p>

            <button
                type="button"
                class="housing-retry-btn"
                id="retrySavedHousing"
            >
                Try Again
            </button>

        </div>
    `;

    if (savedHousingCount) {
        savedHousingCount.textContent =
            "Unable to load saved properties";
    }

    const retryButton = document.getElementById(
        "retrySavedHousing"
    );

    if (retryButton) {

        retryButton.addEventListener(
            "click",
            initializeSavedHousing
        );

    }

}


// ==========================================================
// UPDATE SAVED COUNT
// ==========================================================

function updateSavedHousingCount(count) {

    if (!savedHousingCount) {
        return;
    }

    savedHousingCount.textContent =
        count === 1
            ? "1 saved home"
            : `${count} saved homes`;

}


// ==========================================================
// START
// ==========================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        setupSavedHousingEvents();

        initializeSavedHousing();

    }
);
