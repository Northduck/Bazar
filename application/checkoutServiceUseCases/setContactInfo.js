"use strict";
let validateContactInfo=require("./validation/validateContactInfo.js");
let CheckoutService=require("../../domain/CheckoutService.js");
module.exports=(checkoutServiceContent,contactInfo)=>{
    let checkoutService=new CheckoutService(checkoutServiceContent);
    let validationResponse=validateContactInfo(contactInfo);
    let useCaseResponse={
        "validationResponse":validationResponse,
        "checkoutService":undefined
    }
    if(validationResponse["responseCode"]===-1){
        return useCaseResponse;
    }
    checkoutService.setCurrentStage(contactInfo["currentStage"]);
    let checkoutContactInfo={
        phoneNumber:contactInfo["phoneNumber"],
        email:contactInfo["email"],
        name:contactInfo["name"],
        note:contactInfo["note"]
    };
    checkoutService.setContactInfo(checkoutContactInfo);
    checkoutService.setUserID(contactInfo["userID"]);
    useCaseResponse["checkoutService"]=checkoutService;
    return useCaseResponse;
}