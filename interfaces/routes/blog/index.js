let blog = require('express').Router();
let blogHandler=require("../../controllers/blog/main_blog.js");

blog.get("/blog",blogHandler);

module.exports=blog;