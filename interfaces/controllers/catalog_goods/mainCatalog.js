"use strict";
let checkRequestForForm=require("../../routeValidators/checkRequestForForm.js");
const makePage=require("../../utilities/makePage.js");

module.exports=async (req,res,next)=>{
  checkRequestForForm(req,res,next);

  let catalogPage=new makePage(req,res,"catalog_goods","catalog_goods","pug",{},true,req.params.categoryId);

  let pageContent=await catalogPage.makePage();

  res.end(pageContent);
}