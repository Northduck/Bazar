"use strict";
let CheckoutProducts=require("../../domain/CheckoutProducts.js");
module.exports=async (checkoutProductsContent,purchasedProducts,checkoutRepository)=>{
    let checkoutProducts=new CheckoutProducts(checkoutProductsContent);
    let newOrderID;
    try {
        newOrderID=await checkoutRepository.setProductsOrder(checkoutProducts);
    } catch (error) {
        console.log(error);
    }
    
    let setShipmentInfoResponse;
    if(checkoutProducts.getReceivingInfo()["method"]==="shipment"){
        try {
            setShipmentInfoResponse=await checkoutRepository.setShipmentInfo(checkoutProducts,newOrderID);
        } catch (error) {
            console.log(error);
        }
    }
    let setPurchasedProductsResponse;
    try {
        setPurchasedProductsResponse=await checkoutRepository.setPurchasedProducts(purchasedProducts,newOrderID);
    } catch (error) {
        console.log(error);
    }
}