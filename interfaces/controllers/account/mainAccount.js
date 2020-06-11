let fs=require("fs");
let makeContext=require("../../makeContextFromQueries");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let conf=require("./../../config/index_config");
let knex=require("knex")({
    client: 'pg',
    connection: conf.get("postgresBd"),
    searchPath: ["Bazar"]
  });
let accountPage;
module.exports=(req,res)=>{
  fs.readFile("./templates/account/account.pug",(error,data)=>{
    if(error){
      console.log(error);
      throw(error);
    }
    function makeAccountQueries(userId) {
      return [
        {"queryValue":`select products_orders.product_order_id, product_order_generated_number,product_order_payment_type, product_order_summ, purchase_for_price,product_order_receive_type, product_order_date, purchase_quantity, products.product_id, product_name_en, product_name_ru from products_orders inner join purchases on purchases.product_order_id=products_orders.product_order_id INNER join products on products.product_id=purchases.product_id where user_id=${userId} order by products_orders.product_order_id`,
      "contextVarName":"userProductsOrders"}
      ];
    }

    accountPage=pug.compile(data,{"basedir":"./"});
    console.log(makeAccountQueries(req.session["userInfo"]["user_id"]));
    makeContext(makeAccountQueries(req.session["userInfo"]["user_id"]), client, (resultContext)=>{
      resultContext.session=req.session;
      console.log("\n\nContext",resultContext);
      resultContext.i18n=res.locals;
      res.end(accountPage(resultContext));
    });
  });
}