"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
let {database,queryBuilder}=container.cradle;
module.exports=class cartRepository{
    async listCart(cart){
        let cartContent=cart.getCartContent();
        if(cart.getCartQuantity()===0){
            return [];
        }
        let cartQuery=queryBuilder.select(queryBuilder.raw("products.product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_receipt_date, product_current_price, product_previous_price"))
        .from("products")
        .where((builder)=>{
            for(let i=0;i<cartContent.length;i++){
                builder=builder.orWhere("products.product_id",cartContent[i]["productID"]);
            }
        })
        .orderBy("products.product_id")
        .toString();
        let cartInfo=(await database.query(cartQuery)).rows;
        cartInfo=cartInfo.map((cartInfoValue,i)=>{
            cartInfoValue["productQuantity"]=cartContent[i]["productQuantity"];
            return cartInfoValue;
        });
        return cartInfo;
    }
};