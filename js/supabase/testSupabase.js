// ==========================================
// CampusNest Supabase Connection Test
// ==========================================

async function testSupabaseConnection() {

    console.log(
        "Testing CampusNest Supabase connection..."
    );


    const { data, error } = await campusSupabase
        .from("listings")
        .select("*");


    if (error) {

        console.error(
            "Supabase connection failed:",
            error
        );

        return;

    }


    console.log(
        "Supabase connection successful!"
    );


    console.log(
        "Listings received:",
        data
    );


    console.log(
        "Number of listings:",
        data.length
    );

}


testSupabaseConnection();