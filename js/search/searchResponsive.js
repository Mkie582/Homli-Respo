const searchContainer =
document.getElementById("searchContainer");

const searchExpand =
document.getElementById("searchExpand");

const searchInput =
document.getElementById("searchInput");

if(searchInput){

searchInput.addEventListener("focus",()=>{

if(window.innerWidth<=768){

searchContainer.classList.add("active");

}

});

}

document.addEventListener("click",(e)=>{

if(

window.innerWidth<=768 &&

!searchContainer.contains(e.target)

){

searchContainer.classList.remove("active");

}

});