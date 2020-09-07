"use strict";

module.exports=function getQueriesMas(category){
    return[{"queryValue":`select distinct product_characteristic_value_en, product_characteristic_value_ru, product_characteristic_name_en, product_characteristic_name_ru FROM products_characteristics_values inner join products_characteristics on products_characteristics.product_characteristic_id=products_characteristics_values.product_characteristic_id where product_category_id=${category} and product_characteristic_type='checkbox' order by product_characteristic_name_en;`,
    "contextVarName":"categoryFilters"},
    {"queryValue":`select * from "get_min_max_range"(${category});`,
    "contextVarName":"minMaxRanges"},
    {"queryValue":`select product_category_id, product_id, product_name_en, product_name_ru, product_rating, product_receipt_date, product_current_price, product_previous_price, product_description_en, product_description_ru FROM products where product_category_id=${category};`,
    "contextVarName":"productsInfo"},
    {"queryValue":`select product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price, product_home_gallery_header_en, product_home_gallery_header_ru from products, products_home_gallery where products.product_id=products_home_gallery.product_id;`,
    "contextVarName":"topProducts"},
    {"queryValue":`select product_category_id, type_name_en, type_name_ru, products_categories.type_id, product_category_name_en, product_category_name_ru from products_categories inner join products_services_types on products_services_types.type_id=products_categories.type_id where product_category_id=${category};`,
      "contextVarName":"typeCategoryInfo"}
  ];
}