let roomsNamesFunc=require("../../dataAccess/roomsCategories/index.js");
let roomNames;
(async ()=>{
    roomNames=await roomsNamesFunc();
})()
module.exports=(req,res,next)=>{
    let urlType=req.params.typeName;
    console.log(urlType);
    let typeIndex=roomNames.findIndex((el,ind)=>{
        return urlType===el.type_name_en;
    });
    if(typeIndex===-1){
        let err = new Error(`Type doesn't exist`);
        err.statusCode = 404;
        err.name="typeError";
        next(err);
    }else{
        req.params.typeId=roomNames[typeIndex]["type_id"];
        next();
    }
}