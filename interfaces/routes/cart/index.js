let cart = require('express').Router();
let cartHandler=require("../../controllers/cart/mainCart");

cart.get("/cart",cartHandler);

module.exports=cart;