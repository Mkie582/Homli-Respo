document.addEventListener("DOMContentLoaded", () => {

    /* ==========================
       ELEMENTS
    ========================== */

    const header = document.getElementById("header");
    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");
    const navLinks = document.querySelectorAll(".nav-link");

    /* ==========================
       MOBILE OVERLAY
    ========================== */

    const overlay = document.createElement("div");
    overlay.classList.add("nav-overlay");
    document.body.appendChild(overlay);

    /* ==========================
       OPEN MENU
    ========================== */

    function openMenu() {

        navMenu.classList.add("open");
        overlay.classList.add("show");
        menuToggle.classList.add("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.style.overflow = "hidden";

    }

    /* ==========================
       CLOSE MENU
    ========================== */

    function closeMenu() {

        navMenu.classList.remove("open");
        overlay.classList.remove("show");
        menuToggle.classList.remove("active");

        menuToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.style.overflow = "";

    }

    /* ==========================
       MENU BUTTON
    ========================== */

    menuToggle.addEventListener("click", () => {

        if (navMenu.classList.contains("open")) {

            closeMenu();

        } else {

            openMenu();

        }

    });

    /* ==========================
       CLOSE WHEN CLICKING LINK
    ========================== */

    navLinks.forEach(link => {

        link.addEventListener("click", () => {

            if (window.innerWidth <= 992) {

                closeMenu();

            }

        });

    });

    /* ==========================
       CLOSE OVERLAY
    ========================== */

    overlay.addEventListener("click", closeMenu);

    /* ==========================
       ESC KEY
    ========================== */

    document.addEventListener("keydown", e => {

        if (e.key === "Escape") {

            closeMenu();

        }

    });

/* ==========================
   SMART NAVBAR
========================== */

let lastScroll = 0;

function handleScroll(){

    const currentScroll = window.pageYOffset;

    if(currentScroll <= 0){

        header.classList.remove("hide");

        header.classList.remove("scrolled");

        lastScroll = currentScroll;

        return;

    }

    if(currentScroll > 40){

        header.classList.add("scrolled");

    }else{

        header.classList.remove("scrolled");

    }

    if(

        currentScroll > lastScroll &&

        currentScroll > 120

    ){

        header.classList.add("hide");

    }

    else{

        header.classList.remove("hide");

    }

    lastScroll = currentScroll;

}

window.addEventListener("scroll",handleScroll,{
    passive:true
});

handleScroll();

    /* ==========================
       ACTIVE SECTION
    ========================== */

    const sections = document.querySelectorAll("section[id]");

    function highlightMenu() {

        let scrollY = window.scrollY + 150;

        sections.forEach(section => {

            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute("id");

            if (

                scrollY >= top &&
                scrollY < top + height

            ) {

                navLinks.forEach(link => {

                    link.classList.remove("active");

                });

                const activeLink = document.querySelector(

                    `.nav-link[href="#${id}"]`

                );

                if (activeLink) {

                    activeLink.classList.add("active");

                }

            }

        });

    }

    window.addEventListener("scroll", highlightMenu);

    highlightMenu();

    /* ==========================
       SMOOTH SCROLL
    ========================== */

    navLinks.forEach(link => {

        link.addEventListener("click", e => {

            const targetID = link.getAttribute("href");

            if (!targetID.startsWith("#")) return;

            const target = document.querySelector(targetID);

            if (!target) return;

            e.preventDefault();

            target.scrollIntoView({

                behavior: "smooth"

            });

        });

    });

});