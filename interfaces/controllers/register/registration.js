const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res)=>{
  
  let registerPage=new makePage(req,res,"register","register","pug",{});

  let pageContent=await registerPage.makePage();

  res.end(pageContent);
};