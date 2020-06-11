"use strict";
let makeContext=require("../../makeContextFromQueries");
let fs=require("fs");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
module.exports=async (req,res)=>{
  if(req.session["compareArray"]===undefined){
    req.session["compareArray"]=[];
  }
  let existingCategoryIndex=req.session["compareArray"].findIndex((arrayEl)=>{
    if(Number.parseInt(arrayEl["compareCategoryId"])===Number.parseInt(req.query["compareCategoryId"])){
      return true;
    }
  });
  if(existingCategoryIndex!==-1){
    let existingProductIndex=req.session["compareArray"][existingCategoryIndex]["compareProducts"].findIndex((arrayEl)=>{
      if(arrayEl===Number.parseInt(req.query["compareProductId"])){
        return true;
      }
    });
    if(existingProductIndex===-1){
      req.session["compareArray"][existingCategoryIndex]["compareProducts"].push(Number.parseInt(req.query["compareProductId"]));
    }
  }else{
    req.session["compareArray"].push(
      {
        "compareCategoryId":Number.parseInt(req.query["compareCategoryId"]),
        "compareProducts": [Number.parseInt(req.query["compareProductId"])]
      }
    );
  }
  res.end(JSON.stringify({"responseCode":1}));
}