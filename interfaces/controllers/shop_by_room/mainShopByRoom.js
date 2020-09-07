const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res)=>{
  
  let shopByRoomPage=new makePage(req,res,"shop_by_room","shop_by_room","pug",{},true);

  let pageContent=await shopByRoomPage.makePage();

  res.end(pageContent);
};