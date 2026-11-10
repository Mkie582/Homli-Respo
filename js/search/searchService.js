class SearchService {

    constructor() {
        this.searchData = [];
        this.pageCategory = null;
    }

    setData(data) {
        this.searchData =
            Array.isArray(data)
                ? data
                : [];
    }

    /*
     * Set the category for the current page.
     *
     * Example:
     * Housing page      → Housing
     * Roommates page    → Roommates
     * Jobs page         → Jobs
     * Marketplace page  → Marketplace
     * Resources page    → Resources
     *
     * Homepage          → null (search everything)
     */
    setPageCategory(category) {

        if (
            !category ||
            category === "All Categories"
        ) {
            this.pageCategory = null;
            return;
        }

        this.pageCategory = category;
    }

    search(filters = {}) {

        /*
         * Create a copy so we do NOT modify
         * the original SearchFilters object.
         */
        const activeFilters = {
            ...filters
        };

        /*
         * If this page has a category,
         * automatically search only inside
         * that category.
         */
        if (this.pageCategory) {
            activeFilters.category = this.pageCategory;
        }

        return this.searchData.filter(item => {
            return this.matches(item, activeFilters);
        });
    }

    matches(item, filters) {

        return (
            this.matchKeyword(
                item,
                filters.keyword
            )

            &&

            this.matchLocation(
                item,
                filters.location
            )

            &&

            this.matchUniversity(
                item,
                filters.university
            )

            &&

            this.matchHousingType(
                item,
                filters.housingType
            )

            &&

            this.matchBudget(
                item,
                filters.budget
            )

            &&

            this.matchMoveIn(
                item,
                filters.moveIn
            )

            &&

            this.matchGender(
                item,
                filters.gender
            )

            &&

            this.matchLifestyle(
                item,
                filters.lifestyle
            )

            &&

            this.matchSmoking(
                item,
                filters.smoking
            )

            &&

            this.matchPets(
                item,
                filters.pets
            )

            &&

            this.matchFurnished(
                item,
                filters.furnished
            )

            &&

            this.matchParking(
                item,
                filters.parking
            )

            &&

            this.matchUtilities(
                item,
                filters.utilities
            )

            &&

            this.matchCategory(
                item,
                filters.category
            )
        );
    }


    matchKeyword(item, keyword) {

        if (!keyword) return true;

        keyword = String(keyword)
            .toLowerCase()
            .trim();

        const title =
            String(item.title || "")
                .toLowerCase();

        const category =
            String(item.category || "")
                .toLowerCase();

        const location =
            String(item.location || "")
                .toLowerCase();

        const university =
            String(item.university || "")
                .toLowerCase();

        const keywords =
            Array.isArray(item.keywords)
                ? item.keywords
                : [];

        return (
            title.includes(keyword)

            ||

            category.includes(keyword)

            ||

            location.includes(keyword)

            ||

            university.includes(keyword)

            ||

            keywords.some(word =>
                String(word)
                    .toLowerCase()
                    .includes(keyword)
            )
        );
    }


    matchLocation(item, location) {

        if (
            !location ||
            location === "Any Location"
        ) {
            return true;
        }

        return item.location === location;
    }


    matchUniversity(item, university) {

        if (
            !university ||
            university === "Any University"
        ) {
            return true;
        }

        return item.university === university;
    }


    matchHousingType(item, housingType) {

        if (
            !housingType ||
            housingType === "Any"
        ) {
            return true;
        }

        return item.housingType === housingType;
    }


    matchMoveIn(item, moveIn) {

        if (
            !moveIn ||
            moveIn === "Any Date"
        ) {
            return true;
        }

        if (!item.moveIn) {
            return false;
        }

        const listingDate =
            new Date(
                item.moveIn + "T00:00:00"
            );

        const requestedDate =
            new Date(
                moveIn + "T00:00:00"
            );

        return listingDate <= requestedDate;
    }


    matchBudget(item, budget) {

        if (
            !budget ||
            typeof budget !== "object"
        ) {
            return true;
        }

        const min = Number(budget.min);
        const max = Number(budget.max);

        if (
            Number.isNaN(min) ||
            Number.isNaN(max)
        ) {
            return true;
        }

        return (
            Number(item.budget || 0) >= min

            &&

            Number(item.budget || 0) <= max
        );
    }


    matchGender(item, gender) {

        if (
            !gender ||
            gender === "Any"
        ) {
            return true;
        }

        return item.gender === gender;
    }


    matchLifestyle(item, lifestyle) {

        if (
            !lifestyle ||
            lifestyle === "Any"
        ) {
            return true;
        }

        return item.lifestyle === lifestyle;
    }


    matchSmoking(item, smoking) {

        if (
            !smoking ||
            smoking === "Any"
        ) {
            return true;
        }

        return item.smoking === smoking;
    }


    matchPets(item, pets) {

        if (
            !pets ||
            pets === "Any"
        ) {
            return true;
        }

        return item.pets === pets;
    }


    matchFurnished(item, furnished) {

        if (
            !furnished ||
            furnished === "Any"
        ) {
            return true;
        }

        return item.furnished === furnished;
    }


    matchParking(item, parking) {

        if (
            !parking ||
            parking === "Any"
        ) {
            return true;
        }

        return item.parking === parking;
    }


    matchUtilities(item, utilities) {

        if (
            !utilities ||
            utilities === "Any"
        ) {
            return true;
        }

        return item.utilities === utilities;
    }


    matchCategory(item, category) {

        if (
            !category ||
            category === "All Categories"
        ) {
            return true;
        }

        return item.category === category;
    }
}


/*
 * Create ONE CampusNest search engine.
 */
const campusSearch = new SearchService();


/*
 * Load the current search data.
 */
campusSearch.setData(
    window.searchData || []
);


/*
 * Detect whether the current page has
 * a search category.
 *
 * Example HTML:
 *
 * <div
 *     id="campusSearch"
 *     data-category="Housing"
 * ></div>
 *
 * If no data-category exists,
 * the search engine searches everything.
 */
const campusSearchContainer =
    document.getElementById("campusSearch");


if (campusSearchContainer) {

    const category =
        campusSearchContainer.dataset.category;

    if (category) {

        campusSearch.setPageCategory(
            category
        );

        console.log(
            "CampusNest page category:",
            category
        );
    }
}


console.log(
    "CampusNest SearchService:",
    campusSearch.searchData
);