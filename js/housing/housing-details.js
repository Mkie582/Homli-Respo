// ==================================================
// CAMPUSNEST HOUSING DETAILS
// ==================================================
// PHASE 6 — STEP 6.4
// ==================================================

console.log(
    "CampusNest housing-details.js loaded."
);


// ==================================================
// STATE
// ==================================================

let currentListing = null;

let galleryImages = [];

let currentGalleryIndex = 0;


// ==================================================
// FALLBACK IMAGES
// ==================================================

const fallbackImages = [

    "assets/images/housing/apartment.jpg",

    "assets/images/housing/room.jpg",

    "assets/images/housing/student.jpg",

    "assets/images/housing/calgarys-skyline.jpg",

    "assets/images/housing/apartment.jpg"

];


// ==================================================
// DOM HELPERS
// ==================================================

function getElement(id) {

    return document.getElementById(id);

}


// ==================================================
// VALUE HELPER
// ==================================================

function firstValue(
    object,
    keys,
    fallback = ""
) {

    for (const key of keys) {

        if (
            object &&
            object[key] !== undefined &&
            object[key] !== null &&
            object[key] !== ""
        ) {

            return object[key];

        }

    }

    return fallback;

}


// ==================================================
// TEXT CLEANER
// ==================================================

function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value).trim();

}


// ==================================================
// FORMAT PRICE
// ==================================================

function formatPrice(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return "CA$—";

    }

    const numericValue =
        Number(
            String(value)
                .replace(/[^0-9.]/g, "")
        );

    if (
        Number.isNaN(numericValue)
    ) {

        return `CA$${value}`;

    }

    return new Intl.NumberFormat(
        "en-CA",
        {
            style: "currency",
            currency: "CAD",
            maximumFractionDigits: 0
        }
    ).format(numericValue);

}


// ==================================================
// FORMAT DATE
// ==================================================

function formatDate(value) {

    if (!value) {

        return "Not specified";

    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return cleanText(value);

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


// ==================================================
// IMAGE NORMALIZER
// ==================================================

function normalizeImages(listing) {

    let images = [];


    const possibleImageFields = [

        "images",

        "image_urls",

        "imageUrls",

        "photos",

        "gallery",

        "gallery_images",

        "galleryImages"

    ];


    for (
        const field
        of possibleImageFields
    ) {

        const value =
            listing?.[field];


        if (!value) {

            continue;

        }


        if (
            Array.isArray(value)
        ) {

            images.push(
                ...value
            );

            continue;

        }


        if (
            typeof value === "string"
        ) {

            try {

                const parsed =
                    JSON.parse(value);

                if (
                    Array.isArray(parsed)
                ) {

                    images.push(
                        ...parsed
                    );

                } else {

                    images.push(
                        value
                    );

                }

            } catch {

                images.push(
                    value
                );

            }

        }

    }


    // ------------------------------------------
    // SINGLE IMAGE FIELDS
    // ------------------------------------------

    const singleImage =
        firstValue(
            listing,
            [
                "image_url",
                "imageUrl",
                "image",
                "photo_url",
                "photoUrl",
                "thumbnail_url",
                "thumbnailUrl"
            ]
        );


    if (singleImage) {

        images.unshift(
            singleImage
        );

    }


    // ------------------------------------------
    // CLEAN
    // ------------------------------------------

    images =
        images
            .map(image => {

                if (
                    typeof image === "object"
                ) {

                    return firstValue(
                        image,
                        [
                            "url",
                            "image_url",
                            "src"
                        ]
                    );

                }

                return image;

            })
            .map(cleanText)
            .filter(Boolean);


    // ------------------------------------------
    // REMOVE DUPLICATES
    // ------------------------------------------

    images =
        [...new Set(images)];


    // ------------------------------------------
    // FALLBACK
    // ------------------------------------------

    if (!images.length) {

        images =
            [...fallbackImages];

    }


    return images;

}


// ==================================================
// GET LISTING ID
// ==================================================

function getListingId() {

    const params =
        new URLSearchParams(
            window.location.search
        );

    return (
        params.get("id") ||
        params.get("listing") ||
        params.get("listing_id")
    );

}


// ==================================================
// FIND LISTING
// ==================================================

async function findListing() {

    const listingId =
        getListingId();


    if (!listingId) {

        throw new Error(
            "No housing listing ID was provided."
        );

    }


    if (
        typeof HousingListings ===
        "undefined"
    ) {

        throw new Error(
            "HousingListings is not available."
        );

    }


    const listings =
        await HousingListings.getListings();


    if (
        !Array.isArray(listings)
    ) {

        throw new Error(
            "Housing listings response was invalid."
        );

    }


    const listing =
        listings.find(
            item => {

                const itemId =
                    firstValue(
                        item,
                        [
                            "id",
                            "listing_id",
                            "listingId",
                            "uuid"
                        ]
                    );

                return (
                    String(itemId) ===
                    String(listingId)
                );

            }
        );


    if (!listing) {

        throw new Error(
            "Housing listing was not found."
        );

    }


    return listing;

}


// ==================================================
// RENDER PROPERTY
// ==================================================

function renderProperty(listing) {

    currentListing =
        listing;


    galleryImages =
        normalizeImages(
            listing
        );


    // ------------------------------------------
    // BASIC INFORMATION
    // ------------------------------------------

    const title =
        firstValue(
            listing,
            [
                "title",
                "name",
                "property_name",
                "propertyName"
            ],
            "Student Housing"
        );


    const location =
        firstValue(
            listing,
            [
                "location",
                "neighborhood",
                "area",
                "address"
            ],
            "Calgary, Alberta"
        );


    const university =
        firstValue(
            listing,
            [
                "university",
                "university_name",
                "universityName"
            ],
            "University of Calgary"
        );


    const housingType =
        firstValue(
            listing,
            [
                "housing_type",
                "housingType",
                "property_type",
                "propertyType",
                "type"
            ],
            "Housing"
        );


    const roomType =
        firstValue(
            listing,
            [
                "room_type",
                "roomType",
                "room",
                "bedroom_type"
            ],
            "Private room"
        );


    const price =
        firstValue(
            listing,
            [
                "price",
                "rent",
                "monthly_rent",
                "monthlyRent",
                "budget"
            ]
        );


    const moveIn =
        firstValue(
            listing,
            [
                "move_in_date",
                "moveInDate",
                "move_in",
                "moveIn"
            ]
        );


    const furnished =
        firstValue(
            listing,
            [
                "furnished",
                "is_furnished"
            ],
            "Not specified"
        );


    const parking =
        firstValue(
            listing,
            [
                "parking",
                "parking_available"
            ],
            "Not specified"
        );


    const utilities =
        firstValue(
            listing,
            [
                "utilities",
                "utilities_included"
            ],
            "Not specified"
        );


    const description =
        firstValue(
            listing,
            [
                "description",
                "property_description",
                "details"
            ],
            "This housing listing is available for students in Calgary."
        );


    const landlordName =
        firstValue(
            listing,
            [
                "landlord_name",
                "landlordName",
                "owner_name",
                "ownerName",
                "host_name",
                "hostName"
            ],
            "Property host"
        );


    const distance =
        firstValue(
            listing,
            [
                "university_distance",
                "universityDistance",
                "distance_to_university",
                "distanceToUniversity"
            ],
            "Student-friendly location"
        );


    // ------------------------------------------
    // TITLE
    // ------------------------------------------

    const titleElement =
        getElement(
            "propertyTitle"
        );

    if (titleElement) {

        titleElement.textContent =
            title;

    }

    
    // ------------------------------------------
    // VERIFIED LISTING BADGE
    // Only show when Supabase confirms verification.
    // ------------------------------------------

    const verifiedPill =
        getElement("verifiedPill");

    if (verifiedPill) {
        if (listing.is_verified === true) {
            verifiedPill.style.display = "inline-flex";
        } else {
            verifiedPill.style.display = "none";
        }
    }



    // ------------------------------------------
    // LOCATION
    // ------------------------------------------

    const locationElement =
        getElement(
            "propertyLocation"
        );

    if (locationElement) {

        locationElement.textContent =
            location;

    }


    const sidebarLocation =
        getElement(
            "sidebarLocation"
        );

    if (sidebarLocation) {

        sidebarLocation.textContent =
            location;

    }


    const sidebarFullLocation =
        getElement(
            "sidebarFullLocation"
        );

    if (sidebarFullLocation) {

        sidebarFullLocation.textContent =
            location;

    }


    // ------------------------------------------
    // UNIVERSITY
    // ------------------------------------------

    const universityElement =
        getElement(
            "propertyUniversity"
        );

    if (universityElement) {

        universityElement.innerHTML = `

            <i class="fa-solid fa-graduation-cap"></i>

            <span>
                ${escapeHtml(university)}
            </span>

        `;

    }


    const universityName =
        getElement(
            "universityName"
        );

    if (universityName) {

        universityName.textContent =
            university;

    }


    const universityDistance =
        getElement(
            "universityDistance"
        );

    if (universityDistance) {

        universityDistance.textContent =
            distance;

    }


    // ------------------------------------------
    // DETAILS
    // ------------------------------------------

    setText(
        "housingType",
        housingType
    );


    setText(
        "roomType",
        roomType
    );


    setText(
        "furnished",
        cleanText(furnished)
    );


    setText(
        "parking",
        cleanText(parking)
    );


    setText(
        "utilities",
        cleanText(utilities)
    );


    setText(
        "moveIn",
        formatDate(moveIn)
    );


    setText(
        "sidebarMoveIn",
        formatDate(moveIn)
    );


    // ------------------------------------------
    // PRICE
    // ------------------------------------------

    setText(
        "propertyPrice",
        formatPrice(price)
    );


    // ------------------------------------------
    // DESCRIPTION
    // ------------------------------------------

    renderDescription(
        description
    );


    // ------------------------------------------
    // LANDLORD
    // ------------------------------------------

    setText(
        "landlordName",
        landlordName
    );


    // ------------------------------------------
    // GALLERY
    // ------------------------------------------

    renderGallery();


    // ------------------------------------------
    // PREFERENCES
    // ------------------------------------------

    renderPreferences(
        listing
    );


    // ------------------------------------------
    // PAGE TITLE
    // ------------------------------------------

    document.title =
        `${title} | CampusNest`;

}


// ==================================================
// SET TEXT
// ==================================================

function setText(
    id,
    value
) {

    const element =
        getElement(id);

    if (element) {

        element.textContent =
            value || "Not specified";

    }

}


// ==================================================
// DESCRIPTION
// ==================================================

function renderDescription(
    description
) {

    const container =
        getElement(
            "propertyDescription"
        );


    if (!container) {

        return;

    }


    const text =
        cleanText(description);


    if (!text) {

        container.innerHTML = `

            <p>
                No description has been provided for this listing yet.
            </p>

        `;

        return;

    }


    const paragraphs =
        text
            .split(/\n+/)
            .map(
                paragraph =>
                    paragraph.trim()
            )
            .filter(Boolean);


    container.innerHTML =
        paragraphs
            .map(
                paragraph =>
                    `<p>${escapeHtml(paragraph)}</p>`
            )
            .join("");

}


// ==================================================
// PREFERENCES
// ==================================================

function renderPreferences(
    listing
) {

    const container =
        getElement(
            "preferenceChips"
        );


    if (!container) {

        return;

    }


    const preferences = [];


    const gender =
        firstValue(
            listing,
            [
                "gender",
                "gender_preference"
            ]
        );


    const smoking =
        firstValue(
            listing,
            [
                "smoking",
                "smoking_preference"
            ]
        );


    const pets =
        firstValue(
            listing,
            [
                "pets",
                "pet_preference"
            ]
        );


    const lifestyle =
        firstValue(
            listing,
            [
                "lifestyle",
                "lifestyle_preference"
            ]
        );


    const furnished =
        firstValue(
            listing,
            [
                "furnished",
                "is_furnished"
            ]
        );


    if (gender) {

        preferences.push({

            icon:
                "fa-user-group",

            text:
                `Gender: ${gender}`

        });

    }


    if (smoking) {

        preferences.push({

            icon:
                "fa-ban-smoking",

            text:
                `Smoking: ${smoking}`

        });

    }


    if (pets) {

        preferences.push({

            icon:
                "fa-paw",

            text:
                `Pets: ${pets}`

        });

    }


    if (lifestyle) {

        preferences.push({

            icon:
                "fa-heart",

            text:
                `Lifestyle: ${lifestyle}`

        });

    }


    if (furnished) {

        preferences.push({

            icon:
                "fa-couch",

            text:
                `Furnished: ${furnished}`

        });

    }


    if (!preferences.length) {

        preferences.push({

            icon:
                "fa-circle-info",

            text:
                "No specific preferences listed"

        });

    }


    container.innerHTML =
        preferences
            .map(
                item => `

                    <span class="preference-chip">

                        <i
                            class="fa-solid ${item.icon}"
                        ></i>

                        ${escapeHtml(item.text)}

                    </span>

                `
            )
            .join("");

}


// ==================================================
// GALLERY
// ==================================================

function renderGallery() {

    const imageIds = [

        "mainPropertyImage",

        "galleryImage1",

        "galleryImage2",

        "galleryImage3",

        "galleryImage4"

    ];


    imageIds.forEach(
        (
            id,
            index
        ) => {

            const image =
                getElement(id);


            if (!image) {

                return;

            }


            const source =
                galleryImages[index] ||
                galleryImages[0] ||
                fallbackImages[index] ||
                fallbackImages[0];


            image.src =
                source;


            image.onerror =
                () => {

                    image.onerror =
                        null;

                    image.src =
                        fallbackImages[index] ||
                        fallbackImages[0];

                };

        }
    );

}


// ==================================================
// GALLERY INDEX
// ==================================================

function setGalleryImage(
    index
) {

    if (!galleryImages.length) {

        return;

    }


    currentGalleryIndex =
        (
            index +
            galleryImages.length
        ) %
        galleryImages.length;


    const image =
        getElement(
            "lightboxImage"
        );


    if (image) {

        image.src =
            galleryImages[
                currentGalleryIndex
            ];

    }


    const counter =
        getElement(
            "lightboxCounter"
        );


    if (counter) {

        counter.textContent =
            `${currentGalleryIndex + 1} / ${galleryImages.length}`;

    }

}


// ==================================================
// OPEN LIGHTBOX
// ==================================================

function openLightbox(
    index = 0
) {

    const lightbox =
        getElement(
            "galleryLightbox"
        );


    if (!lightbox) {

        return;

    }


    setGalleryImage(
        index
    );


    lightbox.classList.add(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


// ==================================================
// CLOSE LIGHTBOX
// ==================================================

function closeLightbox() {

    const lightbox =
        getElement(
            "galleryLightbox"
        );


    if (!lightbox) {

        return;

    }


    lightbox.classList.remove(
        "active"
    );


    lightbox.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


// ==================================================
// NEXT IMAGE
// ==================================================

function nextImage() {

    setGalleryImage(
        currentGalleryIndex + 1
    );

}


// ==================================================
// PREVIOUS IMAGE
// ==================================================

function previousImage() {

    setGalleryImage(
        currentGalleryIndex - 1
    );

}


// ==================================================
// ESCAPE HTML
// ==================================================

function escapeHtml(
    value
) {

    return String(value)
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


// ==================================================
// SAVE LISTING
// ==================================================


// ==================================================
// PHASE 7.7.4.2 — SUPABASE PROPERTY SAVES
// ==================================================


// --------------------------------------------------
// GET CURRENT LISTING ID
// --------------------------------------------------

function getListingStorageId() {

    if (!currentListing) {
        return null;
    }

    return firstValue(
        currentListing,
        [
            "id",
            "listing_id",
            "listingId"
        ]
    );
}


// --------------------------------------------------
// GET CURRENT AUTHENTICATED USER
// --------------------------------------------------

async function getPropertySaveStudent() {

    const {
        data: authData,
        error: authError
    } = await campusSupabase.auth.getUser();

    if (authError) {
        throw authError;
    }

    if (!authData?.user) {
        return {
            user: null,
            isStudent: false
        };
    }

    const user = authData.user;

    // Verify the user's account type.
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

    return {
        user,
        isStudent:
            String(profile?.role || "").toLowerCase() === "student"
    };

}


// --------------------------------------------------
// UPDATE BOTH SAVE BUTTONS
// --------------------------------------------------

function setPropertySaveButtonState(isSaved) {

    const buttons = [
        getElement("saveListing"),
        getElement("saveListingSidebar")
    ];

    buttons.forEach(button => {

        if (!button) {
            return;
        }

        button.classList.toggle(
            "saved",
            isSaved
        );

        button.setAttribute(
            "aria-pressed",
            String(isSaved)
        );

        if (button.id === "saveListing") {

            button.innerHTML = isSaved
                ? `
                    <i class="fa-solid fa-heart"></i>
                    <span>Saved</span>
                `
                : `
                    <i class="fa-regular fa-heart"></i>
                    <span>Save</span>
                `;

        } else {

            button.innerHTML = isSaved
                ? `
                    <i class="fa-solid fa-heart"></i>
                    Saved
                `
                : `
                    <i class="fa-regular fa-heart"></i>
                    Save listing
                `;

        }

    });

}


// --------------------------------------------------
// LOAD SAVED STATE FROM SUPABASE
// --------------------------------------------------

async function updateSaveButtons() {

    const rawListingId = getListingStorageId();
    const listingId = Number(rawListingId);

    if (
        !Number.isSafeInteger(listingId) ||
        listingId <= 0
    ) {
        console.warn(
            "Cannot check saved state: invalid listing ID."
        );
        return;
    }

    try {

        const {
            user,
            isStudent
        } = await getPropertySaveStudent();

        // Visitors who are not logged in cannot have
        // an authenticated student save record.
        if (!user || !isStudent) {

            setPropertySaveButtonState(false);
            return;

        }

        const {
            data,
            error
        } = await campusSupabase
            .from("property_saves")
            .select("id")
            .eq("listing_id", listingId)
            .eq("student_id", user.id)
            .maybeSingle();

        if (error) {
            throw error;
        }

        setPropertySaveButtonState(
            Boolean(data)
        );

        console.log(
            "Property saved state loaded:",
            Boolean(data)
        );

    } catch (error) {

        console.error(
            "Could not load property saved state:",
            error
        );

    }

}


// --------------------------------------------------
// SAVE / UNSAVE PROPERTY
// --------------------------------------------------

async function saveListing() {

    const rawListingId = getListingStorageId();
    const listingId = Number(rawListingId);

    if (
        !currentListing ||
        !Number.isSafeInteger(listingId) ||
        listingId <= 0
    ) {
        console.error(
            "Cannot save property: invalid listing."
        );
        return;
    }

    const buttons = [
        getElement("saveListing"),
        getElement("saveListingSidebar")
    ].filter(Boolean);

    // Prevent repeated clicks while Supabase responds.
    buttons.forEach(button => {
        button.disabled = true;
    });

    try {

        const {
            user,
            isStudent
        } = await getPropertySaveStudent();

        // ------------------------------------------
        // REQUIRE STUDENT LOGIN
        // ------------------------------------------

        if (!user) {

            alert(
                "Please sign in with your student account to save properties."
            );

            const currentPage =
                window.location.href;

            window.location.href =
                "student-login.html?redirect=" +
                encodeURIComponent(currentPage);

            return;
        }

        // ------------------------------------------
        // VERIFY STUDENT ROLE
        // ------------------------------------------

        if (!isStudent) {

            alert(
                "Only student accounts can save properties."
            );

            return;
        }

        // ------------------------------------------
        // CHECK EXISTING SAVE
        // ------------------------------------------

        const {
            data: existingSave,
            error: lookupError
        } = await campusSupabase
            .from("property_saves")
            .select("id")
            .eq("listing_id", listingId)
            .eq("student_id", user.id)
            .maybeSingle();

        if (lookupError) {
            throw lookupError;
        }

        // ------------------------------------------
        // REMOVE EXISTING SAVE
        // ------------------------------------------

        if (existingSave) {

            const {
                error: deleteError
            } = await campusSupabase
                .from("property_saves")
                .delete()
                .eq("listing_id", listingId)
                .eq("student_id", user.id);

            if (deleteError) {
                throw deleteError;
            }

            setPropertySaveButtonState(false);

            console.log(
                "Property removed from saved properties:",
                listingId
            );

        }

        // ------------------------------------------
        // CREATE NEW SAVE
        // ------------------------------------------

        else {

            const {
                error: insertError
            } = await campusSupabase
                .from("property_saves")
                .insert({
                    listing_id: listingId,
                    student_id: user.id
                });

            if (insertError) {
                throw insertError;
            }

            setPropertySaveButtonState(true);

            console.log(
                "Property successfully saved:",
                listingId
            );

        }

    } catch (error) {

        console.error(
            "Property save operation failed:",
            error
        );

        alert(
            "We couldn't update your saved property. Please try again."
        );

    } finally {

        buttons.forEach(button => {
            button.disabled = false;
        });

    }

}


// ==================================================
// SHARE
// ==================================================

async function shareListing() {

    if (!currentListing) {

        return;

    }


    const title =
        firstValue(
            currentListing,
            [
                "title",
                "name",
                "property_name"
            ],
            "CampusNest Housing"
        );


    const url =
        window.location.href;


    try {

        if (
            navigator.share
        ) {

            await navigator.share({

                title:
                    title,

                text:
                    "Check out this housing listing on CampusNest.",

                url:
                    url

            });

            return;

        }


        await navigator.clipboard.writeText(
            url
        );


        alert(
            "Listing link copied."
        );

    } catch (error) {

        console.log(
            "Share cancelled:",
            error
        );

    }

}


// ==================================================
// MESSAGE MODAL
// ==================================================

function openMessageModal() {

    const modal =
        getElement(
            "messageModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.add(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.style.overflow =
        "hidden";

}


function closeMessageModal() {

    const modal =
        getElement(
            "messageModal"
        );


    if (!modal) {

        return;

    }


    modal.classList.remove(
        "active"
    );


    modal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.style.overflow =
        "";

}


// ==================================================
// REPORT
// ==================================================

function reportListing() {

    alert(
        "Thank you. The reporting feature will be connected to CampusNest support in the next step."
    );

}


// ==================================================
// EVENTS
// ==================================================

function initializeEvents() {


    // ------------------------------------------
    // MAIN GALLERY
    // ------------------------------------------

    const galleryMain =
        getElement(
            "galleryMain"
        );


    if (galleryMain) {

        galleryMain.addEventListener(
            "click",
            () => {

                openLightbox(0);

            }
        );

    }


    // ------------------------------------------
    // SMALL GALLERY IMAGES
    // ------------------------------------------

    document
        .querySelectorAll(
            "[data-gallery-index]"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                button.dataset.galleryIndex
                            );


                        openLightbox(
                            index
                        );

                    }
                );

            }
        );


    // ------------------------------------------
    // LIGHTBOX
    // ------------------------------------------

    const closeButton =
        getElement(
            "lightboxClose"
        );


    const nextButton =
        getElement(
            "lightboxNext"
        );


    const previousButton =
        getElement(
            "lightboxPrev"
        );


    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeLightbox
        );

    }


    if (nextButton) {

        nextButton.addEventListener(
            "click",
            nextImage
        );

    }


    if (previousButton) {

        previousButton.addEventListener(
            "click",
            previousImage
        );

    }


    const lightbox =
        getElement(
            "galleryLightbox"
        );


    if (lightbox) {

        lightbox.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    lightbox
                ) {

                    closeLightbox();

                }

            }
        );

    }


    // ------------------------------------------
    // KEYBOARD GALLERY
    // ------------------------------------------

    document.addEventListener(
        "keydown",
        event => {

            const lightbox =
                getElement(
                    "galleryLightbox"
                );


            if (
                lightbox &&
                lightbox.classList.contains(
                    "active"
                )
            ) {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLightbox();

                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    nextImage();

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    previousImage();

                }

            }

        }
    );


    // ------------------------------------------
    // SAVE
    // ------------------------------------------

    [
        "saveListing",
        "saveListingSidebar"
    ]
        .forEach(
            id => {

                const button =
                    getElement(id);


                if (button) {

                    button.addEventListener(
                        "click",
                        saveListing
                    );

                }

            }
        );


    // ------------------------------------------
    // SHARE
    // ------------------------------------------

    const shareButton =
        getElement(
            "shareListing"
        );


    if (shareButton) {

        shareButton.addEventListener(
            "click",
            shareListing
        );

    }


    // ------------------------------------------
    // MESSAGE
    // ------------------------------------------

    [
        "contactLandlord",
        "landlordContactSecondary"
    ]
        .forEach(
            id => {

                const button =
                    getElement(id);


                if (button) {

                    button.addEventListener(
                        "click",
                        openMessageModal
                    );

                }

            }
        );


    // ------------------------------------------
    // MODAL
    // ------------------------------------------

    const modalClose =
        getElement(
            "messageModalClose"
        );


    const modalCancel =
        getElement(
            "messageModalCancel"
        );


    const modalBackdrop =
        document.querySelector(
            ".simple-modal-backdrop"
        );


    if (modalClose) {

        modalClose.addEventListener(
            "click",
            closeMessageModal
        );

    }


    if (modalCancel) {

        modalCancel.addEventListener(
            "click",
            closeMessageModal
        );

    }


    if (modalBackdrop) {

        modalBackdrop.addEventListener(
            "click",
            closeMessageModal
        );

    }


    // ------------------------------------------
    // REPORT
    // ------------------------------------------

    const reportButton =
        getElement(
            "reportListing"
        );


    if (reportButton) {

        reportButton.addEventListener(
            "click",
            reportListing
        );

    }

}


// ==================================================
// PROPERTY VIEW ANALYTICS
// PHASE 7.7.3.3
// ==================================================

function getHomliVisitorKey() {

    const storageKey = "homli_visitor_key";

    try {

        let visitorKey =
            localStorage.getItem(storageKey);

        if (visitorKey) {
            return visitorKey;
        }

        // Generate a UUID for anonymous visitors.
        if (
            window.crypto &&
            typeof window.crypto.randomUUID === "function"
        ) {

            visitorKey =
                window.crypto.randomUUID();

        } else if (
            window.crypto &&
            typeof window.crypto.getRandomValues === "function"
        ) {

            const bytes = new Uint8Array(16);

            window.crypto.getRandomValues(bytes);

            bytes[6] = (bytes[6] & 0x0f) | 0x40;
            bytes[8] = (bytes[8] & 0x3f) | 0x80;

            const hex = Array.from(bytes)
                .map(byte => byte.toString(16).padStart(2, "0"))
                .join("");

            visitorKey =
                `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;

        } else {

            throw new Error(
                "Secure UUID generation is unavailable."
            );

        }

        localStorage.setItem(
            storageKey,
            visitorKey
        );

        return visitorKey;

    } catch (error) {

        console.error(
            "Could not create or retrieve visitor ID:",
            error
        );

        return null;

    }

}


// ==================================================
// RECORD PROPERTY VIEW
// ==================================================

async function recordPropertyView(listing) {

    try {

        // Confirm that the Supabase client exists.
        if (
            typeof campusSupabase === "undefined" ||
            !campusSupabase
        ) {

            console.warn(
                "Property analytics: Supabase client unavailable."
            );

            return;

        }


        // Confirm that a valid listing ID exists.
        const listingId = Number(listing?.id);

        if (
            !Number.isSafeInteger(listingId) ||
            listingId <= 0
        ) {

            console.warn(
                "Property analytics: Invalid listing ID."
            );

            return;

        }


        // Get the anonymous visitor ID.
        const visitorKey =
            getHomliVisitorKey();

        if (!visitorKey) {

            console.warn(
                "Property analytics: Visitor ID unavailable."
            );

            return;

        }


        // Send the view to the secure Supabase function.
        const { data, error } =
            await campusSupabase.rpc(
                "record_property_view",
                {
                    p_listing_id: listingId,
                    p_visitor_key: visitorKey
                }
            );


        if (error) {

            throw error;

        }


        if (data === true) {

            console.log(
                "Property view successfully recorded."
            );

        } else {

            console.log(
                "Property view not counted. It may be a repeat visit or an excluded view."
            );

        }

    } catch (error) {

        // Analytics errors must never break the property page.
        console.error(
            "Property view tracking failed:",
            error
        );

    }

}

// ==================================================
// INITIALIZE PAGE
// ==================================================

async function initializeHousingDetails() {

    console.log(
        "Initializing CampusNest Housing Details..."
    );


    const loading =
        getElement(
            "detailsLoading"
        );


    const content =
        getElement(
            "detailsContent"
        );


    const error =
        getElement(
            "detailsError"
        );


    try {

        const listing =
            await findListing();


        console.log(
            "Housing detail listing:",
            listing
        );


        renderProperty(
            listing
        );

        // Record this property view without blocking page loading.
recordPropertyView(listing);


        if (loading) {

            loading.style.display =
                "none";

        }


        if (error) {

            error.hidden =
                true;

        }


        if (content) {

            content.hidden =
                false;

        }


        await updateSaveButtons();


        console.log(
            "CampusNest Housing Details initialized."
        );

    } catch (errorObject) {

        console.error(
            "Housing details initialization failed:",
            errorObject
        );


        if (loading) {

            loading.style.display =
                "none";

        }


        if (content) {

            content.hidden =
                true;

        }


        if (error) {

            error.hidden =
                false;

        }

    }

}


// ==================================================
// START
// ==================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeEvents();

        initializeHousingDetails();

    }
);