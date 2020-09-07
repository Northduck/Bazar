function setCurrency(req,res,next){
    if(req.cookies["currency"]===undefined || req.cookies["currency"]===""){
        res.cookie("currency","USD");
    }
    if(req.session["currency"]===undefined || req.session["currency"]===""){
        req.session["currency"]="USD";
    }
    next();
}
module.exports=setCurrency;