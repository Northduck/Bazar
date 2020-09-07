"use strict";

module.exports=function getQueriesMas(category){
    return[/*{"queryValue":`select distinct product_characteristic_value_en,product_characteristic_name_en FROM products_characteristics_values inner join products_characteristics on products_characteristics.product_characteristic_id=products_characteristics_values.product_characteristic_id where product_category_id=${category} and product_characteristic_type='checkbox' order by product_characteristic_name_en;`,
    "contextVarName":"categoryFilters"},
    {"queryValue":`select * from "get_min_max_range"(${category});`,
    "contextVarName":"minMaxRanges"},*/
    {"queryValue":`select service_id, service_current_price, service_previous_price, service_category_id, service_name_en, service_name_ru from services;`,
    "contextVarName":"servicesInfo"},/*
    {"queryValue":`select product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price, product_home_gallery_header_en from products, products_home_gallery where products.product_id=products_home_gallery.product_id;`,
    "contextVarName":"topProducts"},*/
    {"queryValue":`select service_category_id, service_category_name_en, service_category_name_ru from services_categories;`,
      "contextVarName":"typeCategoryInfo"}
  ];
}

