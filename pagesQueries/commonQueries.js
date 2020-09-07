module.exports=function makeCommщnQueries() {
    return [
        {"queryValue":"select product_category_id, products_categories.type_id, product_category_name_en, product_category_name_ru, type_name_en, type_name_ru from products_categories inner join products_services_types on products_services_types.type_id=products_categories.type_id order by type_name_en;",
        "contextVarName":"navCatalogCategories"}
    ];
}