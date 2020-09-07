"use strict";
module.exports=(req,res,next)=>{
    if(req.session["userInfo"]!=undefined&&req.session["userInfo"]["user_id"]!=undefined){
        next();
        return;
    }
    res.redirect("/login");
}