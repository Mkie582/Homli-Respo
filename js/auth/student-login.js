// ==========================================
// CAMPUSNEST STUDENT LOGIN
// PHASE 5 → STEP 5.4.8.1
// ==========================================


document.addEventListener(
    "DOMContentLoaded",
    () => {

        console.log(
            "CampusNest Student Login loaded."
        );


        initializeStudentLogin();

    }
);


// ==========================================
// INITIALIZE
// ==========================================

function initializeStudentLogin() {

    const form =
        document.getElementById(
            "studentLoginForm"
        );


    const passwordInput =
        document.getElementById(
            "studentPassword"
        );


    const togglePassword =
        document.getElementById(
            "togglePassword"
        );


    const forgotPassword =
        document.getElementById(
            "forgotPassword"
        );


    if (!form) {

        console.error(
            "Student login form not found."
        );

        return;
    }


    // ======================================
    // FORM SUBMIT
    // ======================================

    form.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await handleStudentLogin();

        }
    );


    // ======================================
    // SHOW / HIDE PASSWORD
    // ======================================

    if (togglePassword && passwordInput) {

        togglePassword.addEventListener(
            "click",
            () => {

                const isPassword =
                    passwordInput.type === "password";


                passwordInput.type =
                    isPassword
                        ? "text"
                        : "password";


                togglePassword.innerHTML =
                    isPassword
                        ? '<i class="fa-solid fa-eye-slash"></i>'
                        : '<i class="fa-solid fa-eye"></i>';


                togglePassword.setAttribute(
                    "aria-label",
                    isPassword
                        ? "Hide password"
                        : "Show password"
                );

            }
        );

    }


    // ======================================
    // FORGOT PASSWORD
    // ======================================

    if (forgotPassword) {

        forgotPassword.addEventListener(
            "click",
            async (event) => {

                event.preventDefault();

                await handleForgotPassword();

            }
        );

    }

}


// ==========================================
// STUDENT LOGIN
// ==========================================

async function handleStudentLogin() {

    const emailInput =
        document.getElementById(
            "studentEmail"
        );


    const passwordInput =
        document.getElementById(
            "studentPassword"
        );


    const button =
        document.getElementById(
            "studentLoginButton"
        );


    const buttonText =
        document.getElementById(
            "loginButtonText"
        );


    const spinner =
        document.getElementById(
            "loginSpinner"
        );


    const email =
        emailInput.value.trim();


    const password =
        passwordInput.value;


    clearLoginMessages();


    // ======================================
    // BASIC VALIDATION
    // ======================================

    if (!email || !password) {

        showLoginError(
            "Please enter your email address and password."
        );

        return;
    }


    // ======================================
    // LOADING
    // ======================================

    button.disabled = true;


    if (buttonText) {

        buttonText.textContent =
            "Signing in...";

    }


    if (spinner) {

        spinner.style.display =
            "inline-flex";

    }


    try {

        console.log(
            "Student login attempt:",
            email
        );


        // ==================================
        // SUPABASE AUTH
        // ==================================

        const {
            data,
            error
        } =
            await campusSupabase.auth.signInWithPassword({

                email:
                    email,

                password:
                    password

            });


        // ==================================
        // AUTH ERROR
        // ==================================

        if (error) {

            console.error(
                "Student login error:",
                error
            );


            showLoginError(
                getFriendlyAuthError(
                    error
                )
            );


            return;
        }


        if (!data || !data.user) {

            showLoginError(
                "We could not complete your sign in. Please try again."
            );


            return;
        }


        const user =
            data.user;


        console.log(
            "Student authenticated:",
            user
        );


        // ==================================
        // CHECK STUDENT PROFILE
        // ==================================

        const isStudent =
            await verifyStudentAccount(
                user.id
            );


        if (!isStudent) {

            console.error(
                "Authenticated account is not registered as a student."
            );


            await campusSupabase.auth.signOut();


            showLoginError(
                "This account is not registered as a student. Please use a student account."
            );


            return;
        }


        // ==================================
        // SUCCESS
        // ==================================

        showLoginSuccess(
            "Signed in successfully. Opening CampusNest..."
        );


        console.log(
            "CampusNest student login successful."
        );


        // ==================================
        // REDIRECT
        // ==================================

        setTimeout(
            () => {

                redirectAfterStudentLogin();

            },
            700
        );


    } catch (error) {

        console.error(
            "Unexpected student login error:",
            error
        );


        showLoginError(
            "Something went wrong while signing in. Please try again."
        );

    } finally {

        button.disabled = false;


        if (buttonText) {

            buttonText.textContent =
                "Sign In";

        }


        if (spinner) {

            spinner.style.display =
                "none";

        }

    }

}



// ==========================================
// VERIFY STUDENT ACCOUNT
// Uses shared CampusNest authentication utility
// ==========================================

async function verifyStudentAccount(userId) {

    try {

        console.log(
            "Checking Homli student profile..."
        );

        const result =
            await CampusNestAuth.verifyAccountRole(
                userId,
                "student"
            );

        if (!result.success) {

            console.warn(
                "Student account verification failed:",
                result.reason
            );

            return false;
        }

        console.log(
            "Homli student profile verified:",
            result.profile
        );

        return true;

    } catch (error) {

        console.error(
            "Student profile verification failed:",
            error
        );

        return false;

    }

}




// ==========================================
// REDIRECT AFTER STUDENT LOGIN
// Uses shared safe redirect utility
// ==========================================

function redirectAfterStudentLogin() {

    CampusNestAuth.redirectAfterLogin(
        "index.html"
    );

}



// ==========================================
// FORGOT PASSWORD
// ==========================================

async function handleForgotPassword() {

    const emailInput =
        document.getElementById(
            "studentEmail"
        );


    const email =
        emailInput.value.trim();


    clearLoginMessages();


    if (!email) {

        showLoginError(
            "Enter your email address first, then click Forgot password."
        );

        emailInput.focus();

        return;
    }


    try {

        const {
            error
        } =
            await campusSupabase.auth.resetPasswordForEmail(
                email,
                {
                    redirectTo:
                        `${window.location.origin}/reset-password.html`
                }
            );


        if (error) {

            console.error(
                "Password reset error:",
                error
            );


            showLoginError(
                getFriendlyAuthError(
                    error
                )
            );


            return;
        }


        showLoginSuccess(
            "If an account exists with this email, a password reset link has been sent."
        );

    } catch (error) {

        console.error(
            "Forgot password error:",
            error
        );


        showLoginError(
            "Unable to request a password reset right now."
        );

    }

}


// ==========================================
// FRIENDLY AUTH ERRORS
// ==========================================

function getFriendlyAuthError(
    error
) {

    if (!error) {

        return "Unable to sign in.";
    }


    const message =
        String(
            error.message || ""
        ).toLowerCase();


    if (
        message.includes(
            "invalid login credentials"
        )
    ) {

        return "The email or password is incorrect.";

    }


    if (
        message.includes(
            "email not confirmed"
        )
    ) {

        return "Please confirm your email address before signing in.";

    }


    if (
        message.includes(
            "too many requests"
        )
    ) {

        return "Too many login attempts. Please wait a moment and try again.";

    }


    if (
        message.includes(
            "user not found"
        )
    ) {

        return "No CampusNest account was found with this email.";

    }


    return (
        error.message ||
        "Unable to sign in. Please try again."
    );

}


// ==========================================
// SHOW ERROR
// ==========================================

function showLoginError(
    message
) {

    const errorBox =
        document.getElementById(
            "studentLoginError"
        );


    const errorText =
        document.getElementById(
            "studentLoginErrorText"
        );


    if (errorText) {

        errorText.textContent =
            message;

    }


    if (errorBox) {

        errorBox.style.display =
            "flex";

    }

}


// ==========================================
// SHOW SUCCESS
// ==========================================

function showLoginSuccess(
    message
) {

    const successBox =
        document.getElementById(
            "studentLoginSuccess"
        );


    const successText =
        document.getElementById(
            "studentLoginSuccessText"
        );


    if (successText) {

        successText.textContent =
            message;

    }


    if (successBox) {

        successBox.style.display =
            "flex";

    }

}


// ==========================================
// CLEAR MESSAGES
// ==========================================

function clearLoginMessages() {

    const errorBox =
        document.getElementById(
            "studentLoginError"
        );


    const successBox =
        document.getElementById(
            "studentLoginSuccess"
        );


    if (errorBox) {

        errorBox.style.display =
            "none";

    }


    if (successBox) {

        successBox.style.display =
            "none";

    }

}


console.log(
    "Homli Student Login JS loaded."
);