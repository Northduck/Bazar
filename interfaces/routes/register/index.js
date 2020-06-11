let register = require('express').Router();
register.post("/register?:formData",require("../../controllers/register/registration_post"));
register.get("/register",require("../../controllers/register/registration"));
module.exports=register;