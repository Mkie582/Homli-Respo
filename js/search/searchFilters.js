const SearchFilters = {

    filters: {

        keyword: "",

        location: "Any Location",

        university: "Any University",

        moveIn: "Any Date",

        budget:{
        min:0,
        max:Infinity
        },

       housingType:"Any",

        gender:"Any",

        lifestyle:"Any",

        pets:"Any",

        smoking:"Any",

        furnished:"Any",

        parking:"Any",

        utilities:"Any",

        category:"All Categories",
    },



    //--------------------------------------
    // SET FILTER
    //--------------------------------------

    set(name, value) {

        this.filters[name] = value;

        this.updateUI();

    },



    //--------------------------------------
    // GET SINGLE
    //--------------------------------------

    get(name) {

        return this.filters[name];

    },



    //--------------------------------------
    // GET ALL
    //--------------------------------------

    getAll() {

        return this.filters;

    },



    //--------------------------------------
    // RESET
    //--------------------------------------

    reset() {

    this.filters = {

        keyword: "",

        location: "Any Location",

        university: "Any University",

        moveIn: "Any Date",

        budget:{
    min:0,
    max:Infinity
},

        housingType: "Any",

        gender: "Any",

        lifestyle: "Any",

        pets: "Any",

        smoking: "Any",

        furnished: "Any",

        parking: "Any",

        utilities: "Any",

        category: "All Categories"

    };

    this.updateUI();

},



    //--------------------------------------
    // UPDATE TEXT ON FILTER BAR
    //--------------------------------------

    updateUI() {

        const location = document.getElementById("locationValue");

        const university = document.getElementById("universityValue");

        const moveIn = document.getElementById("moveInValue");

        const budget = document.getElementById("budgetValue");

        if (location)

            location.textContent = this.filters.location;

        if (university)

            university.textContent = this.filters.university;

        if (moveIn){

    if(
        !this.filters.moveIn ||
        this.filters.moveIn === "Any Date"
    ){

        moveIn.textContent = "Any Date";

    }else{

        const date =
            new Date(
                this.filters.moveIn + "T00:00:00"
            );

        moveIn.textContent =
            date.toLocaleDateString(
                "en-US",
                {
                    month:"short",
                    day:"numeric",
                    year:"numeric"
                }
            );

    }

}

        if(budget){

    const isDefaultBudget =
        this.filters.budget.min === 0 &&
        this.filters.budget.max === Infinity;


    if(isDefaultBudget){

        budget.textContent =
            "Any Price";

    }else{

        budget.textContent =
            `$${this.filters.budget.min} - $${this.filters.budget.max}`;

    }

}

    const housingType =
    document.getElementById("housingTypeValue");

if(housingType){

    housingType.textContent =
        this.filters.housingType;

}

const gender =
document.getElementById("genderValue");

if(gender){

    gender.textContent =
        this.filters.gender === "Any"
            ? "Any Gender"
            : this.filters.gender;

}

const lifestyle =
document.getElementById("lifestyleValue");

if(lifestyle){

    lifestyle.textContent =
        this.filters.lifestyle === "Any"
            ? "Any Lifestyle"
            : this.filters.lifestyle;

}

const pets =
document.getElementById("petsValue");

if(pets){

    pets.textContent =
        this.filters.pets === "Any"
            ? "Any Pets"
            : this.filters.pets;

}

const smoking =
document.getElementById("smokingValue");

if(smoking){

    smoking.textContent =
        this.filters.smoking === "Any"
            ? "Any Smoking"
            : this.filters.smoking;

}

const furnished =
document.getElementById("furnishedValue");

if(furnished){

    furnished.textContent =
        this.filters.furnished === "Any"
            ? "Any Furnished"
            : this.filters.furnished;

}

const parking =
document.getElementById("parkingValue");

if(parking){

    parking.textContent =
        this.filters.parking === "Any"
            ? "Any Parking"
            : this.filters.parking;

}

const utilities =
document.getElementById("utilitiesValue");

if(utilities){

    utilities.textContent =
        this.filters.utilities === "Any"
            ? "Any Utilities"
            : this.filters.utilities;

}

const category =
document.getElementById("categoryValue");

if(category){

    category.textContent =
        this.filters.category;

}

// ======================================
// MOBILE FILTER VALUES
// ======================================

const mobileLocation =
    document.getElementById(
        "mobileLocationValue"
    );

const mobileUniversity =
    document.getElementById(
        "mobileUniversityValue"
    );

const mobileMoveIn =
    document.getElementById(
        "mobileMoveInValue"
    );

const mobileBudget =
    document.getElementById(
        "mobileBudgetValue"
    );


if(mobileLocation){

    mobileLocation.textContent =
        this.filters.location;

}


if(mobileUniversity){

    mobileUniversity.textContent =
        this.filters.university;

}


if(mobileMoveIn){

    if(
        !this.filters.moveIn ||
        this.filters.moveIn === "Any Date"
    ){

        mobileMoveIn.textContent =
            "Any Date";

    }else{

        const date =
            new Date(
                this.filters.moveIn + "T00:00:00"
            );

        mobileMoveIn.textContent =
            date.toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
                }
            );

    }

}


if(budget){

    const isDefaultBudget =
        this.filters.budget.min === 0 &&
        this.filters.budget.max === Infinity;


    if(isDefaultBudget){

        budget.textContent =
            "Any Price";

    }else{

        budget.textContent =
            `$${this.filters.budget.min} - $${this.filters.budget.max}`;

    }

}

// ======================================
// MOBILE ADVANCED FILTER VALUES
// ======================================

const mobileHousingType =
    document.getElementById(
        "mobileHousingTypeValue"
    );

if (mobileHousingType) {

    mobileHousingType.textContent =
        this.filters.housingType === "Any"
            ? "Any Housing Type"
            : this.filters.housingType;

}


const mobileGender =
    document.getElementById(
        "mobileGenderValue"
    );

if (mobileGender) {

    mobileGender.textContent =
        this.filters.gender === "Any"
            ? "Any Gender"
            : this.filters.gender;

}


const mobileLifestyle =
    document.getElementById(
        "mobileLifestyleValue"
    );

if (mobileLifestyle) {

    mobileLifestyle.textContent =
        this.filters.lifestyle === "Any"
            ? "Any Lifestyle"
            : this.filters.lifestyle;

}


const mobilePets =
    document.getElementById(
        "mobilePetsValue"
    );

if (mobilePets) {

    mobilePets.textContent =
        this.filters.pets === "Any"
            ? "Any Pets"
            : this.filters.pets;

}


const mobileSmoking =
    document.getElementById(
        "mobileSmokingValue"
    );

if (mobileSmoking) {

    mobileSmoking.textContent =
        this.filters.smoking === "Any"
            ? "Any Smoking"
            : this.filters.smoking;

}


const mobileFurnished =
    document.getElementById(
        "mobileFurnishedValue"
    );

if (mobileFurnished) {

    mobileFurnished.textContent =
        this.filters.furnished === "Any"
            ? "Any Furnishing"
            : this.filters.furnished;

}


const mobileParking =
    document.getElementById(
        "mobileParkingValue"
    );

if (mobileParking) {

    mobileParking.textContent =
        this.filters.parking === "Any"
            ? "Any Parking"
            : this.filters.parking;

}


const mobileUtilities =
    document.getElementById(
        "mobileUtilitiesValue"
    );

if (mobileUtilities) {

    mobileUtilities.textContent =
        this.filters.utilities === "Any"
            ? "Any Utilities"
            : this.filters.utilities;

}


const mobileCategory =
    document.getElementById(
        "mobileCategoryValue"
    );

if (mobileCategory) {

    mobileCategory.textContent =
        this.filters.category;

}

    },



    //--------------------------------------
    // LOCATIONS
    //--------------------------------------

    getLocations() {

        return [

            "Any Location",

            ...new Set(

                searchData

                    .map(item => item.location)

                    .filter(Boolean)

                    .sort()

            )

        ];

    },



    //--------------------------------------
    // UNIVERSITIES
    //--------------------------------------

    getUniversities(){

    return [

        "Any University",

        ...new Set(

            searchData

                .map(item => item.university)

                .filter(Boolean)

                .sort()

        )

    ];

},



    //--------------------------------------
    // MOVE-IN
    //--------------------------------------

    getMoveInOptions() {

        return [

            "Any Date",

            "Today",

            "Tomorrow",

            "This Week",

            "This Month"

        ];

    },



    //--------------------------------------
    // BUDGET
    //--------------------------------------

    getBudgetOptions() {

        return [

            "Any Price",

            "Under $500",

            "$500 - $700",

            "$700 - $1000",

            "Above $1000"

        ];

    },

    getHousingTypes(){

    return [

        "Any Housing Type",

        ...new Set(

            searchData

            .map(item => item.housingType)

            .filter(Boolean)

            .sort()

        )

    ];

},

getGenders(){

    return [

        "Any",

        ...new Set(

            searchData

                .map(item => item.gender)

                .filter(

                    gender =>

                        gender &&

                        gender !== "Any"

                )

                .sort()

        )

    ];

},

getLifestyles(){

    return [

        "Any",

        ...new Set(

            searchData

                .map(item => item.lifestyle)

                .filter(

                    lifestyle =>

                        lifestyle &&

                        lifestyle !== "Any"

                )

                .sort()

        )

    ];

},

getPets(){

    return [

        "Any",

        ...new Set(

            searchData

                .map(item => item.pets)

                .filter(

                    pets =>

                        pets &&

                        pets !== "Any"

                )

                .sort()

        )

    ];

},

getSmokingOptions(){

    return [

        "Any",

        ...new Set(

            searchData

                .map(item => item.smoking)

                .filter(

                    smoking =>

                        smoking &&

                        smoking !== "Any"

                )

                .sort()

        )

    ];

},

getFurnishedOptions(){

    return [

        "Any",

        ...new Set(

            searchData

                .map(item => item.furnished)

                .filter(

                    furnished =>

                        furnished &&

                        furnished !== "Any"

                )

                .sort()

        )

    ];

},

getParkingOptions(){

    return [

        "Any",

        ...new Set(

            searchData

                .map(item => item.parking)

                .filter(

                    parking =>

                        parking &&

                        parking !== "Any"

                )

                .sort()

        )

    ];

},

getUtilitiesOptions(){

    return [

        "Any",

        ...new Set(

            searchData

                .map(item => item.utilities)

                .filter(

                    utilities =>

                        utilities &&

                        utilities !== "Any"

                )

                .sort()

        )

    ];

},

getCategories(){

    return [

        "All Categories",

        ...new Set(

            searchData

                .map(item => item.category)

                .filter(

                    category =>

                        category &&

                        category !== "All Categories"

                )

                .sort()

        )

    ];

},
};



document.addEventListener(

    "DOMContentLoaded",

    () => {

        SearchFilters.updateUI();

    }

);