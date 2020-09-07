"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
const {money}=container.cradle;
module.exports=async (req,res,next)=>{
  let newLanguage=req.query["change_language"];
  req.session["language"]=newLanguage;
  res.cookie("language",newLanguage);
  money.globalLocale=newLanguage;
  res.end(JSON.stringify({returnValue:1}));
}