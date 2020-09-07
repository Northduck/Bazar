"use strict";
const Cart=require("../../domain/Cart.js");
const container=require("../../infrastructure/infrastructureContainer.js");
const {money}=container.cradle;
module.exports=(cartContent,cartInfo)=>{
    let cart=new Cart(cartContent);
    
    let orderTotalPrice=money({"amount":0,"currency":"USD"});
    orderTotalPrice=cartInfo.reduce((summ,cartProductVal,i)=>{
        let productPrice=money({"amount":Number.parseInt(cartProductVal['product_current_price']*100)});
        let productPurchaseSumm=productPrice.multiply(cart.getProductInfo(i)["productQuantity"]);
        return summ.add(productPurchaseSumm);
    },orderTotalPrice);
    let purchaseInfo={
        "totalPrice":orderTotalPrice.toRoundedUnit(2),
        "totalQuantity":cart.getCartQuantity()
    };
    return purchaseInfo;
}