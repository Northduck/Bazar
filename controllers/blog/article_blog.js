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
function makeBlogArticleQueries(articleName) {
    return [
        {"queryValue":"select product_category_id, products_categories.type_id, product_category_name_en, product_category_name_ru, type_name_en, type_name_ru from products_categories inner join products_services_types on products_services_types.type_id=products_categories.type_id order by type_name_en;",
        "contextVarName":"navCatalogCategories"},
        {"queryValue":`select * from blog_articles where article_template=${articleName}`,
        "contextVarName":"articleInfo"}
    ];
}
module.exports=async (req,res)=>{
    let articleName=req.params["articleName"];
    let articleQuery=`select * from blog_articles where article_template=${articleName}`;
    let articleResult=(await client.query(articleQuery)).rows;
    if(articleResult===undefined||articleResult.length===0){
        res.redirect("/blog");
        return;
    }
    fs.readFile(`./templates/articles/${articleName}.pug`,(error,data)=>{
        if(error){
            console.log(error);
            throw(error);
        }
        blogList=pug.compile(data,{"basedir":"./"});
        makeContext(makeBlogArticleQueries(articleName), client, (resultContext)=>{
            resultContext.session=req.session;
            resultContext.i18n=res.locals;
            res.end(blogList(resultContext));
        });
    });
}