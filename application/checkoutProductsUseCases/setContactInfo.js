"use strict";
let validateContactInfo=require("./validation/validateContactInfo.js");
let CheckoutProducts=require("../../domain/CheckoutProducts.js");
module.exports=(checkoutProductsContent,contactInfo)=>{
    let checkoutProducts=new CheckoutProducts(checkoutProductsContent);
    let validationResponse=validateContactInfo(contactInfo);
    let useCaseResponse={
        "validationResponse":validationResponse,
        "checkoutProducts":undefined
    }
    if(validationResponse["responseCode"]===-1){
        return useCaseResponse;
    }
    checkoutProducts.setCurrentStage(contactInfo["currentStage"]);
    let checkoutContactInfo={
        phoneNumber:contactInfo["phoneNumber"],
        email:contactInfo["email"],
        name:contactInfo["name"]
    };
    checkoutProducts.setContactInfo(checkoutContactInfo);
    checkoutProducts.setUserID(contactInfo["userID"]);
    useCaseResponse["checkoutProducts"]=checkoutProducts;
    return useCaseResponse;
}