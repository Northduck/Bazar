let catalog = require('express').Router();
const catalogMain=require("../../controllers/catalog_goods/mainCatalog.js");
const catalogFormGet=require("../../controllers/catalog_goods/formGet.js");
const catalogCheckProductCategory=require("../../controllers/catalog_goods/checkProductCategory.js");
catalog.get("/catalog_goods/:categoryName",catalogCheckProductCategory,catalogMain,catalogFormGet);

module.exports=catalog;