// ==========================================
// CAMPUSNEST HOUSING RENDERER
// PHASE 6 — STEP 6.2
// ==========================================

console.log("CampusNest housingRenderer.js loaded.");


const HousingRenderer = {

    // ======================================
    // RENDER LISTINGS
    // ======================================

    render(listings) {

        const container =
            document.getElementById("housingListings");

        const count =
            document.getElementById("housingResultsCount");


        // ==================================
        // CHECK CONTAINER
        // ==================================

        if (!container) {

            console.error(
                "Housing listings container not found."
            );

            return;
        }


        // ==================================
        // NORMALIZE LISTINGS
        // ==================================

        listings = Array.isArray(listings)
            ? listings
            : [];


        // ==================================
        // UPDATE COUNT
        // ==================================

        if (count) {

            count.textContent =
                `${listings.length} housing ${
                    listings.length === 1
                        ? "listing"
                        : "listings"
                } found`;

        }


        // ==================================
        // CLEAR CONTAINER
        // ==================================

        container.innerHTML = "";


        // ==================================
        // EMPTY STATE
        // ==================================

        if (listings.length === 0) {

            container.innerHTML = `

                <div class="housing-empty">

                    <div class="housing-empty-icon">

                        <i class="fa-solid fa-house-circle-xmark"></i>

                    </div>

                    <h3>
                        No housing found
                    </h3>

                    <p>
                        We couldn't find any active housing
                        listings matching your search.
                    </p>

                    <button
                        type="button"
                        class="housing-empty-reset"
                        id="housingEmptyReset"
                    >
                        View All Housing
                    </button>

                </div>

            `;

            return;
        }


        // ==================================
        // CREATE CARDS
        // ==================================

        listings.forEach(
            listing => {

                const card =
                    this.createCard(listing);

                container.appendChild(card);

            }
        );


        console.log(
            `Rendered ${listings.length} housing listings.`
        );

    },


    // ======================================
    // CREATE LISTING CARD
    // ======================================

    createCard(listing) {

        const card =
            document.createElement("article");


        card.className =
            "housing-listing-card";


        // ==================================
        // SAFE VALUES
        // ==================================

        const title =
            this.escapeHTML(
                listing.title ||
                "Student Housing"
            );


        const location =
            this.escapeHTML(
                listing.location ||
                "Calgary"
            );


        const university =
            this.escapeHTML(
                listing.university ||
                ""
            );


        const housingType =
            this.escapeHTML(
                listing.housing_type ||
                ""
            );


        const furnished =
            this.escapeHTML(
                listing.furnished ||
                ""
            );


        const parking =
            this.escapeHTML(
                listing.parking ||
                ""
            );


        const utilities =
            this.escapeHTML(
                listing.utilities ||
                ""
            );


        // ==================================
        // PRICE
        // ==================================

        let priceHTML = "";


        if (
            listing.budget !== null &&
            listing.budget !== undefined &&
            listing.budget !== "" &&
            Number(listing.budget) > 0
        ) {

            priceHTML = `

                <div class="housing-price">

                    <strong>
                        $${Number(
                            listing.budget
                        ).toLocaleString()}
                    </strong>

                    <span>
                        / month
                    </span>

                </div>

            `;

        } else {

            priceHTML = `

                <div class="housing-price">

                    <strong>
                        Contact
                    </strong>

                    <span>
                        for price
                    </span>

                </div>

            `;

        }


        // ==================================
        // IMAGE
        // ==================================

        const imageURL =
            typeof listing.image_url === "string"
            && listing.image_url.trim() !== ""
                ? listing.image_url.trim()
                : null;


        let imageHTML;


        if (imageURL) {

            imageHTML = `

                <img
                    src="${this.escapeAttribute(imageURL)}"
                    alt="${this.escapeAttribute(title)}"
                    class="housing-card-image-real"
                    loading="lazy"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                >

                <div
                    class="housing-card-placeholder"
                    style="display:none;"
                >

                    <i class="fa-solid fa-house"></i>

                </div>

            `;

        } else {

            imageHTML = `

                <div class="housing-card-placeholder">

                    <i class="fa-solid fa-house"></i>

                    <span>
                        CampusNest Housing
                    </span>

                </div>

            `;

        }


        // ==================================
        // VERIFIED BADGE
        // ==================================

        const verifiedHTML =
            listing.is_verified
                ? `

                    <span class="housing-verified-badge">

                        <i class="fa-solid fa-circle-check"></i>

                        Verified

                    </span>

                `
                : "";


        // ==================================
        // SAVE BUTTON
        // ==================================

        const listingId =
            this.escapeAttribute(
                String(listing.id)
            );


        // ==================================
        // BUILD CARD
        // ==================================

        card.innerHTML = `

            <div class="housing-card-image-wrapper">

                ${imageHTML}


                ${verifiedHTML}


                <button
                    type="button"
                    class="housing-card-heart"
                    data-listing-id="${listingId}"
                    aria-label="Save ${this.escapeAttribute(title)}"
                >

                    <i class="fa-regular fa-heart"></i>

                </button>

            </div>


            <div class="housing-card-content">


                <!-- TITLE -->

                <div class="housing-card-heading">

                    <h3>
                        ${title}
                    </h3>

                    <p class="housing-card-location">

                        <i class="fa-solid fa-location-dot"></i>

                        ${location}

                    </p>

                </div>


                <!-- UNIVERSITY -->

                ${
                    university
                        ? `

                            <div class="housing-card-university">

                                <i class="fa-solid fa-graduation-cap"></i>

                                ${university}

                            </div>

                        `
                        : ""
                }


                <!-- META -->

                <div class="housing-card-meta">

                    ${
                        housingType
                            ? `

                                <span>

                                    <i class="fa-solid fa-house"></i>

                                    ${housingType}

                                </span>

                            `
                            : ""
                    }


                    ${
                        furnished
                            ? `

                                <span>

                                    <i class="fa-solid fa-couch"></i>

                                    ${furnished}

                                </span>

                            `
                            : ""
                    }


                    ${
                        parking
                            ? `

                                <span>

                                    <i class="fa-solid fa-square-parking"></i>

                                    ${parking}

                                </span>

                            `
                            : ""
                    }


                    ${
                        utilities
                            ? `

                                <span>

                                    <i class="fa-solid fa-bolt"></i>

                                    ${utilities}

                                </span>

                            `
                            : ""
                    }

                </div>


                <!-- BOTTOM -->

                <div class="housing-card-bottom">

                    ${priceHTML}


                    <button
                        type="button"
                        class="view-housing-btn"
                    >

                        View Details

                        <i class="fa-solid fa-arrow-right"></i>

                    </button>

                </div>

            </div>

        `;


        // ==================================
        // CARD CLICK
        // ==================================

        card.addEventListener(
            "click",
            event => {

                // Don't navigate when heart is clicked

                if (
                    event.target.closest(
                        ".housing-card-heart"
                    )
                ) {

                    return;

                }


                window.location.href =
                    `housing-details.html?id=${encodeURIComponent(
                        listing.id
                    )}`;

            }
        );


        // ==================================
        // HEART BUTTON
        // ==================================

        const heartButton =
            card.querySelector(
                ".housing-card-heart"
            );


        if (heartButton) {

            heartButton.addEventListener(
                "click",
                event => {

                    event.stopPropagation();

                    this.toggleSavedListing(
                        listing,
                        heartButton
                    );

                }
            );


            this.updateHeartState(
                listing.id,
                heartButton
            );

        }


        return card;

    },


    // ======================================
    // SAVE / UNSAVE LISTING
    // ======================================

    toggleSavedListing(
        listing,
        button
    ) {

        let savedListings = [];


        try {

            savedListings =
                JSON.parse(
                    localStorage.getItem(
                        "campusNestSavedListings"
                    )
                ) || [];

        } catch (error) {

            console.error(
                "Could not read saved listings:",
                error
            );

            savedListings = [];

        }


        const listingId =
            String(listing.id);


        const isSaved =
            savedListings.some(
                id =>
                    String(id) === listingId
            );


        if (isSaved) {

            savedListings =
                savedListings.filter(
                    id =>
                        String(id) !== listingId
                );

        } else {

            savedListings.push(
                listing.id
            );

        }


        localStorage.setItem(
            "campusNestSavedListings",
            JSON.stringify(
                savedListings
            )
        );


        this.updateHeartState(
            listing.id,
            button
        );

    },


    // ======================================
    // UPDATE HEART
    // ======================================

    updateHeartState(
        listingId,
        button
    ) {

        if (!button) {
            return;
        }


        let savedListings = [];


        try {

            savedListings =
                JSON.parse(
                    localStorage.getItem(
                        "campusNestSavedListings"
                    )
                ) || [];

        } catch (error) {

            savedListings = [];

        }


        const isSaved =
            savedListings.some(
                id =>
                    String(id) ===
                    String(listingId)
            );


        if (isSaved) {

            button.classList.add(
                "saved"
            );


            button.innerHTML = `

                <i class="fa-solid fa-heart"></i>

            `;

        } else {

            button.classList.remove(
                "saved"
            );


            button.innerHTML = `

                <i class="fa-regular fa-heart"></i>

            `;

        }

    },


    // ======================================
    // ESCAPE HTML
    // ======================================

    escapeHTML(value) {

        return String(value ?? "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    },


    // ======================================
    // ESCAPE ATTRIBUTE
    // ======================================

    escapeAttribute(value) {

        return this.escapeHTML(value);

    }

};