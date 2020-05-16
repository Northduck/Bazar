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
let types;
const takeTypes= async()=>{
  return client
  .query(`select type_id, type_name_en, type_name_ru from products_services_types;`)
  .then(result => {
    types=result.rows;
    for(let i=0;i<types.length;i++){
      types[i].type_name_en=types[i].type_name_en.toLowerCase().replace(/ /g,"_");
    }
  })
  .catch(e => console.log("Sure?",e));
}
(async ()=>{
  await takeTypes();
})();
function makeAccountQueries(typeID) {
  return [
    {"queryValue":`select product_category_id, product_category_name_en, product_category_name_ru from products_categories where type_id=${typeID};`,
    "contextVarName":"roomCategories"},
    {"queryValue":"select product_category_id, products_categories.type_id, product_category_name_en, product_category_name_ru, type_name_en, type_name_ru from products_categories inner join products_services_types on products_services_types.type_id=products_categories.type_id order by type_name_en;",
    "contextVarName":"navCatalogCategories"},
    {"queryValue":`select * from products_services_types where type_id=${typeID}`,
      "contextVarName":"typeinfo"}
  ];
}
let shopByRoom;
module.exports=(req,res)=>{
  fs.readFile("./templates/rooms_categories/rooms_categories.pug",(error,data)=>{
    if(error){
      console.log(error);
      throw(error);
    }
    let urlType=req.params.typeName;
    console.log(urlType);
    let i=types.findIndex((el,ind)=>{
      return urlType===el.type_name_en;
    });

    shopByRoom=pug.compile(data,{"basedir":"./"});
    makeContext(makeAccountQueries(types[i]["type_id"]), client, (resultContext)=>{
      resultContext.session=req.session;
      resultContext.i18n=res.locals;
      res.end(shopByRoom(resultContext));
    });
  });
}