let logout = require('express').Router();
logout.get("/logout",require("../../controllers/logout/logout_main"));
module.exports=logout;