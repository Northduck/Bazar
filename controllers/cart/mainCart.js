"use strict";

let makeContext=require("../../makeContextFromQueries");
let fsPromises=require("fs").promises;
let pug=require("pug");
let conf=require("./../../config/index_config");
let knex=require("knex")({
  client: 'pg',
  connection: conf.get("postgresBd"),
  searchPath: ["Bazar"],
});
let db=require("../../connect");
let client=db.getClient();
let cart;
let pugContext={};
module.exports=async (req,res)=>{
  pugContext={};
  pugContext.session=req.session;
  console.log(req.cookies);
  let cartMas;
  let cartMasInfo;
  if(req.cookies.cartCounter!==undefined){
    pugContext.cartQuantity=req.cookies.cartCounter;
  }else{
    pugContext.cartQuantity="0";
  }
  if(req.cookies.cartContent!==undefined&&req.cookies.cartContent!==""){
    cartMas=req.cookies.cartContent.split("_");
    cartMasInfo=Array(cartMas.length);
    for(let i=0;i<cartMas.length;i++){
      cartMasInfo[i]=cartMas[i].split("-");
    }
    let cartQuery=knex.select(knex.raw("products.product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_receipt_date, product_current_price::numeric::float8, product_previous_price::numeric::float8"))
    .from("products")
    .where((builder)=>{
      let queryTemp=builder;
      for(let i=0;i<cartMasInfo.length;i++){
        queryTemp=queryTemp.orWhere("products.product_id",cartMasInfo[i][0]);
      }
    }).orderBy("products.product_id");
    
    cartMasInfo.sort((a,b)=>{
      if(Number.parseInt(a[0])<Number.parseInt(b[0])){
        return -1;
      }
      if(Number.parseInt(a[0])>Number.parseInt(b[0])){
        return 1;
      }
      return 0;
    });
      console.log(cartQuery.toString());
      await client.query(cartQuery.toString())
      .then((res)=>{
        pugContext["cartProducts"]=res.rows;
        pugContext["cartProductsQuantity"]=cartMasInfo;
      })
      .catch((err)=>{
        console.log(err);
      });
  }else{
    pugContext["cartProducts"]=[];
    pugContext["cartProductsQuantity"]=0;
  }
  fsPromises.readFile("./templates/cart/cart.pug")
  .then((data)=>{
    cart=pug.compile(data,{"basedir":"./"});
    pugContext.i18n=res.locals;
    res.end(cart(pugContext));
  })
  .catch((err)=>{
    console.log(err);
  });
}