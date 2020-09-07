"use strict";

let authenticateUser=require("../../../application/userUseCases/authenticateUser.js");
let UserRepository=require("../../dataAccess/userDataAccess/userRepository.js");
let prepareUserInfo=require("../../utilities/prepareUserInfo.js");
module.exports=async (req,res,next)=>{
    let userInfo=req.query;
    let userRepository= new UserRepository()
    let userAuthenticationResponse=await authenticateUser(prepareUserInfo(userInfo),userRepository);
    if(userAuthenticationResponse.code===-4){
        res.redirect("/not_found");
    }
    if(userAuthenticationResponse.code===1){
        req.session["userInfo"]=userAuthenticationResponse.result;
    }
    res.end(JSON.stringify(userAuthenticationResponse));
}