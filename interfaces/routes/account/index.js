let account = require('express').Router();
let isAuthorized=require("../../middlewares/isAuthorized.js");
let accountHandler=require("../../controllers/account/mainAccount.js");

account.get("/account",isAuthorized,accountHandler);

module.exports=account;