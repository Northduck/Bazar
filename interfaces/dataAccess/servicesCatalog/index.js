/*
    TODO: Обернуть в try catch
*/
let container=require("../../../infrastructure/infrastructureContainer.js");
let {queryBuilder, database}=container.cradle;
module.exports=async (categoriesArray)=>{
    let filterQuery=queryBuilder.distinct("service_id", "service_current_price", "service_previous_price", "services.service_category_id", "service_name_en", "service_name_ru")
    .from("services")
    .innerJoin("services_categories" ,"services.service_category_id","services_categories.service_category_id")
    .whereIn("service_category_name_en",categoriesArray);
    console.log(filterQuery.toString());
    let filteredServiceCatalog=(await database.query(filterQuery.toString())).rows;
    return filteredServiceCatalog;
}
