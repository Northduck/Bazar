let catalog = require('express').Router();
catalog.get("/catalog_goods/:categoryId",require("../../controllers/catalog_goods/mainCatalog"));

module.exports=catalog;