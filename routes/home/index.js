let home = require('express').Router();
let mainHandler=require("../../controllers/home/mainHandler");
home.get("/",mainHandler);
module.exports=home;