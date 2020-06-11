"use strict";
let makeContext=require("../../makeContextFromQueries");
let fs=require("fs");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let goodsPage;
fs.readFile("./templates/goods/goods.pug",(error,data)=>{
  if(error){
    console.log(error);
  }
  goodsPage=pug.compile(data,{"basedir":"./"});
});
function addImgQuantityToQuery(rows, callback){
  let promMas=[];
  rows.forEach((element, i) => {
    promMas.push(new Promise((resolve, reject)=>{
      let dirName="./public/img/products/"+(100000000+(Number(element.product_category_id)*10000)+Number(element.product_id));
      console.log(dirName);
      fs.readdir(dirName,(err,files)=>{
        if(err) reject(err);
          rows[i]["imgQuan"]=files.length;
          resolve(rows[i]);
      });
    }));
  });
  Promise.all(promMas).then(result=>{
    callback(result);
  });
}
function makeGoodsPage(id){
  console.log(id);
  return[{"queryValue":`select products.product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price, product_description_en, product_description_ru, product_category_name_en, product_category_name_ru, type_name_en, type_name_ru from products inner join products_categories on products_categories.product_category_id=products.product_category_id inner join products_services_types on products_services_types.type_id=products_categories.type_id where products.product_id=${id};`,
  "contextVarName":"goodMainInformation",
  "queryFunc":addImgQuantityToQuery },
  {"queryValue":`select product_characteristic_name_en, product_characteristic_name_ru, product_characteristic_value_en, product_characteristic_value_ru from products_characteristics_values inner join products_characteristics on products_characteristics_values.product_characteristic_id=products_characteristics.product_characteristic_id where product_id=${id};`,
  "contextVarName":"characteristicValues"},
  {"queryValue":`select product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price,product_receipt_date FROM products where (product_receipt_date + interval '180 day')>now() order by product_receipt_date DESC limit 12;`,
  "contextVarName":"top12NewestFurniture"},
  {"queryValue":`select user_login, product_review_rating, product_review_text, product_review_date from products_reviews inner join users on products_reviews.user_id=users.user_id where product_id=${id} order by product_review_date;`,
  "contextVarName":"goodReviews"},
  {"queryValue":`select count(product_review_id) from products_reviews where product_id=${id};`,
  "contextVarName":"reviewsCount"}];
}
module.exports=(req,res)=>{
  console.log("yews", req.url);
  console.log("params",req.params);
  makeContext(makeGoodsPage(Number.parseInt(req.params["goodId"])%10000),client,resultContext=>{
   // console.log("asss",resultContext);
    /*if(!isQueryResultOk(resultContext)){
      console.log("no such file");
      return;
    }*/
    resultContext.session=req.session;
    resultContext.i18n=res.locals;
    res.end(goodsPage(resultContext));
  });
}