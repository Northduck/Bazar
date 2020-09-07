"use strict";
let UserRepository=require("../../dataAccess/userDataAccess/userRepository.js");
let changeUserInfo=require("../../../application/userUseCases/changeUserInfo.js");
let prepareUserInfo=require("../../utilities/prepareUserInfo.js");
module.exports=async(req,res,next)=>{
    let preparedUserInfo=prepareUserInfo(req.query);
    preparedUserInfo["id"]=req.session["userInfo"]["user_id"];
    let userRepository=new UserRepository();
    let changedUserInfoResponse=await changeUserInfo(preparedUserInfo,userRepository);
    res.end(JSON.stringify(changedUserInfoResponse));
}