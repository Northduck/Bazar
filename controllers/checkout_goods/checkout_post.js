"use strict";

let db=require("../../connect");
let client=db.getClient();
let conf=require("../../config/index_config");
let knex=require("knex")({
    client: 'pg',
    connection: conf.get("postgresBd"),
    searchPath: ["Bazar"]
  });
let argon2 = require('argon2');
function generateOrderNumber(req) {
    var orderNumber      = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
        orderNumber += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return orderNumber;
}
async function makeOrder(req) {
    let OrderNumber=generateOrderNumber(req);
    let purchasedProductsInfo=req.cookies["cartContent"].split("_");
    let purchasedProducts=new Array(purchasedProductsInfo.length);
    purchasedProductsInfo.forEach((element,i) => {
      purchasedProducts[i]=element.split("-");
    });

    purchasedProducts.sort((a,b)=>{
        if(Number.parseInt(a[0])>Number.parseInt(b[0])){
            return 1;
        }
        if(Number.parseInt(a[0])<Number.parseInt(b[0])){
            return -1;
        }
        return 0;
    });
    let purchasedProductsInfoQuery=knex.select(knex.raw("product_id, product_current_price::numeric::float8")).from("products").where((builder)=>{
        builder=builder.where("product_id",purchasedProducts[0][0]);
        for(let i=1;i<purchasedProducts.length;i++){
            builder=builder.orWhere("product_id",purchasedProducts[i][0]);
        }
      }).orderBy("product_id").toString();
    let purchasedProductsInfoResult=(await client.query(purchasedProductsInfoQuery)).rows;
    let orderSumm=purchasedProducts.reduce((summ,val,i)=>{
        return summ+Number.parseInt(val[1])*purchasedProductsInfoResult[i]["product_current_price"];
    },0);
    knex.insert((builder)=>{});
    let insertProductOrderQuery=knex.returning('product_order_id').insert(
        {'product_order_id':'default',
        'product_order_payment_type':req.session.orderInfo.paymentMethod,
        'product_order_receive_type':req.session.orderInfo.receiving['method'],
        'product_order_date':"NOW()",
        'product_order_generated_number':OrderNumber,
        'product_order_summ':orderSumm,
        'user_id':req.session["userInfo"]["user_id"]
        }).into("products_orders").toString().replace(/'default'/g,"default");

    let insertProductOrderQueryRes=(await client.query(insertProductOrderQuery)).rows;
    console.log(purchasedProductsInfoResult);

    if(req.session.orderInfo.receiving['method']==='shipment'){
        let insertProductDeliveryQuery=knex.insert(
            {
                'shipment_id':'default',
                'product_order_id':insertProductOrderQueryRes["produc_order_id"],
                'shipment_city':req.session.orderInfo.receiving["city"],
                'shipment_house':req.session.orderInfo.receiving["house"],
                'shipment_apartment':req.session.orderInfo.receiving["apartment"]
            }
        ).into("products_orders").toString().replace(/'default'/g,"default");
        let insertProductDeliveryQueryResult=(await client.query(insertProductDeliveryQuery)).rows;
    }

    let purchasedProductsForQuery=new Array(purchasedProductsInfoResult.length);

    for(let i=0;i<purchasedProductsForQuery.length;i++){
        purchasedProductsForQuery[i]={
            'purchase_id':'default',
            'purchase_quantity':purchasedProducts[i][1],
            'product_order_id':insertProductOrderQueryRes[0]["product_order_id"],
            'product_id':purchasedProducts[i][0],
            'purchase_for_price':purchasedProductsInfoResult[i]["product_current_price"]
        };
    };

    let purchasedProductsQuery=knex.insert(purchasedProductsForQuery).into("purchases").toString().replace(/'default'/g,"default").toString();
    console.log(purchasedProductsQuery);
    let purchasedProductsQueryResult= (await client.query(purchasedProductsQuery)).rows;
    return OrderNumber;
}
let stageHandlers={
    'receivingMethod':function receivingMethodHandler(req) {
        let returnInfo={returnCode:-1};
        if(req.query.receivingMethod!==undefined){
            if(req.query.receivingMethod==="pickup"){
                req.session.orderInfo.receiving={
                    method:"pickup", 
                    place:req.query.pickupPlace
                };
            }else{
                if(req.query.receivingMethod==="shipment"){
                    req.session.orderInfo.receiving={
                        method:"shipment", 
                        city:req.query["Shipment-city"],
                        street:req.query["Shipment-street"],
                        house:req.query["Shipment-house"],
                        apartment:req.query["Shipment-apartment"]
                    };
                }
            }
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
                req.session.orderInfo.currentStage=1;
            }else{
                if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                    req.session.orderInfo.currentStage=0;
                }
            }
            returnInfo['returnCode']=1;
        }
        returnInfo["currentStage"]=req.session.orderInfo.currentStage;
        return returnInfo;
    },
    'contactInformation':function contactInformationHandler(req) {
        let returnInfo={returnCode:-1};
        req.session.orderInfo.contactInfo={
            phoneNumber:req.query["Fulfillment-phone-number"],
            email:req.query["Fulfillment-email"],
            name:req.query["Fulfillment-name"]
        };
        if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
            req.session.orderInfo.currentStage=2;
        }else{
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                req.session.orderInfo.currentStage=1;
            }
        }
        returnInfo['returnCode']=1;
        returnInfo["currentStage"]=req.session.orderInfo.currentStage;
        return returnInfo;
    },
    'paymentMethod':async function paymentMethodHandler(req){
        let returnInfo={returnCode:-1};
        req.session.orderInfo.paymentMethod=req.query["Payment-method"];
        if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
            req.session.orderInfo.currentStage=3;
            returnInfo["orderNumber"]= await makeOrder(req);
            console.log("RETURNED",returnInfo);
        }else{
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                req.session.orderInfo.currentStage=2;
            }
        }
        if(returnInfo["orderNumber"]!==undefined){
            returnInfo['returnCode']=1;
        }
        returnInfo["currentStage"]=req.session.orderInfo.currentStage;
        return returnInfo;
    }
};
module.exports=async(req,res)=>{
    let response={};
    response.problems=[];
    console.log(req.url);
    console.log(req.query);
    console.log(req.session);
    let stageInfo=await stageHandlers[req.query.stageName](req);
    if(stageInfo["currentStage"]===3&&stageInfo["orderNumber"]!==undefined){
        res.clearCookie("cartContent",{path:"/"});
        res.clearCookie("cartCounter",{path:"/"}); 
        delete req.session.orderInfo;
    }
    console.log("RESULT!!!");
    //req.session.orderInfo.currentStage=0;
    res.end(JSON.stringify(stageInfo));
}