var express=require("express");
var http=require("http");
var path=require("path");
var fs=require("fs");
var pug=require("pug");
const {Client}=require("pg");
var makeContext=require("./makeContextFromQueries.js");
var conf=require("./config/index_config.js");
app=express();

app.use(express.static(__dirname + '/public'));
function renameImgs(dirName){
    var files=fs.readdirSync(dirName);
    files.forEach(file=>{
      if(file.indexOf(".jpg")===-1&&file.indexOf(".png")===-1){
        if(file.indexOf("Store")===-1&&file.indexOf(".jpeg")===-1){
          renameImgs(dirName+"/"+file);
        }
      }else if(file.indexOf(".jpeg")===-1){
        console.log(dirName.indexOf("products/"));
        fs.renameSync(dirName+"/"+file, dirName+"/"+file.slice(0,-3)+"jpeg");
      }      
      if(file.indexOf(".jpg")===-1&&file.indexOf(".jpeg")===-1&&file.indexOf(".png")===-1){
        if(file.indexOf("Store")===-1){
          renameImgs(dirName+"/"+file);
        }
      }else if(file.indexOf("_")===-1){
        console.log(dirName.indexOf("products/"));
        fs.renameSync(dirName+"/"+file, dirName+"/"+dirName.substring(64)+"_"+file);
      }
    });
}
const client = new Client(conf.get("postgresBd"));
client.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
  } else {
    console.log('connected');
  }
});
var homeTemplate=fs.readFileSync("./templates/home/home.pug");
var mainPage=pug.compile(homeTemplate,{"basedir":__dirname});

app.set("port", conf.get("port"));
http.createServer(app).listen(conf.get("port"),()=>{
  console.log(`Listening ${conf.get("port")}`);
});

function addImgQuantityToQuery(rows, callback){
  var promMas=[];
  rows.forEach((element, i) => {
    promMas.push(new Promise((resolve, reject)=>{
      var dirName=__dirname+"/public/img/products/"+element.category_id+"_"+element.product_id;
      fs.readdir(dirName,(err,files)=>{
        if(err) reject(err);
          rows[i].imgQuan=files.length;
          resolve(rows[i]);
      });
    }));
  });
  Promise.all(promMas).then(result=>{
    callback(result);
  });
}
var homeQueriesMas=[
  {"queryValue":'select category_id, products_info.product_id, product_name, product_rating, product_static_price, product_onsale_price, product_hot_deal_end FROM products_info, "Products_hot_deals" where products_info.product_id="Products_hot_deals".product_id and product_hot_deal_end>now();',
  "contextVarName":"hotDeals"},
  {"queryValue":"select category_id, products_info.product_id, product_name, product_rating, product_static_price, product_onsale_price FROM products_info where (category_id>=1 and category_id<=5) and ((product_receipt_date + interval '30 day')>now()) order by category_id;",
  "contextVarName":"newProductsCatalog"},
  {"queryValue":"select products_info.category_id, category_name, count(*) FROM products_info INNER JOIN products_categories ON (products_categories.category_id=products_info.category_id) where (products_info.category_id>=1 and products_info.category_id<=5) and ((product_receipt_date + interval '30 day')>now()) group by GROUPING SETS((products_info.category_id, category_name));",
  "contextVarName":"newProductsCatalogNav"},
  {"queryValue":"select category_id, products_info.product_id, product_name, product_rating, product_static_price, product_onsale_price, product_top_header from products_info, products_top_gallery where products_info.product_id=products_top_gallery.product_id;",
  "contextVarName":"topProducts",
  "queryFunc":addImgQuantityToQuery},
  {"queryValue":"select article_id, article_creation_date, article_header, article_introductory from blog_articles",
  "contextVarName":"blogArticles"}
];

app.use((req,res,next)=>{
    if(req.url=="/"){
      makeContext(homeQueriesMas, client, resultContext=>{
        console.log(resultContext);
        res.end(mainPage(resultContext));
      });
    }
});
