"use strict";

let express=require("express");
let http=require("http");
let path=require("path");
let fs=require("fs");
let conf=require("./config/index_config.js");
let db=require("./connect");
let bodyParser = require("body-parser");
let cookieParser = require('cookie-parser');
let session = require('express-session');
let {Pool}=require("pg");
let routes=require("./routes");
let i18n=require("i18n");
//let renameImages=require("./test.js");
let pgSession = require('connect-pg-simple')(session);
function setLanguage(req,res,next){
  if(req.cookies["language"]===undefined || typeof req.cookies["language"]!=="string"){
    req.session["language"]="english";
    res.cookie("language","en");
  }
  next();
}
let client;
let app=express();
app.use(express.static(__dirname + '/public/'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
const pgPool = new Pool(conf.get("postgresBd"));
app.use(session({
  secret:conf.get("session:secret"),
  store: new pgSession({
    pool : pgPool,
    tableName:"user_session",
    schemaName:"Bazar",
  }),
  resave:conf.get("session:resave"),
  saveUninitialized:conf.get("session:saveUninitialized"),
  key:conf.get("session:key"),
  cookie:conf.get("session:cookie")
}));
i18n.configure({
  locales: conf.get("supported_languages"),
  cookie: 'language',
  directory: __dirname + '/locales'
});
app.use("/",setLanguage);
app.use(i18n.init);
app.use(function(req, res, next) {
  res.locals.__ = res.__ = function() {
      return i18n.__.apply(req, arguments);
  };
  next();
});
(async ()=>{
  let categories;
  console.log("before connect");
  await db.initDb((err, dbClient) => {
    if (err) {
      console.log(err);
    }
    console.log("DB");
    client = dbClient;
  });
  console.log("routes");
  app.use("/",routes);
  app.set("port", conf.get("port"));
  app.listen(app.get("port"), () => {
    console.log(`Listening ${conf.get("port")}`);
  });
})();
