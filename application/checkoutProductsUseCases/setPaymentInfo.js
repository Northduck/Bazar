"use strict";
let validatePaymentInfo=require("./validation/validatePaymentInfo.js");
let CheckoutProducts=require("../../domain/CheckoutProducts.js");
module.exports=(checkoutProductsContent,paymentInfo)=>{
    let checkoutProducts=new CheckoutProducts(checkoutProductsContent);
    let validationResponse=validatePaymentInfo(paymentInfo);
    let useCaseResponse={
        "validationResponse":validationResponse,
        "checkoutProducts":undefined
    }
    if(validationResponse["responseCode"]===-1){
        return useCaseResponse;
    }
    checkoutProducts.setCurrentStage(paymentInfo["currentStage"]);
    let checkoutPaymentInfo=paymentInfo["paymentMethod"];
    checkoutProducts.setPaymentMethod(checkoutPaymentInfo);
    useCaseResponse["checkoutProducts"]=checkoutProducts;
    return useCaseResponse;
}