async function loadScript(src) {

    return new Promise((resolve, reject) => {

        const script =
            document.createElement("script");

        script.src = src;

        script.onload = resolve;

        script.onerror = reject;

        document.body.appendChild(script);

    });

}


async function initializeCampusSearchLoader(){

    try {

        // ==========================================
        // LOAD SUPABASE LISTINGS
        // ==========================================

        // await loadScript(
        //     "js/supabaseListings.js"
        // );


        // ==========================================
        // GET REAL LISTINGS FROM SUPABASE
        // ==========================================

        console.log(
            "Loading CampusNest listings from Supabase..."
        );


        const listings =
            await SupabaseListings.getListings();


        console.log(
            "CampusNest Supabase listings:",
            listings
        );


        console.log(
            "Number of Supabase listings:",
            listings.length
        );


        // ==========================================
        // MAKE SUPABASE DATA AVAILABLE TO SEARCH
        // ==========================================

        window.searchData =
            listings;


        // ==========================================
        // LOAD SEARCH SYSTEM
        // ==========================================

        await loadScript(
            "js/search/searchElements.js"
        );

        await loadScript(
            "js/search/searchService.js"
        );

        await loadScript(
            "js/search/searchRecent.js"
        );

        await loadScript(
            "js/search/searchRenderer.js"
        );

        await loadScript(
            "js/search/searchSuggestions.js"
        );

        await loadScript(
            "js/search/searchKeyboard.js"
        );

        await loadScript(
            "js/search/searchPopup.js"
        );

        await loadScript(
            "js/search/searchBudget.js"
        );

        await loadScript(
            "js/search/searchCalendar.js"
        );

        await loadScript(
            "js/search/searchFilters.js"
        );

        await loadScript(
            "js/search/searchAdvancedFilters.js"
        );

        await loadScript(
            "js/search/search.js"
        );

        await loadScript(
            "js/search/searchMobile.js"
        );

        await loadScript(
            "js/searchResponsive.js"
        );


        // ==========================================
        // INITIALIZE SEARCH
        // ==========================================

        initializeCampusSearch();


        console.log(
            "CampusNest Search Engine initialized."
        );


    } catch(error){

        console.error(
            "CampusNest Search initialization failed:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        const searchContainer =
            document.getElementById(
                "campusSearch"
            );


        if(!searchContainer){

            console.log(
                "CampusNest Search container not found."
            );

            return;

        }


        try {

            const response =
                await fetch(
                    "searchComponent.html"
                );


            if(!response.ok){

                throw new Error(
                    "Could not load searchComponent.html"
                );

            }


            const searchHTML =
                await response.text();


            searchContainer.innerHTML =
                searchHTML;


            console.log(
                "CampusNest Search HTML loaded."
            );


            await initializeCampusSearchLoader();


        } catch(error){

            console.error(
                "CampusNest Search failed:",
                error
            );

        }

    }
);