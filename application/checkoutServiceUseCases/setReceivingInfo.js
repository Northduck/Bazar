"use strict";
let validateReceivingInfo=require("./validation/validateReceivingInfo.js");
let CheckoutService=require("../../domain/CheckoutService.js");
module.exports=(checkoutServiceContent,receivingInfo)=>{
    let checkoutService=new CheckoutService(checkoutServiceContent);
    let validationResponse=validateReceivingInfo(receivingInfo);
    let useCaseResponse={
        "validationResponse":validationResponse,
        "checkoutService":undefined
    }
    if(validationResponse["responseCode"]===-1){
        return useCaseResponse;
    }
    checkoutService.setCurrentStage(receivingInfo["currentStage"]);
    let checkoutreceivingInfo={
        method:"shipment", 
        city:receivingInfo["city"],
        street:receivingInfo["street"],
        house:receivingInfo["house"],
        apartment:receivingInfo["apartment"]
    };
    checkoutService.setReceivingInfo(checkoutreceivingInfo);
    useCaseResponse["checkoutService"]=checkoutService;
    return useCaseResponse;
}