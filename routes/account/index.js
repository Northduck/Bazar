let account = require('express').Router();
let accountHandler=require("../../controllers/account/mainAccount.js");

account.get("/account",accountHandler);

module.exports=account;