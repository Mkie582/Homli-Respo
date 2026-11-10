class SearchUI {

    constructor() {

        this.panel =
            document.getElementById("searchPanel");

        this.input =
            document.getElementById("searchInput");

        this.results =
            document.getElementById("searchResults");

    }

    open() {

        if(this.panel){

            this.panel.classList.add("active");

        }

    }

    close() {

        if(this.panel){

            this.panel.classList.remove("active");

        }

    }

    clearResults(){

        if(this.results){

            this.results.innerHTML = "";

        }

    }

}

const searchUI = new SearchUI();