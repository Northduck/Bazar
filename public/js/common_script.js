"use strict";
import {getCookie, setCookie, updateProductCookie, replaceCookie} from "./modules/cookie_methods.js";
let cookiesOptions={
    "max-age":3600*24*365
};

function initializeCartField(cartField) {
  let cookieCounterValue=Number.parseInt(getCookie("cartCounter"));
  let cartCookieContent=getCookie("cartContent");
  if(cartCookieContent!=undefined&&cartCookieContent!==""){
    let cartContent=cartCookieContent.split("_");
    let realCartQuantity=0;
    for (let i = 0; i < cartContent.length; i++) {
      let productInfo=cartContent[i].split("-");
      realCartQuantity+=Number.parseInt(productInfo[1]);
    }
    if(cookieCounterValue!==realCartQuantity){
      setCookie("cartCounter",realCartQuantity,cookiesOptions);
    }
  }else{
    setCookie("cartCounter",0,cookiesOptions);
  }
  cookieCounterValue=Number.parseInt(getCookie("cartCounter"));
  cartField.innerText=cookieCounterValue;

}
let addToCartBtns=document.querySelectorAll(".Add-to-cart-btn");
let cartCounter=document.querySelector(".Cart-counter");
if(cartCounter!=undefined){
  initializeCartField(cartCounter);
}
addToCartBtns.forEach((cartBtn)=>{
    cartBtn.addEventListener("click",(event)=>{
        event.preventDefault();
        let productId=cartBtn.getAttribute("data-product-id");
        let cartCookie=getCookie("cartContent");
        if(cartCookie!==undefined){
          let productIdIndex=cartCookie.indexOf(`${productId}-`);
          if(productIdIndex===-1){
            setCookie("cartContent",cartCookie+"_"+productId+"-1",cookiesOptions);
          }else{
            return;
          }
        }else{
            setCookie("cartContent",`${productId}-1`,cookiesOptions);
        }
        let cookieCounterValue=getCookie("cartCounter");
        if(cookieCounterValue!==undefined){
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
    location = location;
    return false;
  });
});
let currenciesBtns=document.querySelectorAll(".Change-currency-link");
currenciesBtns.forEach((element,i)=>{
  element.addEventListener("click",async (event)=>{
    event.preventDefault();
    let currencyValue=element.getAttribute("data-currency-value");
    let fetchURL=window.location.origin+"/currency?change_currency="+currencyValue;
    let changeCurrencyResponse= (await fetch(fetchURL)).json();
    location = location;
    return false;
  });
});
let compareBtns=document.querySelectorAll(".Compare-btn");
compareBtns.forEach((element,i)=>{
  element.addEventListener("click",async (event)=>{
    event.preventDefault();
    let productIdToCompare=element.getAttribute("data-product-id");
    let productCategoryIdToCompare=element.getAttribute("data-category-id");
    let compareRequestUrl=window.location.origin+`/toggle_product_to_compare?compareCategoryId=${productCategoryIdToCompare}&compareProductId=${productIdToCompare}`;
    let buttonTempContent=element.innerHTML;
    let loadingIcon=document.createElement("i");
    loadingIcon.classList.add("Loading-animation","fas","fa-spinner");
    element.innerHTML="";
    element.insertAdjacentElement("afterbegin",loadingIcon);
    let addProductToCompareResponse= (await fetch(compareRequestUrl)).json();
    let okIcon=document.createElement("i");
    okIcon.classList.add("fas","fa-check-circle");
    element.innerHTML="";
    element.insertAdjacentElement("afterbegin",okIcon);
    element.classList.toggle("Added-successfully");
    setTimeout(()=>{
      element.classList.toggle("Added-successfully");
      element.innerHTML=buttonTempContent;
    },2000);
  });
});