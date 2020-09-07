let roomsCategories = require('express').Router();
let roomsCategoriesHandler=require("../../controllers/rooms_categories/mainRoomsCategories.js");
let checkRoomsType=require("../../controllers/rooms_categories/checkRoomsType.js");
roomsCategories.get("/rooms_categories/:typeName",checkRoomsType,roomsCategoriesHandler);

module.exports=roomsCategories;