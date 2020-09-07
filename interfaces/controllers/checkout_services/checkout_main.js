"use strict";

const makePage=require("../../utilities/makePage.js");
let getPurchaseInfo=require("../../../application/checkoutServiceUseCases/getPurchaseInfo.js");
let ServiceCheckoutRepository=require("../../dataAccess/checkoutServiceDataAccess/checkoutRepository.js");
module.exports=async (req,res)=>{
  let purchasedServiceID=Number.parseInt(req.cookies["serviceOrder"]);
  let serviceCheckoutRepository=new ServiceCheckoutRepository();
  let orderInfoContext= await getPurchaseInfo(purchasedServiceID,serviceCheckoutRepository);

  let checkoutPage=new makePage(req,res,"checkout_service","checkout_service","pug",orderInfoContext);

  let pageContent=await checkoutPage.makePage();

  res.end(pageContent);
}