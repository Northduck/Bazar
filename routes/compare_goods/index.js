let compare = require('express').Router();
compare.get("/compare_goods",require("../../controllers/compare_goods/main_compare.js"));

module.exports=compare;