(async function () {

    console.log(
        "Testing Supabase Listings Service..."
    );

    const listings =
        await SupabaseListings.getListings();

    console.log(
        "Listings returned:",
        listings
    );

    console.log(
        "Number of listings:",
        listings.length
    );

})();