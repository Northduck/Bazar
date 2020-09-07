"use strict";
const makePage=require("../../utilities/makePage.js");
const makeContext=require("../../utilities/makeContextFromQueries.js");
module.exports=async(req,res,next)=>{
    let compareArray=req.session.compareArray;
    //let context=await makeContext("compare_goods",compareArray);
    let compareContext={};
    if(compareArray.length===0){
        compareContext["contentEmpty"][true];
    }
    let comparePage=new makePage(req,res,"compare_goods","compare_goods","pug",compareContext,true,compareArray);

    let pageContent=await comparePage.makePage();

    res.end(pageContent);
}