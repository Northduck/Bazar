import {getCookie, setCookie, updateProductCookie, replaceCookie} from "./modules/cookie_methods.js";
import Dinero from "./modules/dinero.js";
console.log(Dinero().getLocale());
let cookiesOptions={
    "max-age":3600*24*365
};
function updateCartQuan(toDo,quan) {
    quan=quan||1;
    let cookieCounterValue=getCookie("cartCounter");
    if(cookieCounterValue==undefined&&cookieCounterValue===""){
        setCookie("cartCounter","0",cookiesOptions);
        cookieCounterValue=getCookie("cartCounter");
    }
    let cartC=Number.parseInt(cookieCounterValue);
    if(toDo==="+"){
        setCookie("cartCounter",`${cartC+=quan}`,cookiesOptions);
    }else{
        cartC-=quan;
        if(cartC<0){
            cartC=0;
        }
        setCookie("cartCounter",`${cartC}`,cookiesOptions);
    }
    cartCounter.innerText=`${cartC}`;
}
let cartCounter=document.querySelector(".Cart-counter");
let cartQuantityMas=document.querySelectorAll(".Cart-quantity");
let subtotalSummElement=document.querySelector(".Subtotal-price-summ");
let totalSummElement=document.querySelector(".Cart-order-total-price");
let productItems=document.querySelectorAll(".Cart-product-item");
console.log(productItems);
updateCart();
function updateCart() {
    let cartCurrency=getCookie("currency")||"USD";
    let totalSumm=Dinero({"amount":0,"currency":cartCurrency});
    let cartQuantity=0;
    let productsPrices=document.querySelectorAll(".Cart-product-item .Cart-product-price");
    let productsQuantities=document.querySelectorAll(".Product-quantity-value");
    let productTotalPrice=document.querySelectorAll(".Cart-product-total-price");
    for(let i=0;i<productsPrices.length;i++){
        let productPrice=Dinero({"amount":Number.parseInt(productsPrices[i].getAttribute("data-product-price")),"currency":cartCurrency});
        let productQuantity=Number.parseInt(productsQuantities[i].value);
        let productSumm=productPrice.multiply(productQuantity);
        productTotalPrice[i].innerText=productSumm.toFormat("$0,0.00");
        totalSumm=totalSumm.add(productSumm);
        cartQuantity+=productQuantity;
    }
    cartQuantityMas.forEach((val)=>{
        val.innerText=" "+cartQuantity+" ";
    });
    subtotalSummElement.innerText=totalSumm.toFormat("$0,0.00");
    totalSummElement.innerText=totalSumm.toFormat("$0,0.00");
}
let productQuantityWrapperMas=document.querySelectorAll(".Cart-product-quantity-controls");
productQuantityWrapperMas.forEach((val,j)=>{
    let productQuantityBtns=val.querySelectorAll("button");
    let productQuantityInput=val.querySelector("input");
    for(let i=0;i<productQuantityBtns.length;i++){
        productQuantityBtns[i].addEventListener("click",(event)=>{
            event.preventDefault();
            let quantityValue=productQuantityInput.value;
            let productId=Number.parseInt(productItems[j].getAttribute("data-product-id"));
            if(i===0){
                if(quantityValue!=="1"){
                    productQuantityInput.value=Number.parseInt(quantityValue)-1;
                    updateProductCookie("cartContent", productId,"-",cookiesOptions);
                    updateCartQuan("-",1);
                    updateCart();
                }
            }else{
                if(quantityValue!=="9"){
                    productQuantityInput.value=Number.parseInt(quantityValue)+1;
                    updateProductCookie("cartContent", productId,"+",cookiesOptions);
                    updateCartQuan("+",1);
                    updateCart();
                }
            }
        });
    }
    productQuantityInput.addEventListener("change",(event)=>{
        event.preventDefault();
        if(Number.parseInt(productQuantityInput.value)>=1&&Number.parseInt(productQuantityInput.value)<=9){
            productQuantityInput.setAttribute("data-previous-value",productQuantityInput.value);
        }else{
            productQuantityInput.value=productQuantityInput.getAttribute("data-previous-value");
        }
    });
});
let deletepProductBtns=document.querySelectorAll(".Cart-product-total-buttons .Delete-item");
deletepProductBtns.forEach((val,i)=>{
    val.addEventListener("click",(event)=>{
        event.preventDefault();
        productItems[i].remove();
        let cookieValue=getCookie("cartContent");
        let reg=RegExp(`_${productItems[i].getAttribute("data-product-id")}-[0-9]*|${productItems[i].getAttribute("data-product-id")}-[0-9]*_|${productItems[i].getAttribute("data-product-id")}-[0-9]*`);
        let productVal=cookieValue.match(reg)[0];
        productVal=productVal.replace(/_/,"");
        let productQuantity=productVal.split("-");
        setCookie("cartContent",cookieValue.replace(reg,""),cookiesOptions);
        updateCartQuan("-",Number.parseInt(productQuantity[1]));
        updateCart();
    });
});