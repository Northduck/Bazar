function setLanguage(req,res,next){
    if(req.cookies["language"]===undefined || req.cookies["language"]===""){
        res.cookie("language","en");
    }
    if(req.session["language"]===undefined || req.session["language"]===""){
        req.session["language"]="english";
    }
    next();
}
module.exports=setLanguage;