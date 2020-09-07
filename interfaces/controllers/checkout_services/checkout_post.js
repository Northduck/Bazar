"use strict";
let setReceivingInfo=require("../../../application/checkoutServiceUseCases/setReceivingInfo");
let setContactInfo=require("../../../application/checkoutServiceUseCases/setContactInfo.js");
let setPaymentInfo=require("../../../application/checkoutServiceUseCases/setPaymentInfo.js");
let prepareCheckoutInfo=require("../../utilities/prepareServiceCheckoutInfo.js");
let CheckoutRepository=require("../../dataAccess/checkoutServiceDataAccess/checkoutRepository.js");
let getPurchaseInfo=require("../../../application/checkoutServiceUseCases/getPurchaseInfo.js");
let checkoutService=require("../../../application/checkoutServiceUseCases/checkoutService.js");
module.exports=async(req,res,next)=>{
    console.log(req.url);
    console.log(req.query);
    console.log(req.session);
    let purchasedServiceID=Number.parseInt(req.cookies["serviceOrder"]);
    let stageName=req.query.stageName;
    let checkoutStagePreparedInfo=prepareCheckoutInfo[stageName](req);
    let stageResponse;
    switch (stageName) {
        case "receivingMethod":
            stageResponse=setReceivingInfo(req.session["serviceOrderInfo"],checkoutStagePreparedInfo);
            break;
        case "contactInformation":
            stageResponse=setContactInfo(req.session["serviceOrderInfo"],checkoutStagePreparedInfo);
            break;
        case "paymentMethod":
            stageResponse=setPaymentInfo(req.session["serviceOrderInfo"],checkoutStagePreparedInfo);
            break;
        default:
            break;
    }
    if(stageResponse["validationResponse"]["responseCode"]===1){
        req.session["serviceOrderInfo"]=stageResponse["checkoutService"];
    }
    stageResponse["validationResponse"]["currentStage"]=req.session["serviceOrderInfo"]["currentStage"];
    if(stageResponse["validationResponse"]["currentStage"]===3){
        let checkoutRepository=new CheckoutRepository();
        let orderTotalPrice=(await getPurchaseInfo(purchasedServiceID,checkoutRepository)).totalPrice;
        stageResponse["checkoutService"].setOrderSumm(orderTotalPrice);
        stageResponse["checkoutService"].generateOrderNumber();
        req.session["serviceOrderInfo"]=stageResponse["checkoutService"];
        let checkoutResponse= await checkoutService(req.session["serviceOrderInfo"],purchasedServiceID,checkoutRepository);
        stageResponse["validationResponse"]["orderNumber"]=stageResponse["checkoutService"].getOrderNumber();
        res.clearCookie("cartContent",{path:"/"});
        res.clearCookie("cartCounter",{path:"/"}); 
        delete req.session.serviceOrderInfo;
    }
    res.end(JSON.stringify(stageResponse["validationResponse"]));
}