
/* =====================================================
   CAMPUSNEST LANDLORD LOGIN

   PHASE 8.2.1 — SHARED AUTHENTICATION INTEGRATION

   Supports:
   - Supabase email/password authentication
   - Shared landlord profile verification
   - Safe post-login redirects
   - Error handling
   - Login button loading states
===================================================== */

(function () {

    "use strict";


    // =================================================
    // GET HTML ELEMENTS
    // =================================================

    const loginForm =
        document.getElementById("landlordLoginForm");

    const emailInput =
        document.getElementById("landlordEmail");

    const passwordInput =
        document.getElementById("landlordPassword");

    const loginButton =
        document.getElementById("landlordLoginButton");

    const loginError =
        document.getElementById("loginError");


    // =================================================
    // CHECK REQUIRED ELEMENTS
    // =================================================

    if (
        !loginForm ||
        !emailInput ||
        !passwordInput ||
        !loginButton ||
        !loginError
    ) {

        console.error(
            "CampusNest landlord login: Required HTML elements are missing."
        );

        return;

    }


    // =================================================
    // DISPLAY LOGIN ERROR
    // =================================================

    function showLoginError(message) {

        loginError.textContent = message;

        loginError.style.display = "block";

    }


    // =================================================
    // CLEAR LOGIN ERROR
    // =================================================

    function hideLoginError() {

        loginError.textContent = "";

        loginError.style.display = "none";

    }


    // =================================================
    // RESTORE LOGIN BUTTON
    // =================================================

    function restoreLoginButton() {

        loginButton.disabled = false;

        loginButton.innerHTML = `
            <i class="fa-solid fa-right-to-bracket"></i>
            Sign In
        `;

    }


    // =================================================
    // LOGIN FORM SUBMISSION
    // =================================================

    loginForm.addEventListener(
        "submit",
        async function (event) {

            event.preventDefault();

            hideLoginError();


            const email =
                emailInput.value.trim();

            const password =
                passwordInput.value;


            // -----------------------------------------
            // VALIDATE INPUT
            // -----------------------------------------

            if (!email || !password) {

                showLoginError(
                    "Please enter your email and password."
                );

                return;

            }


            // -----------------------------------------
            // SHOW LOADING STATE
            // -----------------------------------------

            loginButton.disabled = true;

            loginButton.innerHTML = `
                <i class="fa-solid fa-spinner fa-spin"></i>
                Signing in...
            `;


            try {

                // -------------------------------------
                // SIGN IN WITH SUPABASE
                // -------------------------------------

                const {
                    data,
                    error
                } = await campusSupabase.auth
                    .signInWithPassword({

                        email: email,

                        password: password

                    });


                if (error) {

                    console.error(
                        "Landlord login error:",
                        error
                    );

                    showLoginError(
                        error.message ||
                        "Unable to sign in. Please try again."
                    );

                    return;

                }


                if (!data.user) {

                    showLoginError(
                        "Login succeeded but no user was returned."
                    );

                    return;

                }


                console.log(
                    "Landlord authenticated:",
                    data.user.email
                );


                // -------------------------------------
                // VERIFY LANDLORD ROLE
                // -------------------------------------

                const verification =
                    await CampusNestAuth.verifyAccountRole(
                        data.user.id,
                        "landlord"
                    );


                if (!verification.success) {

                    console.error(
                        "Landlord profile verification failed:",
                        verification.reason
                    );


                    // End the session if the account
                    // does not have the landlord role.

                    await campusSupabase.auth.signOut();


                    if (
                        verification.reason ===
                        "profile_not_found"
                    ) {

                        showLoginError(
                            "Your account profile could not be found. Please contact CampusNest support."
                        );

                    } else {

                        showLoginError(
                            "This account is not registered as a landlord. Please use the correct sign-in page."
                        );

                    }

                    return;

                }


                console.log(
                    "Landlord profile verified:",
                    verification.profile
                );


                // -------------------------------------
                // REDIRECT AFTER SUCCESSFUL LOGIN
                // -------------------------------------

                CampusNestAuth.redirectAfterLogin(
                    "landlord-dashboard.html"
                );


            } catch (error) {

                console.error(
                    "Unexpected landlord login error:",
                    error
                );


                showLoginError(
                    "Something went wrong while signing in. Please try again."
                );

            } finally {

                restoreLoginButton();

            }

        }
    );


    console.log(
        "Homli Landlord Login JS loaded."
    );

})();