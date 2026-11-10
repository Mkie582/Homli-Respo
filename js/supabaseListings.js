// ==========================================
// CampusNest Supabase Listings Service
// ==========================================

const SupabaseListings = {

    async getListings() {

        console.log(
            "Loading listings from Supabase..."
        );

        try {

            const { data, error } = await campusSupabase
                .from("listings")
                .select("*")
                .eq("is_active", true)
                .order("created_at", {
                    ascending: false
                });


            if (error) {

                console.error(
                    "Supabase listings error:",
                    error
                );

                throw error;

            }


            console.log(
                "Supabase listings loaded:",
                data
            );


            // ======================================
            // CONVERT SUPABASE DATA
            // TO CAMPUSNEST SEARCH FORMAT
            // ======================================

            const listings =
                (data || []).map(item => {

                    return {

                        // --------------------------------
                        // BASIC
                        // --------------------------------

                        id: item.id,

                        owner_id: item.owner_id,

                        title: item.title,

                        category: item.category,

                        location: item.location,

                        university: item.university,


                        // --------------------------------
                        // SEARCH FILTER FIELDS
                        // --------------------------------

                        housingType:
                            item.housing_type,

                        budget:
                            Number(item.budget) || 0,

                        moveIn:
                            item.move_in,

                        gender:
                            item.gender,

                        lifestyle:
                            item.lifestyle,

                        smoking:
                            item.smoking,

                        pets:
                            item.pets,

                        furnished:
                            item.furnished,

                        parking:
                            item.parking,

                        utilities:
                            item.utilities,

                        availability:
                            item.availability,


                        // --------------------------------
                        // SEARCH DATA
                        // --------------------------------

                        keywords:
                            Array.isArray(item.keywords)
                                ? item.keywords
                                : [],


                        icon:
                            item.icon,

                        page:
                            item.page,


                        // --------------------------------
                        // DATABASE STATUS
                        // --------------------------------

                        isActive:
                            item.is_active,

                        isVerified:
                            item.is_verified,


                        // --------------------------------
                        // TIMESTAMPS
                        // --------------------------------

                        createdAt:
                            item.created_at,

                        updatedAt:
                            item.updated_at

                    };

                });


            console.log(
                "CampusNest listings converted:",
                listings
            );


            return listings;


        } catch(error) {

            console.error(
                "Failed to load listings:",
                error
            );

            return [];

        }

    }

};