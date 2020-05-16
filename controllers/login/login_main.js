let fs=require("fs");
let pug=require("pug");
let loginPage;
let pugContext={};
module.exports=(req,res)=>{
  fs.readFile("./templates/login/login.pug",(error,data)=>{
    if(error){
      console.log(error);
    }
    pugContext.session=req.session;
    pugContext.i18n=res.locals;
    loginPage=pug.compile(data,{"basedir":"./"});
    res.end(loginPage(pugContext));
  });
}