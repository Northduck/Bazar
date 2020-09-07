"use strict";
module.exports=async(req,res,next)=>{
    console.log("params",req.params);
    let realServiceId;
    try {
        realServiceId=Number.parseInt(req.params["serviceId"])%10000;
    } catch (error) {
        error.statusCode = 404;
        next(error);
    }
    req.params["realServiceId"]=realServiceId;
    next();
}