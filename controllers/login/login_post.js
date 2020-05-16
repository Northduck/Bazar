let fs=require("fs");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let argon2 = require('argon2');

module.exports=(req,res)=>{
    let response={};
    console.log(req.query);

    (async()=>{
        let hash=await argon2.hash(req.query["userPassword"]);
        console.log(JSON.stringify(req.query));
        console.log("Hash",hash);
        client
        .query(`select user_id, user_login, user_hash from users where (user_login='${req.query["userLogin"]}' or user_email='${req.query["userLogin"]}');`)
        .then( async (result)=>{
            if(result.rowCount>0 && await argon2.verify(result.rows[0].user_hash,req.query["userPassword"])){
                response.code=1;
                response.result=result.rows[0];
                delete result.rows[0].user_hash;
                req.session["userInfo"]=result.rows[0];
            }else{
                response.code=-1;
                response.result=undefined;
            }
            console.log(JSON.stringify(response));
            res.end(JSON.stringify(response));
        })
        .catch(error=>{
            console.log(error);
            response.code=-2;
            res.end(JSON.stringify(response));
        });
    })()

}