let compare = require('express').Router();
let readyContentCompare=require("../../controllers/compare_goods/main_compare.js");
let emptyContentCompare=require("../../controllers/compare_goods/empty_content_compare.js");
compare.get("/compare_goods",emptyContentCompare,readyContentCompare);

module.exports=compare;