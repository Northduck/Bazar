let fs=require("fs");
let makeContext=require("../../makeContextFromQueries");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let conf=require("./../../config/index_config");
let knex=require("knex")({
    client: 'pg',
    connection: conf.get("postgresBd"),
    searchPath: ["Bazar"]
  });
let aboutPage;
let pugContext={};
module.exports=(req,res)=>{
  fs.readFile("./templates/about/about.pug",(error,data)=>{
    if(error){
      console.log(error);
      throw(error);
    }
    aboutPage=pug.compile(data,{"basedir":"./"});
    pugContext.session=req.session;
    pugContext.i18n=res.locals;
    res.end(aboutPage(pugContext));
  });
}