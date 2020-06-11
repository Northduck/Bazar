let catalog = require('express').Router();
catalog.get("/catalog_services",require("../../controllers/catalog_services/mainCatalog"));

module.exports=catalog;