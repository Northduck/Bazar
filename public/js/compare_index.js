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
let  deleteProductBtns=document.querySelectorAll(".Delete-btn");
deleteProductBtns.forEach((element,i)=>{
    element.addEventListener("click",async(event)=>{
        event.preventDefault();
        let categoryNumber=Number.parseInt(element.getAttribute("data-category-number"));
        let productNumber=Number.parseInt(element.getAttribute("data-product-number"));
        let characteristicsContainer=document.querySelectorAll(".Compare-categories-content-el")[categoryNumber];
        let productsRowsWrappers= characteristicsContainer.querySelectorAll(".Compare-products-rows-wrapper");
        let productHeadElement=characteristicsContainer.querySelectorAll(".Compare-product-head-el")[productNumber];
        let productIdToCompare=element.getAttribute("data-product-id");
        let productCategoryIdToCompare=element.getAttribute("data-category-id");
        let compareRequestUrl=window.location.origin+`/toggle_product_to_compare?compareCategoryId=${productCategoryIdToCompare}&compareProductId=${productIdToCompare}`;
        let addProductToCompareResponse= (await fetch(compareRequestUrl)).json();
        productsRowsWrappers.forEach((element,i)=>{
            let productCharacteristicValue=element.querySelectorAll(".Compare-characteristics-value")[productNumber];
            productCharacteristicValue.remove();
        });
        productHeadElement.remove();
        let productsDeleteBtns=characteristicsContainer.querySelectorAll(".Delete-btn");
        productsDeleteBtns.forEach((btnElement,i)=>{
            btnElement.setAttribute("data-product-number",i);
        });
        if(characteristicsContainer.querySelectorAll(".Compare-product-head-el").length===0){
            characteristicsContainer.innerHTML=document.querySelector(".Compare-emptyness-plug").innerHTML;
            characteristicsContainer.classList="Compare-emptyness-plug Section-centerer";
        }
    });
});