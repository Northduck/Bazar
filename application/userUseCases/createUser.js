'use strict';
let User=require("../../domain/User.js");
let userInfoValidator=require("./validateFullUserInfo.js");
module.exports=async function(userInfo,userRepository){
    let validationResponce=userInfoValidator(userInfo);
    if(validationResponce.code===-3){
        return validationResponce;
    }
    let newUser=new User(userInfo);
    let userCreationResponse
    try {
        userCreationResponse=await userRepository.createUser(newUser);
    } catch (error) {
        validationResponce.code=-4;
        return validationResponce;
    }
    return userCreationResponse;
}