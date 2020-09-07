"use strict";

const container=require("../../../infrastructure/infrastructureContainer.js");
const client=container.cradle.database;
module.exports=async()=>{
    let types;
    try {
        types=(await client.query(`select type_id, type_name_en, type_name_ru from products_services_types;`)).rows;
    } catch (error) {
        console.log("Sure?",error);
    }
    for(let i=0;i<types.length;i++){
        types[i].type_name_en=types[i].type_name_en.toLowerCase().replace(/ /g,"_");
    }
    return types;
}