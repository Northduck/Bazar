let currency = require('express').Router();
let currencyChanger=require("../../controllers/currency/currency_main.js");
let newCurrencyValidator=require("../../controllers/currency/newCurrencyValidator.js");
currency.get(/\/currency*/,newCurrencyValidator,currencyChanger);
module.exports=currency;