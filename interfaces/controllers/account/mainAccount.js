"use strict";
const makePage=require("../../utilities/makePage.js");
module.exports=async(req,res)=>{
  let userID=req.session["userInfo"]["user_id"];
  let accountPage=new makePage(req,res,"account","account","pug",{},true,userID);

  let pageContent=await accountPage.makePage();

  res.end(pageContent);
}