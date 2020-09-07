"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
const {config}=container.cradle;
module.exports=(req,res,next)=>{
    console.log(res.locale);
    let newLanguage=req.query["change_language"];
    let supportedLanguages=config.get("supported_languages");
    if(newLanguage===req.cookies["language"]){
        res.end(JSON.stringify({returnValue:0}));
        return;
    }
    if(newLanguage!==undefined&&typeof newLanguage==="string"){
        let isSupported=supportedLanguages.find((el,i)=>{
        if(el===newLanguage){
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