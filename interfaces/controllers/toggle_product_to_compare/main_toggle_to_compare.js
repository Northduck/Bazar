"use strict";
let toggleProductTocompare=require("../../../application/toggleProductTocompare.js");
module.exports=async (req,res)=>{
  if(req.query["compareCategoryId"]===undefined||typeof req.query["compareCategoryId"]!=="string"||req.query["compareProductId"]===undefined||typeof req.query["compareProductId"]!=="string"){
    res.end(JSON.stringify({"responseCode":-1}));
  }
  let compareCategoryId;
  let compareProductId;
  try {
    compareCategoryId=Number.parseInt(req.query["compareCategoryId"]);
    compareProductId=Number.parseInt(req.query["compareProductId"]);
  } catch (error) {
    console.log(error);
    res.end(JSON.stringify({"responseCode":-1}));
  }
  let tempCompareArray=toggleProductTocompare(compareCategoryId,compareProductId,req.session["compareArray"]);
  if(tempCompareArray==undefined){
    res.end(JSON.stringify({"responseCode":-1})); 
  }
  req.session["compareArray"]=tempCompareArray;
  res.end(JSON.stringify({"responseCode":1})); 
}