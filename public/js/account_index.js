function makeSliderWithNavListeners(navElements, content, toggleNavClass, toggleContentClass, currentEl){
    if(!currentEl){
        currentEl=0;
    }
    navElements.forEach((navEl, i) => {
        navEl.addEventListener("click",event=>{
            console.log("content",content,"i",i);
            if(i>=content.length){
                return;
            }
            event.preventDefault();
            content[currentEl].classList.add(toggleContentClass);
            content[i].classList.remove(toggleContentClass);
            navElements[currentEl].classList.remove(toggleNavClass);
            navElements[i].classList.add(toggleNavClass);  
            currentEl=i;  
        });
    });
}

let accountTabsNav=document.querySelectorAll(".Account-nav li button");
let accountTabsContent=document.querySelectorAll(".Account-content li");
let accountOrdersNav=document.querySelectorAll(".Account-orders-type-el button");
let accountOrdersContent=document.querySelectorAll(".Account-orders-type-content>div");
let accountRevealProductsBtn=document.querySelectorAll(".Orders-history-order-el .Order-products-open-btn");
let accountOrderProducts=document.querySelectorAll(".Orders-history-order-products-list");
makeSliderWithNavListeners(accountTabsNav,accountTabsContent,"Current-account-tab","visually-hidden",0);
makeSliderWithNavListeners(accountOrdersNav,accountOrdersContent,"Current-account-tab","visually-hidden",0);
accountRevealProductsBtn.forEach((el,i)=>{
    el.addEventListener("click",(event)=>{
        event.preventDefault()
        accountOrderProducts[i].classList.toggle("visually-hidden");
    });
});
