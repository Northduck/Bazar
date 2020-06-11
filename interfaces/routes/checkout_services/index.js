let checkout = require('express').Router();
checkout.post("/checkout_services?:formData",require("../../controllers/checkout_services/checkout_post"));
checkout.get("/checkout_services",require("../../controllers/checkout_services/checkout_main"));
module.exports=checkout;