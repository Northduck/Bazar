let catalog = require('express').Router();
const catalogMain=require("../../controllers/catalog_services/mainCatalog.js");
const catalogFormGet=require("../../controllers/catalog_services/formGet.js");
catalog.get("/catalog_services/",catalogMain,catalogFormGet);

module.exports=catalog;