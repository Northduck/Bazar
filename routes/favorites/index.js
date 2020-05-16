let favorites = require('express').Router();
let favoritesHandler=require("../../controllers/favorites/mainFavorites");

favorites.get("/favorites",favoritesHandler);

module.exports=favorites;