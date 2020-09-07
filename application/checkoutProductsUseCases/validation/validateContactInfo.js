"use strict";
module.exports=(contactInfo)=>{
    let response={"responseCode":1,"problems":[]};
    let emailRegExp=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let phoneNumberRegExp=/\+[\d]{11,16}/;
    let nameRegExp=/[^a-zA-zа-яА-Я ,.'-]+$/i;
    if(contactInfo["email"].match(emailRegExp)==null){
        response.responseCode=-1;
        response.problems.push({"contactInfo":"email"});
    }
    if(contactInfo["phoneNumber"].match(phoneNumberRegExp)==null){
        response.responseCode=-1;
        response.problems.push({"contactInfo":"phoneNumber"});
    }
    if(contactInfo["name"].match(nameRegExp)!=null){
        response.responseCode=-1;
        response.problems.push({"contactInfo":"name"});
    }
    return response;
}