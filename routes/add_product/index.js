let addProduct = require('express').Router();
let addProductHandler=require("../../controllers/add_product/mainAdd_product.js");
let addProductHandlerPost=require("../../controllers/add_product/add_product_post.js");

addProduct.get("/add_product",addProductHandler);

addProduct.post("/add_product",addProductHandlerPost);

module.exports=addProduct;