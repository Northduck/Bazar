'use strict';
let User=require("../../domain/User.js");
let userInfoValidator=require("./validateAuthorizationUserInfo.js");
let prepareAuthorizationData=require("./prepareAuthorizationData.js");
module.exports=async function(userInfo,userRepository){
    let validationResponce=userInfoValidator(userInfo);
    if(validationResponce.code===-3){
        return validationResponce;
    }
    let newUser=new User(prepareAuthorizationData(userInfo));
    let userAuthentication;
    try {
        userAuthentication=await userRepository.authenticateUser(newUser);
    } catch (error) {
        validationResponce.code=-4;
        return validationResponce;
    }
    return userAuthentication;
}