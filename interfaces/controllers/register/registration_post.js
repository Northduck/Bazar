"use strict";

let createUser=require("../../../application/userUseCases/createUser.js");
let UserRepository=require("../../dataAccess/userDataAccess/userRepository.js");
let prepareUserInfo=require("../../utilities/prepareUserInfo.js");
module.exports=async (req,res,next)=>{
    let userInfo=req.query;
    let userRepository= new UserRepository()
    let userCreationResponse=await createUser(prepareUserInfo(userInfo),userRepository);
    if(userCreationResponse.code===-4){
        /*let serverError=new Error("Something went wrong with registration")
        serverError.code=500;*/
        res.redirect("/not_found");
    }
    res.end(JSON.stringify(userCreationResponse));
}