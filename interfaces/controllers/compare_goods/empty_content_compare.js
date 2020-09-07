"use strict";
const makePage=require("../../utilities/makePage.js");
function isCompareContentGood(compareArray) {
    if(compareArray===undefined||!Array.isArray(compareArray)||compareArray.length===0){
        return false;
    }
    let isCategoryHasEnoughProducts=false
    for(let i=0;i<compareArray.length;i++){
        if(compareArray[i]["compareCategoryId"]!==undefined&&compareArray[i]["compareProducts"]!==undefined&&compareArray[i]["compareProducts"].length>1){
            isCategoryHasEnoughProducts=true;
            break;
        }
    }        
    return isCategoryHasEnoughProducts;
}

module.exports=async(req,res,next)=>{
    let compareArray=req.session.compareArray;
    if(isCompareContentGood(compareArray)===true){
        next();
        return;
    }
    let comparePageContext={
        "contentEmpty":true
    };
    let comparePage=new makePage(req,res,"compare_goods","compare_goods","pug",comparePageContext);

    let pageContent=await comparePage.makePage();

    res.end(pageContent);
}