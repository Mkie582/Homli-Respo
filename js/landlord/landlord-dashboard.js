
/* ==========================================
   CAMPUSNEST LANDLORD DASHBOARD
   Phase 7 - Step 7.4
   Add Property Form Interactions
   ========================================== */

let landlordUser = null;

const LandlordDashboard = {
    initialized: false,
isSubmitting: false,
selectedPropertyImages: [],
existingPropertyImageUrls: [],
removedPropertyImageUrls: [],

    async init() {
        if (this.initialized) return;
        this.initialized = true;

        this.bindEvents();
        await this.initializeLandlordDashboard();
        
        // ==========================================
        // PROPERTY IMAGE PICKER EVENTS
        // ==========================================

        const imageInput = document.getElementById("propertyImages");
        const imagePreviewContainer = document.getElementById(
            "propertyImagePreviews"
        );

        if (imageInput) {
            imageInput.addEventListener("change", (event) => {
                this.handlePropertyImageSelection(event);
            });
        }

        if (imagePreviewContainer) {
            imagePreviewContainer.addEventListener("click", (event) => {

    if (!(event.target instanceof Element)) {
        return;
    }

    const removeButton = event.target.closest(
        "[data-remove-property-image]"
    );

    if (!removeButton) return;

    const index = Number(
        removeButton.dataset.removePropertyImage
    );

    this.removePropertyImage(index);

});
        }

        const existingImagesContainer = document.getElementById(
    "existingPropertyImages"
);

if (existingImagesContainer) {
    existingImagesContainer.addEventListener("click", (event) => {
        if (!(event.target instanceof Element)) {
            return;
        }

        const removeButton = event.target.closest(
            "[data-remove-existing-property-image]"
        );

        if (!removeButton) return;

        const index = Number(
            removeButton.dataset.removeExistingPropertyImage
        );

        this.removeExistingPropertyImage(index);
    });
}

    },

    /* ==========================================
       EVENT LISTENERS
       ========================================== */

    
bindEvents() {

    // ======================================
    // AUTHENTICATION AND NAVIGATION
    // ======================================

    document.getElementById("logoutButton")
        ?.addEventListener("click", () => this.logout());

    // Sidebar sign-out button
document.getElementById("sidebarLogoutButton")
    ?.addEventListener("click", () => this.logout());

// Mobile sidebar open button
document.getElementById("sidebarToggle")
    ?.addEventListener("click", () => this.toggleSidebar());

// Mobile sidebar backdrop
document.getElementById("sidebarBackdrop")
    ?.addEventListener("click", () => this.closeSidebar());

// Sidebar navigation
document.querySelectorAll("[data-dashboard-nav]")
    .forEach((button) => {
        button.addEventListener("click", () => {
            this.handleDashboardNavigation(
                button.dataset.dashboardNav
            );
        });
    });

    // PROPERTY ANALYTICS PERIOD SELECTOR
document.getElementById("analyticsPeriod")
    ?.addEventListener("change", (event) => {
        this.loadPropertyAnalytics(
            Number(event.target.value)
        );
    });

// Close the mobile sidebar with Escape
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        this.closeSidebar();
    }
});

    document.getElementById("messagesButton")
        ?.addEventListener("click", () => {
            window.location.href = "chat.html?listing=1";
        });

    document.getElementById("propertiesButton")
        ?.addEventListener("click", () => this.showProperties());

    document.getElementById("retryPropertiesButton")
        ?.addEventListener("click", () => this.loadProperties());


    // ======================================
    // ADD PROPERTY FORM
    // ======================================

    document.getElementById("addPropertyButton")
        ?.addEventListener("click", () => this.showPropertyForm());

    document.getElementById("cancelAddPropertyButton")
        ?.addEventListener("click", () => this.hidePropertyForm());

    document.getElementById("cancelAddPropertyButtonBottom")
        ?.addEventListener("click", () => this.hidePropertyForm());

    document.getElementById("addPropertyForm")
        ?.addEventListener("submit", (event) => {
            this.validatePropertyForm(event);
        });

    document.getElementById("addPropertyForm")
        ?.addEventListener("input", () => {
            this.clearPropertyFormMessage();
        });

    document.getElementById("addPropertyForm")
        ?.addEventListener("change", () => {
            this.clearPropertyFormMessage();
        });


    // ======================================
    // PROPERTY MANAGEMENT EVENT DELEGATION
    // ======================================

    const propertiesContainer = document.getElementById(
        "landlordPropertiesList"
    );

    if (propertiesContainer) {

        propertiesContainer.addEventListener("click", (event) => {

            // Ignore targets that cannot be used with closest().
            if (!(event.target instanceof Element)) {
                return;
            }

            // ----------------------------------
            // EDIT PROPERTY
            // ----------------------------------

            const editButton = event.target.closest(
                "[data-edit-property]"
            );

            if (
                editButton &&
                propertiesContainer.contains(editButton)
            ) {
                this.openEditProperty(
                    editButton.dataset.editProperty
                );

                return;
            }


            // ----------------------------------
            // ACTIVATE / DEACTIVATE PROPERTY
            // ----------------------------------

            const statusButton = event.target.closest(
                "[data-toggle-property]"
            );

            if (
                statusButton &&
                propertiesContainer.contains(statusButton)
            ) {
                this.togglePropertyStatus(
                    statusButton.dataset.toggleProperty,
                    statusButton
                );

                return;
            }


            // ----------------------------------
            // DELETE PROPERTY
            // ----------------------------------

            const deleteButton = event.target.closest(
                "[data-delete-property]"
            );

            if (
                deleteButton &&
                propertiesContainer.contains(deleteButton)
            ) {
                this.deleteProperty(
                    deleteButton.dataset.deleteProperty,
                    deleteButton
                );

                return;
            }

        });

    }

    
    // ==========================================
    // DASHBOARD OVERVIEW BUTTONS
    // ==========================================

    document.getElementById("overviewAddPropertyButton")
        ?.addEventListener("click", () => {
            this.showPropertyForm("add");
        });

    document.getElementById("quickAddPropertyButton")
        ?.addEventListener("click", () => {
            this.showPropertyForm("add");
        });

    document.getElementById("overviewViewPropertiesButton")
        ?.addEventListener("click", () => {
            this.showProperties();
        });

    document.getElementById("quickViewPropertiesButton")
        ?.addEventListener("click", () => {
            this.showProperties();
        });

    document.getElementById("quickOpenMessagesButton")
        ?.addEventListener("click", () => {
            window.location.href = "chat.html?listing=1";
        });

    document.getElementById("overviewViewMessagesButton")
        ?.addEventListener("click", () => {
            window.location.href = "chat.html?listing=1";
        });

},

/* ==========================================
   SIDEBAR AND DASHBOARD NAVIGATION
   ========================================== */

toggleSidebar() {
    const sidebar = document.getElementById("landlordSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const toggle = document.getElementById("sidebarToggle");

    if (!sidebar || !backdrop || !toggle) return;

    const isOpen = sidebar.classList.contains("is-open");

    if (isOpen) {
        this.closeSidebar();
    } else {
        sidebar.classList.add("is-open");
        backdrop.classList.add("is-visible");

        toggle.setAttribute("aria-expanded", "true");
        toggle.setAttribute("aria-label", "Close navigation menu");

        document.body.style.overflow = "hidden";
    }
},

closeSidebar() {
    const sidebar = document.getElementById("landlordSidebar");
    const backdrop = document.getElementById("sidebarBackdrop");
    const toggle = document.getElementById("sidebarToggle");

    if (sidebar) {
        sidebar.classList.remove("is-open");
    }

    if (backdrop) {
        backdrop.classList.remove("is-visible");
    }

    if (toggle) {
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "Open navigation menu");
    }

    document.body.style.overflow = "";
},

handleDashboardNavigation(section) {
    // Update the active sidebar item.
    document.querySelectorAll("[data-dashboard-nav]")
        .forEach((button) => {
            const isActive =
                button.dataset.dashboardNav === section;

            button.classList.toggle("is-active", isActive);

            if (isActive) {
                button.setAttribute("aria-current", "page");
            } else {
                button.removeAttribute("aria-current");
            }
        });

    // Close the mobile drawer after selecting a section.
    this.closeSidebar();

    switch (section) {

        case "overview":
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
            break;

        case "properties":
            this.showProperties();
            break;

        case "add-property":
            this.showPropertyForm();
            break;

        case "messages":
            window.location.href = "chat.html?listing=1";
            break;

        default:
            console.warn(
                "Unknown dashboard section:",
                section
            );
    }
},

    /* ==========================================
       AUTHENTICATION AND DASHBOARD
       ========================================== */

    async initializeLandlordDashboard() {
        try {
            const { data, error } =
                await campusSupabase.auth.getUser();

            if (error || !data?.user) {
                this.redirectToLogin();
                return;
            }

            landlordUser = data.user;

            const { data: profile, error: profileError } =
                await campusSupabase
                    .from("profiles")
                    .select("id, first_name, last_name, email, role")
                    .eq("id", landlordUser.id)
                    .single();

            if (
                profileError ||
                !profile ||
                profile.role !== "landlord"
            ) {
                await campusSupabase.auth.signOut();
                this.redirectToLogin();
                return;
            }

            const fullName = [
                profile.first_name,
                profile.last_name
            ].filter(Boolean).join(" ");

            const landlordName = document.getElementById("landlordName");
            const welcomeName = document.getElementById("welcomeName");
            const landlordEmail = document.getElementById("landlordEmail");
            const dashboardLoading =
                document.getElementById("dashboardLoading");
            const dashboardContent =
                document.getElementById("dashboardContent");

            if (landlordName) {
                landlordName.textContent = fullName || "Landlord";
            }

            const sidebarLandlordName = document.getElementById(
    "sidebarLandlordName"
);

if (sidebarLandlordName) {
    sidebarLandlordName.textContent = fullName || "Landlord";
}

            if (welcomeName) {
                welcomeName.textContent =
                    profile.first_name || "there";
            }

            if (landlordEmail) {
                landlordEmail.textContent =
                    profile.email || landlordUser.email || "";
            }

            if (dashboardLoading) {
                dashboardLoading.style.display = "none";
            }

            if (dashboardContent) {
                dashboardContent.style.display = "block";
            }

            // Load real Supabase data for the dashboard overview.
await this.loadDashboardOverview();

            console.log("CampusNest landlord dashboard ready.");

        } catch (error) {
            console.error(
                "Dashboard initialization failed:",
                error
            );

            const loading =
                document.getElementById("dashboardLoading");

            if (loading) {
                loading.textContent =
                    "We couldn't load your dashboard. Please refresh the page.";
            }
        }
    },

    async logout() {
        const button = document.getElementById("logoutButton");

        if (button) button.disabled = true;

        try {
            const { error } =
                await campusSupabase.auth.signOut();

            if (error) throw error;

            window.location.href = "landlord-login.html";

        } catch (error) {
            console.error("Logout failed:", error);

            if (button) button.disabled = false;

            alert("We couldn't log you out. Please try again.");
        }
    },

    redirectToLogin() {
        window.location.href = "landlord-login.html";
    },

    /* ==========================================
       MY PROPERTIES SECTION
       ========================================== */

    showProperties() {
        const section = document.getElementById(
            "landlordPropertiesSection"
        );

        if (!section) {
            console.error(
                "Missing #landlordPropertiesSection in landlord-dashboard.html"
            );
            return;
        }

        section.classList.add("is-visible");

        section.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });

        this.loadProperties();
    },

    
async loadProperties() {

    const section = document.getElementById(
        "landlordPropertiesSection"
    );

    const message = document.getElementById(
        "propertyListMessage"
    );

    const container = document.getElementById(
        "landlordPropertiesList"
    );

    // --------------------------------------
    // CHECK REQUIRED ELEMENTS AND USER
    // --------------------------------------

    if (!message || !container) {
        console.error(
            "The landlord properties section is incomplete."
        );
        return;
    }

    if (!landlordUser?.id) {
        console.error(
            "No authenticated landlord is available."
        );

        message.className =
            "property-list-message is-error";

        message.textContent =
            "Your landlord session could not be verified. Please sign in again.";

        return;
    }

    // --------------------------------------
    // GET CURRENT AUTHENTICATED USER
    // --------------------------------------

    message.className =
        "property-list-message is-loading";

    message.textContent =
        "Verifying your account and loading your properties...";

    container.replaceChildren();

    try {

        const {
            data: authData,
            error: authError
        } = await campusSupabase.auth.getUser();

        if (
            authError ||
            !authData?.user ||
            authData.user.id !== landlordUser.id
        ) {
            throw new Error(
                "Your landlord session could not be verified."
            );
        }

        const currentUser = authData.user;

        // ----------------------------------
        // VERIFY LANDLORD ROLE
        // ----------------------------------

        const {
            data: profile,
            error: profileError
        } = await campusSupabase
            .from("profiles")
            .select("id, role")
            .eq("id", currentUser.id)
            .single();

        if (
            profileError ||
            !profile ||
            profile.id !== currentUser.id ||
            profile.role !== "landlord"
        ) {
            throw new Error(
                "This account is not authorized to manage landlord properties."
            );
        }

        // ----------------------------------
        // LOAD ONLY THIS LANDLORD'S LISTINGS
        // ----------------------------------

        const {
            data,
            error
        } = await campusSupabase
            .from("listings")
            .select(`
                id,
                owner_id,
                title,
                category,
                location,
                budget,
                availability,
                housing_type,
                description,
                image_url,
                image_urls,
                is_active,
                is_verified,
                created_at,
                updated_at
            `)
            .eq("owner_id", currentUser.id)
            .eq("category", "Housing")
            .order("created_at", {
                ascending: false
            });

        if (error) throw error;

        // ----------------------------------
        // HANDLE EMPTY PORTFOLIO
        // ----------------------------------

        if (!data || data.length === 0) {

            message.className =
                "property-list-message";

            message.textContent =
                "Your property portfolio is empty. Your first listing will appear here once you add it.";

            this.updatePropertyCount(0);

            section?.classList.remove("has-properties");

            return;
        }

        // ----------------------------------
        // ADD PROPERTY CARDS
        // ----------------------------------

        data.forEach((listing, index) => {

            // Additional client-side ownership check.
            if (listing.owner_id !== currentUser.id) {
                console.warn(
                    "A listing with unexpected ownership was excluded:",
                    listing.id
                );
                return;
            }

            container.appendChild(
                this.createPropertyCard(listing, index)
            );

        });

        const visibleCount =
            container.children.length;

        this.updatePropertyCount(visibleCount);
        await this.loadDashboardOverview();

        message.className =
            "property-list-message";

        message.textContent =
            `${visibleCount} ${
                visibleCount === 1
                    ? "property"
                    : "properties"
            } in your portfolio`;

        section?.classList.toggle(
            "has-properties",
            visibleCount > 0
        );

    } catch (error) {

        console.error(
            "Unable to load landlord properties:",
            error
        );

        container.replaceChildren();

        message.className =
            "property-list-message is-error";

        message.textContent =
            error.message ||
            "We couldn't load your properties. Please try again.";

        const retryButton =
            document.createElement("button");

        retryButton.type = "button";

        retryButton.className =
            "dashboard-button dashboard-button-secondary";

        retryButton.textContent =
            "Try again";

        retryButton.addEventListener(
            "click",
            () => this.loadProperties()
        );

        message.appendChild(
            document.createTextNode(" ")
        );

        message.appendChild(retryButton);

    }

},


    // ======================================
    // VERIFY LANDLORD BEFORE MANAGEMENT
    // ======================================

    async verifyManagementAccess() {
        const {
            data: authData,
            error: authError
        } = await campusSupabase.auth.getUser();

        if (
            authError ||
            !authData?.user ||
            !landlordUser?.id ||
            authData.user.id !== landlordUser.id
        ) {
            throw new Error(
                "Your session could not be verified. Please sign in again."
            );
        }

        const {
            data: profile,
            error: profileError
        } = await campusSupabase
            .from("profiles")
            .select("id, role")
            .eq("id", authData.user.id)
            .single();

        if (
            profileError ||
            !profile ||
            profile.id !== authData.user.id ||
            profile.role !== "landlord"
        ) {
            throw new Error(
                "You are not authorized to manage properties."
            );
        }

        return authData.user;
    },

    // ======================================
    // ACTIVATE / DEACTIVATE PROPERTY
    // ======================================

    async togglePropertyStatus(listingId, button) {
        if (button.disabled) return;

        const id = Number(listingId);

        if (!Number.isSafeInteger(id) || id < 1) {
            alert("Invalid property ID.");
            return;
        }

        const originalText = button.textContent;

        button.disabled = true;
        button.textContent = "Updating...";

        try {
            const user = await this.verifyManagementAccess();

            // Read the current status of this landlord's listing.
            const {
                data: listing,
                error: fetchError
            } = await campusSupabase
                .from("listings")
                .select("id, owner_id, is_active")
                .eq("id", id)
                .eq("owner_id", user.id)
                .eq("category", "Housing")
                .single();

            if (fetchError || !listing) {
                throw new Error(
                    "Property not found or you do not have permission to manage it."
                );
            }

            if (listing.owner_id !== user.id) {
                throw new Error(
                    "You cannot manage another landlord's property."
                );
            }

            const nextStatus = !listing.is_active;

            const {
                data: updatedListing,
                error: updateError
            } = await campusSupabase
                .from("listings")
                .update({
                    is_active: nextStatus,
                    updated_at: new Date().toISOString()
                })
                .eq("id", id)
                .eq("owner_id", user.id)
                .eq("category", "Housing")
                .select("id, is_active")
                .single();

            if (updateError) throw updateError;

            if (
                !updatedListing ||
                updatedListing.is_active !== nextStatus
            ) {
                throw new Error(
                    "The property status could not be confirmed."
                );
            }

            console.log(
                `Property ${id} is now ${nextStatus ? "active" : "inactive"}.`
            );

            await this.loadProperties();

        } catch (error) {
            console.error(
                "Property status update failed:",
                error
            );

            alert(
                error.message ||
                "Unable to update this property's status."
            );

            button.disabled = false;
            button.textContent = originalText;
        }
    },

    // ======================================
    // DELETE PROPERTY AND ITS IMAGES
    // ======================================

    async deleteProperty(listingId, button) {
        if (button.disabled) return;

        const id = Number(listingId);

        if (!Number.isSafeInteger(id) || id < 1) {
            alert("Invalid property ID.");
            return;
        }

        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this property? This action cannot be undone."
        );

        if (!confirmed) return;

        const originalText = button.textContent;

        button.disabled = true;
        button.textContent = "Deleting...";

        try {
            const user = await this.verifyManagementAccess();

            // Fetch the listing first so we can verify ownership
            // and collect its image URLs for storage cleanup.
            const {
                data: listing,
                error: fetchError
            } = await campusSupabase
                .from("listings")
                .select("id, owner_id, image_url, image_urls")
                .eq("id", id)
                .eq("owner_id", user.id)
                .eq("category", "Housing")
                .single();

            if (fetchError || !listing) {
                throw new Error(
                    "Property not found or you do not have permission to delete it."
                );
            }

            if (listing.owner_id !== user.id) {
                throw new Error(
                    "You cannot delete another landlord's property."
                );
            }

            // Delete only the listing owned by this landlord.
            const {
                data: deletedListing,
                error: deleteError
            } = await campusSupabase
                .from("listings")
                .delete()
                .eq("id", id)
                .eq("owner_id", user.id)
                .eq("category", "Housing")
                .select("id")
                .maybeSingle();

            if (deleteError) throw deleteError;

            if (!deletedListing) {
                throw new Error(
                    "The property was not deleted. Please refresh and try again."
                );
            }

            // The database record is now deleted.
            // Clean up its images from the public storage bucket.
            const imageUrls = [
                ...(Array.isArray(listing.image_urls)
                    ? listing.image_urls
                    : []),
                listing.image_url
            ].filter(Boolean);

            const storagePaths = [];

            for (const imageUrl of imageUrls) {
                try {
                    const parsedUrl = new URL(imageUrl);

                    const marker =
                        "/storage/v1/object/public/property-images/";

                    const markerIndex =
                        parsedUrl.pathname.indexOf(marker);

                    if (markerIndex === -1) continue;

                    const path = decodeURIComponent(
                        parsedUrl.pathname.slice(
                            markerIndex + marker.length
                        )
                    );

                    // Only remove files inside this landlord's folder.
                    if (path.startsWith(`${user.id}/`)) {
                        storagePaths.push(path);
                    }

                } catch (imageError) {
                    console.warn(
                        "Could not interpret a property image URL:",
                        imageError
                    );
                }
            }

            const uniquePaths = [...new Set(storagePaths)];

            if (uniquePaths.length > 0) {
                const {
                    error: storageError
                } = await campusSupabase
                    .storage
                    .from("property-images")
                    .remove(uniquePaths);

                if (storageError) {
                    console.warn(
                        "Property deleted, but some stored images could not be removed:",
                        storageError
                    );
                }
            }

            alert("Your property has been deleted.");

            await this.loadProperties();

        } catch (error) {
            console.error(
                "Property deletion failed:",
                error
            );

            alert(
                error.message ||
                "Unable to delete this property."
            );

            button.disabled = false;
            button.textContent = originalText;
        }
    },

    
async openEditProperty(listingId) {

    const id = Number(listingId);

    if (!Number.isSafeInteger(id) || id < 1) {
        alert("Invalid property ID.");
        return;
    }

    try {

        // ======================================
        // 1. VERIFY THE SIGNED-IN LANDLORD
        // ======================================

        const user = await this.verifyManagementAccess();

        // ======================================
        // 2. RETRIEVE THE SELECTED PROPERTY
        // ======================================

        const {
            data: listing,
            error
        } = await campusSupabase
            .from("listings")
            .select(`
                id,
                owner_id,
                title,
                category,
                location,
                university,
                housing_type,
                budget,
                move_in,
                availability,
                gender,
                lifestyle,
                smoking,
                pets,
                furnished,
                parking,
                utilities,
                description,
                image_url,
                image_urls
            `)
            .eq("id", id)
            .eq("owner_id", user.id)
            .eq("category", "Housing")
            .single();

        if (error || !listing) {
            throw new Error(
                "Property not found or you do not have permission to edit it."
            );
        }

        // ======================================
        // 3. VERIFY PROPERTY OWNERSHIP
        // ======================================

        if (listing.owner_id !== user.id) {
            throw new Error(
                "You cannot edit another landlord's property."
            );
        }

        // ======================================
        // 4. PREPARE THE FORM
        // ======================================

        const form = document.getElementById(
            "addPropertyForm"
        );

        if (!form) {
            throw new Error(
                "The property editing form could not be found."
            );
        }

        // Clear old values and previous image selections.
        form.reset();

        this.clearSelectedPropertyImages();

        // ======================================
        // 5. HELPER TO POPULATE FORM FIELDS
        // ======================================

        const setField = (elementId, value) => {

            const element = document.getElementById(
                elementId
            );

            if (!element) {
                console.warn(
                    `Form field not found: ${elementId}`
                );
                return;
            }

            if (value === null || value === undefined) {
                return;
            }

            element.value = String(value);
        };

        // ======================================
        // 6. POPULATE PROPERTY INFORMATION
        // ======================================

        setField(
            "propertyTitle",
            listing.title
        );

        setField(
            "propertyLocation",
            listing.location
        );

        setField(
            "propertyUniversity",
            listing.university
        );

        setField(
            "propertyHousingType",
            listing.housing_type
        );

        setField(
            "propertyBudget",
            listing.budget
        );

        // Date inputs require YYYY-MM-DD.
        setField(
            "propertyMoveIn",
            listing.move_in
                ? String(listing.move_in).slice(0, 10)
                : ""
        );

        setField(
            "propertyAvailability",
            listing.availability
        );

        // ======================================
        // 7. POPULATE PREFERENCES
        // ======================================

        setField(
            "propertyGender",
            listing.gender || "Any"
        );

        setField(
            "propertyLifestyle",
            listing.lifestyle || ""
        );

        setField(
            "propertySmoking",
            listing.smoking || "Any"
        );

        setField(
            "propertyPets",
            listing.pets || "Any"
        );

        // ======================================
        // 8. POPULATE YES / NO SETTINGS
        // ======================================

        setField(
            "propertyFurnished",
            listing.furnished ? "true" : "false"
        );

        setField(
            "propertyParking",
            listing.parking ? "true" : "false"
        );

        setField(
            "propertyUtilities",
            listing.utilities ? "true" : "false"
        );

        // ======================================
        // 9. POPULATE DESCRIPTION
        // ======================================

        setField(
            "propertyDescription",
            listing.description || ""
        );

        // ======================================
        // 10. DISPLAY EXISTING PROPERTY IMAGES
        // ======================================

        const existingImageUrls = [
            ...(Array.isArray(listing.image_urls)
                ? listing.image_urls
                : []),
            listing.image_url
        ].filter(Boolean);

        const uniqueImageUrls = [
            ...new Set(existingImageUrls)
        ];

        this.existingPropertyImageUrls = uniqueImageUrls;
this.removedPropertyImageUrls = [];

this.renderExistingPropertyImages(
    uniqueImageUrls
);

        // ======================================
        // 11. STORE THE PROPERTY ID
        // ======================================

        const editListingId = document.getElementById(
            "editListingId"
        );

        if (editListingId) {
            editListingId.value = String(listing.id);
        }

        // ======================================
        // 12. OPEN THE EDIT FORM
        // ======================================

        this.showPropertyForm("edit");

        this.showPropertyFormMessage(
            "Existing property details loaded successfully. Review your information before making changes.",
            "success"
        );

        console.log(
            "Property details loaded for editing:",
            listing.id
        );

    } catch (error) {

        console.error(
            "Unable to load property for editing:",
            error
        );

        alert(
            error.message ||
            "Unable to load this property. Please try again."
        );
    }
},

    updatePropertyCount(count) {
        const countElement =
            document.getElementById("propertyCount");

        if (countElement) {
            countElement.textContent = String(count);
        }
    },

    
    /* ==========================================
       PHASE 7.7.2.3 — DASHBOARD OVERVIEW DATA
    ========================================== */

    async loadDashboardOverview() {
        if (!landlordUser?.id) {
            console.error(
                "Cannot load overview without an authenticated landlord."
            );
            return;
        }

        try {
            // ----------------------------------
            // 1. LOAD THIS LANDLORD'S PROPERTIES
            // ----------------------------------

            const {
                data: properties,
                error: propertiesError
            } = await campusSupabase
                .from("listings")
                .select(`
                    id,
                    owner_id,
                    title,
                    location,
                    budget,
                    image_url,
                    image_urls,
                    is_active,
                    created_at
                `)
                .eq("owner_id", landlordUser.id)
                .eq("category", "Housing")
                .order("created_at", {
                    ascending: false
                });

            if (propertiesError) {
                throw propertiesError;
            }

            const safeProperties = properties || [];

            const totalProperties = safeProperties.length;

            const activeProperties = safeProperties.filter(
                property => property.is_active === true
            ).length;

            const inactiveProperties =
                totalProperties - activeProperties;

            // ----------------------------------
            // 2. UPDATE PROPERTY STATISTICS
            // ----------------------------------

            this.setOverviewValue(
                "totalPropertiesCount",
                totalProperties
            );

            this.setOverviewValue(
                "activePropertiesCount",
                activeProperties
            );

            this.setOverviewValue(
                "inactivePropertiesCount",
                inactiveProperties
            );

            // ----------------------------------
            // 3. DISPLAY RECENT PROPERTIES
            // ----------------------------------

            this.renderOverviewProperties(
                safeProperties.slice(0, 5)
            );

            // Load real property views analytics.
            await this.loadPropertyAnalytics(7);

            // Load saved property analytics.
            await this.loadPropertySaveAnalytics();

            // ----------------------------------
            // 4. LOAD LANDLORD CONVERSATIONS
            // ----------------------------------

            const {
                data: conversations,
                error: conversationsError
            } = await campusSupabase
                .from("conversations")
                .select("id, listing_id, student_id, landlord_id, updated_at")
                .eq("landlord_id", landlordUser.id)
                .order("updated_at", {
                    ascending: false
                });

            if (conversationsError) {
                throw conversationsError;
            }

            const safeConversations = conversations || [];

            const conversationIds = safeConversations.map(
                conversation => conversation.id
            );

            // ----------------------------------
            // 5. HANDLE EMPTY CONVERSATIONS
            // ----------------------------------

            if (conversationIds.length === 0) {
                this.setOverviewValue(
                    "unreadMessagesCount",
                    0
                );

                this.renderOverviewMessages([]);

                return;
            }

            // ----------------------------------
            // 6. COUNT UNREAD STUDENT MESSAGES
            // ----------------------------------

            const {
                count: unreadCount,
                error: unreadError
            } = await campusSupabase
                .from("messages")
                .select("id", {
                    count: "exact",
                    head: true
                })
                .in("conversation_id", conversationIds)
                .eq("is_read", false)
                .neq("sender_id", landlordUser.id);

            if (unreadError) {
                throw unreadError;
            }

            this.setOverviewValue(
                "unreadMessagesCount",
                unreadCount ?? 0
            );

            // ----------------------------------
            // 7. LOAD THE FIVE LATEST MESSAGES
            // ----------------------------------

            const {
                data: recentMessages,
                error: messagesError
            } = await campusSupabase
                .from("messages")
                .select(`
                    id,
                    conversation_id,
                    sender_id,
                    message_text,
                    is_read,
                    created_at
                `)
                .in("conversation_id", conversationIds)
                .order("created_at", {
                    ascending: false
                })
                .limit(5);

            if (messagesError) {
                throw messagesError;
            }

            // ----------------------------------
            // 8. DISPLAY RECENT MESSAGES
            // ----------------------------------

            const conversationMap = new Map(
                safeConversations.map(conversation => [
                    String(conversation.id),
                    conversation
                ])
            );

            this.renderOverviewMessages(
                recentMessages || [],
                conversationMap
            );

            console.log(
                "CampusNest dashboard overview loaded successfully."
            );

        } catch (error) {
            console.error(
                "Dashboard overview loading failed:",
                error
            );

            this.showOverviewError(
                "We couldn't load some dashboard information. Please refresh the page."
            );
        }
        
    },

    
    // ==========================================
    // PHASE 7.7.3.4 — PROPERTY ANALYTICS
    // ==========================================

    async loadPropertyAnalytics(days = 7) {

        const totalElement = document.getElementById(
            "analyticsTotalViews"
        );

        const todayElement = document.getElementById(
            "analyticsViewsToday"
        );

        const chartContainer = document.getElementById(
            "propertyViewsChart"
        );

        const performanceContainer = document.getElementById(
            "propertyPerformanceList"
        );

        const errorElement = document.getElementById(
            "analyticsError"
        );

        if (
            !totalElement ||
            !todayElement ||
            !chartContainer ||
            !performanceContainer
        ) {
            return;
        }

        if (errorElement) {
            errorElement.textContent = "";
        }

        chartContainer.textContent = "Loading analytics...";
        performanceContainer.textContent =
            "Loading property performance...";

        try {

            const { data, error } =
                await campusSupabase.rpc(
                    "get_landlord_property_analytics",
                    {
                        p_days: days === 30 ? 30 : 7
                    }
                );

            if (error) {
                throw error;
            }

            if (!data) {
                throw new Error(
                    "No analytics data was returned."
                );
            }

            // Update summary figures.
            totalElement.textContent =
                Number(data.total_views || 0).toLocaleString();

            todayElement.textContent =
                Number(data.views_today || 0).toLocaleString();

            // Render daily chart.
            this.renderPropertyViewsChart(
                data.daily || [],
                chartContainer
            );

            // Render property rankings.
            this.renderPropertyPerformance(
                data.properties || [],
                performanceContainer
            );

            console.log(
                "Property analytics loaded successfully."
            );

        } catch (error) {

            console.error(
                "Property analytics loading failed:",
                error
            );

            chartContainer.textContent =
                "Unable to load the views chart.";

            performanceContainer.textContent =
                "Unable to load property performance.";

            if (errorElement) {
                errorElement.textContent =
                    "We couldn't load property analytics. Please refresh the page.";
            }

        }

    },


    // ==========================================
    // PHASE 7.7.5.2 — PROPERTY SAVE ANALYTICS
    // ==========================================

    async loadPropertySaveAnalytics() {

        const totalElement = document.getElementById(
            "analyticsTotalSaves"
        );

        const mostSavedElement = document.getElementById(
            "analyticsMostSavedProperty"
        );

        const mostSavedCountElement = document.getElementById(
            "analyticsMostSavedCount"
        );

        const rankingContainer = document.getElementById(
            "propertySavesRankingList"
        );

        // Stop if the new analytics HTML is not present.
        if (
            !totalElement ||
            !mostSavedElement ||
            !mostSavedCountElement ||
            !rankingContainer
        ) {
            console.warn(
                "Property save analytics elements were not found."
            );
            return;
        }

        // Display loading states.
        totalElement.textContent = "—";
        mostSavedElement.textContent = "Loading...";
        mostSavedCountElement.textContent = "Loading save count...";
        rankingContainer.textContent = "Loading saved property rankings...";

        try {

            // Request save analytics from Supabase.
            const { data, error } = await campusSupabase.rpc(
                "get_landlord_property_save_analytics"
            );

            if (error) {
                throw error;
            }

            if (!data || typeof data !== "object") {
                throw new Error(
                    "No property save analytics data was returned."
                );
            }

            // Safely prepare the returned data.
            const totalSaves = Number(data.total_saves || 0);

            const properties = Array.isArray(data.properties)
                ? data.properties
                : [];

            // Sort properties by save count.
            properties.sort((a, b) => {
                return Number(b.save_count || 0) -
                    Number(a.save_count || 0);
            });

            // Update total saves.
            totalElement.textContent =
                totalSaves.toLocaleString();

            // Handle properties with no saves.
            if (
                properties.length === 0 ||
                Number(properties[0].save_count || 0) === 0
            ) {

                mostSavedElement.textContent = "No saves yet";

                mostSavedCountElement.textContent =
                    "No student saves recorded yet.";

            } else {

                const mostSavedProperty = properties[0];

                mostSavedElement.textContent =
                    mostSavedProperty.title || "Untitled property";

                const mostSavedCount = Number(
                    mostSavedProperty.save_count || 0
                );

                mostSavedCountElement.textContent =
                    `${mostSavedCount.toLocaleString()} ${
                        mostSavedCount === 1 ? "save" : "saves"
                    }`;
            }

            // Render individual property rankings.
            this.renderPropertySaveRankings(
                properties,
                rankingContainer
            );

            console.log(
                "Property save analytics loaded successfully."
            );

        } catch (error) {

            console.error(
                "Property save analytics loading failed:",
                error
            );

            totalElement.textContent = "—";
            mostSavedElement.textContent = "Unavailable";
            mostSavedCountElement.textContent =
                "Unable to retrieve save count.";

            rankingContainer.textContent =
                "Unable to load property save rankings.";

        }

    },


    // ==========================================
    // RENDER PROPERTY SAVE RANKINGS
    // ==========================================

    renderPropertySaveRankings(properties, container) {

        container.replaceChildren();

        if (!properties.length) {

            container.textContent =
                "Your property save rankings will appear here.";

            return;
        }

        properties.forEach((property, index) => {

            const item = document.createElement("article");

            item.className = "property-performance-item";

            // Ranking number.
            const rank = document.createElement("span");

            rank.className = "property-performance-rank";
            rank.textContent = String(index + 1);

            // Property information.
            const details = document.createElement("div");

            details.className = "property-performance-details";

            const title = document.createElement("strong");

            title.textContent =
                property.title || "Untitled property";

            const description = document.createElement("small");

            description.textContent = "Student property saves";

            details.append(title, description);

            // Number of saves.
            const saves = document.createElement("strong");

            saves.className = "property-performance-views";

            const saveCount = Number(property.save_count || 0);

            saves.textContent =
                `${saveCount.toLocaleString()} ${
                    saveCount === 1 ? "save" : "saves"
                }`;

            item.append(
                rank,
                details,
                saves
            );

            container.appendChild(item);

        });

    },

    // ==========================================
    // RENDER DAILY PROPERTY VIEWS
    // ==========================================

    renderPropertyViewsChart(dailyData, container) {

        container.replaceChildren();

        if (!dailyData.length) {

            container.textContent =
                "No view data available yet.";

            return;

        }

        const maximumViews = Math.max(
            1,
            ...dailyData.map(item => Number(item.views || 0))
        );

        const chart = document.createElement("div");
chart.className = "analytics-bars";

chart.style.setProperty(
    "--analytics-columns",
    String(dailyData.length)
);

        dailyData.forEach(item => {

            const views = Number(item.views || 0);

            const date = new Date(
                `${item.date}T12:00:00`
            );

            const dayLabel = date.toLocaleDateString(
                undefined,
                {
                    weekday: "short"
                }
            );

            const barColumn = document.createElement("div");

            barColumn.className = "analytics-bar-column";

            const value = document.createElement("span");

            value.className = "analytics-bar-value";
            value.textContent = String(views);

            const track = document.createElement("div");

            track.className = "analytics-bar-track";

            const bar = document.createElement("div");

            bar.className = "analytics-bar";

            bar.style.height =
                `${Math.max(4, (views / maximumViews) * 100)}%`;

            bar.title = `${views} views`;

            track.appendChild(bar);

            const label = document.createElement("span");

            label.className = "analytics-bar-label";
            label.textContent = dayLabel;

            barColumn.append(
                value,
                track,
                label
            );

            chart.appendChild(barColumn);

        });

        container.appendChild(chart);

    },


    // ==========================================
    // RENDER PROPERTY PERFORMANCE RANKING
    // ==========================================

    renderPropertyPerformance(properties, container) {

        container.replaceChildren();

        if (!properties.length) {

            container.textContent =
                "Your property performance will appear here.";

            return;

        }

        properties.forEach((property, index) => {

            const item = document.createElement("article");

            item.className = "property-performance-item";

            const rank = document.createElement("span");

            rank.className = "property-performance-rank";
            rank.textContent = String(index + 1);

            const details = document.createElement("div");

            details.className = "property-performance-details";

            const title = document.createElement("strong");

            title.textContent =
                property.title || "Untitled property";

            const status = document.createElement("small");

            status.textContent = property.is_active
                ? "Active listing"
                : "Inactive listing";

            const views = document.createElement("strong");

            views.className = "property-performance-views";

            views.textContent =
                `${Number(property.views || 0).toLocaleString()} views`;

            details.append(title, status);

            item.append(rank, details, views);

            container.appendChild(item);

        });

    },

    // ==========================================
    // UPDATE OVERVIEW STATISTIC
    // ==========================================

    setOverviewValue(elementId, value) {
        const element = document.getElementById(elementId);

        if (!element) return;

        element.textContent = String(value);
    },

    // ==========================================
    // RENDER RECENT PROPERTIES
    // ==========================================

    renderOverviewProperties(properties = []) {
        const container = document.getElementById(
            "overviewRecentProperties"
        );

        if (!container) return;

        container.replaceChildren();

        if (properties.length === 0) {
            container.appendChild(
                this.createOverviewEmptyState(
                    "fa-house",
                    "You haven't added any properties yet."
                )
            );

            return;
        }

        properties.forEach(property => {
            const item = document.createElement("article");

            item.className = "overview-property-item";

            // Property image
            const imageContainer = document.createElement("div");

            imageContainer.className = "overview-property-image";

            const imageUrl =
                property.image_url ||
                property.image_urls?.[0];

            if (imageUrl) {
                const image = document.createElement("img");

                image.src = imageUrl;
                image.alt = property.title || "Property photo";
                image.loading = "lazy";

                image.addEventListener("error", () => {
                    image.remove();

                    imageContainer.innerHTML =
                        '<i class="fa-solid fa-house"></i>';
                });

                imageContainer.appendChild(image);

            } else {
                const icon = document.createElement("i");

                icon.className = "fa-solid fa-house";

                imageContainer.appendChild(icon);
            }

            // Property information
            const info = document.createElement("div");

            info.className = "overview-property-info";

            const title = document.createElement("strong");

            title.textContent =
                property.title || "Untitled property";

            const location = document.createElement("span");

            location.textContent =
                property.location || "Location not provided";

            info.append(title, location);

            // Listing status
            const status = document.createElement("span");

            status.className = property.is_active
                ? "overview-property-status"
                : "overview-property-status is-inactive";

            status.textContent = property.is_active
                ? "Active"
                : "Inactive";

            item.append(
                imageContainer,
                info,
                status
            );

            container.appendChild(item);
        });
    },

    // ==========================================
    // RENDER RECENT MESSAGES
    // ==========================================

    renderOverviewMessages(
        messages = [],
        conversationMap = new Map()
    ) {
        const container = document.getElementById(
            "overviewRecentMessages"
        );

        if (!container) return;

        container.replaceChildren();

        if (messages.length === 0) {
            container.appendChild(
                this.createOverviewEmptyState(
                    "fa-comments",
                    "You don't have any messages yet."
                )
            );

            return;
        }

        messages.forEach(message => {
            const item = document.createElement("article");

            item.className = "overview-message-item";

            // Sender avatar placeholder
            const avatar = document.createElement("div");

            avatar.className = "overview-message-avatar";
            avatar.textContent =
                message.sender_id === landlordUser.id
                    ? "Y"
                    : "S";

            // Message information
            const info = document.createElement("div");

            info.className = "overview-message-info";

            const conversation = conversationMap.get(
                String(message.conversation_id)
            );

            const sender = document.createElement("strong");

            sender.textContent =
                message.sender_id === landlordUser.id
                    ? "You"
                    : "Student";

            const preview = document.createElement("p");

            preview.textContent =
                message.message_text || "Message";

            // Format message date
            const date = document.createElement("span");

            date.textContent = this.formatOverviewDate(
                message.created_at
            );

            date.style.display = "block";
            date.style.marginTop = "4px";
            date.style.color = "#94a3b8";
            date.style.fontSize = "10px";

            info.append(sender, preview, date);

            // Unread indicator
            const unreadIndicator = document.createElement("span");

            if (
                message.is_read === false &&
                message.sender_id !== landlordUser.id
            ) {
                unreadIndicator.className =
                    "overview-message-unread";

                unreadIndicator.setAttribute(
                    "aria-label",
                    "Unread message"
                );
            }

            item.append(
                avatar,
                info,
                unreadIndicator
            );

            container.appendChild(item);
        });
    },

    // ==========================================
    // EMPTY STATE HELPER
    // ==========================================

    createOverviewEmptyState(iconName, message) {
        const wrapper = document.createElement("div");

        wrapper.className = "overview-empty-state";

        const icon = document.createElement("i");

        icon.className = `fa-solid ${iconName}`;

        const text = document.createElement("p");

        text.textContent = message;

        wrapper.append(icon, text);

        return wrapper;
    },

    // ==========================================
    // FORMAT MESSAGE DATE
    // ==========================================

    formatOverviewDate(dateValue) {
        if (!dateValue) return "";

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString("en-CA", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit"
        });
    },

    // ==========================================
    // OVERVIEW ERROR MESSAGE
    // ==========================================

    showOverviewError(message) {
        const propertyContainer = document.getElementById(
            "overviewRecentProperties"
        );

        const messageContainer = document.getElementById(
            "overviewRecentMessages"
        );

        [
            propertyContainer,
            messageContainer
        ].forEach(container => {
            if (!container) return;

            container.replaceChildren();

            const errorText = document.createElement("p");

            errorText.textContent = message;

            errorText.style.color = "#b91c1c";
            errorText.style.fontSize = "12px";
            errorText.style.lineHeight = "1.7";

            container.appendChild(errorText);
        });
    },
    
createPropertyCard(listing, index) {
    const card = document.createElement("article");
    card.className = "property-item";
    card.style.setProperty("--card-index", index);

    const media = document.createElement("div");
    media.className = "property-media";

    if (listing.image_url) {
        const image = document.createElement("img");

        image.src = listing.image_url;
        image.alt = listing.title || "Property photo";
        image.loading = "lazy";

        image.addEventListener("error", () => {
            media.classList.add("property-media-placeholder");
            image.remove();
        });

        media.appendChild(image);
    } else {
        media.classList.add("property-media-placeholder");

        const houseIcon = document.createElement("span");
        houseIcon.className = "property-placeholder-icon";
        houseIcon.setAttribute("aria-hidden", "true");
        houseIcon.textContent = "⌂";

        const placeholderLabel = document.createElement("span");
        placeholderLabel.textContent = "Your property";

        media.append(houseIcon, placeholderLabel);
    }

    const content = document.createElement("div");
    content.className = "property-content";

    const topLine = document.createElement("div");
    topLine.className = "property-topline";

    const type = document.createElement("span");
    type.className = "property-type";
    type.textContent = listing.housing_type || "Housing";

    const status = document.createElement("span");
    status.className = listing.is_active
        ? "property-status active"
        : "property-status inactive";

    status.textContent = listing.is_active ? "● Active" : "○ Inactive";

    topLine.append(type, status);

    const title = document.createElement("h3");
    title.textContent = listing.title || "Untitled property";

    const location = document.createElement("p");
    location.className = "property-location";
    location.textContent =
        `⌖ ${listing.location || "Location not provided"}`;

    const footer = document.createElement("div");
    footer.className = "property-footer";

    const priceBlock = document.createElement("div");
    priceBlock.className = "property-price";

    const price = document.createElement("strong");
    const amount = Number(listing.budget);

    price.textContent =
        listing.budget !== null &&
        listing.budget !== undefined &&
        listing.budget !== "" &&
        Number.isFinite(amount)
            ? `$${amount.toLocaleString("en-CA")}`
            : "Price not set";

    priceBlock.appendChild(price);

    if (
        listing.budget !== null &&
        listing.budget !== undefined &&
        listing.budget !== ""
    ) {
        const period = document.createElement("span");
        period.textContent = "/ month";
        priceBlock.appendChild(period);
    }

    const details = document.createElement("div");
    details.className = "property-details";

    const availabilityLabel = document.createElement("span");
    availabilityLabel.textContent = "Availability";

    const availabilityValue = document.createElement("strong");
    availabilityValue.textContent =
        listing.availability || "Not specified";

    details.append(availabilityLabel, availabilityValue);
    footer.append(priceBlock, details);

    // --------------------------------------
    // PROPERTY MANAGEMENT ACTIONS
    // --------------------------------------

    const actions = document.createElement("div");
    actions.className = "property-management-actions";

    
const editButton = document.createElement("button");

editButton.type = "button";
editButton.className =
    "property-action-button property-edit-button";

editButton.dataset.editProperty = String(listing.id);
editButton.textContent = "Edit Property";

editButton.setAttribute(
    "aria-label",
    `Edit ${listing.title || "property"}`
);


    const statusButton = document.createElement("button");
    statusButton.type = "button";
    statusButton.className = "property-action-button status-toggle-button";
    statusButton.dataset.toggleProperty = String(listing.id);
    statusButton.textContent = listing.is_active
        ? "Deactivate listing"
        : "Activate listing";
    statusButton.setAttribute(
        "aria-label",
        `${listing.is_active ? "Deactivate" : "Activate"} ${listing.title || "property"}`
    );

    const deleteButton = document.createElement("button");
    deleteButton.type = "button";
    deleteButton.className =
        "property-action-button property-delete-button";
    deleteButton.dataset.deleteProperty = String(listing.id);
    deleteButton.textContent = "Delete property";
    deleteButton.setAttribute(
        "aria-label",
        `Delete ${listing.title || "property"}`
    );

    actions.append(editButton, statusButton, deleteButton);

    content.append(topLine, title, location, footer, actions);
    card.append(media, content);

    return card;
},


    /* ==========================================
       STEP 7.4: ADD PROPERTY FORM
       ========================================== */

    showPropertyForm(mode = "add") {

    const form = document.getElementById(
        "addPropertyForm"
    );

    const button = document.getElementById(
        "addPropertyButton"
    );

    const section = document.getElementById(
        "landlordPropertiesSection"
    );

    const formTitle = document.getElementById(
        "propertyFormTitle"
    );

    const formDescription = document.getElementById(
        "propertyFormDescription"
    );

    const formMode = document.getElementById(
        "propertyFormMode"
    );

    const saveButton = document.getElementById(
        "savePropertyButton"
    );

    const editListingId = document.getElementById(
        "editListingId"
    );

    if (!form) {
        console.error(
            "Missing #addPropertyForm in landlord-dashboard.html"
        );
        return;
    }

    const isEditMode = mode === "edit";

    // Show the properties section.
    if (section) {
        section.classList.add("is-visible");
    }

    // Show the form.
    form.hidden = false;

    // Update the form heading and description.
    if (formTitle) {
        formTitle.textContent = isEditMode
            ? "Edit Property"
            : "Add a New Property";
    }

    if (formDescription) {
        formDescription.textContent = isEditMode
            ? "Update your property information and keep your listing accurate."
            : "Share the details students need to find their next home.";
    }

    // Show or hide the editing indicator.
    if (formMode) {
        formMode.hidden = !isEditMode;
    }

    // Update the submit button.
    if (saveButton) {
        saveButton.textContent = isEditMode
            ? "Save Changes"
            : "Save Property";
    }

   // Reset edit-specific information when opening Add Property.
if (!isEditMode) {
    if (editListingId) {
        editListingId.value = "";
    }

    this.existingPropertyImageUrls = [];
    this.removedPropertyImageUrls = [];

    this.renderExistingPropertyImages([]);

}

    // Update the Add Property button state.
    if (button) {
        button.setAttribute(
            "aria-expanded",
            "true"
        );
    }

    this.clearPropertyFormMessage();

    form.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

    // Focus the title field.
    const titleInput = document.getElementById(
        "propertyTitle"
    );

    if (titleInput) {
        window.setTimeout(() => {
            titleInput.focus();
        }, 200);
    }
},

    hidePropertyForm() {

    const form = document.getElementById(
        "addPropertyForm"
    );

    const button = document.getElementById(
        "addPropertyButton"
    );

    if (!form) return;

    form.hidden = true;

    if (button) {
        button.setAttribute(
            "aria-expanded",
            "false"
        );

        button.focus();
    }

    this.clearPropertyFormMessage();
},

    clearPropertyFormMessage() {
        const message =
            document.getElementById("addPropertyMessage");

        if (!message) return;

        message.className = "property-list-message";
        message.textContent = "";
    },

    showPropertyFormMessage(text, type = "error") {
        const message =
            document.getElementById("addPropertyMessage");

        if (!message) return;

        message.className =
            type === "success"
                ? "property-list-message is-success"
                : "property-list-message is-error";

        message.textContent = text;
    },

    

    // ==========================================
    // UPLOAD PROPERTY IMAGES AND SAVE LISTING
    // Phase 7 - Step 7.5.4
    // ==========================================

    
async savePropertyToSupabase(form) {
    const bucketName = "property-images";
    const selectedImages = this.selectedPropertyImages || [];
    const uploadedPaths = [];
    const removedImagePaths = [];
    let storageCleanupWarning = false;

    let listingSaved = false;
    let user = null;

    const saveButton = document.getElementById("savePropertyButton");
    const editListingId = document.getElementById("editListingId");

    const listingIdValue = editListingId?.value.trim() || "";
    const isEditMode = listingIdValue !== "";

    const listingId = isEditMode ? Number(listingIdValue) : null;

    const getValue = (id) => {
        const element = document.getElementById(id);
        return element ? element.value.trim() : "";
    };

    try {
        this.clearPropertyImageMessage();

        // ======================================
        // 1. VALIDATE EDITING PROPERTY ID
        // ======================================

        if (
            isEditMode &&
            (!Number.isSafeInteger(listingId) || listingId < 1)
        ) {
            throw new Error("Invalid property ID. Please reopen the property and try again.");
        }

        // ======================================
        // 2. VERIFY AUTHENTICATED LANDLORD
        // ======================================

        user = await this.verifyManagementAccess();

        // ======================================
        // 3. FETCH EXISTING PROPERTY IF EDITING
        // ======================================

        let existingListing = null;
        let existingImageUrls = [];

        if (isEditMode) {
            const {
                data: listing,
                error: fetchError
            } = await campusSupabase
                .from("listings")
                .select(`
    id,
    owner_id,
    category,
    is_active,
    is_verified,
    image_url,
    image_urls
`)
                .eq("id", listingId)
                .eq("owner_id", user.id)
                .eq("category", "Housing")
                .single();

            if (fetchError || !listing) {
                throw new Error(
                    "Property not found or you do not have permission to edit it."
                );
            }

            if (
                listing.owner_id !== user.id ||
                listing.category !== "Housing"
            ) {
                throw new Error(
                    "You cannot edit another landlord's property."
                );
            }

            existingListing = listing;

            // All images currently saved in the database.
existingImageUrls = [
    ...(Array.isArray(listing.image_urls)
        ? listing.image_urls
        : []),
    listing.image_url
].filter(
    url => typeof url === "string" && url.trim() !== ""
);

existingImageUrls = [...new Set(existingImageUrls)];

// Images still retained by the landlord in the edit form.
const retainedImageUrls = [
    ...new Set(this.existingPropertyImageUrls || [])
];

// Prevent the form from retaining an image that does not
// belong to this property's original image collection.
const hasInvalidRetainedImage = retainedImageUrls.some(
    url => !existingImageUrls.includes(url)
);

if (hasInvalidRetainedImage) {
    throw new Error(
        "One or more selected property images are invalid. Please reopen the property and try again."
    );
}

// Identify original images that the landlord removed.
const removedImageUrls = existingImageUrls.filter(
    url => !retainedImageUrls.includes(url)
);

// Convert removed URLs into safe Storage paths.
for (const imageUrl of removedImageUrls) {
    const storagePath = this.getOwnedPropertyImagePath(
        imageUrl,
        user.id
    );

    if (storagePath) {
        removedImagePaths.push(storagePath);
    } else {
        // Do not attempt to delete an image unless its path
        // can be verified as belonging to this landlord.
        storageCleanupWarning = true;

        console.warn(
            "Skipped deletion because the image Storage path could not be verified:",
            imageUrl
        );
    }
}
        }

        // ======================================
        // 4. VALIDATE TOTAL IMAGE COUNT
        // ======================================

        const retainedImageCount = isEditMode
    ? (this.existingPropertyImageUrls || []).length
    : 0;

const totalImageCount =
    retainedImageCount + selectedImages.length;

        if (totalImageCount < 4) {
            throw new Error(
                "A property must have at least four images. Please select more images."
            );
        }

        if (totalImageCount > 5) {
            throw new Error(
                "A property can have a maximum of five images. Please select fewer new images."
            );
        }

        // ======================================
        // 5. VALIDATE NEW IMAGE FILES
        // ======================================

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const maxFileSize = 5 * 1024 * 1024;

        for (const item of selectedImages) {
            const file = item.file;

            if (!file || !allowedTypes.includes(file.type)) {
                throw new Error(
                    "One or more images have an unsupported file type. Use JPG, PNG, or WebP."
                );
            }

            if (file.size === 0 || file.size > maxFileSize) {
                throw new Error(
                    "Each image must be greater than 0 bytes and no larger than 5 MB."
                );
            }
        }

        // ======================================
        // 6. PREPARE IMAGE UPLOAD
        // ======================================

        const batchId = crypto.randomUUID();

        const extensionByType = {
            "image/jpeg": "jpg",
            "image/png": "png",
            "image/webp": "webp"
        };

        const newImageUrls = [];

        for (
            let index = 0;
            index < selectedImages.length;
            index++
        ) {
            const file = selectedImages[index].file;
            const extension = extensionByType[file.type];

            const uniqueFileName =
                `${String(index + 1).padStart(2, "0")}-` +
                `${crypto.randomUUID()}.${extension}`;

            // The first folder must be the authenticated user's ID.
            const storagePath =
                `${user.id}/${batchId}/${uniqueFileName}`;

            const {
                data: uploadData,
                error: uploadError
            } = await campusSupabase.storage
                .from(bucketName)
                .upload(storagePath, file, {
                    cacheControl: "3600",
                    contentType: file.type,
                    upsert: false
                });

            if (uploadError) {
                throw new Error(
                    `Image ${index + 1} could not be uploaded: ${uploadError.message}`
                );
            }

            uploadedPaths.push(uploadData.path || storagePath);

            const {
                data: publicUrlData
            } = campusSupabase.storage
                .from(bucketName)
                .getPublicUrl(storagePath);

            if (!publicUrlData?.publicUrl) {
                throw new Error(
                    `Could not create a URL for image ${index + 1}.`
                );
            }

            newImageUrls.push(publicUrlData.publicUrl);
        }

        // ======================================
        // 7. COMBINE EXISTING AND NEW IMAGES
        // ======================================

        const finalImageUrls = isEditMode
    ? [
        ...(this.existingPropertyImageUrls || []),
        ...newImageUrls
    ]
    : newImageUrls;

        // ======================================
        // 8. BUILD EDITABLE PROPERTY DATA
        // ======================================

        const propertyDetails = {
            title: getValue("propertyTitle"),
            location: getValue("propertyLocation"),
            university: getValue("propertyUniversity") || null,
            housing_type: getValue("propertyHousingType"),
            budget: Number(getValue("propertyBudget")),
            move_in: getValue("propertyMoveIn"),
            availability: getValue("propertyAvailability"),
            gender: getValue("propertyGender") || "Any",
            lifestyle: getValue("propertyLifestyle") || null,
            smoking: getValue("propertySmoking") || "Any",
            pets: getValue("propertyPets") || "Any",

            furnished: getValue("propertyFurnished") === "true",
            parking: getValue("propertyParking") === "true",
            utilities: getValue("propertyUtilities") === "true",

            description: getValue("propertyDescription"),

            image_url: finalImageUrls[0],
            image_urls: finalImageUrls,

            updated_at: new Date().toISOString()
        };

        // ======================================
        // 9. UPDATE OR INSERT THE PROPERTY
        // ======================================

        
if (isEditMode) {
    // Update only the property belonging to this landlord.
    const {
        data: updatedProperty,
        error: updateError
    } = await campusSupabase
        .from("listings")
        .update(propertyDetails)
        .eq("id", listingId)
        .eq("owner_id", user.id)
        .eq("category", "Housing")
        .select(`
            id,
            owner_id,
            category,
            title,
            image_urls,
            is_active,
            is_verified
        `)
        .single();

    if (updateError) {
        throw new Error(
            `The property could not be updated: ${updateError.message}`
        );
    }

    // The database has accepted the update.
    // Do not delete newly uploaded images if a later
    // verification check reports an unexpected result.
    if (updatedProperty) {
        listingSaved = true;
    }

    if (!updatedProperty) {
        throw new Error(
            "The property update could not be confirmed."
        );
    }

    // ======================================
    // VERIFY PROPERTY ID AND OWNERSHIP
    // ======================================

    if (
        updatedProperty.id !== listingId ||
        updatedProperty.owner_id !== user.id
    ) {
        throw new Error(
            "The updated property ownership could not be verified."
        );
    }

    // ======================================
    // VERIFY PROTECTED PROPERTY FIELDS
    // ======================================

    if (updatedProperty.category !== existingListing.category) {
        throw new Error(
            "The property's category changed unexpectedly. Please contact support."
        );
    }

    if (updatedProperty.is_active !== existingListing.is_active) {
        throw new Error(
            "The property's active status changed unexpectedly. Please contact support."
        );
    }

    if (updatedProperty.is_verified !== existingListing.is_verified) {
        throw new Error(
            "The property's verification status changed unexpectedly. Please contact support."
        );
    }

    console.log(
        "Property update and protected fields verified:",
        updatedProperty.id
    );

    // ======================================
    // DELETE REMOVED IMAGES FROM STORAGE
    // Only after the database update succeeds.
    // ======================================

    if (removedImagePaths.length > 0) {
        try {
            const {
                error: removalError
            } = await campusSupabase.storage
                .from(bucketName)
                .remove(removedImagePaths);

            if (removalError) {
                storageCleanupWarning = true;

                console.error(
                    "The property was updated, but some old images could not be deleted:",
                    removalError
                );
            } else {
                console.log(
                    "Removed property images from Storage:",
                    removedImagePaths
                );
            }

        } catch (cleanupError) {
            // The database update has already succeeded.
            // Do not report the entire property update as failed.
            storageCleanupWarning = true;

            console.error(
                "Storage cleanup encountered an error:",
                cleanupError
            );
        }
    }

} else {
            // Preserve the original Add Property behavior.
            const newProperty = {
                ...propertyDetails,
                owner_id: user.id,
                category: "Housing",
                is_active: true,
                is_verified: false
            };

            const {
                data: savedProperty,
                error: insertError
            } = await campusSupabase
                .from("listings")
                .insert(newProperty)
                .select("id, title, owner_id")
                .single();

            if (insertError) {
                throw new Error(
                    `The property could not be saved: ${insertError.message}`
                );
            }

            if (
                !savedProperty ||
                savedProperty.owner_id !== user.id
            ) {
                throw new Error(
                    "The saved property could not be verified."
                );
            }

            listingSaved = true;

            console.log(
                "New property saved successfully:",
                savedProperty.id
            );
        }

        // ======================================
        // 10. CLEAN UP AND REFRESH DASHBOARD
        // ======================================

        this.clearSelectedPropertyImages();

        this.existingPropertyImageUrls = [];

        this.removedPropertyImageUrls = [];

        form.reset();

        this.renderExistingPropertyImages([]);

        if (editListingId) {
            editListingId.value = "";
        }

        this.hidePropertyForm();

        await this.loadProperties();

        let successMessage;

if (isEditMode && storageCleanupWarning) {
    successMessage =
        "Your property was updated successfully, but some removed photos could not be deleted from storage. Please contact support if the old photos remain.";

} else if (isEditMode) {
    successMessage =
        "Your property and photos have been updated successfully.";

} else {
    successMessage =
        "Property saved successfully. Your listing is not yet verified.";
}

        const propertyListMessage = document.getElementById(
            "propertyListMessage"
        );

        if (propertyListMessage) {
            propertyListMessage.className =
                "property-list-message is-success";

            propertyListMessage.textContent = successMessage;
        }

    } catch (error) {
        console.error(
            "CampusNest property save/update error:",
            error
        );

        // Remove newly uploaded images if the database operation failed.
        if (
            !listingSaved &&
            uploadedPaths.length > 0 &&
            user
        ) {
            const {
                error: cleanupError
            } = await campusSupabase
                .storage
                .from(bucketName)
                .remove(uploadedPaths);

            if (cleanupError) {
                console.error(
                    "Image cleanup failed. Some uploaded files may remain:",
                    cleanupError
                );
            }
        }

        this.showPropertyFormMessage(
            error.message ||
            "We couldn't save your property. Please try again.",
            "error"
        );

    } finally {
        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = isEditMode
                ? "Save Changes"
                : "Save Property";
        }
    }
},


getOwnedPropertyImagePath(imageUrl, userId) {
    try {
        if (
            typeof imageUrl !== "string" ||
            !imageUrl.trim() ||
            !userId
        ) {
            return null;
        }

        // Get the Supabase project URL configured for this app.
        const configuredUrl = new URL(
            campusSupabase.supabaseUrl
        );

        const parsedUrl = new URL(imageUrl);

        // Only accept URLs from this exact Supabase project.
        if (
            parsedUrl.origin !== configuredUrl.origin ||
            parsedUrl.username ||
            parsedUrl.password
        ) {
            return null;
        }

        const marker =
            "/storage/v1/object/public/property-images/";

        const markerIndex =
            parsedUrl.pathname.indexOf(marker);

        if (markerIndex === -1) {
            return null;
        }

        const encodedPath = parsedUrl.pathname.slice(
            markerIndex + marker.length
        );

        const storagePath = decodeURIComponent(encodedPath);

        const pathParts = storagePath.split("/");

        // The first folder must belong to this landlord.
        if (
            pathParts.length < 2 ||
            pathParts[0] !== userId ||
            pathParts.some(part =>
                !part || part === "." || part === ".."
            )
        ) {
            return null;
        }

        return storagePath;

    } catch (error) {
        console.error(
            "Could not safely read property image path:",
            error
        );

        return null;
    }
},
    // ==========================================
    // PROPERTY IMAGE SELECTION AND PREVIEWS
    // ==========================================

    showPropertyImageMessage(message, type = "error") {
        const messageElement = document.getElementById(
            "propertyImageMessage"
        );

        if (!messageElement) return;

        messageElement.textContent = message;
        messageElement.classList.remove("is-error", "is-success");
        messageElement.classList.add(
            type === "success" ? "is-success" : "is-error"
        );
    },

    clearPropertyImageMessage() {
        const messageElement = document.getElementById(
            "propertyImageMessage"
        );

        if (!messageElement) return;

        messageElement.textContent = "";
        messageElement.classList.remove("is-error", "is-success");
    },

    handlePropertyImageSelection(event) {
        const input = event.target;
        const incomingFiles = Array.from(input.files || []);

        if (incomingFiles.length === 0) return;

        this.clearPropertyImageMessage();

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        const maxFileSize = 5 * 1024 * 1024;
        const maxImages = 5;

        const acceptedFiles = [];
        const rejectedReasons = [];

        for (const file of incomingFiles) {
            if (!allowedTypes.includes(file.type)) {
                rejectedReasons.push(
                    `${file.name}: use JPG, PNG, or WebP.`
                );
                continue;
            }

            if (file.size === 0) {
                rejectedReasons.push(
                    `${file.name}: the file is empty.`
                );
                continue;
            }

            if (file.size > maxFileSize) {
                rejectedReasons.push(
                    `${file.name}: exceeds the 5 MB limit.`
                );
                continue;
            }

            const alreadySelected = this.selectedPropertyImages.some(
                (item) =>
                    item.file.name === file.name &&
                    item.file.size === file.size &&
                    item.file.lastModified === file.lastModified
            );

            const alreadyAccepted = acceptedFiles.some(
                (item) =>
                    item.name === file.name &&
                    item.size === file.size &&
                    item.lastModified === file.lastModified
            );

            if (!alreadySelected && !alreadyAccepted) {
                acceptedFiles.push(file);
            }
        }

        const existingCount =
    this.existingPropertyImageUrls.length;

const availableSlots =
    maxImages -
    existingCount -
    this.selectedPropertyImages.length;

        if (acceptedFiles.length > availableSlots) {
            this.showPropertyImageMessage(
                "You can select a maximum of 5 property images. " +
                "Remove an image before adding another."
            );

            input.value = "";
            return;
        }

        for (const file of acceptedFiles) {
            this.selectedPropertyImages.push({
                file,
                previewUrl: URL.createObjectURL(file)
            });
        }

        input.value = "";

        this.renderPropertyImagePreviews();

        if (rejectedReasons.length > 0) {
            this.showPropertyImageMessage(
                rejectedReasons.join(" ")
            );
        } else if (this.selectedPropertyImages.length < 4) {
            this.showPropertyImageMessage(
                "Please select at least four property images."
            );
        } else {
            this.showPropertyImageMessage(
                "Your property images are ready for review.",
                "success"
            );
        }
    },

    renderPropertyImagePreviews() {
        const previewContainer = document.getElementById(
            "propertyImagePreviews"
        );

        const countElement = document.getElementById(
            "propertyImageCount"
        );

        if (!previewContainer || !countElement) return;

        previewContainer.replaceChildren();

        const total =
    this.existingPropertyImageUrls.length +
    this.selectedPropertyImages.length;

countElement.textContent =
    `${total} of 4–5 required images selected`;

        this.selectedPropertyImages.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = "property-image-preview-card";

            const image = document.createElement("img");
            image.src = item.previewUrl;
            image.alt = `Property image ${index + 1}`;
            image.loading = "lazy";

            const label = document.createElement("span");
            label.className = "property-image-preview-label";
            label.textContent =
                index === 0
                    ? "Main photo"
                    : `Photo ${index + 1}`;

            const removeButton = document.createElement("button");
            removeButton.type = "button";
            removeButton.textContent = "Remove";
            removeButton.dataset.removePropertyImage = String(index);
            removeButton.setAttribute(
                "aria-label",
                `Remove property image ${index + 1}`
            );

            // Keep the button visible over the image.
            removeButton.style.position = "absolute";
            removeButton.style.top = "6px";
            removeButton.style.right = "6px";
            removeButton.style.border = "0";
            removeButton.style.borderRadius = "6px";
            removeButton.style.padding = "5px 7px";
            removeButton.style.background = "#FFFFFF";
            removeButton.style.color = "#1D4ED8";
            removeButton.style.cursor = "pointer";
            removeButton.style.fontSize = "12px";
            removeButton.style.fontWeight = "600";

            card.append(image, label, removeButton);
            previewContainer.appendChild(card);
        });
    },

    
renderExistingPropertyImages(imageUrls = []) {
    const container = document.getElementById(
        "existingPropertyImages"
    );

    if (!container) return;

    container.replaceChildren();

    const uniqueUrls = [
        ...new Set(
            (Array.isArray(imageUrls) ? imageUrls : [])
                .filter(
                    url =>
                        typeof url === "string" &&
                        url.trim() !== ""
                )
        )
    ];

    if (uniqueUrls.length === 0) {
        container.hidden = true;
        return;
    }

    uniqueUrls.forEach((url, index) => {
        const card = document.createElement("div");
        card.className = "existing-property-image-card";

        const image = document.createElement("img");
        image.src = url;
        image.alt = `Existing property image ${index + 1}`;
        image.loading = "lazy";

        image.addEventListener("error", () => {
            card.classList.add("image-load-error");
            image.alt = "Property image could not be loaded";
        });

        const label = document.createElement("span");
        label.className = "existing-property-image-label";
        label.textContent =
            index === 0
                ? "Current main photo"
                : `Current photo ${index + 1}`;

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.textContent = "Remove";
        removeButton.dataset.removeExistingPropertyImage =
            String(index);

        removeButton.setAttribute(
            "aria-label",
            `Remove existing property image ${index + 1}`
        );

        removeButton.style.position = "absolute";
        removeButton.style.top = "6px";
        removeButton.style.right = "6px";
        removeButton.style.border = "0";
        removeButton.style.borderRadius = "6px";
        removeButton.style.padding = "5px 7px";
        removeButton.style.background = "#FFFFFF";
        removeButton.style.color = "#DC2626";
        removeButton.style.cursor = "pointer";
        removeButton.style.fontSize = "12px";
        removeButton.style.fontWeight = "600";

        card.append(image, label, removeButton);
        container.appendChild(card);
    });

    container.hidden = container.children.length === 0;
},


removeExistingPropertyImage(index) {
    const imageUrl = this.existingPropertyImageUrls[index];

    if (!imageUrl) return;

    // Remember the URL for Storage cleanup after a successful save.
    this.removedPropertyImageUrls.push(imageUrl);

    // Remove it from the photos that will remain on the listing.
    this.existingPropertyImageUrls.splice(index, 1);

    // Re-render the remaining existing photos.
    this.renderExistingPropertyImages(
        this.existingPropertyImageUrls
    );

    // Update the combined image count.
    this.renderPropertyImagePreviews();

    this.clearPropertyImageMessage();

    const totalImages =
        this.existingPropertyImageUrls.length +
        this.selectedPropertyImages.length;

    if (totalImages < 4) {
        this.showPropertyImageMessage(
            "Your property needs at least four images. Please add another photo."
        );
    } else {
        this.showPropertyImageMessage(
            "Photo marked for removal. Save your changes to apply it.",
            "success"
        );
    }
},


    removePropertyImage(index) {
        const item = this.selectedPropertyImages[index];

        if (!item) return;

        URL.revokeObjectURL(item.previewUrl);

        this.selectedPropertyImages.splice(index, 1);

        this.renderPropertyImagePreviews();
        this.clearPropertyImageMessage();

        if (this.selectedPropertyImages.length < 4) {
            this.showPropertyImageMessage(
                "Please select at least four property images."
            );
        }
    },

    clearSelectedPropertyImages() {
        this.selectedPropertyImages.forEach((item) => {
            URL.revokeObjectURL(item.previewUrl);
        });

        this.selectedPropertyImages = [];

        const input = document.getElementById("propertyImages");

        if (input) input.value = "";

        this.renderPropertyImagePreviews();
        this.clearPropertyImageMessage();
    },

    
    
async validatePropertyForm(event) {
    event.preventDefault();

    const form = document.getElementById("addPropertyForm");

    if (!form) {
        console.error("Property form was not found.");
        return;
    }

    const title = document.getElementById("propertyTitle");
    const location = document.getElementById("propertyLocation");
    const budget = document.getElementById("propertyBudget");
    const moveIn = document.getElementById("propertyMoveIn");

    const editListingId = document.getElementById("editListingId");
    const isEditMode = Boolean(editListingId?.value.trim());

    // Clear previous custom validation messages.
    moveIn?.setCustomValidity("");

    // Reject move-in dates earlier than today.
    if (moveIn?.value) {
        const today = new Date();

        const todayLocal =
            `${today.getFullYear()}-` +
            `${String(today.getMonth() + 1).padStart(2, "0")}-` +
            `${String(today.getDate()).padStart(2, "0")}`;

        if (moveIn.value < todayLocal) {
            moveIn.setCustomValidity(
                "The available-from date cannot be in the past."
            );
        }
    }

    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }

    if (!title?.value.trim() || !location?.value.trim()) {
        this.showPropertyFormMessage(
            "Please enter a property title and location.",
            "error"
        );
        return;
    }

    const rent = Number(budget?.value);

    if (
        !Number.isFinite(rent) ||
        rent < 1 ||
        rent > 100000
    ) {
        budget?.focus();

        this.showPropertyFormMessage(
            "Enter a valid monthly rent between $1 and $100,000 CAD.",
            "error"
        );
        return;
    }

    // ======================================
    // VALIDATE TOTAL PROPERTY IMAGE COUNT
    // ======================================

    const existingImageCount = isEditMode
        ? (this.existingPropertyImageUrls || []).length
        : 0;

    const newImageCount =
        this.selectedPropertyImages.length;

    const totalImageCount =
        existingImageCount + newImageCount;

    if (totalImageCount < 4) {
        this.showPropertyImageMessage(
            "Please make sure your property has at least four images."
        );

        document.getElementById("propertyImages")?.focus();
        return;
    }

    if (totalImageCount > 5) {
        this.showPropertyImageMessage(
            "A property can have a maximum of five images. Please remove some newly selected images."
        );
        return;
    }

    // ======================================
    // PREVENT DUPLICATE SUBMISSIONS
    // ======================================

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const saveButton = document.getElementById("savePropertyButton");

    const originalButtonText = isEditMode
        ? "Save Changes"
        : "Save Property";

    if (saveButton) {
        saveButton.disabled = true;
        saveButton.textContent = isEditMode
            ? "Updating property..."
            : "Saving property...";
    }

    try {
        await this.savePropertyToSupabase(form);

    } finally {
        this.isSubmitting = false;

        if (saveButton) {
            saveButton.disabled = false;
            saveButton.textContent = originalButtonText;
        }
    }
},
};

/* ==========================================
   INITIALIZE DASHBOARD
   ========================================== */

function initializeCampusNestLandlordDashboard() {
    LandlordDashboard.init();
}

if (document.readyState === "loading") {
    document.addEventListener(
        "DOMContentLoaded",
        initializeCampusNestLandlordDashboard,
        { once: true }
    );
} else {
    initializeCampusNestLandlordDashboard();
}
