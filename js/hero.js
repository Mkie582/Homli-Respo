const hero = document.querySelector(".hero");
const showcase = document.getElementById("heroShowcase");

let targetX = 0;
let targetY = 0;
let currentX = 0;
let currentY = 0;

if (hero && showcase) {

    hero.addEventListener("mousemove", (e) => {

        targetX = ((e.clientX / window.innerWidth) - 0.5) * 18;
        targetY = ((e.clientY / window.innerHeight) - 0.5) * 18;

    });

    hero.addEventListener("mouseleave", () => {

        targetX = 0;
        targetY = 0;

    });

    function animateParallax() {

        currentX += (targetX - currentX) * 0.08;
        currentY += (targetY - currentY) * 0.08;

        showcase.style.transform =
            `translate(${currentX}px, ${currentY}px)`;

        requestAnimationFrame(animateParallax);

    }

    animateParallax();

}

const cards = document.querySelectorAll(".showcase-card");

cards.forEach(card => {

    card.addEventListener("click", () => {

        const link = card.dataset.link;

        if (link) {

            window.location.href = link;

        }

    });

});

