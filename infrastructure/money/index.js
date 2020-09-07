const Dinero = require('dinero.js');
function convertTo(moneyObj,currency,rates) {
    if(rates==undefined){
        let variableError=new Error("rates aren't declared");
        throw variableError;
    }
    if(currency==undefined||currency===""){
        let variableError=new Error("Currency isn't declared");
        throw variableError;
    }
    if(moneyObj.getCurrency()===currency){
        return moneyObj;
    }
    if(rates["data"]["currency"]!==moneyObj.getCurrency()){
        let currencyError=new Error("Currency in rates is different from passed argument");
        throw currencyError;
    }
    let convertedMoneyAmount=moneyObj.multiply(rates["data"]["rates"][currency]).getAmount();
    let convertedMoney=Dinero({amount:convertedMoneyAmount,currency:currency});
    return convertedMoney;
}
module.exports=()=>{
    const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
    global.XMLHttpRequest=XMLHttpRequest;
    Dinero.defaultCurrency="USD";
    Dinero.globalExchangeRatesApi={
        endpoint:"https://api.coinbase.com/v2/exchange-rates",
        propertyPath: 'data.rates.{{to}}'
    }
    Dinero.convertTo=convertTo;
    return Dinero;
}