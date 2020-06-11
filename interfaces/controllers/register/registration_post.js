"use strict";

let db=require("../../connect");
let client=db.getClient();
let argon2 = require('argon2');

module.exports=(req,res)=>{
    let response={};
    response.problems=[];
    console.log(req.query);
    let loginRegExp=/[a-zA-Z0-9_-]+/;
    let emailRegExp=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let passwordRegExp=/[^]{7,}/;
    if(!req.query["User-email"].match(emailRegExp)){
        response.code=-3;
        response.problems.push("email");
    }
    if(!req.query["User-login"].match(loginRegExp)){
        response.code=-3;
        response.problems.push("login");
    }
    if(!(req.query["User-password"].match(passwordRegExp))){
        response.code=-3;
        response.problems.push("password");
    }
    if(response.code===-3){
        res.end(JSON.stringify(response));
        return;
    }
    (async()=>{
        let hash=await argon2.hash(req.query["User-password"]);
        console.log(JSON.stringify(req.query));
        console.log("Hash",hash);
        req.query["User-password"]=hash;
        client
        .query(`select "registerNewUser"('${JSON.stringify(req.query)}'::json)`)
        .then(result=>{
            response.code=result.rows[0]["registerNewUser"];
            console.log(JSON.stringify(response));
            res.end(JSON.stringify(response));
        })
        .catch(error=>{
            console.log(error);
            response.code=-4;
            res.end(JSON.stringify(response));
        });
    })()
}