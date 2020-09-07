"use strict";

module.exports=function getQueriesMas(typeID){
  return [
    {"queryValue":`select product_category_id, product_category_name_en, product_category_name_ru from products_categories where type_id=${typeID};`,
    "contextVarName":"roomCategories"}
    {"queryValue":`select type_id, type_name_en, type_name_ru from products_services_types where type_id=${typeID}`,
      "contextVarName":"typeinfo"}
  ];
}