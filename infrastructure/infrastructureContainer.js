"set strict";
const awilix=require("awilix");
const { asFunction } = require("awilix");
const {initDb}=require("./database/index.js");
const {getDb}=require("./database/index.js");
const config=require("./config/index.js");
const i18n=require("./i18n/index.js");
const money=require("./money/index.js");
const queryBuilder=require("./queryBuilder/index.js");
const app=require("./app/index.js");
const view=require("./view/index.js");
const serverListener=require("./serverListening/index.js");
const crypto=require("./crypto/index.js");
const rates=require("./rates/index.js");
const fetch=require("./fetch/index.js");
const container=awilix.createContainer();

container.register({
    config: asFunction(config).singleton(),
    app: asFunction(app).singleton(),
    crypto:asFunction(crypto).singleton(),
    fetch:asFunction(fetch).singleton(),
    money:asFunction(money).singleton(),
    rates:asFunction(rates).singleton(),
    serverListener: asFunction(serverListener).singleton(),
    databaseInit: asFunction(initDb).singleton(),
    database: asFunction(getDb).singleton(),
    view:asFunction(view).singleton(),
    i18n: asFunction(i18n).singleton(),
    queryBuilder: asFunction(queryBuilder).singleton()
});
module.exports=container;