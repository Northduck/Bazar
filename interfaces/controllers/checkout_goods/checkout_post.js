"use strict";
let setReceivingInfo=require("../../../application/checkoutProductsUseCases/setReceivingInfo.js");
let setContactInfo=require("../../../application/checkoutProductsUseCases/setContactInfo.js");
let setPaymentInfo=require("../../../application/checkoutProductsUseCases/setPaymentInfo.js");
let prepareCheckoutInfo=require("../../utilities/prepareCheckoutInfo.js");
let convertCartCookieToArr=require("../../utilities/convertCartCookieToArr.js");
let listCart=require("../../../application/cartUseCases/listCart.js");
let CartRepository=require("../../dataAccess/cartDataAccess/cartRepository.js");
let CheckoutRepository=require("../../dataAccess/checkoutProductsDataAccess/checkoutRepository.js");
let getPurchaseTotalPrice=require("../../../application/checkoutProductsUseCases/getPurchaseTotalPrice.js");
let checkoutProducts=require("../../../application/checkoutProductsUseCases/checkoutProducts.js");
module.exports=async(req,res,next)=>{
    console.log(req.url);
    console.log(req.query);
    console.log(req.session);
    let stageName=req.query.stageName;
    let checkoutStagePreparedInfo=prepareCheckoutInfo[stageName](req);
    let stageResponse;
    switch (stageName) {
        case "receivingMethod":
            stageResponse=setReceivingInfo(req.session["orderInfo"],checkoutStagePreparedInfo);
            break;
        case "contactInformation":
            stageResponse=setContactInfo(req.session["orderInfo"],checkoutStagePreparedInfo);
            break;
        case "paymentMethod":
            stageResponse=setPaymentInfo(req.session["orderInfo"],checkoutStagePreparedInfo);
            break;
        default:
            break;
    }
    if(stageResponse["validationResponse"]["responseCode"]===1){
        req.session["orderInfo"]=stageResponse["checkoutProducts"];
    }
    stageResponse["validationResponse"]["currentStage"]=req.session["orderInfo"]["currentStage"];
    if(stageResponse["validationResponse"]["currentStage"]===3){
        let cartContent=convertCartCookieToArr(req.cookies.cartContent);
        let cartRepository=new CartRepository();
        let cartInfo= await listCart(cartContent,cartRepository);
        let checkoutRepository=new CheckoutRepository();
        let orderTotalPrice=await getPurchaseTotalPrice(cartInfo);
        stageResponse["checkoutProducts"].setOrderSumm(orderTotalPrice);
        stageResponse["checkoutProducts"].generateOrderNumber();
        req.session["orderInfo"]=stageResponse["checkoutProducts"];
        let checkoutResponse= await checkoutProducts(req.session["orderInfo"],cartInfo,checkoutRepository);
        stageResponse["validationResponse"]["orderNumber"]=stageResponse["checkoutProducts"].getOrderNumber();
        res.clearCookie("cartContent",{path:"/"});
        res.clearCookie("cartCounter",{path:"/"}); 
        delete req.session.orderInfo;
    }
    res.end(JSON.stringify(stageResponse["validationResponse"]));
}