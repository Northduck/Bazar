let fs=require("fs");
let pug=require("pug");
let registrationPage;
let pugContext={};
module.exports=(req,res)=>{
  fs.readFile("./templates/register/register.pug",(error,data)=>{
    if(error){
      console.log(error);
    }
    pugContext.session=req.session;
    pugContext.i18n=res.locals;
    registrationPage=pug.compile(data,{"basedir":"./"});
    res.end(registrationPage(pugContext));
  });
}