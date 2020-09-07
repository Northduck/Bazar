"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
let {database,queryBuilder}=container.cradle;
module.exports=class checkoutRepository{
    async getServiceInfoById(purchasedServiceID){
        let purchasedServiceInfoQuery=`select service_id, service_current_price from services where service_id=${purchasedServiceID}`;
        let purchasedServiceInfoResult;
        try {
            purchasedServiceInfoResult=(await database.query(purchasedServiceInfoQuery)).rows[0];
        } catch (error) {
            console.log(error);
        }
        return purchasedServiceInfoResult;
    }

    async setServiceOrder(orderInfo,purchasedService){
        let insertProductOrderQuery=queryBuilder.returning('service_order_id').insert(
        {'service_order_id':'default',
        'service_order_payment_type':orderInfo.getPaymentMethod(),
        'service_order_note':orderInfo.getContactInfo()["note"],
        'service_id':purchasedService,
        'service_order_date':"NOW()",
        'service_order_generated_number':orderInfo.getOrderNumber(),
        'service_order_summ':orderInfo.getOrderSumm(),
        'user_id':orderInfo.getUserID()
        })
        .into("services_orders")
        .toString().replace(/'default'/g,"default");
        let insertProductOrderQueryRes;
        try {
            insertProductOrderQueryRes=(await database.query(insertProductOrderQuery)).rows[0]["service_order_id"];
        } catch (error) {
            console.log(error);
        }
        console.log(insertProductOrderQueryRes);
        return insertProductOrderQueryRes;
    }
};