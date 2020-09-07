"use strict";
let validateReceivingInfo=require("./validation/validateReceivingInfo.js");
let CheckoutProducts=require("../../domain/CheckoutProducts.js");
module.exports=(checkoutProductsContent,receivingInfo)=>{
    let checkoutProducts=new CheckoutProducts(checkoutProductsContent);
    let validationResponse=validateReceivingInfo(receivingInfo);
    let useCaseResponse={
        "validationResponse":validationResponse,
        "checkoutProducts":undefined
    }
    if(validationResponse["responseCode"]===-1){
        return useCaseResponse;
    }
    checkoutProducts.setCurrentStage(receivingInfo["currentStage"]);
    let checkoutreceivingInfo;
    if(receivingInfo["receivingMethod"]==="shipment"){
        checkoutreceivingInfo={
            method:"shipment", 
            city:receivingInfo["city"],
            street:receivingInfo["street"],
            house:receivingInfo["house"],
            apartment:receivingInfo["apartment"]
        };
    }
    if(receivingInfo["receivingMethod"]==="pickup"){
        checkoutreceivingInfo={
            method:"pickup", 
            place:receivingInfo["pickupPlace"]
        };
    }
    checkoutProducts.setReceivingInfo(checkoutreceivingInfo);
    useCaseResponse["checkoutProducts"]=checkoutProducts;
    return useCaseResponse;
}