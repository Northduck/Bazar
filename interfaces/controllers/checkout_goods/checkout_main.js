"use strict";

const makePage=require("../../utilities/makePage.js");
let convertCartCookieToArr=require("../../utilities/convertCartCookieToArr.js");
let listCart=require("../../../application/cartUseCases/listCart.js");
let CartRepository=require("../../dataAccess/cartDataAccess/cartRepository.js");
let getPurchaseInfo=require("../../../application/checkoutProductsUseCases/getPurchaseInfo.js");
module.exports=async (req,res)=>{
  let cartContent=convertCartCookieToArr(req.cookies.cartContent);
  let cartRepository=new CartRepository();
  let cartInfo= await listCart(cartContent,cartRepository);
  let orderInfoContext=getPurchaseInfo(cartContent,cartInfo);

  let checkoutPage=new makePage(req,res,"checkout_goods","checkout_goods","pug",orderInfoContext);

  let pageContent=await checkoutPage.makePage();

  res.end(pageContent);
}