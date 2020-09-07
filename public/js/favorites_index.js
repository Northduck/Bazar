"user strict";
import {getCookie, setCookie, updateProductCookie, replaceCookie} from "./modules/cookie_methods.js";

let cookiesOptions={
    "max-age":3600*24*365
};
function updateCartQuan(toDo,quan) {
    quan=quan||1;
    let cookieCounterValue=getCookie("cartCounter");
    if(cookieCounterValue){
        let cartC=Number.parseInt(cookieCounterValue);
        if(toDo==="+"){
            setCookie("cartCounter",`${cartC+=quan}`,cookiesOptions);
        }else{
            setCookie("cartCounter",`${cartC-=quan}`,cookiesOptions);
        }
        cartCounter.innerText=`${cartC}`;
    }else{
        setCookie("cartCounter","1",cookiesOptions);
        cartCounter.innerText="1";
    }
}
let productCardItems=document.querySelectorAll(".Favorites-product-item");
let favoritesQuan=document.querySelector(".Favorites-quan");
let deleteItemsBtns=document.querySelectorAll(".Delete-item");
let deleteAllBtn=document.querySelector(".Favorites-delete-all-btn");
let buyAllBtn=document.querySelector(".Favorites-buy-all-btn");
deleteItemsBtns.forEach((deleteBtnElement,i) => {
    deleteBtnElement.addEventListener("click",(event)=>{
        event.preventDefault();
        productCardItems[i].remove();
        let cookieValue=getCookie("favoritesContent");
        let cookieQuan=Number.parseInt(getCookie("favoritesCounter"));
        let reg=RegExp(`_${productCardItems[i].getAttribute("data-product-id")}|${productCardItems[i].getAttribute("data-product-id")}_|${productCardItems[i].getAttribute("data-product-id")}`);
        setCookie("favoritesContent",cookieValue.replace(reg,""),cookiesOptions);
        setCookie("favoritesCounter",--cookieQuan<0?0:cookieQuan,cookiesOptions);
        favoritesQuan.innerText=getCookie("favoritesCounter");
    });
});
deleteAllBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    productCardItems[0].parentElement.innerHTML="";
    setCookie("favoritesContent","",cookiesOptions);
    setCookie("favoritesCounter","0",cookiesOptions);
    favoritesQuan.innerText=getCookie("favoritesCounter");
});
buyAllBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    let isBoughtAll=buyAllBtn.getAttribute("data-is-bought");
    if(isBoughtAll==="yes"){
        return;
    }
    if(isBoughtAll==="no"){
        let addToCartBtns=document.querySelectorAll(".Add-to-cart-btn");
        let clickEvent=new Event("click");
        for (let i = 0; i < addToCartBtns.length; i++) {
            addToCartBtns[i].dispatchEvent(clickEvent);
        }
        buyAllBtn.setAttribute("data-is-bought","yes");
    }
});