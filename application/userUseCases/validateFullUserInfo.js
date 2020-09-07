"use strict";
module.exports=(userInfo)=>{
    let response={};
    response.code=1;
    response.problems=[];
    let loginRegExp=[/[\W]+/];
    let emailRegExp=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passwordRegExp=[/[^]{7,}/,/[0-9]{1,}/,/[A-ZА-Я]{1,}/];
    let phoneNumberRegExp=/\+[\d]{11,16}/;
    let dateRegExp=/[\d]{4,4}-[\d]{2,2}-[\d]{2,2}/;
    let nameRegExp=/[^a-zA-zа-яА-Я ,.'-]+$/i;
    let addressRegExp=/[^a-zA-Z,. -_\dа-яА-Я]/;
    if(!userInfo["email"].match(emailRegExp)){
        response.code=-3;
        response.problems.push("email");
    }
    if(userInfo["login"].match(loginRegExp)){
        response.code=-3;
        response.problems.push("login");
    }
    if(!passwordRegExp.every((regExpElement)=>{
        return userInfo["password"].match(regExpElement);
    })){
        response.code=-3;
        response.problems.push("password");
    }
    if(userInfo["phonenumber"]!=null&&!userInfo["phonenumber"].match(phoneNumberRegExp)){
        response.code=-3;
        response.problems.push("phonenumber");
    }
    if(userInfo["birthdate"]!=null&&!(userInfo["birthdate"].match(dateRegExp))){
        response.code=-3;
        response.problems.push("birthdate");
    }
    if(userInfo["fullname"]!=null&&(userInfo["fullname"].match(nameRegExp))){
        response.code=-3;
        response.problems.push("fullname");
    }
    if(userInfo["address"]!=null&&(userInfo["address"].match(addressRegExp))){
        response.code=-3;
        response.problems.push("address");
    }
    return response;
}