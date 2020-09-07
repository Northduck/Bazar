/*
    TODO: Обернуть в try catch
*/
let container=require("../../../infrastructure/infrastructureContainer.js");
let {queryBuilder, database}=container.cradle;
module.exports=async (categoryIndex,priceRange,checkboxFilters,rangeFilters,lengthCorrection)=>{
    let filterQuery=queryBuilder.distinct("products.product_category_id", "products.product_id", "product_name_en", "product_name_ru", "product_rating", "product_receipt_date", "product_current_price", "product_previous_price","product_description_en", "product_description_ru")
    .from("products_characteristics_values")
    .innerJoin("products_characteristics","products_characteristics.product_characteristic_id","products_characteristics_values.product_characteristic_id")
    .innerJoin("products" ,"products.product_id","products_characteristics_values.product_id")
    .where("products_characteristics.product_category_id", categoryIndex)
    .andWhereBetween("products.product_current_price",priceRange)
    .andWhere((filtersBuilder)=>{
        for(let i=0;i<checkboxFilters.length;i++){
            filtersBuilder=filtersBuilder.orWhere((checkboxBuilder)=>{
                checkboxBuilder.where("product_characteristic_name_en",checkboxFilters[i].checkboxName).andWhere("product_characteristic_value_en",checkboxFilters[i].checkboxValue);
            });
        }
        for(let i=0;i<rangeFilters.length;i++){
            filtersBuilder=filtersBuilder.orWhere((rangeBuilder)=>{
                rangeBuilder.where("product_characteristic_name_en",rangeFilters[i].rangeName).andWhereBetween("product_characteristic_value_en",rangeFilters[i].between);
            });
        }
    })
    .groupBy("products.product_id")
    .havingRaw(`count(*)>=${Object.getOwnPropertyNames(checkboxFilters).length+rangeFilters.length-lengthCorrection-1}`);
    console.log(filterQuery.toString());
    let filteredProductCatalog=(await database.query(filterQuery.toString())).rows;
    return filteredProductCatalog;
}
