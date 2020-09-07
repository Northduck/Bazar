"use strict";

const makePage=require("../../utilities/makePage.js");
let convertCartCookieToArr=require("../../utilities/convertCartCookieToArr.js");
let listCart=require("../../../application/cartUseCases/listCart.js");
let CartRepository=require("../../dataAccess/cartDataAccess/cartRepository.js");
module.exports=async (req,res)=>{
  let cartContent=convertCartCookieToArr(req.cookies.cartContent);
  let cartRepository=new CartRepository();
  let cartInfo= await listCart(cartContent,cartRepository);
  let cartPageContext={
    "cartQuantity":Number.parseInt(req.cookies.cartCounter)||0,
    "cartProducts":cartInfo
  };
  let cartPage=new makePage(req,res,"cart","cart","pug",cartPageContext);

  let pageContent=await cartPage.makePage();

  res.end(pageContent);
}
