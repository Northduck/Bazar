let checkout = require('express').Router();
checkout.post("/checkout_goods?:formData",require("../../controllers/checkout_goods/checkout_post"));
checkout.get("/checkout_goods",require("../../controllers/checkout_goods/checkout_main"));
module.exports=checkout;