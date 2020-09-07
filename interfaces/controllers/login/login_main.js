const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res)=>{
  
  let loginPage=new makePage(req,res,"login","login","pug",{});

  let pageContent=await loginPage.makePage();

  res.end(pageContent);
};