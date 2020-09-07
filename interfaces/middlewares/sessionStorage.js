const session = require('express-session');
const {Pool}=require("pg");
const pgSession = require('connect-pg-simple')(session);
const container=require("../../infrastructure/infrastructureContainer.js");
const {config}=container.cradle;
const pgPool = new Pool(config.get("postgresBd"));

module.exports=session({
    secret:config.get("session:secret"),
    store: new pgSession({
        pool : pgPool,
        tableName:"user_session",
        schemaName:"Bazar",
    }),
    resave:config.get("session:resave"),
    saveUninitialized:config.get("session:saveUninitialized"),
    key:config.get("session:key"),
    cookie:config.get("session:cookie")
})