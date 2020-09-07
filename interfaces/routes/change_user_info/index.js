let changeUserInfo = require('express').Router();
let isAuthorized=require("../../middlewares/isAuthorized.js");
let changeUserInfoHandler=require("../../controllers/change_user_info/changeUserInfoPost.js");
changeUserInfo.post("/change_user_info?:formData",isAuthorized,changeUserInfoHandler);
module.exports=changeUserInfo;