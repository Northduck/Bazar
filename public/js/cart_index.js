import {getCookie, setCookie, updateProductCookie, replaceCookie} from "./modules/cookie_methods.js";
function deleteCurrency(price) {
    price.replace(/\$/g,"");
}
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
let cartCounter=document.querySelector(".Cart-counter");
let cartQuantityMas=document.querySelectorAll(".Cart-quantity");
let subtotalPrice=document.querySelector(".Cart-order-subtotal-price");
let totalPrice=document.querySelector(".Cart-order-total-price");
let productItems=document.querySelectorAll(".Cart-product-item");
console.log(productItems);
updateCart();
function updateCart() {
    let subtotalSumm=0;
    let cartQuantity=0;
    let productsPrices=document.querySelectorAll(".Cart-product-item .Cart-product-price");
    let productsQuantities=document.querySelectorAll(".Product-quantity-value");
    let productTotalPrice=document.querySelectorAll(".Cart-product-total-price");
    for(let i=0;i<productsPrices.length;i++){
        let producTempSumm=Number.parseFloat(productsPrices[i].getAttribute("data-product-price"))
        *Number.parseFloat(productsQuantities[i].value);
        productTotalPrice[i].innerText="$"+producTempSumm.toFixed(2);
        subtotalSumm+=producTempSumm;
        cartQuantity+=Number.parseInt(productsQuantities[i].value);
    }
    subtotalPrice.innerText="$"+subtotalSumm.toFixed(2);
    cartQuantityMas.forEach((val)=>{
        val.innerText=" "+cartQuantity+" ";
    });
    totalPrice.innerText="$"+(subtotalSumm+subtotalSumm/5).toFixed(2);
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
        let productStart=cookieValue.search(reg);
        let productVal=cookieValue.substring(productStart,cookieValue.indexOf("_",productStart)===-1?undefined:cookieValue.indexOf("_",productStart));
        let productQuantity=productVal.split("-");
        setCookie("cartContent",cookieValue.replace(reg,""),cookiesOptions);
        updateCartQuan("-",Number.parseInt(productQuantity[1]));
        updateCart();
    });
});