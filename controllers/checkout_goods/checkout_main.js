let fs=require("fs");
let pug=require("pug");
let conf=require("./../../config/index_config");
let knex=require("knex")({
  client: 'pg',
  connection: conf.get("postgresBd"),
  searchPath: ["Bazar"],
});
let db=require("../../connect");
let client=db.getClient();
let pugContext={};
module.exports=(req,res)=>{
  fs.readFile("./templates/checkout_goods/checkout_goods.pug",(error,data)=>{
    if(error){
      console.log(error);
    }
    if(req.session.orderInfo===undefined){
      req.session.orderInfo={
        currentStage:0,
      };
    }
    let purchasedProductsInfo=req.cookies["cartContent"].split("_");
    let purchasedProducts=new Array(purchasedProductsInfo.length);
    purchasedProductsInfo.forEach((element,i) => {
      purchasedProducts[i]=element.split("-");
    });
    purchasedProducts.sort((a,b)=>{
      if(Number.parseInt(a[0])>Number.parseInt(b[0])){
          return 1;
      }
      if(Number.parseInt(a[0])<Number.parseInt(b[0])){
          return -1;
      }
      return 0;
  });
  console.log("Products",purchasedProducts);
  (async ()=>{
    let purchasedProductsInfoQuery=knex.select(knex.raw("product_id, product_current_price::numeric::float8")).from("products").where((builder)=>{
      builder=builder.where("product_id",purchasedProducts[0][0]);
      for(let i=1;i<purchasedProducts.length;i++){
          builder=builder.orWhere("product_id",purchasedProducts[i][0]);
      }
    }).orderBy("product_id").toString();
    console.log(purchasedProductsInfoQuery);
    let purchasedProductsInfoResult=(await client.query(purchasedProductsInfoQuery)).rows;
    console.log(purchasedProductsInfoResult);
    let totalPrice=purchasedProductsInfoResult.reduce((summ,val,i)=>{
      return summ+(Number(val['product_current_price'])*Number.parseInt(purchasedProducts[i][1]));
    },0);
    //req.session.orderInfo.currentStage=0;
    pugContext['totalPrice']=totalPrice.toFixed(2);
    pugContext['totalQuantity']=req.cookies["cartCounter"];
    pugContext.session=req.session;
    pugContext.i18n=res.locals;
    checkoutPage=pug.compile(data,{"basedir":"./"});
    res.end(checkoutPage(pugContext));
  })();
  });
}