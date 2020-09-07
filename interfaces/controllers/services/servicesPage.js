"use strict";
const makePage=require("../../utilities/makePage.js");
module.exports=async(req,res)=>{
  let serviceId=req.params["realServiceId"];
  let servicePage=new makePage(req,res,"services","services","pug",{},true,serviceId);

  let pageContent=await servicePage.makePage();

  res.end(pageContent);
}