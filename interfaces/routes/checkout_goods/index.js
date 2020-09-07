let checkout = require('express').Router();
let isAuthorized=require("../../middlewares/isAuthorized.js");
let areProductsToBuy=require("../../middlewares/areProductsToBuy.js");
let checkoutMain=require("../../controllers/checkout_goods/checkout_main");
let checkoutPost=require("../../controllers/checkout_goods/checkout_post");
let validateStages=require("../../controllers/checkout_goods/validate_stages.js");
checkout.post("/checkout_goods?:formData",isAuthorized,validateStages,areProductsToBuy,checkoutPost);
checkout.get("/checkout_goods",isAuthorized,areProductsToBuy,checkoutMain);
module.exports=checkout;