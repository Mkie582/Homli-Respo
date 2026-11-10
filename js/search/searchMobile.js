// ======================================
// Mobile Search Overlay
// ======================================

const mobileOverlay =
document.getElementById("mobileSearchOverlay");

const desktopSearch =
document.getElementById("searchInput");

const mobileSearch =
document.getElementById("mobileSearchInput");

const closeMobileSearch =
document.getElementById("closeMobileSearch");

const mobileFilters =
document.getElementById("mobileFilters");


// Open overlay when desktop/mobile search is clicked
if(desktopSearch){

    desktopSearch.addEventListener("focus",()=>{

    if(window.innerWidth<=768){

        mobileOverlay.classList.add("active");

        mobileSearch.value = desktopSearch.value;

        if(mobileSearch.value.trim() !== ""){

    if (mobileFilters) {
    mobileFilters.classList.add("hide");
}

}else{

    if (mobileFilters) {
    mobileFilters.classList.remove("hide");
}

}

        mobileSearch.focus();

    }

});

// ======================================
// Mobile Input Search
// ======================================

if(mobileSearch){

mobileSearch.addEventListener("input",(e)=>{

    const keyword = e.target.value.trim();

    desktopSearch.value = keyword;

    if(keyword === ""){

        SearchRenderer.render([]);

        if(mobileFilters){
            mobileFilters.classList.remove("hide");
        }

        return;

    }

    if(mobileFilters){
        mobileFilters.classList.add("hide");
    }

    renderResults(keyword);
    SearchSuggestions.render(e.target.value);

});

}

}


// Close overlay
if(closeMobileSearch){

    closeMobileSearch.addEventListener("click",()=>{

        mobileOverlay.classList.remove("active");

        desktopSearch.value = mobileSearch.value;

    });

}


// ESC closes overlay
document.addEventListener("keydown",(e)=>{

    if(e.key==="Escape"){

        mobileOverlay.classList.remove("active");

        desktopSearch.value = mobileSearch.value;

    }

});
