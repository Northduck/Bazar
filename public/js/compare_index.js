function makeSliderWithNavListeners(navElements, contentArray, toggleNavClass, toggleContentClass, currentEl){
    if(!currentEl){
        currentEl=0;
    }
    navElements.forEach((navEl, i) => {
        navEl.addEventListener("click",event=>{
            event.preventDefault();
            for(let j=0;j<contentArray.length;j++){
                contentArray[j][currentEl].classList.add(toggleContentClass);
                contentArray[j][i].classList.remove(toggleContentClass);
            }
            navElements[currentEl].classList.remove(toggleNavClass);
            navElements[i].classList.add(toggleNavClass);  
            currentEl=i;  
        });
    });
}
let compareCategoriesBtns=document.querySelectorAll(".Compare-category-name-btn");
let compareCategoriesNav=document.querySelectorAll(".Compare-categories-nav-el");
let compareCategoriesContent=document.querySelectorAll(".Compare-categories-content-el");
makeSliderWithNavListeners(compareCategoriesBtns,[compareCategoriesNav,compareCategoriesContent],"Active-slide-btn","visually-hidden",0);