const routes = require('express').Router();
/*
//routes.all(/\/add_product~/,require("./add_product"));
*/

routes.all("/",require("./home"));

routes.all(/\/account*/,require("./account"));

routes.all(/\/register*/,require("./register"));

routes.all(/\/login*/,require("./login"));

routes.all(/\/change_user_info*/,require("./change_user_info"));

routes.all(/\/logout*/,require("./logout"));

routes.all(/\/about*/,require("./about"));

routes.all(/\/blog*/,require("./blog"));

routes.all(/\/goods\/*/,require("./goods"));

routes.all(/\/services\/*/,require("./services"));

routes.all(/\/language*/,require("./language"));

routes.all(/\/currency*/,require("./currency"));

routes.all(/\/catalog_goods\/*/,require("./catalog_goods"));

routes.all(/\/catalog_services\/*/,require("./catalog_services"));

routes.all(/\/shop_by_room*/,require("./shop_by_room"));

routes.all(/\/cart*/,require("./cart"));

routes.all(/\/favorites*/,require("./favorites"));

routes.all(/\/rooms_categories*/,require("./rooms_categories"));

routes.all(/\/toggle_product_to_compare*/,require("./toggle_product_to_compare"));

routes.all(/\/compare_goods*/,require("./compare_goods"));

routes.all(/\/checkout_goods*/,require("./checkout_goods"));

routes.all(/\/checkout_services*/,require("./checkout_services"));

routes.all("*",require("./not_found"));

module.exports=routes;