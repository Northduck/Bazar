"use strict";
let CheckoutService=require("../../domain/CheckoutService.js");
module.exports=async (checkoutServiceContent,purchasedService,checkoutRepository)=>{
    let checkoutService=new CheckoutService(checkoutServiceContent);
    let newOrderID;
    try {
        newOrderID=await checkoutRepository.setServiceOrder(checkoutService,purchasedService);
    } catch (error) {
        console.log(error);
    }
}