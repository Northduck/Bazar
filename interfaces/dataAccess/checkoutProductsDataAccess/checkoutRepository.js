"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
let {database,queryBuilder}=container.cradle;
module.exports=class checkoutRepository{
    async setProductsOrder(orderInfo){
        let insertProductOrderQuery=queryBuilder.returning('product_order_id').insert(
        {'product_order_id':'default',
        'product_order_payment_type':orderInfo.getPaymentMethod(),
        'product_order_receive_type':orderInfo.getReceivingInfo()["method"],
        'product_order_date':"NOW()",
        'product_order_generated_number':orderInfo.getOrderNumber(),
        'product_order_summ':orderInfo.getOrderSumm(),
        'user_id':orderInfo.getUserID()
        })
        .into("products_orders")
        .toString().replace(/'default'/g,"default");
        let insertProductOrderQueryRes;
        try {
            insertProductOrderQueryRes=(await database.query(insertProductOrderQuery)).rows[0]["product_order_id"];
        } catch (error) {
            console.log(error);
        }
        console.log(insertProductOrderQueryRes);
        return insertProductOrderQueryRes;
    }
    async setShipmentInfo(orderInfo,orderID){
        let shipmentInfo=orderInfo.getReceivingInfo();
        let insertProductDeliveryQuery=queryBuilder.insert(
            {
                'shipment_id':'default',
                'product_order_id':orderID,
                'shipment_city':shipmentInfo["city"],
                'shipment_street':shipmentInfo["street"],
                'shipment_house':shipmentInfo["house"],
                'shipment_apartment':shipmentInfo["apartment"]
            }
        )
        .into("shipments")
        .toString().replace(/'default'/g,"default");
        let insertProductDeliveryQueryResult;
        try {
            insertProductDeliveryQueryResult=(await database.query(insertProductDeliveryQuery)).rows;
        } catch (error) {
            console.log(error);
        }
        return insertProductDeliveryQueryResult;
    }
    async setPurchasedProducts(purchasedProducts,orderID){
        let purchasedProductsForQuery=new Array(purchasedProducts.length);
        for(let i=0;i<purchasedProductsForQuery.length;i++){
            purchasedProductsForQuery[i]={
                'purchase_id':'default',
                'purchase_quantity':purchasedProducts[i]["productQuantity"],
                'product_order_id':orderID,
                'product_id':purchasedProducts[i]["product_id"],
                'purchase_for_price':purchasedProducts[i]["product_current_price"]
            };
        };
        let purchasedProductsQuery=queryBuilder.insert(purchasedProductsForQuery)
        .into("purchases")
        .toString().replace(/'default'/g,"default");
        let purchasedProductsQueryResult;
        try {
            purchasedProductsQueryResult=(await database.query(purchasedProductsQuery)).rows;
        } catch (error) {
            console.log(error);
        }
        
        console.log(purchasedProductsQueryResult);
    }
};