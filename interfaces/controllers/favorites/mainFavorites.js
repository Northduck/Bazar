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
let favorites;
let pugContext={};
module.exports=async (req,res)=>{
  pugContext={};
  pugContext.session=req.session;
  console.log(req.cookies);
  let favoritesMasInfo;
  if(req.cookies.favoritesCounter!==undefined){
    pugContext.favoritesQuantity=req.cookies.favoritesCounter;
  }else{
    pugContext.favoritesQuantity="0";
  }
  if(req.cookies.favoritesContent!==undefined&&req.cookies.favoritesContent!==""){
    favoritesMasInfo=req.cookies.favoritesContent.split("_");
    let favoritesQuery=knex.select(knex.raw("products.product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_receipt_date, product_current_price::numeric::float8, product_previous_price::numeric::float8"))
    .from("products")
    .where((builder)=>{
      let queryTemp=builder;
      for(let i=0;i<favoritesMasInfo.length;i++){
        queryTemp=queryTemp.orWhere("products.product_id",favoritesMasInfo[i]);
      }
    }).orderBy("products.product_id").toString();
    favoritesMasInfo.sort((a,b)=>{
      if(Number.parseInt(a[0])<Number.parseInt(b[0])){
        return -1;
      }
      if(Number.parseInt(a[0])>Number.parseInt(b[0])){
        return 1;
      }
      return 0;
    });
    console.log(favoritesQuery);
    let favoriteProducts=(await client.query(favoritesQuery)).rows;
    let favoritesTotalPrice=favoritesMasInfo.reduce((summ,val,i)=>{
      return summ+=Number.parseInt(val[1])*favoriteProducts[i]["product_current_price"];
    },0);
    pugContext["favoritesProducts"]=favoriteProducts;
    pugContext["favoritesProductsQuantity"]=favoritesMasInfo.length;
    pugContext["favoritesProductsTotalPrice"]=favoritesTotalPrice;
  }else{
    pugContext["favoritesProducts"]=[];
    pugContext["favoritesProductsQuantity"]=0;
    pugContext["favoritesProductsTotalPrice"]=0;
  }
  pugContext.i18n=res.locals;
  fsPromises.readFile("./templates/favorites/favorites.pug")
  .then((data)=>{
    favorites=pug.compile(data,{"basedir":"./"});
    res.end(favorites(pugContext));
  })
  .catch((err)=>{
    console.log(err);
  });
}