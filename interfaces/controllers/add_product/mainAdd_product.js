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
let addPage;
module.exports=(req,res)=>{
  fs.readFile("./templates/add_furniture/add.pug",(error,data)=>{
    if(error){
      console.log(error);
      throw(error);
    }
    function makePageQueries() {
      return [
        {"queryValue":`select * from products_categories`,
      "contextVarName":"productsCategories"}
      ];
    }

    addPage=pug.compile(data,{"basedir":"./"});
    makeContext(makePageQueries(), client, (resultContext)=>{
      resultContext.session=req.session;
      console.log("\n\nContext",resultContext);
      resultContext.i18n=res.locals;
      res.end(addPage(resultContext));
    });
  });
}