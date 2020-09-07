"use strict";
let validatePaymentInfo=require("./validation/validatePaymentInfo.js");
let CheckoutService=require("../../domain/CheckoutService.js");
module.exports=(checkoutServiceContent,paymentInfo)=>{
    let checkoutService=new CheckoutService(checkoutServiceContent);
    let validationResponse=validatePaymentInfo(paymentInfo);
    let useCaseResponse={
        "validationResponse":validationResponse,
        "checkoutService":undefined
    }
    if(validationResponse["responseCode"]===-1){
        return useCaseResponse;
    }
    checkoutService.setCurrentStage(paymentInfo["currentStage"]);
    let checkoutPaymentInfo=paymentInfo["paymentMethod"];
    checkoutService.setPaymentMethod(checkoutPaymentInfo);
    useCaseResponse["checkoutService"]=checkoutService;
    return useCaseResponse;
}