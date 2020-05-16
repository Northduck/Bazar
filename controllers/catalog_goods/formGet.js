"use strict";

let fs=require("fs");
let pug=require("pug");
let conf=require("../../config/index_config");
let knex=require("knex")({
  client: 'pg',
  connection: conf.get("postgresBd"),
  searchPath: ["Bazar"],
});
let db=require("../../connect");
let client=db.getClient();
let categories;
let pugContext={};
const takeCategories= async()=>{
  return client
  .query(`select product_category_id, product_category_name_en, product_category_name_ru from products_categories;`)
  .then(result => {
    categories=result.rows;
    for(let i=0;i<categories.length;i++){
      categories[i].product_category_name_en=categories[i].product_category_name_en.toLowerCase().replace(/ /g,"_");
    }
  })
  .catch(e => console.log("Sure?",e));
}
let makeFiltersQuery=(categoryIndex,urlQuery)=>{
  let checkboxFilters=[];
  let rangeFilters=[];
  let isRangeMax=false;
  let i=0,j=0;
  let priceRange=new Array(2);
  let lengthCorrection=0;
  let prevCheckboxName="";
  priceRange[0]=urlQuery["price_min"];
  priceRange[1]=urlQuery["price_max"];
  delete urlQuery["price_min"];
  delete urlQuery["price_max"];
  for(let queryEl in urlQuery){
    let underlinePos=queryEl.indexOf("_");
    if(urlQuery[queryEl]==='on'){
      checkboxFilters.push({});
      checkboxFilters[j].checkboxName=queryEl.slice(0,underlinePos);
      checkboxFilters[j].checkboxValue=queryEl.slice(underlinePos+1);
      if(prevCheckboxName===checkboxFilters[j].checkboxName){
        lengthCorrection++;
      }
      prevCheckboxName=checkboxFilters[j].checkboxName;
      j++;
    }else{
      if(!isRangeMax){
        rangeFilters.push({});
        rangeFilters[i].rangeName=queryEl.slice(0,underlinePos);
        rangeFilters[i].between=new Array(2);
        rangeFilters[i].between[0]=urlQuery[queryEl];
        isRangeMax=true;
      }else{
        rangeFilters[i].between[1]=urlQuery[queryEl];
        i++;
        isRangeMax=false;
      }
    }
  }
  console.log(checkboxFilters,"\n",rangeFilters);
  let filterQuery= knex.distinct("products.product_category_id", "products.product_id", "product_name_en", "product_name_ru", "product_rating", "product_receipt_date", "product_current_price", "product_previous_price")
  .from("products_characteristics_values")
  .innerJoin("products_characteristics","products_characteristics.product_characteristic_id","products_characteristics_values.product_characteristic_id")
  .innerJoin("products" ,"products.product_id","products_characteristics_values.product_id")
  .where("products_characteristics.product_category_id", categoryIndex)
  .andWhereBetween("products.product_current_price",priceRange)
  .andWhere((filtersBuilder)=>{
    for(let i=0;i<checkboxFilters.length;i++){
      filtersBuilder=filtersBuilder.orWhere((checkboxBuilder)=>{
        checkboxBuilder.where("product_characteristic_name_en",checkboxFilters[i].checkboxName).andWhere("product_characteristic_value_en",checkboxFilters[i].checkboxValue);
      });
    }
    for(let i=0;i<rangeFilters.length;i++){
      filtersBuilder=filtersBuilder.orWhere((rangeBuilder)=>{
        rangeBuilder.where("product_characteristic_name_en",rangeFilters[i].rangeName).andWhereBetween("product_characteristic_value_en",rangeFilters[i].between);
      });
    }
  })
  .groupBy("products.product_id")
  .havingRaw(`count(*)>=${Object.getOwnPropertyNames(checkboxFilters).length+rangeFilters.length-lengthCorrection-1}`);

  console.log(filterQuery.toString());
  return filterQuery.toString();
}
(async ()=>{
  await takeCategories();
  
})();
module.exports=(req,res)=>{
  pugContext.session=req.session;
  console.log("!!!!",req.url);
  console.log("??????",req.query);
  
  let Urlcategory=req.params.categoryId;
  console.log("category",Urlcategory);
  let categoryIndex=categories.findIndex((el,ind)=>{
    return Urlcategory===el.product_category_name_en;
  });
  categoryIndex=Number.parseInt(categories[categoryIndex].product_category_id);
  console.log("index",categoryIndex);
  if(categoryIndex===-1){
    console.log("error");
    return;
  }
  let filtersQuery=makeFiltersQuery(categoryIndex,req.query);
  console.log(req.url);
  console.log(req.query);
  //res.end(filtersQuery);
  let getProductsFromFilters=[];

  getProductsFromFilters.push(new Promise((resolve, reject)=>{
    client
    .query(filtersQuery)
    .then(result=>{
      console.log(result.rows);
      resolve(result.rows);
    })
    .catch(err=>{
      console.log(err);
      reject(err);
    })
  }));
  getProductsFromFilters.push(new Promise((resolve, reject)=>{
    fs.readFile("./templates/catalog_goods/catalog_goods_product_grid.pug",(err,productsTemplate)=>{
      if(err){
        reject(err);
      }
      let productsGrid=pug.compile(productsTemplate,{"basedir":"./"});
      resolve(productsGrid);
    });
  }));
  Promise.all(getProductsFromFilters)
  .then(results=>{
    pugContext["productsInfo"]=results[0];
    pugContext.i18n=res.locals;
    let resultProductsHtml=results[1](pugContext);
    res.end(resultProductsHtml);
  })
  .catch(err=>{
    console.log(err);
  });
}