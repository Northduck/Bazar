const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res)=>{
  
  let blogPage=new makePage(req,res,"blog","blog","pug",{},true);

  let pageContent=await blogPage.makePage();

  res.end(pageContent);
};