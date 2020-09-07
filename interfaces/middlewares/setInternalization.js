const container=require("../../infrastructure/infrastructureContainer.js");
const {i18n}=container.cradle;
const setInternalization=(req, res, next)=>{
    res.locals.__ = res.__ = function() {
        return i18n.__.apply(req, arguments);
    };
    res.i18n=res.locals;
    next();
}
module.exports=setInternalization;