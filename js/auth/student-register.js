
/* =========================================================
   CAMPUSNEST — STUDENT REGISTRATION
   PHASE 8.2.2 — STEP 2

   Supabase Authentication Integration

   Features:
   - Student account creation
   - First and last name metadata
   - Student role assignment
   - Email verification support
   - Password validation
   - Password visibility toggle
   - Duplicate account response handling
   - Loading states
   - Friendly error messages
========================================================= */


/* =========================================================
   1. INITIALIZE WHEN PAGE LOADS
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initializeStudentRegistration();
});


/* =========================================================
   2. INITIALIZE REGISTRATION
========================================================= */

function initializeStudentRegistration() {

    const form = document.getElementById("studentRegisterForm");

    if (!form) {
        console.error(
            "CampusNest: Student registration form was not found."
        );
        return;
    }


    /* -----------------------------------------------------
       FORM ELEMENTS
    ----------------------------------------------------- */

    const firstNameInput = document.getElementById("firstName");
    const lastNameInput = document.getElementById("lastName");
    const emailInput = document.getElementById("registerEmail");

    const passwordInput = document.getElementById("registerPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");

    const termsCheckbox = document.getElementById("acceptTerms");

    const registerButton = document.getElementById("studentRegisterButton");
    const registerButtonText = document.getElementById("registerButtonText");
    const registerSpinner = document.getElementById("registerSpinner");

    const messageContainer = document.getElementById("registerMessage");


    /* -----------------------------------------------------
       CHECK REQUIRED ELEMENTS
    ----------------------------------------------------- */

    if (
        !firstNameInput ||
        !lastNameInput ||
        !emailInput ||
        !passwordInput ||
        !confirmPasswordInput ||
        !termsCheckbox ||
        !registerButton ||
        !messageContainer
    ) {
        console.error(
            "CampusNest: One or more registration form elements are missing."
        );
        return;
    }


    let isSubmitting = false;


    /* =====================================================
       3. PASSWORD VISIBILITY
    ===================================================== */

    initializePasswordToggles();


    /* =====================================================
       4. FORM SUBMISSION
    ===================================================== */

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (isSubmitting) {
            return;
        }

        hideRegistrationMessage();


        /* -------------------------------------------------
           GET FORM VALUES
        ------------------------------------------------- */

        const firstName = firstNameInput.value.trim();
        const lastName = lastNameInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();

        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;

        const acceptedTerms = termsCheckbox.checked;


        /* =================================================
           5. VALIDATION
        ================================================= */

        if (
            !firstName ||
            !lastName ||
            !email ||
            !password ||
            !confirmPassword
        ) {
            showRegistrationMessage(
                "Please complete all required fields.",
                "error"
            );
            return;
        }


        // First name validation

        if (firstName.length > 60) {
            showRegistrationMessage(
                "Your first name must not exceed 60 characters.",
                "error"
            );

            firstNameInput.focus();
            return;
        }


        // Last name validation

        if (lastName.length > 60) {
            showRegistrationMessage(
                "Your last name must not exceed 60 characters.",
                "error"
            );

            lastNameInput.focus();
            return;
        }


        // Email validation

        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailPattern.test(email)) {
            showRegistrationMessage(
                "Please enter a valid email address.",
                "error"
            );

            emailInput.focus();
            return;
        }


        // Password length validation

        if (password.length < 8) {
            showRegistrationMessage(
                "Your password must contain at least 8 characters.",
                "error"
            );

            passwordInput.focus();
            return;
        }


        // Password confirmation

        if (password !== confirmPassword) {
            showRegistrationMessage(
                "Your passwords do not match. Please check them.",
                "error"
            );

            confirmPasswordInput.focus();
            return;
        }


        // Terms acceptance

        if (!acceptedTerms) {
            showRegistrationMessage(
                "Please accept the Terms of Service and Privacy Policy to continue.",
                "error"
            );

            termsCheckbox.focus();
            return;
        }


        /* =================================================
           6. CHECK SUPABASE CONNECTION
        ================================================= */

        if (
            !window.campusSupabase ||
            !window.campusSupabase.auth
        ) {
            console.error(
                "CampusNest: Supabase client is unavailable."
            );

            showRegistrationMessage(
                "We could not connect to our registration service. Please refresh the page and try again.",
                "error"
            );

            return;
        }


        /* =================================================
           7. START REGISTRATION
        ================================================= */

        isSubmitting = true;

        setRegistrationLoading(true);


        try {

            /* ---------------------------------------------
               EMAIL VERIFICATION REDIRECT

               After the student verifies their email,
               Supabase returns them to index.html.

               Ensure this URL is allowed in your
               Supabase Authentication URL Configuration.
            --------------------------------------------- */

            const emailRedirectTo = new URL(
                "index.html",
                window.location.href
            ).href;


            /* =============================================
               8. CREATE STUDENT ACCOUNT
            ============================================= */

            const { data, error } =
                await window.campusSupabase.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        emailRedirectTo: emailRedirectTo,

                        data: {
                            first_name: firstName,
                            last_name: lastName,
                            role: "student"
                        }

                    }

                });


            /* =============================================
               9. HANDLE SUPABASE ERRORS
            ============================================= */

            if (error) {

                console.error(
                    "CampusNest registration error:",
                    error
                );

                showRegistrationMessage(
                    getRegistrationErrorMessage(error),
                    "error"
                );

                return;
            }


            /* =============================================
               10. CHECK REGISTRATION RESPONSE
            ============================================= */

            if (!data || !data.user) {

                showRegistrationMessage(
                    "We could not complete your registration. Please try again.",
                    "error"
                );

                return;
            }


            /* =============================================
               11. POSSIBLE EXISTING ACCOUNT

               Supabase may return an empty identities
               array for an email that is already registered,
               rather than returning a direct error.
            ============================================= */

            if (
                Array.isArray(data.user.identities) &&
                data.user.identities.length === 0
            ) {

                showRegistrationMessage(
                    "We could not create an account with those details. Please check your email or try signing in.",
                    "error"
                );

                return;
            }


            /* =============================================
               12. EMAIL CONFIRMATION REQUIRED
            ============================================= */

            if (!data.session) {

                showRegistrationMessage(
                    "Your account has been created successfully! Please check your email for a verification link before signing in.",
                    "success"
                );

                form.reset();

                console.log(
                    "CampusNest: Student account created. Email confirmation is pending."
                );

                return;
            }


            /* =============================================
               13. EMAIL CONFIRMATION DISABLED

               If Supabase immediately authenticates the
               student, send them to the homepage.
            ============================================= */

            showRegistrationMessage(
                "Your account has been created successfully. Redirecting...",
                "success"
            );

            console.log(
                "CampusNest: Student account created and authenticated."
            );

            window.location.href = "index.html";


        } catch (error) {

            /* =============================================
               14. UNEXPECTED ERRORS
            ============================================= */

            console.error(
                "CampusNest: Unexpected student registration error:",
                error
            );

            showRegistrationMessage(
                "Something went wrong while creating your account. Please try again.",
                "error"
            );


        } finally {

            isSubmitting = false;

            setRegistrationLoading(false);

        }

    });


    /* =====================================================
       15. SHOW REGISTRATION MESSAGE
    ===================================================== */

    function showRegistrationMessage(message, type) {

        messageContainer.textContent = message;

        messageContainer.className =
            "register-message " + type;

        messageContainer.style.display = "block";

        messageContainer.setAttribute("role", "alert");

        messageContainer.scrollIntoView({
            behavior: "smooth",
            block: "nearest"
        });

    }


    /* =====================================================
       16. HIDE REGISTRATION MESSAGE
    ===================================================== */

    function hideRegistrationMessage() {

        messageContainer.textContent = "";

        messageContainer.className = "register-message";

        messageContainer.style.display = "none";

    }


    /* =====================================================
       17. REGISTRATION LOADING STATE
    ===================================================== */

    function setRegistrationLoading(loading) {

        registerButton.disabled = loading;

        if (registerButtonText) {

            registerButtonText.textContent = loading
                ? "Creating your account..."
                : "Create Student Account";

        }

        if (registerSpinner) {

            registerSpinner.style.display = loading
                ? "inline-block"
                : "none";

        }

    }


    /* =====================================================
       18. PASSWORD VISIBILITY TOGGLES
    ===================================================== */

    function initializePasswordToggles() {

        const toggleButtons = document.querySelectorAll(
            "[data-password-toggle]"
        );

        toggleButtons.forEach((button) => {

            button.addEventListener("click", () => {

                const targetId = button.getAttribute(
                    "data-password-toggle"
                );

                const targetInput = document.getElementById(targetId);

                if (!targetInput) {

                    console.warn(
                        "CampusNest: Password input not found:",
                        targetId
                    );

                    return;
                }


                const isPassword =
                    targetInput.type === "password";


                targetInput.type = isPassword
                    ? "text"
                    : "password";


                button.setAttribute(
                    "aria-label",
                    isPassword ? "Hide password" : "Show password"
                );

                button.setAttribute(
                    "aria-pressed",
                    String(isPassword)
                );


                // Update the eye icon

                const icon = button.querySelector("i");

                if (icon) {

                    icon.className = isPassword
                        ? "fa-solid fa-eye-slash"
                        : "fa-regular fa-eye";

                }

            });

        });

    }


    /* =====================================================
       19. FRIENDLY SUPABASE ERROR MESSAGES
    ===================================================== */

    function getRegistrationErrorMessage(error) {

        const errorMessage = (
            error.message || ""
        ).toLowerCase();


        // Existing account

        if (
            errorMessage.includes("already registered") ||
            errorMessage.includes("already exists") ||
            errorMessage.includes("user already")
        ) {

            return "We could not create the account with those details. Please check your email address or try signing in.";

        }


        // Weak password

        if (
            errorMessage.includes("password") &&
            (
                errorMessage.includes("weak") ||
                errorMessage.includes("characters") ||
                errorMessage.includes("short")
            )
        ) {

            return "Your password does not meet the security requirements. Please choose a stronger password.";

        }


        // Invalid email

        if (
            errorMessage.includes("email") &&
            errorMessage.includes("invalid")
        ) {

            return "Please enter a valid email address.";

        }


        // Rate limiting

        if (
            errorMessage.includes("rate limit") ||
            errorMessage.includes("too many requests")
        ) {

            return "Too many registration attempts. Please wait a little while and try again.";

        }


        // Network errors

        if (
            errorMessage.includes("fetch") ||
            errorMessage.includes("network")
        ) {

            return "We could not reach the registration service. Please check your internet connection and try again.";

        }


        // General fallback

        return "We could not complete your registration. Please check your details and try again.";

    }


    /* =====================================================
       20. INITIALIZATION CONFIRMATION
    ===================================================== */

    console.log(
        "CampusNest: Student registration initialized successfully."
    );

}
