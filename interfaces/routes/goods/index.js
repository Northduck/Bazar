let goods = require('express').Router();
let goodPage=require("../../controllers/goods/goodsPage.js");
let isAuthorized=require("../../middlewares/isAuthorized.js");
let newfeedbackHandler=require("../../controllers/goods/newFeedback");
let checkGoodID=require("../../controllers/goods/checkGoodID.js");
goods.post("/goods/newfeedback/:goodId\?",isAuthorized,newfeedbackHandler);

goods.get("/goods/:goodId",checkGoodID,goodPage);

module.exports=goods;