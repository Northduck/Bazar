let about = require('express').Router();
let aboutHandler=require("../../controllers/about/mainAbout.js");

about.get("/about",aboutHandler);

module.exports=about;