document.addEventListener("DOMContentLoaded",()=>{

    const input=document.getElementById("searchInput");

    const expand=document.getElementById("searchExpand");

    if(!input || !expand){

        return;

    }

    /* Open */

    input.addEventListener("focus",()=>{

        if(window.innerWidth<=768){

            expand.classList.add("active");

        }

    });

    /* Close */

    document.addEventListener("click",(e)=>{

        if(window.innerWidth>768){

            return;

        }

        if(

            !e.target.closest(".search-top") &&

            !e.target.closest(".search-expand")

        ){

            expand.classList.remove("active");

        }

    });

});