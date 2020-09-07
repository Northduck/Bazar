"use strict";

const container=require("../../../infrastructure/infrastructureContainer.js");
const client=container.cradle.database;
module.exports=async()=>{
    let productsCategories;
    try {
        productsCategories=(await client.query(`select product_category_id, product_category_name_en, product_category_name_ru from products_categories;`)).rows;
    } catch (error) {
        console.log("Sure?",error);
    }
    for(let i=0;i<productsCategories.length;i++){
        productsCategories[i].product_category_name_en=productsCategories[i].product_category_name_en.toLowerCase().replace(/ /g,"_");
    }
    return productsCategories;
}