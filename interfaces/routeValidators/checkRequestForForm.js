module.exports=(req,res,next)=>{
    if(req.url.match(/\?/)){
        next();
    }
}