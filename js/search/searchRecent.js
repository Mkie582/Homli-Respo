const SearchRecent = {

    storageKey: "campusnest_recent_searches",

    maxItems: 5,


    // ======================================
    // SAVE CURRENT SEARCH
    // ======================================

    save(){

        // Get a copy of the current filters
        const currentFilters =
            SearchFilters.getAll();


        // Create a deep copy so future
        // filter changes don't modify the
        // saved search.
        const filters =
            JSON.parse(
                JSON.stringify(currentFilters)
            );


        // Check if there is actually
        // something worth saving
        if(!this.hasActiveSearch(filters)){

            return;

        }


        // Create readable label
        const label =
            this.createLabel(filters);


        let recent =
            this.get();


        // Remove an identical previous search
        recent =
            recent.filter(item => {

                return JSON.stringify(item.filters)
                    !==
                    JSON.stringify(filters);

            });


        // Add newest search first
        recent.unshift({

            label: label,

            filters: filters

        });


        // Keep maximum number
        if(
            recent.length >
            this.maxItems
        ){

            recent =
                recent.slice(
                    0,
                    this.maxItems
                );

        }


        localStorage.setItem(

            this.storageKey,

            JSON.stringify(recent)

        );


        // Refresh recent searches
        this.render();

    },


    // ======================================
    // CHECK IF SEARCH IS ACTIVE
    // ======================================

    hasActiveSearch(filters){

        // Keyword
        if(
            filters.keyword &&
            filters.keyword.trim() !== ""
        ){

            return true;

        }


        // Location
        if(
            filters.location &&
            filters.location !==
            "Any Location"
        ){

            return true;

        }


        // University
        if(
            filters.university &&
            filters.university !==
            "Any University"
        ){

            return true;

        }


        // Move In
        if(
            filters.moveIn &&
            filters.moveIn !==
            "Any Date"
        ){

            return true;

        }


        // Budget
        if(filters.budget){

            if(
                Number(filters.budget.min) !== 300 ||
                Number(filters.budget.max) !== 1500
            ){

                return true;

            }

        }


        // Housing Type
        if(
            filters.housingType &&
            filters.housingType !== "Any"
        ){

            return true;

        }


        // Gender
        if(
            filters.gender &&
            filters.gender !== "Any"
        ){

            return true;

        }


        // Lifestyle
        if(
            filters.lifestyle &&
            filters.lifestyle !== "Any"
        ){

            return true;

        }


        // Pets
        if(
            filters.pets &&
            filters.pets !== "Any"
        ){

            return true;

        }


        // Smoking
        if(
            filters.smoking &&
            filters.smoking !== "Any"
        ){

            return true;

        }


        // Furnished
        if(
            filters.furnished &&
            filters.furnished !== "Any"
        ){

            return true;

        }


        // Parking
        if(
            filters.parking &&
            filters.parking !== "Any"
        ){

            return true;

        }


        // Utilities
        if(
            filters.utilities &&
            filters.utilities !== "Any"
        ){

            return true;

        }


        // Category
        if(
            filters.category &&
            filters.category !==
            "All Categories"
        ){

            return true;

        }


        return false;

    },


    // ======================================
    // CREATE READABLE LABEL
    // ======================================

    createLabel(filters){

        const parts = [];


        // Keyword
        if(
            filters.keyword &&
            filters.keyword.trim() !== ""
        ){

            parts.push(
                filters.keyword.trim()
            );

        }


        // Location
        if(
            filters.location &&
            filters.location !==
            "Any Location"
        ){

            parts.push(
                filters.location
            );

        }


        // University
        if(
            filters.university &&
            filters.university !==
            "Any University"
        ){

            parts.push(
                filters.university
            );

        }


        // Move In
        if(
            filters.moveIn &&
            filters.moveIn !==
            "Any Date"
        ){

            parts.push(
                filters.moveIn
            );

        }


        // Budget
        if(filters.budget){

            const min =
                Number(filters.budget.min);

            const max =
                Number(filters.budget.max);


            if(
                min !== 300 ||
                max !== 1500
            ){

                parts.push(
                    `$${min} - $${max}`
                );

            }

        }


        // Housing Type
        if(
            filters.housingType &&
            filters.housingType !== "Any"
        ){

            parts.push(
                filters.housingType
            );

        }


        // Gender
        if(
            filters.gender &&
            filters.gender !== "Any"
        ){

            parts.push(
                filters.gender
            );

        }


        // Lifestyle
        if(
            filters.lifestyle &&
            filters.lifestyle !== "Any"
        ){

            parts.push(
                filters.lifestyle
            );

        }


        // Pets
        if(
            filters.pets &&
            filters.pets !== "Any"
        ){

            parts.push(
                filters.pets
            );

        }


        // Smoking
        if(
            filters.smoking &&
            filters.smoking !== "Any"
        ){

            parts.push(
                filters.smoking
            );

        }


        // Furnished
        if(
            filters.furnished &&
            filters.furnished !== "Any"
        ){

            parts.push(
                filters.furnished
            );

        }


        // Parking
        if(
            filters.parking &&
            filters.parking !== "Any"
        ){

            parts.push(
                filters.parking
            );

        }


        // Utilities
        if(
            filters.utilities &&
            filters.utilities !== "Any"
        ){

            parts.push(
                filters.utilities
            );

        }


        // Category
        if(
            filters.category &&
            filters.category !==
            "All Categories"
        ){

            parts.push(
                filters.category
            );

        }


        // Fallback
        if(parts.length === 0){

            return "All Listings";

        }


        return parts.join(" • ");

    },


    // ======================================
    // GET RECENT SEARCHES
    // ======================================

    get(){

        const stored =
            localStorage.getItem(
                this.storageKey
            );


        if(!stored){

            return [];

        }


        try{

            const recent =
                JSON.parse(stored);


            if(!Array.isArray(recent)){

                return [];

            }


            // ==================================
            // SUPPORT OLD SEARCH FORMAT
            // ==================================

            return recent.map(item => {

                // Old format:
                // ["roommate", "housing"]

                if(
                    typeof item ===
                    "string"
                ){

                    return {

                        label: item,

                        filters: {

                            keyword: item,

                            location:
                                "Any Location",

                            university:
                                "Any University",

                            moveIn:
                                "Any Date",

                            budget: {

                                min: 300,

                                max: 1500

                            },

                            housingType:
                                "Any",

                            gender:
                                "Any",

                            lifestyle:
                                "Any",

                            pets:
                                "Any",

                            smoking:
                                "Any",

                            furnished:
                                "Any",

                            parking:
                                "Any",

                            utilities:
                                "Any",

                            category:
                                "All Categories"

                        }

                    };

                }


                return item;

            });

        }catch(error){

            console.error(
                "Unable to load recent searches:",
                error
            );

            return [];

        }

    },


    // ======================================
    // CLEAR ALL
    // ======================================

    clear(){

        localStorage.removeItem(
            this.storageKey
        );


        this.render();

    },


    // ======================================
    // REMOVE ONE SEARCH
    // ======================================

    remove(index){

        let recent =
            this.get();


        recent.splice(
            index,
            1
        );


        localStorage.setItem(

            this.storageKey,

            JSON.stringify(recent)

        );


        this.render();

    },


    // ======================================
    // RENDER
    // ======================================

    render(){

        const desktopList =
            document.getElementById(
                "recentSearches"
            );


        const mobileList =
            document.getElementById(
                "mobileRecentSearches"
            );


        const recent =
            this.get();


        // ==================================
        // EMPTY STATE
        // ==================================

        if(recent.length === 0){

            const emptyHTML = `

                <li class="empty">

                    No recent searches

                </li>

            `;


            if(desktopList){

                desktopList.innerHTML =
                    emptyHTML;

            }


            if(mobileList){

                mobileList.innerHTML =
                    emptyHTML;

            }


            return;

        }


        // ==================================
        // CREATE SEARCH ITEMS
        // ==================================

        const html =
            recent.map(
                (item, index) => {

                    return `

                        <li
                            class="recent-item"
                            data-index="${index}"
                        >

                            <span
                                class="recent-search-content"
                            >

                                <i
                                    class="fa-solid fa-clock"
                                ></i>

                                <span
                                    class="recent-search-label"
                                >

                                    ${this.escapeHTML(
                                        item.label
                                    )}

                                </span>

                            </span>


                            <button
                                type="button"
                                class="remove-recent"
                                data-index="${index}"
                                aria-label="Remove recent search"
                            >

                                <i
                                    class="fa-solid fa-xmark"
                                ></i>

                            </button>

                        </li>

                    `;

                }
            ).join("");


        if(desktopList){

            desktopList.innerHTML =
                html;

        }


        if(mobileList){

            mobileList.innerHTML =
                html;

        }


        this.attachEvents();

    },


    // ======================================
    // ATTACH EVENTS
    // ======================================

    attachEvents(){

        document
            .querySelectorAll(
                ".recent-item"
            )
            .forEach(item => {

                item.addEventListener(
                    "click",
                    (event) => {

                        // Don't trigger search
                        // when X button is clicked
                        if(
                            event.target.closest(
                                ".remove-recent"
                            )
                        ){

                            return;

                        }


                        const index =
                            Number(
                                item.dataset.index
                            );


                        this.load(index);

                    });

            });


        // ==================================
        // REMOVE BUTTONS
        // ==================================

        document
            .querySelectorAll(
                ".remove-recent"
            )
            .forEach(button => {

                button.addEventListener(
                    "click",
                    (event) => {

                        event.stopPropagation();


                        const index =
                            Number(
                                button.dataset.index
                            );


                        this.remove(index);

                    });

            });

    },


    // ======================================
    // LOAD RECENT SEARCH
    // ======================================

    load(index){

        const recent =
            this.get();


        const item =
            recent[index];


        if(!item){

            return;

        }


        const savedFilters =
            JSON.parse(
                JSON.stringify(
                    item.filters
                )
            );


        // ==================================
        // RESTORE FILTERS
        // ==================================

        SearchFilters.filters = {

            keyword:
                savedFilters.keyword || "",


            location:
                savedFilters.location ||
                "Any Location",


            university:
                savedFilters.university ||
                "Any University",


            moveIn:
                savedFilters.moveIn ||
                "Any Date",


            budget:
                savedFilters.budget
                    ? {
                        min:
                            Number(
                                savedFilters.budget.min
                            ),

                        max:
                            Number(
                                savedFilters.budget.max
                            )
                    }
                    : {
                        min: 300,
                        max: 1500
                    },


            housingType:
                savedFilters.housingType ||
                "Any",


            gender:
                savedFilters.gender ||
                "Any",


            lifestyle:
                savedFilters.lifestyle ||
                "Any",


            pets:
                savedFilters.pets ||
                "Any",


            smoking:
                savedFilters.smoking ||
                "Any",


            furnished:
                savedFilters.furnished ||
                "Any",


            parking:
                savedFilters.parking ||
                "Any",


            utilities:
                savedFilters.utilities ||
                "Any",


            category:
                savedFilters.category ||
                "All Categories"

        };


        // ==================================
        // UPDATE FILTER BAR
        // ==================================

        SearchFilters.updateUI();


        // ==================================
        // UPDATE SEARCH INPUT
        // ==================================

        const desktopInput =
            document.getElementById(
                "searchInput"
            );


        const mobileInput =
            document.getElementById(
                "mobileSearchInput"
            );


        const keyword =
            savedFilters.keyword || "";


        if(desktopInput){

            desktopInput.value =
                keyword;

        }


        if(mobileInput){

            mobileInput.value =
                keyword;

        }


        // ==================================
        // RUN SEARCH
        // ==================================

        const filters =
            SearchFilters.getAll();


        const results =
            campusSearch.search(
                filters
            );


        SearchRenderer.render(
            results,
            keyword
        );


        // ==================================
        // CLOSE POPUP
        // ==================================

        if(
            typeof SearchPopup !==
            "undefined"
        ){

            SearchPopup.close();

        }

    },


    // ======================================
    // ESCAPE HTML
    // ======================================

    escapeHTML(value){

        return String(value)
            .replace(
                /&/g,
                "&amp;"
            )
            .replace(
                /</g,
                "&lt;"
            )
            .replace(
                />/g,
                "&gt;"
            )
            .replace(
                /"/g,
                "&quot;"
            )
            .replace(
                /'/g,
                "&#039;"
            );

    }

};