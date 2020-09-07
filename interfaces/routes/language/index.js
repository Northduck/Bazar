let language = require('express').Router();
let languageChanger=require("../../controllers/language/language_main.js");
let newLanguageValidator=require("../../controllers/language/newLanguageValidator.js");
language.get(/\/language*/,newLanguageValidator,languageChanger);
module.exports=language;