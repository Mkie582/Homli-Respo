document.addEventListener("keydown",(e)=>{

    if(!SearchSuggestions.suggestions.length){
        return;
    }

    // DOWN
    if(e.key==="ArrowDown"){

        e.preventDefault();

        SearchSuggestions.selectedIndex++;

        if(
            SearchSuggestions.selectedIndex >=
            SearchSuggestions.suggestions.length
        ){
            SearchSuggestions.selectedIndex = 0;
        }

        SearchSuggestions.highlight(
            SearchSuggestions.selectedIndex
        );

    }

    // UP
    else if(e.key==="ArrowUp"){

        e.preventDefault();

        SearchSuggestions.selectedIndex--;

        if(
            SearchSuggestions.selectedIndex < 0
        ){
            SearchSuggestions.selectedIndex =
            SearchSuggestions.suggestions.length - 1;
        }

        SearchSuggestions.highlight(
            SearchSuggestions.selectedIndex
        );

    }

    // ENTER
    else if(e.key==="Enter"){

        e.preventDefault();

        if(SearchSuggestions.selectedIndex >= 0){

            document
            .querySelectorAll(".suggestion-item")
            [SearchSuggestions.selectedIndex]
            .click();

        }else{

            const desktop =
            document.getElementById("searchInput");

            const mobile =
            document.getElementById("mobileSearchInput");

            const keyword =
                document.activeElement === mobile
                ? mobile.value
                : desktop.value;

            renderResults(keyword);

        }

    }

});