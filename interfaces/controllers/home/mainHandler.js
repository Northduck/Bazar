let makeContext=require("../../makeContextFromQueries");
let fs=require("fs");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
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
let mainPage;
  let homeQueriesMas=[
    {"queryValue":'select product_category_id, products_hot_deals.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price, product_hot_deal_end FROM products, products_hot_deals where (products.product_id=products_hot_deals.product_id) and (product_hot_deal_end>now());',
    "contextVarName":"hotDeals"},
    {"queryValue":"select product_category_id, product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price FROM products where (product_category_id=1 or product_category_id=10 or product_category_id=18 or product_category_id=28 or product_category_id=32) and ((product_receipt_date + interval '60 day')>now()) order by product_category_id;",
    "contextVarName":"newProductsCatalog"},
    {"queryValue":"select products.product_category_id, product_category_name_en, product_category_name_ru, count(products.product_category_id) FROM products INNER JOIN products_categories ON (products_categories.product_category_id=products.product_category_id) where (products.product_category_id=1 or products.product_category_id=10 or products.product_category_id=18 or products.product_category_id=28 or products.product_category_id=32) and ((product_receipt_date + interval '60 day')>now()) group by GROUPING SETS((products.product_category_id, product_category_name_en, product_category_name_ru));",
    "contextVarName":"newProductsCatalogNav"},
    {"queryValue":"select product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_current_price, product_previous_price, product_home_gallery_header_en, product_home_gallery_header_ru from products, products_home_gallery where products.product_id=products_home_gallery.product_id;",
    "contextVarName":"topProducts",
    "queryFunc":addImgQuantityToQuery},
    {"queryValue":"select article_id, article_creation_date, article_header_en, article_header_ru, article_introductory_en, article_introductory_ru from blog_articles;",
    "contextVarName":"blogArticles"},
    {"queryValue":"select product_category_id, products_categories.type_id, product_category_name_en, product_category_name_ru, type_name_en, type_name_ru from products_categories inner join products_services_types on products_services_types.type_id=products_categories.type_id order by type_name_en;",
    "contextVarName":"navCatalogCategories"}
    ];
module.exports=(req,res)=>{
  console.log(req.cookie);
  fs.readFile("./templates/home/home.pug",(err,homeTemplate)=>{
    if(err){
      console.log(err);
    }
    mainPage=pug.compile(homeTemplate,{"basedir":"./"});
    makeContext(homeQueriesMas, client, resultContext=>{
      resultContext.session=req.session;
      console.log(res.locals);
      resultContext.i18n=res.locals;
      res.end(mainPage(resultContext));
    });
    console.log("hello");
  });
};