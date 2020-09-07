"use strict";
const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res)=>{
  
  let homePage=new makePage(req,res,"home","home","pug",{},true);

  let pageContent=await homePage.makePage();

  res.end(pageContent);
};