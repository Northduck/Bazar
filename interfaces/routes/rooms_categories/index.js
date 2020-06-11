let roomsCategories = require('express').Router();
let roomsCategoriesHandler=require("../../controllers/rooms_categories/mainRoomsCategories.js");

roomsCategories.get("/rooms_categories/:typeName",roomsCategoriesHandler);

module.exports=roomsCategories;