let login = require('express').Router();
login.post("/login?:formData",require("../../controllers/login/login_post"));
login.get("/login",require("../../controllers/login/login_main"));
module.exports=login;