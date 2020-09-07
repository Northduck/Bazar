let notFound = require('express').Router();
let notFoundPage=require("../../controllers/not_found/notFoundMain.js");
notFound.all("*",notFoundPage);

module.exports=notFound;