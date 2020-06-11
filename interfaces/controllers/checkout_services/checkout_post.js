"use strict";

let db=require("../../connect");
let client=db.getClient();
let conf=require("../../config/index_config");
let knex=require("knex")({
    client: 'pg',
    connection: conf.get("postgresBd"),
    searchPath: ["Bazar"]
  });
function generateOrderNumber() {
    var orderNumber      = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < 10; i++ ) {
        orderNumber += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return orderNumber;
}
async function makeOrder(req) {
    let OrderNumber=generateOrderNumber();
    let purchasedServiceID=req.cookies["serviceOrder"];
    let purchasedServiceInfoQuery=`select service_current_price::numeric::float8 from services where service_id=${purchasedServiceID}`;
    console.log(purchasedServiceInfoQuery);
    let purchasedServiceInfoResult=(await client.query(purchasedServiceInfoQuery)).rows;
    console.log(purchasedServiceInfoResult);
    let totalPrice=Number.parseFloat(purchasedServiceInfoResult[0]["service_current_price"]);
    let insertServiceOrderQuery=knex.returning('service_order_id').insert(
        {'service_order_id':'default',
        'service_order_payment_type':req.session.serviceOrderInfo.paymentMethod,
        'service_order_date':"NOW()",
        'service_order_generated_number':OrderNumber,
        'service_order_summ':totalPrice,
        'service_id':purchasedServiceID,
        'user_id':req.session["userInfo"]["user_id"]
        }).into("services_orders").toString().replace(/'default'/g,"default");
    console.log(insertServiceOrderQuery);
    let insertServiceOrderQueryRes=(await client.query(insertServiceOrderQuery)).rows;
    console.log(insertServiceOrderQueryRes);
    return OrderNumber;
}
let stageHandlers={
    'contactInformation':function contactInformationHandler(req) {
        let returnInfo={returnCode:-1};
        req.session.serviceOrderInfo.contactInfo={
            phoneNumber:req.query["Fulfillment-phone-number"],
            email:req.query["Fulfillment-email"],
            name:req.query["Fulfillment-name"]
        };
        if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
            req.session.serviceOrderInfo.currentStage=1;
        }else{
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                req.session.serviceOrderInfo.currentStage=0;
            }
        }
        returnInfo['returnCode']=1;
        returnInfo["currentStage"]=req.session.serviceOrderInfo.currentStage;
        return returnInfo;
    },
    'paymentMethod':async function paymentMethodHandler(req){
        let returnInfo={returnCode:-1};
        req.session.serviceOrderInfo.paymentMethod=req.query["Payment-method"];
        if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
            req.session.serviceOrderInfo.currentStage=3;
            returnInfo["orderNumber"]= await makeOrder(req);
            console.log("RETURNED",returnInfo);
        }else{
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                req.session.serviceOrderInfo.currentStage=1;
            }
        }
        if(returnInfo["orderNumber"]!==undefined){
            returnInfo['returnCode']=1;
        }
        returnInfo["currentStage"]=req.session.serviceOrderInfo.currentStage;
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
    if(stageInfo["currentStage"]===2&&stageInfo["orderNumber"]!==undefined){
        res.clearCookie("serviceOrder",{path:"/"});
        delete req.session.serviceOrderInfo;
    }
    console.log("RESULT!!!");
    //req.session.serviceOrderInfo.currentStage=0;
    res.end(JSON.stringify(stageInfo));
}