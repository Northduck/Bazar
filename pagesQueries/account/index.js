module.exports=function makeAccountQueries(userId) {
  return [
    {"queryValue":`select products_orders.product_order_id, product_order_generated_number,product_order_payment_type, product_order_summ, purchase_for_price,product_order_receive_type, product_order_date, purchase_quantity, products.product_id, product_name_en, product_name_ru from products_orders inner join purchases on purchases.product_order_id=products_orders.product_order_id INNER join products on products.product_id=purchases.product_id where user_id=${userId} order by products_orders.product_order_id`,
  "contextVarName":"userProductsOrders"},
  {
    "queryValue":`select service_order_id,service_current_price,service_name_en,service_name_ru,service_order_payment_type,service_order_note,services_orders.service_id, service_order_date,service_order_generated_number,service_order_summ,user_id from services_orders inner join services on services_orders.service_id=services.service_id where user_id=${userId}`,
    "contextVarName":"userServicesOrders"
  },
  {
    "queryValue":`SELECT products_reviews.*,products.product_id,product_name_en,product_name_ru FROM products_reviews inner join products on products.product_id=products_reviews.product_id where user_id=${userId}`,
    "contextVarName":"userProductsReviews"
  },
  {
    "queryValue":`SELECT services_reviews.*,services.service_id,service_name_en,service_name_ru FROM services_reviews inner join services on services.service_id=services_reviews.service_id where user_id=${userId};`,
    "contextVarName":"userServicesReviews"
  },
  {"queryValue":`select user_id, user_login,user_email,user_full_name, user_birthdate,user_phone_number,user_address from users where user_id=${userId};`,
  "contextVarName":"userInfo"}
  ];
}
