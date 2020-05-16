let goods = require('express').Router();
let goodPage=require("../../controllers/goods/goodsPage.js");
goods.post("/goods/newfeedback/:categoryId([^]*)\?",require("../../controllers/goods/newFeedback"));

goods.get("/goods/:goodId([^]*)",goodPage);

module.exports=goods;