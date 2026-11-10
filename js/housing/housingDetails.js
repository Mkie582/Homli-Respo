// ==========================================
// CAMPUSNEST HOUSING DETAILS
// PHASE 5 — STEP 5.1
// ==========================================

console.log("CampusNest housingDetails.js loaded.");


// ==========================================
// GET ELEMENTS
// ==========================================

const housingLoading =
    document.getElementById("housingLoading");

const housingContent =
    document.getElementById("housingContent");

const housingError =
    document.getElementById("housingError");


// ==========================================
// GET URL LISTING ID
// ==========================================

function getListingId() {

    const params =
        new URLSearchParams(window.location.search);

    const id =
        params.get("id");

    console.log("Housing listing ID:", id);

    return id;
}


// ==========================================
// SHOW LOADING
// ==========================================

function showLoading() {

    if(housingLoading){
        housingLoading.style.display = "flex";
    }

    if(housingContent){
        housingContent.style.display = "none";
    }

    if(housingError){
        housingError.style.display = "none";
    }
}


// ==========================================
// SHOW CONTENT
// ==========================================

function showContent() {

    if(housingLoading){
        housingLoading.style.display = "none";
    }

    if(housingContent){
        housingContent.style.display = "block";
    }

    if(housingError){
        housingError.style.display = "none";
    }
}


// ==========================================
// SHOW ERROR
// ==========================================

function showError() {

    if(housingLoading){
        housingLoading.style.display = "none";
    }

    if(housingContent){
        housingContent.style.display = "none";
    }

    if(housingError){
        housingError.style.display = "block";
    }
}


// ==========================================
// FORMAT PRICE
// ==========================================

function formatPrice(value) {

    if(
        value === null ||
        value === undefined ||
        value === ""
    ){
        return "—";
    }

    const number =
        Number(value);

    if(Number.isNaN(number)){
        return "—";
    }

    return `$${number.toLocaleString()} / month`;
}


// ==========================================
// FORMAT DATE
// ==========================================

function formatDate(dateValue) {

    if(!dateValue){
        return "—";
    }

    const date =
        new Date(dateValue + "T00:00:00");

    if(Number.isNaN(date.getTime())){
        return dateValue;
    }

    return date.toLocaleDateString(
        "en-CA",
        {
            year: "numeric",
            month: "long",
            day: "numeric"
        }
    );
}


// ==========================================
// SET TEXT SAFELY
// ==========================================

function setText(id, value) {

    const element =
        document.getElementById(id);

    if(!element){
        console.warn(
            `Element #${id} was not found.`
        );

        return;
    }

    element.textContent =
        value ?? "—";
}


// ==========================================
// DISPLAY LISTING
// ==========================================

function displayListing(listing) {

    console.log(
        "Displaying housing listing:",
        listing
    );


    // ======================================
    // BASIC INFORMATION
    // ======================================

    setText(
        "listingCategory",
        listing.category || "Housing"
    );

    setText(
        "listingTitle",
        listing.title || "Housing Listing"
    );

    setText(
        "listingLocation",
        listing.location || "Calgary"
    );


    // ======================================
    // PROPERTY DETAILS
    // ======================================

    setText(
        "housingType",
        listing.housing_type || "—"
    );

    setText(
        "listingBudget",
        formatPrice(listing.budget)
    );

    setText(
        "listingMoveIn",
        formatDate(listing.move_in)
    );

    setText(
        "listingFurnished",
        listing.furnished || "—"
    );

    setText(
        "listingParking",
        listing.parking || "—"
    );

    setText(
        "listingUtilities",
        listing.utilities || "—"
    );


    // ======================================
    // UNIVERSITY
    // ======================================

    setText(
        "listingUniversity",
        listing.university || "—"
    );


    // ======================================
    // LIVING PREFERENCES
    // ======================================

    setText(
        "listingGender",
        listing.gender || "—"
    );

    setText(
        "listingLifestyle",
        listing.lifestyle || "—"
    );

    setText(
        "listingSmoking",
        listing.smoking || "—"
    );

    setText(
        "listingPets",
        listing.pets || "—"
    );


    // ======================================
    // SIDEBAR
    // ======================================

    setText(
        "sidebarPrice",
        formatPrice(listing.budget)
    );

    setText(
        "sidebarLocation",
        listing.location || "Calgary"
    );


    // ======================================
    // VERIFIED BADGE
    // ======================================

    const verifiedBadge =
        document.getElementById("verifiedBadge");

    if(verifiedBadge){

        if(listing.is_verified){

            verifiedBadge.style.display =
                "inline-flex";

        }else{

            verifiedBadge.style.display =
                "none";
        }
    }

    // ======================================
// CONTACT LANDLORD → CAMPUSNEST CHAT
// PHASE 5 — STEP 5.4.1
// ======================================

const contactButton =
    document.getElementById(
        "contactLandlordBtn"
    );

if(contactButton){

    contactButton.addEventListener(
        "click",
        () => {

            console.log(
                "Opening CampusNest chat for listing:",
                listing.id
            );


            window.location.href =
                `chat.html?listing=${encodeURIComponent(
                    listing.id
                )}`;

        }
    );
}

    // ======================================
    // SAVE LISTING
    // ======================================

    const saveButton =
        document.getElementById(
            "saveListingBtn"
        );

    if(saveButton){

        saveButton.addEventListener(
            "click",
            () => {

                saveListing(listing);

            }
        );
    }


    // ======================================
    // SHOW PAGE
    // ======================================

    showContent();
}


// ==========================================
// SAVE LISTING
// ==========================================

function saveListing(listing) {

    let savedListings = [];

    try {

        savedListings =
            JSON.parse(
                localStorage.getItem(
                    "campusNestSavedListings"
                )
            ) || [];

    } catch(error){

        console.error(
            "Could not read saved listings:",
            error
        );

        savedListings = [];
    }


    const listingId =
        String(listing.id);


    const alreadySaved =
        savedListings.some(
            id => String(id) === listingId
        );


    if(alreadySaved){

        savedListings =
            savedListings.filter(
                id => String(id) !== listingId
            );

        localStorage.setItem(
            "campusNestSavedListings",
            JSON.stringify(savedListings)
        );

        updateSaveButton(false);

        return;
    }


    savedListings.push(
        listing.id
    );


    localStorage.setItem(
        "campusNestSavedListings",
        JSON.stringify(savedListings)
    );


    updateSaveButton(true);
}


// ==========================================
// UPDATE SAVE BUTTON
// ==========================================

function updateSaveButton(isSaved) {

    const button =
        document.getElementById(
            "saveListingBtn"
        );

    if(!button){
        return;
    }


    if(isSaved){

        button.innerHTML = `
            <i class="fa-solid fa-heart"></i>
            Saved
        `;

    }else{

        button.innerHTML = `
            <i class="fa-regular fa-heart"></i>
            Save Listing
        `;
    }
}


// ==========================================
// CHECK IF LISTING IS SAVED
// ==========================================

function checkSavedState(listing) {

    let savedListings = [];

    try {

        savedListings =
            JSON.parse(
                localStorage.getItem(
                    "campusNestSavedListings"
                )
            ) || [];

    } catch(error){

        savedListings = [];
    }


    const isSaved =
        savedListings.some(
            id =>
                String(id) ===
                String(listing.id)
        );


    updateSaveButton(isSaved);
}


// ==========================================
// LOAD LISTING FROM SUPABASE
// ==========================================

async function loadHousingListing() {

    console.log(
        "Loading CampusNest housing listing..."
    );


    showLoading();


    // ======================================
    // GET ID
    // ======================================

    const listingId =
        getListingId();


    if(!listingId){

        console.error(
            "No housing listing ID was provided."
        );

        showError();

        return;
    }


    // ======================================
    // QUERY SUPABASE
    // ======================================

    try {

        console.log(
            "Searching Supabase for listing:",
            listingId
        );


        const {
            data,
            error
        } = await campusSupabase
            .from("listings")
            .select("*")
            .eq("id", listingId)
            .eq("category", "Housing")
            .eq("is_active", true)
            .single();


        // ==================================
        // SUPABASE ERROR
        // ==================================

        if(error){

            console.error(
                "Supabase housing listing error:",
                error
            );

            showError();

            return;
        }


        // ==================================
        // NO LISTING
        // ==================================

        if(!data){

            console.error(
                "Housing listing not found."
            );

            showError();

            return;
        }


        // ==================================
        // LISTING FOUND
        // ==================================

        console.log(
            "Housing listing found:",
            data
        );


        displayListing(data);

        checkSavedState(data);


    } catch(error){

        console.error(
            "Failed to load housing listing:",
            error
        );

        showError();
    }
}


// ==========================================
// INITIALIZE
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    loadHousingListing
);

// ==========================================
// CAMPUSNEST PROPERTY GALLERY
// PHASE 5 — STEP 5.3
// ==========================================


const HousingGallery = {

    images: [
        "assets/images/housing/roommates.jpg",
        "assets/images/housing/job.jpg",
        "assets/images/housing/student.jpg",
        "assets/images/housing/calgarys-skyline.jpg",
        "assets/images/housing/apartment.jpg"
    ],

    currentIndex: 0,


    // ======================================
    // INITIALIZE
    // ======================================

    init() {

        console.log(
            "CampusNest Housing Gallery initialized."
        );


        this.mainImage =
            document.getElementById(
                "mainGalleryImage"
            );

        this.mainImageButton =
            document.getElementById(
                "mainGalleryImageButton"
            );

        this.counter =
            document.getElementById(
                "galleryCounter"
            );

        this.prevButton =
            document.getElementById(
                "galleryPrev"
            );

        this.nextButton =
            document.getElementById(
                "galleryNext"
            );

        this.thumbnails =
            document.querySelectorAll(
                ".gallery-thumbnail"
            );


        this.lightbox =
            document.getElementById(
                "galleryLightbox"
            );

        this.lightboxImage =
            document.getElementById(
                "lightboxImage"
            );

        this.lightboxClose =
            document.getElementById(
                "lightboxClose"
            );

        this.lightboxPrev =
            document.getElementById(
                "lightboxPrev"
            );

        this.lightboxNext =
            document.getElementById(
                "lightboxNext"
            );


        if(!this.mainImage){

            console.warn(
                "Housing gallery elements not found."
            );

            return;
        }


        this.setupEvents();

        this.showImage(0);

    },


    // ======================================
    // EVENTS
    // ======================================

    setupEvents() {


        // Previous image

        if(this.prevButton){

            this.prevButton.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    this.previous();

                }
            );

        }


        // Next image

        if(this.nextButton){

            this.nextButton.addEventListener(
                "click",
                (event) => {

                    event.stopPropagation();

                    this.next();

                }
            );

        }


        // Thumbnail buttons

        this.thumbnails.forEach(
            thumbnail => {

                thumbnail.addEventListener(
                    "click",
                    () => {

                        const index =
                            Number(
                                thumbnail.dataset.index
                            );

                        this.showImage(index);

                    }
                );

            }
        );


        // Open lightbox

        if(this.mainImageButton){

            this.mainImageButton.addEventListener(
                "click",
                () => {

                    this.openLightbox();

                }
            );

        }


        // Close lightbox

        if(this.lightboxClose){

            this.lightboxClose.addEventListener(
                "click",
                () => {

                    this.closeLightbox();

                }
            );

        }


        // Lightbox previous

        if(this.lightboxPrev){

            this.lightboxPrev.addEventListener(
                "click",
                () => {

                    this.previous();

                }
            );

        }


        // Lightbox next

        if(this.lightboxNext){

            this.lightboxNext.addEventListener(
                "click",
                () => {

                    this.next();

                }
            );

        }


        // Click background to close

        if(this.lightbox){

            this.lightbox.addEventListener(
                "click",
                (event) => {

                    if(
                        event.target ===
                        this.lightbox
                    ){

                        this.closeLightbox();

                    }

                }
            );

        }


        // Keyboard controls

        document.addEventListener(
            "keydown",
            (event) => {

                if(
                    !this.lightbox ||
                    !this.lightbox.classList.contains(
                        "active"
                    )
                ){

                    return;

                }


                if(event.key === "Escape"){

                    this.closeLightbox();

                }


                if(event.key === "ArrowLeft"){

                    this.previous();

                }


                if(event.key === "ArrowRight"){

                    this.next();

                }

            }
        );

    },


    // ======================================
    // SHOW IMAGE
    // ======================================

    showImage(index) {

        if(
            !this.images.length ||
            !this.mainImage
        ){

            return;
        }


        if(index < 0){

            index =
                this.images.length - 1;

        }


        if(
            index >=
            this.images.length
        ){

            index = 0;

        }


        this.currentIndex =
            index;


        const image =
            this.images[
                this.currentIndex
            ];


        this.mainImage.src =
            image;


        this.mainImage.alt =
            `Housing property image ${
                this.currentIndex + 1
            }`;


        if(this.counter){

            this.counter.textContent =
                `${this.currentIndex + 1} / ${
                    this.images.length
                }`;

        }


        // Update thumbnails

        this.thumbnails.forEach(
            thumbnail => {

                const thumbnailIndex =
                    Number(
                        thumbnail.dataset.index
                    );


                thumbnail.classList.toggle(
                    "active",
                    thumbnailIndex ===
                    this.currentIndex
                );

            }
        );


        // Update lightbox image

        if(this.lightboxImage){

            this.lightboxImage.src =
                image;

            this.lightboxImage.alt =
                `Housing property image ${
                    this.currentIndex + 1
                }`;

        }

    },


    // ======================================
    // NEXT
    // ======================================

    next() {

        this.showImage(
            this.currentIndex + 1
        );

    },


    // ======================================
    // PREVIOUS
    // ======================================

    previous() {

        this.showImage(
            this.currentIndex - 1
        );

    },


    // ======================================
    // OPEN LIGHTBOX
    // ======================================

    openLightbox() {

        if(!this.lightbox){

            return;
        }


        this.lightbox.classList.add(
            "active"
        );


        this.lightbox.setAttribute(
            "aria-hidden",
            "false"
        );


        document.body.style.overflow =
            "hidden";


        this.showImage(
            this.currentIndex
        );

    },


    // ======================================
    // CLOSE LIGHTBOX
    // ======================================

    closeLightbox() {

        if(!this.lightbox){

            return;
        }


        this.lightbox.classList.remove(
            "active"
        );


        this.lightbox.setAttribute(
            "aria-hidden",
            "true"
        );


        document.body.style.overflow =
            "";

    }

};


// ==========================================
// INITIALIZE HOUSING GALLERY
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        HousingGallery.init();

    }
);