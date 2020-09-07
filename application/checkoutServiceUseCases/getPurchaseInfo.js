"use strict";
const container=require("../../infrastructure/infrastructureContainer.js");
const {money}=container.cradle;
module.exports=async(purchaseServiceId,serviceCheckoutRepository)=>{
    let serviceInfo=await serviceCheckoutRepository.getServiceInfoById(purchaseServiceId);
    
    let orderTotalPrice=money({"amount":Number.parseInt(serviceInfo['service_current_price']*100),"currency":"USD"});
    let purchaseInfo={
        "totalPrice":orderTotalPrice.toRoundedUnit(2)
    };
    return purchaseInfo;
}