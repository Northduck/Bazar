"use strict";
let makeContext=require("../../makeContextFromQueries");
let fs=require("fs");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let goodsPage;
fs.readFile("./templates/services/services.pug",(error,data)=>{
  if(error){
    console.log(error);
  }
  goodsPage=pug.compile(data,{"basedir":"./"});
});
function addImgQuantityToQuery(rows, callback){
  let promMas=[];
  rows.forEach((element, i) => {
    promMas.push(new Promise((resolve, reject)=>{
      let dirName="./public/img/services/"+Number(element.service_id);
      fs.readdir(dirName,(err,files)=>{
        if(err) {
          return(err);
        }
        console.log(dirName);
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
  return[{"queryValue":`select services.*, service_category_name_en, service_category_name_ru from services inner join services_categories on services_categories.service_category_id=services.service_category_id where service_id=${id};`,
  "contextVarName":"serviceMainInformation",
  "queryFunc":addImgQuantityToQuery },/*
  {"queryValue":`select product_characteristic_name_en, product_characteristic_value_en from products_characteristics_values inner join products_characteristics on products_characteristics_values.product_characteristic_id=products_characteristics.product_characteristic_id where product_id=${id};`,
  "contextVarName":"characteristicValues"},
  {"queryValue":`select product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price,product_receipt_date FROM products where (product_receipt_date + interval '180 day')>now() order by product_receipt_date DESC limit 12;`,
  "contextVarName":"top12NewestFurniture"},*/
  {"queryValue":`select services_reviews.*, user_login from services_reviews inner join users on services_reviews.user_id=users.user_id where service_review_id=${id} order by service_review_date;;`,
  "contextVarName":"serviceReviews"},
  {"queryValue":`select count(service_review_id) from services_reviews where service_id=${id};`,
  "contextVarName":"reviewsCount"}];
}
function isQueryResultOk(res){
  for(let elName in res){
    console.log("elName",elName,"element",res[elName]);
    if(!res[elName]){
      return  false;
    }
  }
  return true;
}
module.exports=(req,res)=>{
  console.log("yews", req.url);
  console.log("params",req.params);
  makeContext(makeGoodsPage(Number.parseInt(req.params.serviceId)),client,resultContext=>{
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