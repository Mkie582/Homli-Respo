document.addEventListener("DOMContentLoaded", () => {

    const announcement = document.getElementById("announcementBar");
    const closeBtn = document.getElementById("closeAnnouncement");

    if (!announcement || !closeBtn) return;

    // Check if user already closed it
    const isClosed = localStorage.getItem("announcementClosed");

    if (isClosed === "true") {
        announcement.style.display = "none";
        return;
    }

    closeBtn.addEventListener("click", () => {

        announcement.classList.add("hide");

        localStorage.setItem("announcementClosed", "true");

        setTimeout(() => {

            announcement.style.display = "none";

        }, 350);

    });

});