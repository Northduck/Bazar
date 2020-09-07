"use strict";
const container=require("../../infrastructure/infrastructureContainer.js");
const {money}=container.cradle;
module.exports=(cartInfo)=>{
    let orderTotalPrice=money({"amount":0,"currency":"USD"});
    orderTotalPrice=cartInfo.reduce((summ,cartProductVal,i)=>{
        let productPrice=money({"amount":Number.parseInt(cartProductVal['product_current_price']*100)});
        let productPurchaseSumm=productPrice.multiply(cartInfo[i]["productQuantity"]);
        return summ.add(productPurchaseSumm);
    },orderTotalPrice);
    return orderTotalPrice.toRoundedUnit(2);
}