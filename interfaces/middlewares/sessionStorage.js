const session = require('express-session');
const {Pool}=require("pg");
const pgSession = require('connect-pg-simple')(session);
const container=require("../../infrastructure/infrastructureContainer.js");
const {config}=container.cradle;
let pgPool;
if(process.env.NODE_ENV==="production"){
    pgPool=new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}else{
    pgPool=new Pool({
        "host":process.env.HOST,
        "database":process.env.DATABASE,
        "user":process.env.USER,
        "schema":process.env.SCHEMA,
        "password":process.env.PASSWORD
    });
}
module.exports=session({
    secret:process.env.SECRET,
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