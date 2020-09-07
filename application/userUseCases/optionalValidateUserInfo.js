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
    if(userInfo["email"]!==undefined&&!userInfo["email"].match(emailRegExp)){
        response.code=-1;
        response.problems.push("email");
    }
    if(userInfo["login"]!==undefined&&userInfo["login"].match(loginRegExp)){
        response.code=-1;
        response.problems.push("login");
    }
    if(userInfo["password"]!==undefined&&!passwordRegExp.every((regExpElement)=>{
        return userInfo["password"].match(regExpElement);
    })){
        response.code=-1;
        response.problems.push("password");
    }
    if(userInfo["phonenumber"]!=undefined&&!userInfo["phonenumber"].match(phoneNumberRegExp)){
        response.code=-1;
        response.problems.push("phonenumber");
    }
    if(userInfo["birthdate"]!=undefined&&!(userInfo["birthdate"].match(dateRegExp))){
        response.code=-1;
        response.problems.push("birthdate");
    }
    if(userInfo["fullname"]!=undefined&&(userInfo["fullname"].match(nameRegExp))){
        response.code=-1;
        response.problems.push("fullname");
    }
    if(userInfo["address"]!=undefined&&(userInfo["address"].match(addressRegExp))){
        response.code=-1;
        response.problems.push("address");
    }
    return response;
}