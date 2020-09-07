"use strict";

const makePage=require("../../utilities/makePage.js");

module.exports=async (req,res,next)=>{

  let roomsCategoriesPage=new makePage(req,res,"rooms_categories","rooms_categories","pug",{},true,req.params.typeId);

  let pageContent=await roomsCategoriesPage.makePage();

  res.end(pageContent);
}