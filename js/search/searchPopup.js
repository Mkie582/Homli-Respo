const PopupData = {

    location:{

        title:"Choose Location",

        placeholder:"Search location...",

        icon:"fa-location-dot",

        type:"list",

        values:()=>SearchFilters.getLocations()

    },

    university:{

        title:"Choose University",

        placeholder:"Search university...",

        icon:"fa-building-columns",

        type:"list",

        values:()=>SearchFilters.getUniversities()

    },

    housingType:{

    title:"Choose Housing Type",

    placeholder:"Search housing type...",

    icon:"fa-house",

    type:"list",

    values:()=>SearchFilters.getHousingTypes()

},

gender:{

    title:"Choose Gender",

    placeholder:"Search gender...",

    icon:"fa-user",

    type:"list",

    values:()=>SearchFilters.getGenders()

},

lifestyle:{

    title:"Choose Lifestyle",

    placeholder:"Search lifestyle...",

    icon:"fa-mug-hot",

    type:"list",

    values:()=>SearchFilters.getLifestyles()

},

pets:{

    title:"Choose Pets",

    placeholder:"Search pet preference...",

    icon:"fa-paw",

    type:"list",

    values:()=>SearchFilters.getPets()

},

smoking:{

    title:"Choose Smoking Preference",

    placeholder:"Search smoking preference...",

    icon:"fa-ban-smoking",

    type:"list",

    values:()=>SearchFilters.getSmokingOptions()

},

furnished:{

    title:"Choose Furnished",

    placeholder:"Search furnished option...",

    icon:"fa-couch",

    type:"list",

    values:()=>SearchFilters.getFurnishedOptions()

},

parking:{

    title:"Choose Parking",

    placeholder:"Search parking option...",

    icon:"fa-square-parking",

    type:"list",

    values:()=>SearchFilters.getParkingOptions()

},

utilities:{

    title:"Choose Utilities",

    placeholder:"Search utilities option...",

    icon:"fa-bolt",

    type:"list",

    values:()=>SearchFilters.getUtilitiesOptions()

},

category:{

    title:"Choose Category",

    placeholder:"Search category...",

    icon:"fa-layer-group",

    type:"list",

    values:()=>SearchFilters.getCategories()

},

    moveIn: {

    title: "Choose Move-in Date",

    placeholder: "Select a date",

    type: "calendar"

},

    budget:{

        title:"Budget",

        icon:"fa-dollar-sign",

        type:"budget"

    }

};



const SearchPopup = {

    popup: null,
    title: null,
    searchInput: null,
    list: null,
    currentFilter: null,

    // ======================================
    // INITIALIZE
    // ======================================

    init(){

        console.log("SearchPopup initialized");

        this.popup =
            document.getElementById("globalPopup");

        this.title =
            document.getElementById("popupTitle");

        this.searchInput =
            document.getElementById("popupSearchInput");

        this.list =
            document.getElementById("popupList");


        if(!this.popup){

            console.error(
                "SearchPopup: globalPopup was not found."
            );

            return;

        }


        this.bindFilters();

        this.bindCloseEvents();

        this.bindScrollBehavior();

    },


    // ======================================
    // FILTER BUTTONS
    // ======================================

    bindFilters(){

        const filters = [

            "locationFilter",

            "universityFilter",

            "moveInFilter",

            "budgetFilter",

            "housingTypeFilter",

            "genderFilter",

            "lifestyleFilter",

            "petsFilter",

            "smokingFilter",

            "furnishedFilter",

            "parkingFilter",

            "utilitiesFilter",

            "categoryFilter"

        ];


        filters.forEach(id => {

            const element =
                document.getElementById(id);


            if(!element){

                return;

            }


            element.addEventListener(

                "click",

                (e) => {

                    e.preventDefault();

                    e.stopPropagation();

                    this.open(
                        id,
                        element
                    );

                }

            );

        });

    },


    // ======================================
    // OPEN POPUP
    // ======================================

    open(filterName, trigger){

        console.log(
            "SEARCH POPUP OPEN:",
            filterName
        );


        // ==================================
        // SAVE CURRENT FILTER
        // ==================================

        this.currentFilter =
            filterName;


        // ==================================
        // GET POPUP KEY
        // ==================================

        const key =
            filterName.replace(
                "Filter",
                ""
            );


        const data =
            PopupData[key];


        if(!data){

            console.error(
                "Popup data not found:",
                key
            );

            return;

        }


        const type =
            data.type;


        // ==================================
        // POSITION POPUP AT TOP
        // ==================================

        this.positionPopup();


        // ==================================
        // SHOW POPUP
        // ==================================

        this.popup.classList.add(
            "active"
        );


        // ==================================
        // UPDATE TITLE
        // ==================================

        if(this.title){

            this.title.textContent =
                data.title;

        }


        // ==================================
        // GET CONTENT AREA
        // ==================================

        const popupContent =
            document.getElementById(
                "popupContent"
            );


        if(!popupContent){

            console.error(
                "popupContent not found."
            );

            return;

        }


        // ==================================
        // LIST POPUP
        // ==================================

        if(type === "list"){

            popupContent.innerHTML = `

                <div class="popup-search">

                    <i class="fa-solid fa-magnifying-glass"></i>

                    <input
                        id="popupSearchInput"
                        type="text"
                        placeholder="${data.placeholder || ""}"
                        autocomplete="off"
                    >

                </div>


                <div
                    id="popupList"
                    class="popup-list"
                ></div>

            `;


            // ----------------------------------
            // RECONNECT ELEMENTS
            // ----------------------------------

            this.searchInput =
                document.getElementById(
                    "popupSearchInput"
                );


            this.list =
                document.getElementById(
                    "popupList"
                );


            // ----------------------------------
            // GET VALUES
            // ----------------------------------

            const values =
                data.values();


            const icon =
                data.icon ||
                "fa-filter";


            // ----------------------------------
            // RENDER LIST
            // ----------------------------------

            const renderList =
                (items) => {

                    if(!this.list){

                        return;

                    }


                    this.list.innerHTML =

                        items.map(
                            value => `

                                <div
                                    class="popup-option"
                                    data-value="${value}"
                                >

                                    <i
                                        class="fa-solid ${icon}"
                                    ></i>

                                    <span>
                                        ${value}
                                    </span>

                                </div>

                            `
                        ).join("");


                    // ----------------------------------
                    // OPTION CLICK
                    // ----------------------------------

                    this.list
                        .querySelectorAll(
                            ".popup-option"
                        )
                        .forEach(option => {

                            option.addEventListener(
                                "click",
                                (e) => {

                                    e.stopPropagation();


                                    // --------------------------
                                    // SAVE FILTER
                                    // --------------------------

                                    SearchFilters.set(

                                        key,

                                        option.dataset.value

                                    );


                                    // --------------------------
                                    // RUN SEARCH
                                    // --------------------------

                                    const searchInput =
                                        document.getElementById(
                                            "searchInput"
                                        );


                                    renderResults(

                                        searchInput
                                            ?.value
                                            ?.trim() || ""

                                    );


                                    // --------------------------
                                    // CLOSE POPUP
                                    // --------------------------

                                    this.close();

                                }
                            );

                        });

                };


            // ==================================
            // INITIAL LIST
            // ==================================

            renderList(values);


            // ==================================
            // POPUP SEARCH
            // ==================================

            if(this.searchInput){

                this.searchInput.addEventListener(
                    "input",
                    () => {

                        const keyword =
                            this.searchInput
                                .value
                                .toLowerCase()
                                .trim();


                        const filtered =
                            values.filter(
                                item =>
                                    item
                                        .toLowerCase()
                                        .includes(
                                            keyword
                                        )
                            );


                        renderList(filtered);

                    }
                );

            }


            return;

        }


        // ======================================
        // CALENDAR
        // ======================================

        if(type === "calendar"){

            popupContent.innerHTML =
                SearchCalendar.render();


            SearchCalendar.bindEvents();


            if(this.searchInput){

                this.searchInput.value = "";

            }


            return;

        }


        // ======================================
        // BUDGET
        // ======================================

        if(type === "budget"){

            popupContent.innerHTML =
                SearchBudget.render();


            SearchBudget.bindEvents();


            if(this.searchInput){

                this.searchInput.value = "";

            }


            return;

        }

    },


    // ======================================
    // POSITION POPUP
    // ======================================

    positionPopup(){

        if(!this.popup){

            return;

        }


        const header =
            document.querySelector(".header");


        let headerHeight = 80;


        if(header){

            headerHeight =
                header.offsetHeight;

        }


        // ==================================
        // FIXED POSITION
        // ==================================

        this.popup.style.position =
            "fixed";


        this.popup.style.top =
            (headerHeight + 12) + "px";


        // ==================================
        // DESKTOP
        // ==================================

        if(window.innerWidth > 768){

            this.popup.style.left =
                "50%";


            this.popup.style.right =
                "auto";


            this.popup.style.transform =
                "translateX(-50%)";

        }


        // ==================================
        // MOBILE
        // ==================================

        else{

            this.popup.style.left =
                "16px";


            this.popup.style.right =
                "16px";


            this.popup.style.width =
                "auto";


            this.popup.style.transform =
                "none";

        }

    },


    // ======================================
    // KEEP POPUP AT TOP WHILE SEARCH
    // IS STILL VISIBLE
    // ======================================

    bindScrollBehavior(){

        window.addEventListener(
            "scroll",
            () => {

                if(
                    !this.popup ||
                    !this.popup.classList.contains(
                        "active"
                    )
                ){

                    return;

                }


                const searchContainer =
                    document.getElementById(
                        "campusSearch"
                    );


                if(!searchContainer){

                    return;

                }


                const rect =
                    searchContainer.getBoundingClientRect();


                const header =
                    document.querySelector(".header");


                const headerHeight =
                    header
                        ? header.offsetHeight
                        : 80;


                // ==================================
                // SEARCH SECTION HAS PASSED
                // ==================================

                if(
                    rect.bottom <=
                    headerHeight
                ){

                    this.close();

                    return;

                }


                // ==================================
                // KEEP POPUP BELOW HEADER
                // ==================================

                this.positionPopup();

            },
            {
                passive: true
            }
        );


        // ======================================
        // WINDOW RESIZE
        // ======================================

        window.addEventListener(
            "resize",
            () => {

                if(
                    this.popup &&
                    this.popup.classList.contains(
                        "active"
                    )
                ){

                    this.positionPopup();

                }

            }
        );

    },


    // ======================================
    // REFRESH CALENDAR
    // ======================================

    refreshCalendar(){

        const popupContent =
            document.getElementById(
                "popupContent"
            );


        if(!popupContent){

            return;

        }


        popupContent.innerHTML =
            SearchCalendar.render();


        SearchCalendar.bindEvents();

    },


    // ======================================
    // CLOSE
    // ======================================

    close(){

        if(!this.popup){

            return;

        }


        console.log(
            "POPUP CLOSED"
        );


        this.popup.classList.remove(
            "active"
        );

    },


    // ======================================
    // CLOSE EVENTS
    // ======================================

    bindCloseEvents(){

        if(!this.popup){

            return;

        }


        // ==================================
        // CLICK INSIDE POPUP
        // DON'T CLOSE
        // ==================================

        this.popup.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

            }
        );


        // ==================================
        // CLICK OUTSIDE
        // CLOSE
        // ==================================

        document.addEventListener(
            "click",
            () => {

                this.close();

            }
        );

    }

};
