"use strict";
const makePage=require("../../utilities/makePage.js");
module.exports=async(req,res)=>{
  let productId=req.params["productId"];
  let productPage=new makePage(req,res,"goods","goods","pug",{},true,productId);

  let pageContent=await productPage.makePage();

  res.end(pageContent);
}