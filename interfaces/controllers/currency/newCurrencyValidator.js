"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
const {config}=container.cradle;
module.exports=(req,res,next)=>{
    let newCurrency=req.query["change_currency"];
    let supportedCurrencies=config.get("supported_currencies");
    if(newCurrency===req.cookies["currency"]){
        res.end(JSON.stringify({returnValue:0}));
        return;
    }
    if(newCurrency!==undefined&&typeof newCurrency==="string"){
        let isSupported=supportedCurrencies.find((el,i)=>{
        if(el===newCurrency){
            return true;
        }
        });
        if(isSupported!==undefined){
            next();
        }else{
            res.end(JSON.stringify({returnValue:-1}));
        }
    }else{
        res.end(JSON.stringify({returnValue:-1}));
    }
}