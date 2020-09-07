"use strict";
module.exports=(userInfo)=>{
    let loginRegExp=[/[\W]+/];
    let emailRegExp=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let newUserInfo={
        "password":userInfo["password"]
    };
    if(userInfo["loginemail"].match(emailRegExp)){
        newUserInfo["email"]=userInfo["loginemail"];
        return newUserInfo;
    }
    if(!userInfo["loginemail"].match(loginRegExp)){
        newUserInfo["login"]=userInfo["loginemail"];
        return newUserInfo;
    }
    return userInfo;
}