"use strict";
let makeContext=require("../../makeContextFromQueries");
let fs=require("fs");
let pug=require("pug");
let conf=require("../../config/index_config");
let knex=require("knex")({
  client: 'pg',
  connection: conf.get("postgresBd"),
  searchPath: ["Bazar"],
});
let db=require("../../connect");
let client=db.getClient();
function makeCompareQueriesMas(compareArray){
    if(compareArray===undefined||!Array.isArray(compareArray)||compareArray.length===0){
        return [];
    }
    for(let i=0;i<compareArray.length;i++){
        if(compareArray[i]["compareProducts"]===undefined||compareArray[i]["compareProducts"].length===0){
            return [];
        }
    }
    let productsCharacteristicsQuery=knex.select("*").from("products_characteristics_values").where((builder)=>{
        builder.where("product_category_id",compareArray[0]["compareCategoryId"]);
        for(let i=1;i<compareArray.length;i++){
            builder.orWhere("product_category_id",compareArray[i]["compareCategoryId"]);
        }
    }).andWhere((builder)=>{
        if(compareArray[0]["compareProducts"]!==undefined&&compareArray[0]["compareProducts"].length>0){
            builder.where("product_id",compareArray[0]["compareProducts"][0]);
            let k=1;
            for(let i=0;i<compareArray.length;i++){
                for(let j=k;j<compareArray[0]["compareProducts"].length;j++){
                    builder.orWhere("product_id",compareArray[i]["compareProducts"][j]);
                }
                k=0;
            }
        }
    })
    .innerJoin("products_characteristics","products_characteristics.product_characteristic_id","products_characteristics_values.product_characteristic_id ")
    .orderBy([{column: 'product_category_id', order: 'asc' },
    {column:"products_characteristics.product_characteristic_id",order:"asc"},
    {column: 'product_id', order: 'asc'}]).toString();
    
    let productsInfoQuery=knex.select("*").from("products").where((builder)=>{
        if(compareArray[0]["compareProducts"]!==undefined&&compareArray[0]["compareProducts"].length>0){
            builder.where("product_id",compareArray[0]["compareProducts"][0]);
            let k=1;
            for(let i=0;i<compareArray.length;i++){
                for(let j=k;j<compareArray[0]["compareProducts"].length;j++){
                    builder.orWhere("product_id",compareArray[i]["compareProducts"][j]);
                }
                k=0;
            }
        }
    }).orderBy([{column: 'product_category_id', order: 'asc' },{column:"product_id",order:"asc"}]).toString();
    let categoriesInfoQuery=knex.select("*").from("products_categories")
    .innerJoin("products_services_types", "products_services_types.type_id","products_categories.type_id")
    .where((builder)=>{
        builder.where("product_category_id",compareArray[0]["compareCategoryId"]);
        for(let i=1;i<compareArray.length;i++){
            builder.orWhere("product_category_id",compareArray[i]["compareCategoryId"]);
        }
    }).orderBy("product_category_id").toString();
    return[{"queryValue":productsCharacteristicsQuery,
    "contextVarName":"productsCharacteristics"},
    {"queryValue":productsInfoQuery,
    "contextVarName":"productsInfo"},
    {"queryValue":categoriesInfoQuery,
    "contextVarName":"categoriesInfo"}
    ];
}

module.exports=(req,res)=>{
    let catalogTemplate=fs.readFileSync("./templates/compare_goods/compare_goods.pug");
    let catalogPage=pug.compile(catalogTemplate,{"basedir":"./"});
    makeContext(makeCompareQueriesMas([
        {
            "compareCategoryId":32,
            "compareProducts":[1,2]
        },
        {
            "compareCategoryId":10,
            "compareProducts":[24,27,30]
        }
    ]),client,resultContext=>{
        resultContext.i18n=res.locals;
        resultContext.session=req.session;
        res.end(catalogPage(resultContext));
    });
}