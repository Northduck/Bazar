"use strict";
module.exports=(userInfo)=>{
    let response={};
    response.code=1;
    response.problems=[];
    let loginRegExp=[/[\W]+/];
    let emailRegExp=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passwordRegExp=/[^]+/;
    if(!userInfo["password"].match(passwordRegExp)){
        response.code=-3;
        response.problems.push("password");
    }
    if(userInfo["loginemail"].match(loginRegExp)&&!userInfo["loginemail"].match(emailRegExp)){
        response.code=-3;
        response.problems.push("loginemail");
    }
    return response;
}
