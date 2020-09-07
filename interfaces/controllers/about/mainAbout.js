const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res)=>{
  
  let aboutPage=new makePage(req,res,"about","about","pug",{});

  let pageContent=await aboutPage.makePage();

  res.end(pageContent);
};