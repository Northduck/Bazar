let shopByRoom = require('express').Router();
let shopByRoomHandler=require("../../controllers/shop_by_room/mainShopByRoom.js");

shopByRoom.get("/shop_by_room",shopByRoomHandler);

module.exports=shopByRoom;