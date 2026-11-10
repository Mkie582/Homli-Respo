const SearchSuggestions = {

    desktopContainer: null,
    mobileContainer: null,
    selectedIndex:-1,

    suggestions:[],


    // ======================================
    // INITIALIZE
    // ======================================

    init(){

        this.desktopContainer =
        document.getElementById("searchSuggestions");

        this.mobileContainer =
        document.getElementById("mobileSearchSuggestions");

    },


    // ======================================
    // GET SUGGESTIONS
    // ======================================

    getSuggestions(keyword){

        if(!keyword.trim()){

            return [];

        }

        keyword = keyword.toLowerCase();

        return searchData.filter(item=>{

            return (

                item.title.toLowerCase().includes(keyword) ||

                item.category.toLowerCase().includes(keyword) ||

                item.location.toLowerCase().includes(keyword)

            );

        }).slice(0,5);

    },


    // ======================================
    // RENDER
    // ======================================

    render(keyword){

        const suggestions =
        this.getSuggestions(keyword);

        this.suggestions = suggestions;

        this.selectedIndex = -1;


        // ======================================
        // GET ELEMENTS
        // ======================================

        const desktopRecent =
            document.getElementById("recentContainer");

        const mobileRecent =
            document.getElementById("mobileRecentContainer");

        const desktopResults =
            document.getElementById("searchResults");

        const mobileResults =
            document.getElementById("mobileSearchResults");

        const mobileFilters =
            document.getElementById("mobileFilters");


     
        // ======================================
        // RECENT SEARCHES AND FILTER VISIBILITY
        // ======================================

        const hasKeyword = keyword.trim() !== "";

        // Desktop recent searches
        if (desktopRecent) {
            desktopRecent.style.display =
                hasKeyword ? "none" : "";
        }

        // Mobile recent searches
        if (mobileRecent) {
            mobileRecent.style.display =
                hasKeyword ? "none" : "";
        }

        // IMPORTANT:
        // Suggestions must never clear or hide actual
        // search results. SearchRenderer controls results.
        //
        // Do not change mobileResults.innerHTML here.
        // Do not add/remove show-results or hide-results here.
        // Do not set mobileResults.style.display here.

        if (mobileFilters) {
            mobileFilters.classList.toggle("hide", hasKeyword);
        }

        // ======================================
        // CREATE SUGGESTIONS HTML
        // ======================================

        const html = suggestions.map(item=>`

            <div
                class="suggestion-item"
                data-title="${item.title}"
            >

                <i class="${item.icon}"></i>

                <div class="suggestion-text">

                    ${this.highlightMatch(
                        item.title,
                        keyword
                    )}

                </div>

                <div class="suggestion-category">

                    ${item.category}

                </div>

            </div>

        `).join("");


        // ======================================
        // DESKTOP SUGGESTIONS
        // ======================================

        if(this.desktopContainer){

            this.desktopContainer.innerHTML =
                html;

            this.desktopContainer.classList.toggle(

                "active",

                suggestions.length > 0

            );

        }


        // ======================================
        // MOBILE SUGGESTIONS
        // ======================================

        if(this.mobileContainer){

            this.mobileContainer.innerHTML =
                html;

            this.mobileContainer.classList.toggle(

                "active",

                suggestions.length > 0

            );

        }


        // ======================================
        // ATTACH EVENTS
        // ======================================

        this.attachEvents();

    },


    // ======================================
    // HIGHLIGHT MATCH
    // ======================================

    highlightMatch(text, keyword){

        if(!keyword){

            return text;

        }

        const escapedKeyword =
            keyword.replace(
                /[.*+?^${}()|[\]\\]/g,
                "\\$&"
            );

        const regex =
            new RegExp(
                `(${escapedKeyword})`,
                "gi"
            );

        return text.replace(
            regex,
            "<mark>$1</mark>"
        );

    },


    // ======================================
    // ATTACH EVENTS
    // ======================================

    attachEvents(){

        document

        .querySelectorAll(".suggestion-item")

        .forEach(item=>{

            item.onclick = ()=>{


                // ==================================
                // GET KEYWORD
                // ==================================

                const keyword =
                    item.dataset.title;


                // ==================================
                // DESKTOP INPUT
                // ==================================

                const desktop =
                    document.getElementById(
                        "searchInput"
                    );

                if(desktop){

                    desktop.value =
                        keyword;

                }


                // ==================================
                // MOBILE INPUT
                // ==================================

                const mobile =
                    document.getElementById(
                        "mobileSearchInput"
                    );

                if(mobile){

                    mobile.value =
                        keyword;

                }


                // ==================================
                // SAVE RECENT SEARCH
                // ==================================

                SearchRecent.save(
                    keyword
                );

                SearchRecent.render();


                // ==================================
                // RUN SEARCH
                // ==================================

                renderResults(
                    keyword
                );


                // ==================================
                // GET RESULTS / FILTERS
                // ==================================

                const desktopResults =
                    document.getElementById(
                        "searchResults"
                    );

                const mobileResults =
                    document.getElementById(
                        "mobileSearchResults"
                    );

                const mobileFilters =
                    document.getElementById(
                        "mobileFilters"
                    );


                // ==================================
                // DESKTOP RESULTS
                // ==================================

                if(desktopResults){

                    desktopResults.style.display =
                        "block";

                }


                // ==================================
                // MOBILE RESULTS
                // ==================================

                if(mobileResults){

                    mobileResults.classList.remove(
                        "hide-results"
                    );

                    mobileResults.classList.add(
                        "show-results"
                    );

                    mobileResults.style.display =
                        "flex";

                }


                // ==================================
                // MOBILE FILTERS
                // ==================================

                if(mobileFilters){

                    mobileFilters.classList.add(
                        "hide"
                    );

                }


                // ==================================
                // HIDE SUGGESTIONS
                // ==================================

                this.hide();

            };

        });

    },


    // ======================================
    // KEYBOARD HIGHLIGHT
    // ======================================

    highlight(index){

        const items =
            document.querySelectorAll(
                ".suggestion-item"
            );


        items.forEach(item=>{

            item.classList.remove(
                "active"
            );

        });


        if(items[index]){

            items[index].classList.add(
                "active"
            );

            items[index].scrollIntoView({

                block:"nearest"

            });

        }

    },


    // ======================================
    // HIDE SUGGESTIONS
    // ======================================

    hide(){

        this.selectedIndex = -1;

        this.suggestions = [];


        // ==================================
        // DESKTOP
        // ==================================

        if(this.desktopContainer){

            this.desktopContainer.classList.remove(
                "active"
            );

            this.desktopContainer.innerHTML="";

        }


        // ==================================
        // MOBILE
        // ==================================

        if(this.mobileContainer){

            this.mobileContainer.classList.remove(
                "active"
            );

            this.mobileContainer.innerHTML="";

        }


        // ==================================
        // RECENT SEARCHES
        // ==================================

        const desktopRecent =
            document.getElementById(
                "recentContainer"
            );

        const mobileRecent =
            document.getElementById(
                "mobileRecentContainer"
            );


        if (desktopRecent) {
    const desktopInput =
        document.getElementById("searchInput");

    desktopRecent.style.display =
        desktopInput && desktopInput.value.trim()
            ? "none"
            : "";
}


        if (mobileRecent) {
    const mobileInput =
        document.getElementById("mobileSearchInput");

    mobileRecent.style.display =
        mobileInput && mobileInput.value.trim()
            ? "none"
            : "";
}

    }

};