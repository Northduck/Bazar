"use strict";
module.exports=async(req,res,next)=>{
    console.log("params",req.params);
    let productId;
    try {
        productId=Number.parseInt(req.params["goodId"])%10000;
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
    req.params["productId"]=productId;
    next();
}