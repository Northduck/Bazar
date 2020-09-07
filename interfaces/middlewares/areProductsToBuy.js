"use strict";
module.exports=(req,res,next)=>{
    if(req.cookies.cartContent!=undefined&&req.cookies.cartContent!==""&&req.cookies.cartCounter!=undefined&&req.cookies.cartCounter!=="0"){
        next();
    }else{
        res.redirect("/cart");
    }
}