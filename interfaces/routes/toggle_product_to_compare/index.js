let toggleProductToCompare = require('express').Router();
let toggleProductToCompareHandler=require("../../controllers/toggle_product_to_compare/main_toggle_to_compare.js");

toggleProductToCompare.get(/toggle_product_to_compare*/,toggleProductToCompareHandler);


module.exports=toggleProductToCompare;