let language = require('express').Router();
language.get("/language",require("../../controllers/language/language_main"));
module.exports=language;