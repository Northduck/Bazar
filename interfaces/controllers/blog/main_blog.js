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
let blogList;
module.exports=(req,res)=>{
  fs.readFile("./templates/blog/blog_list.pug",(error,data)=>{
    if(error){
      console.log(error);
      throw(error);
    }
    function makeAccountQueries() {
      return [
        {"queryValue":"select product_category_id, products_categories.type_id, product_category_name_en, product_category_name_ru, type_name_en, type_name_ru from products_categories inner join products_services_types on products_services_types.type_id=products_categories.type_id order by type_name_en;",
        "contextVarName":"navCatalogCategories"},
        {"queryValue":"select * from blog_articles",
        "contextVarName":"articles"}
      ];
    }
    blogList=pug.compile(data,{"basedir":"./"});
    makeContext(makeAccountQueries(), client, (resultContext)=>{
      resultContext.session=req.session;
      resultContext.i18n=res.locals;
      res.end(blogList(resultContext));
    });
  });
}