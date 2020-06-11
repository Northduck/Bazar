const routes = require('express').Router();

routes.all(/\/register*/,require("./register"));

routes.all(/\/about*/,require("./about"));

routes.all(/\/catalog_goods\/*/,require("./catalog_goods"));

routes.all(/\/catalog_services\/*/,require("./catalog_services"));

routes.all(/\/goods\/*/,require("./goods"));

routes.all(/\/services\/*/,require("./services"));

routes.all(/\/cart*/,require("./cart"));

routes.all(/\/favorites*/,require("./favorites"));

routes.all(/\/login*/,require("./login"));

routes.all(/\/account*/,require("./account"));

routes.all(/\/checkout_goods*/,require("./checkout_goods"));

routes.all(/\/compare_goods*/,require("./compare_goods"));

routes.all(/\/add_product_to_compare*/,require("./add_product_to_compare"));

routes.all(/\/checkout_services*/,require("./checkout_services"));

routes.all(/\/logout*/,require("./logout"));

routes.all(/\/language*/,require("./language"));

routes.all(/\/shop_by_room*/,require("./shop_by_room"));

routes.all(/\/rooms_categories*/,require("./rooms_categories"));

routes.all(/\/add_product*/,require("./add_product"));

routes.all(/\/blog*/,require("./blog"));

routes.use("/",require("./home"));

module.exports=routes;