
// ==========================================
// CAMPUSNEST HOUSING LISTINGS SERVICE
// PHASE 6 — STEP 6.2
// UPDATED — PHASE 7.5.4 IMAGE SUPPORT
// ==========================================

console.log("CampusNest housingListings.js loaded.");

const HousingListings = {

    // ======================================
    // GET ACTIVE HOUSING
    // ======================================

    async getListings() {

        console.log(
            "Loading real housing listings from Supabase..."
        );

        const {
            data,
            error
        } = await campusSupabase
            .from("listings")
            .select(`
                id,
                owner_id,
                title,
                category,
                location,
                university,
                housing_type,
                budget,
                move_in,
                gender,
                lifestyle,
                smoking,
                pets,
                furnished,
                parking,
                utilities,
                availability,
                description,
                keywords,
                icon,
                image_url,
                image_urls,
                page,
                is_active,
                is_verified,
                created_at,
                updated_at
            `)
            .eq("category", "Housing")
            .eq("is_active", true)
            .order("created_at", {
                ascending: false
            });

        // ==================================
        // HANDLE SUPABASE ERROR
        // ==================================

        if (error) {

            console.error(
                "Supabase housing query failed:",
                error
            );

            throw error;
        }

        console.log(
            "Supabase returned housing listings:",
            data
        );

        console.log(
            `Found ${data?.length || 0} active housing listings.`
        );

        return data || [];
    }

};
