"use strict";
let User=require("../../domain/User.js");
let userInfoValidator=require("./optionalValidateUserInfo.js");
module.exports=async (infoForChanging,userRepository)=>{
    let validationResponce=userInfoValidator(infoForChanging);
    if(validationResponce.code===-1){
        return validationResponce;
    }
    let user=new User(infoForChanging);
    let changingUserInfoResponse;
    try {
        changingUserInfoResponse=await userRepository.changeInfo(user);
    } catch (error) {
        console.log(error);
    }
    return validationResponce;
}