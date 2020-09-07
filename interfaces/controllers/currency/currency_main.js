"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
const {money}=container.cradle;
module.exports=async (req,res,next)=>{
  let newCurrency=req.query["change_currency"];
  req.session["currency"]=newCurrency;
  res.cookie("currency",newCurrency);
  res.end(JSON.stringify({returnValue:1}));
}