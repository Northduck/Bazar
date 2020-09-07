"use strict";
let container=require("../../infrastructure/infrastructureContainer.js");
let {queryBuilder}=container.cradle;
module.exports=function makeCompareQueriesMas(compareArray){
    let productsCharacteristicsQuery=queryBuilder.select("*")
    .from("products_characteristics_values")
    .where((builder)=>{
        for(let i=0;i<compareArray.length;i++){
            builder.orWhere("product_category_id",compareArray[i]["compareCategoryId"]);
        }
    }).andWhere((builder)=>{
            for(let i=0;i<compareArray.length;i++){
                if(compareArray[i]["compareProducts"]!==undefined&&compareArray[i]["compareProducts"].length>0){
                    for(let j=0;j<compareArray[i]["compareProducts"].length;j++){
                        builder.orWhere("product_id",compareArray[i]["compareProducts"][j]);
                    }
                }
            }
    })
    .innerJoin("products_characteristics","products_characteristics.product_characteristic_id","products_characteristics_values.product_characteristic_id ")
    .orderBy([{column: 'product_category_id', order: 'asc' },
    {column:"products_characteristics.product_characteristic_id",order:"asc"},
    {column: 'product_id', order: 'asc'}]).toString();
    

    let productsInfoQuery=queryBuilder.select("*").from("products").where((builder)=>{
        for(let i=0;i<compareArray.length;i++){
            if(compareArray[i]["compareProducts"]!==undefined&&compareArray[i]["compareProducts"].length>0){
                for(let j=0;j<compareArray[i]["compareProducts"].length;j++){
                    builder.orWhere("product_id",compareArray[i]["compareProducts"][j]);
                }
            }
        }
    }).orderBy([{column: 'product_category_id', order: 'asc' },{column:"product_id",order:"asc"}]).toString();


    let categoriesInfoQuery=queryBuilder.select("*").from("products_categories")
    .innerJoin("products_services_types", "products_services_types.type_id","products_categories.type_id")
    .where((builder)=>{
        for(let i=0;i<compareArray.length;i++){
            builder.orWhere("product_category_id",compareArray[i]["compareCategoryId"]);
        }
    }).orderBy("product_category_id").toString();
    let returnArray=[{"queryValue":productsCharacteristicsQuery,
    "contextVarName":"productsCharacteristics"},
    {"queryValue":productsInfoQuery,
    "contextVarName":"productsInfo"},
    {"queryValue":categoriesInfoQuery,
    "contextVarName":"categoriesInfo"}
    ];
    return returnArray;
}