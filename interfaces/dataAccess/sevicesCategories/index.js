"use strict";

const container=require("../../../infrastructure/infrastructureContainer.js");
const client=container.cradle.database;
module.exports=async()=>{
    let servicesCategories;
    try {
        servicesCategories=(await client.query(`select service_category_id, service_category_name_en, service_category_name_ru from services_categories;`)).rows;
    } catch (error) {
        console.log("Sure?",error);
    }
    for(let i=0;i<servicesCategories.length;i++){
        servicesCategories[i].service_category_name_en=servicesCategories[i].service_category_name_en.toLowerCase().replace(/ /g,"_");
    }
    return servicesCategories;
}