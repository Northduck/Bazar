"use strict";
import {getCookie, setCookie, updateProductCookie, replaceCookie} from "./modules/cookie_methods.js";
let cookiesOptions={
    "max-age":3600*24*365
};

function initializeCartField(cartField) {
  let cookieCounterValue=getCookie(cartField);
  if(cookieCounterValue!==undefined){
      cartCounter.innerText=cookieCounterValue;
  }else{
      cartCounter.innerText="0";
  }
}
let addToCartBtns=document.querySelectorAll(".Add-to-cart-btn");
let cartCounter=document.querySelector(".Cart-counter");
initializeCartField("cartCounter");
addToCartBtns.forEach((cartBtn)=>{
    cartBtn.addEventListener("click",(event)=>{
        event.preventDefault();
        let productId=cartBtn.getAttribute("data-product-id");
        let cartCookie=getCookie("cartContent");
        if(cartCookie){
          let productIdIndex=cartCookie.indexOf(`${productId}-`);
          if(productIdIndex===-1){
            setCookie("cartContent",cartCookie+"_"+productId+"-1",cookiesOptions);
          }else{
            updateProductCookie("cartContent",productId,"+",cookiesOptions)
          }
        }else{
            setCookie("cartContent",`${productId}-1`,cookiesOptions);
        }
        let cookieCounterValue=getCookie("cartCounter");
        if(cookieCounterValue){
            let cartC=Number.parseInt(cookieCounterValue);
            setCookie("cartCounter",`${++cartC}`,cookiesOptions);
            cartCounter.innerText=`${cartC}`;
        }else{
            setCookie("cartCounter","1",cookiesOptions);
            cartCounter.innerText="1";
        }
    });
});
let addToFavoritesBtn=document.querySelectorAll(".Good-like-btn");
addToFavoritesBtn.forEach((btnFavorite,i) => {
  btnFavorite.addEventListener("click",(event)=>{
    event.preventDefault();
    let productId=btnFavorite.getAttribute("data-product-id");
    let favoritesCookie=getCookie("favoritesContent");
    if(favoritesCookie){
      let productIdIndex=favoritesCookie.indexOf(`${productId}_`)||favoritesCookie.indexOf(`_${productId}`)||favoritesCookie.indexOf(`${productId}`);
      if(productIdIndex===-1){
        setCookie("favoritesContent",favoritesCookie+"_"+productId,cookiesOptions);
      }
    }else{
        setCookie("favoritesContent",`${productId}`,cookiesOptions);
    }
    let favoritesCounterValue=getCookie("favoritesCounter");
    if(favoritesCounterValue){
      let favoriteC=Number.parseInt(favoritesCounterValue);
        setCookie("favoritesCounter",`${++favoriteC}`,cookiesOptions);
    }else{
        setCookie("favoritesCounter","1",cookiesOptions);
    }
  });
});

let checkoutServiceBtn=document.querySelectorAll(".Checkout-service-btn");
checkoutServiceBtn.forEach((serviceBtn,i)=>{
  serviceBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    let serviceId=serviceBtn.getAttribute("data-service-id");
    setCookie("serviceOrder",serviceId,cookiesOptions);
    window.location.href=window.location.origin+"/checkout_services";
  });
});

let languagesBtns=document.querySelectorAll(".Change-language-link");
languagesBtns.forEach((element,i)=>{
  element.addEventListener("click",async (event)=>{
    event.preventDefault();
    let languageValue=element.getAttribute("data-language-value");
    let fetchURL=window.location.origin+"/language?change_language="+languageValue;
    let changeLanguageResponse= (await fetch(fetchURL)).json();
    location = location
    return false;
  });
});