"use strict";
let fs=require("fs");
function addImgQuantityToQuery(rows, callback){
  let promMas=[];
  rows.forEach((element, i) => {
    promMas.push(new Promise((resolve, reject)=>{
      let dirName="./public/img/services/"+Number(element.service_id);
      fs.readdir(dirName,(err,files)=>{
        if(err) {
          return(err);
        }
        rows[i]["imgQuan"]=files.length;
        resolve(rows[i]);
      });
    }));
  });
  Promise.all(promMas).then(result=>{
    callback(result);
  });
}
module.exports=function makeGoodsPage(id){
  console.log(id);
  return[{"queryValue":`select services.*, service_category_name_en, service_category_name_ru from services inner join services_categories on services_categories.service_category_id=services.service_category_id where service_id=${id};`,
  "contextVarName":"serviceMainInformation",
  "queryFunc":addImgQuantityToQuery },
  {"queryValue":`select services_reviews.*, user_login from services_reviews inner join users on services_reviews.user_id=users.user_id where services_reviews.service_id=${id} order by service_review_date;`,
  "contextVarName":"serviceReviews"},
  {"queryValue":`select count(service_review_id) from services_reviews where service_id=${id};`,
  "contextVarName":"reviewsCount"}];
}