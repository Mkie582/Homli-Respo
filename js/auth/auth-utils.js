
/* =====================================================
   CAMPUSNEST SHARED AUTHENTICATION UTILITIES

   PHASE 8.2.1 — AUTHENTICATION FOUNDATION

   Responsibilities:
   - Retrieve authenticated user profiles
   - Verify student and landlord account roles
   - Safely handle post-login redirects
   - Provide reusable authentication helpers
===================================================== */

(function () {

    "use strict";


    // =================================================
    // AUTHENTICATION CONFIGURATION
    // =================================================

    const DEFAULT_REDIRECT = "index.html";


    const AUTH_PAGES = [
        "student-login.html",
        "landlord-login.html",
        "student-register.html",
        "landlord-register.html",
        "reset-password.html"
    ];


    // =================================================
    // CHECK SUPABASE CLIENT
    // =================================================

    function getSupabaseClient() {

        if (!window.campusSupabase) {

            throw new Error(
                "CampusNest Supabase client has not been initialized."
            );

        }

        return window.campusSupabase;

    }


    // =================================================
    // GET CURRENT USER
    // =================================================

    async function getCurrentUser() {

        const supabaseClient =
            getSupabaseClient();


        const {
            data,
            error
        } = await supabaseClient.auth.getUser();


        if (error) {

            throw error;

        }


        return data.user || null;

    }


    // =================================================
    // GET USER PROFILE
    // =================================================

    async function getUserProfile(userId) {

        if (!userId) {

            throw new Error(
                "A valid user ID is required."
            );

        }


        const supabaseClient =
            getSupabaseClient();


        const {
            data,
            error
        } = await supabaseClient
            .from("profiles")
            .select(
                "id, first_name, last_name, email, role, avatar_url"
            )
            .eq("id", userId)
            .maybeSingle();


        if (error) {

            throw error;

        }


        return data || null;

    }


    // =================================================
    // VERIFY ACCOUNT ROLE
    // =================================================

    async function verifyAccountRole(
        userId,
        expectedRole
    ) {

        const profile =
            await getUserProfile(userId);


        if (!profile) {

            return {
                success: false,
                profile: null,
                reason: "profile_not_found"
            };

        }


        const actualRole =
            String(profile.role || "")
                .trim()
                .toLowerCase();


        const requiredRole =
            String(expectedRole || "")
                .trim()
                .toLowerCase();


        if (actualRole !== requiredRole) {

            return {
                success: false,
                profile: profile,
                reason: "incorrect_role"
            };

        }


        return {
            success: true,
            profile: profile,
            reason: null
        };

    }


    // =================================================
    // SAFE POST-LOGIN REDIRECT
    // =================================================

    function getSafeRedirect(
        defaultDestination = DEFAULT_REDIRECT
    ) {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const requestedRedirect =
            params.get("redirect");


        // ---------------------------------------------
        // No requested redirect
        // ---------------------------------------------

        if (!requestedRedirect) {

            return defaultDestination;

        }


        const destination =
            requestedRedirect.trim();


        // ---------------------------------------------
        // Reject empty or malformed destinations
        // ---------------------------------------------

        if (
            !destination ||
            destination.startsWith("//") ||
            destination.startsWith("\\")
        ) {

            return defaultDestination;

        }


        try {

            const parsedURL =
                new URL(
                    destination,
                    window.location.origin
                );


            // -----------------------------------------
            // Only allow same-origin destinations
            // -----------------------------------------

            if (
                parsedURL.origin !==
                window.location.origin
            ) {

                return defaultDestination;

            }


            // -----------------------------------------
            // Reject unsupported URL protocols
            // -----------------------------------------

            if (
                parsedURL.protocol !== "http:" &&
                parsedURL.protocol !== "https:"
            ) {

                return defaultDestination;

            }


            // -----------------------------------------
            // Prevent authentication redirect loops
            // -----------------------------------------

            const destinationPage =
                parsedURL.pathname
                    .split("/")
                    .pop()
                    .toLowerCase();


            if (
                AUTH_PAGES.includes(
                    destinationPage
                )
            ) {

                return defaultDestination;

            }


            // -----------------------------------------
            // Return safe local destination
            // -----------------------------------------

            return (
                parsedURL.pathname +
                parsedURL.search +
                parsedURL.hash
            );

        } catch (error) {

            console.warn(
                "Invalid CampusNest redirect:",
                error
            );


            return defaultDestination;

        }

    }


    // =================================================
    // REDIRECT AFTER LOGIN
    // =================================================

    function redirectAfterLogin(
        defaultDestination = DEFAULT_REDIRECT
    ) {

        const destination =
            getSafeRedirect(
                defaultDestination
            );


        window.location.assign(
            destination
        );

    }


    // =================================================
    // EXPOSE SHARED AUTHENTICATION UTILITIES
    // =================================================

    window.CampusNestAuth = Object.freeze({

        getCurrentUser,

        getUserProfile,

        verifyAccountRole,

        getSafeRedirect,

        redirectAfterLogin

    });


    console.log(
        "Homli shared authentication utilities initialized."
    );

})();
