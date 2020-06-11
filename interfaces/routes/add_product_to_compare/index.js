let addProductToCompare = require('express').Router();
let addProductToCompareHandler=require("../../controllers/add_product_to_compare/main_add_to_compare.js");

addProductToCompare.get("/add_product_to_compare",addProductToCompareHandler);


module.exports=addProductToCompare;