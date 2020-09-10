const makePage=require("../../interfaces/utilities/makePage");
module.exports=async (err,req,res,next)=>{
    console.log("\n\nError handler URL= ",req.originalUrl,"\n\n");
    if (!err.statusCode) {
        err.statusCode = 500;
    }
    res.status(err.statusCode);
    let errContext={
        "statusCode":err.statusCode,
        "errorMessage":err.message,
        "errorType":err.errorType
    };
    if((req.headers["sec-fetch-dest"]&&req.headers["sec-fetch-dest"]==="document")){
        let notFoundPage=new makePage(req,res,"not_found","not_found","pug",errContext);
        let errorPageContent=await notFoundPage.makePage();
        res.end(errorPageContent);
    }
    res.end();
}