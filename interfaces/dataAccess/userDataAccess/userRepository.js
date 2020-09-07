"use strict";
let container=require("../../../infrastructure/infrastructureContainer.js");
let {database,crypto,queryBuilder}=container.cradle;

module.exports=class UserRepository{
    async createUser(user){
        let response={};
        response.code=1;
        response.problems=[];
        const possibleProblems=["login","email"];
        let userHash=await crypto.hash(user.getPassword());
        let checkLoginQuery=database.query(`SELECT users.user_id FROM users where users.user_login='${user.getLogin()}'`);
        let checkEmailQuery=database.query(`SELECT users.user_id FROM users where users.user_email='${user.getEmail()}'`);
        let checkingQueriesResult;
        try {
            checkingQueriesResult=await Promise.all([checkLoginQuery,checkEmailQuery]);
        } catch (error) {
            console.log(error);
            response.code=-4;
            return response;
        }
        
        for(let i=0;i<2;i++){
            if(checkingQueriesResult[i].rows.length!==0){
                response.code=-1;
                response.problems.push(possibleProblems[i]);
            }
        }
        if(response.code===-1){
            return response;
        }
        let userCreatedResponse;
        try {
            userCreatedResponse=(await database.query(`INSERT INTO users(user_id,user_login,user_email,user_hash,user_full_name,user_birthdate,user_phone_number,user_address) VALUES
            (default,'${user.getLogin()}','${user.getEmail()}','${userHash}','${user.getFullName()}','${user.getBirthdate()}','${user.getPhoneNumber()}','${user.getAddress()}');`)).rows;
        } catch (error) {
            console.log(error);
            response.code=-4;
            return response;
        }
        return response;
    }
    async authenticateUser(user){
        let response={};
        response.code=-1;
        response.result=undefined;
        let userInfoWithAuthorizeDataQuery=queryBuilder.select("user_id", "user_login", "user_hash")
        .from("users")
        .where((builder)=>{
            if(user.getLogin()!=null){
                builder.orWhere("user_login",user.getLogin());
            }
            if(user.getEmail()!=null){
                builder.orWhere("user_email",user.getEmail());
            }
        })
        .toString();
        let userInfoWithAuthorizeData;
        try {
            userInfoWithAuthorizeData=(await database.query(userInfoWithAuthorizeDataQuery)).rows;
        } catch (error) {
            console.log(error);
            response.code=-4;
            return response;
        }
        
        if(userInfoWithAuthorizeData.length>0&&await crypto.verify(userInfoWithAuthorizeData[0].user_hash,user.getPassword())===true){
            delete userInfoWithAuthorizeData[0].user_hash;
            response.code=1;
            response.result=userInfoWithAuthorizeData[0];
        }
        return response;
    }
    async changeInfo(user){
        let id=user.getId();
        let login=user.getLogin();
        let email=user.getEmail();
        let password=user.getPassword();
        let birthDate=user.getBirthdate();
        let fullname=user.getFullName();
        let phoneNumber=user.getPhoneNumber();
        let address=user.getAddress();
        let updateUserInfoQuery=queryBuilder("users").update({
            "user_login":login,
            "user_email":email,
            "user_hash":password,
            "user_full_name":fullname,
            "user_birthdate":birthDate,
            "user_phone_number":phoneNumber,
            "user_address":address
        })
        .where("user_id",id)
        .toString();
        let updateUserInfoResult;
        try {
            updateUserInfoResult=(await database.query(updateUserInfoQuery)).rows;
        } catch (error) {
            console.log(error);
        }
        return updateUserInfoResult;
    }
};
