"use strict";
let makeContext=require("../../makeContextFromQueries");
let fs=require("fs");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let categories;
let handleFilterForm=require("./formGet");
const takeCategories= async()=>{
  return client
  .query(`select service_category_id, service_category_name_en, service_category_name_ru from services_categories;`)
  .then(result => {
    categories=result.rows;
    for(let i=0;i<categories.length;i++){
      categories[i].service_category_name_en=categories[i].service_category_name_en.toLowerCase().replace(/ /g,"_");
    }
  })
  .catch(e => console.log("Sure?",e));
}

function roundValues(rows, callback){
    for(let i=0;i<rows.length;i++){
      for(j in rows[i]){
        let tempValue;
        console.log("j",j,"value",rows[i][j])
        tempValue=Number.parseFloat(rows[i][j]);
        if(j.indexOf("max")!==-1){
          tempValue=Math.ceil(tempValue);
        }else{
          tempValue=Math.floor(tempValue);
        }
        rows[i][j]=tempValue+"";
      }
    }
    callback(rows);
}

function makecataloQueriesMas(){
    return[/*{"queryValue":`select distinct product_characteristic_value_en,product_characteristic_name_en FROM products_characteristics_values inner join products_characteristics on products_characteristics.product_characteristic_id=products_characteristics_values.product_characteristic_id where product_category_id=${category} and product_characteristic_type='checkbox' order by product_characteristic_name_en;`,
    "contextVarName":"categoryFilters"},
    {"queryValue":`select * from "get_min_max_range"(${category});`,
    "contextVarName":"minMaxRanges"},*/
    {"queryValue":`select service_id, service_current_price, service_previous_price, service_description_en, service_description_ru, service_category_id, service_name_en, service_name_ru from services;`,
    "contextVarName":"servicesInfo"},/*
    {"queryValue":`select product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price, product_home_gallery_header_en from products, products_home_gallery where products.product_id=products_home_gallery.product_id;`,
    "contextVarName":"topProducts"},*/
    {"queryValue":`select service_category_id, service_category_name_en, service_category_name_ru from services_categories;`,
      "contextVarName":"typeCategoryInfo"}
  ];
}


(async ()=>{
  await takeCategories();
  
})();
module.exports=(req,res)=>{
  console.log("!!!!url",req.url);
  console.log("!!!!params",req.params);
  if(req.url.match(/\?/)){
    handleFilterForm(req,res);
    return;
  }
  let catalogTemplate=fs.readFileSync("./templates/catalog_services/catalog_services.pug");
  let catalogPage=pug.compile(catalogTemplate,{"basedir":"./"});
  makeContext(makecataloQueriesMas(),client,resultContext=>{
    console.log(resultContext);
    resultContext.i18n=res.locals;
    res.end(catalogPage(resultContext));
  });
}