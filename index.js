let express=require("express");
let http=require("http");
let path=require("path");
let fs=require("fs");
let pug=require("pug");
const {Client}=require("pg");
let makeContext=require("./makeContextFromQueries.js");
let conf=require("./config/index_config.js");
const bodyParser = require("body-parser");
const pathToRegexp = require('path-to-regexp');
function renameImgs(dirName){
  let files=fs.readdirSync(dirName);
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
function addImgQuantityToQuery(rows, callback){
let promMas=[];
rows.forEach((element, i) => {
  promMas.push(new Promise((resolve, reject)=>{
    let dirName=__dirname+"/public/img/products/"+element.category_id+"_"+element.product_id;
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
function roundValues(rows, callback){
for(let i=0;i<rows.length;i++){
  for(j in rows[i]){
    let tempValue;
    console.log("j",j,"value",rows[i][j])
    tempValue=Number.parseFloat(rows[i][j]);
    if(j.indexOf("max")!==-1){
      tempValue=Math.ceil(tempValue);
    }else{
      tempValue=Math.floor(tempValue);
    }
    rows[i][j]=tempValue+"";
  }
}
callback(rows);
}
let homeQueriesMas=[
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
function makecataloQueriesMas(category){
return[{"queryValue":`select categories_characteristics_values.category_characteristic_value, products_characteristics.characteristic_name from products_characteristics_values inner join products_info on(products_info.product_id=products_characteristics_values.product_id) inner join categories_characteristics_values on(categories_characteristics_values.category_characteristic_value_id=products_characteristics_values.category_characteristic_value_id) inner join categories_characteristics on (categories_characteristics.category_characteristic_id=categories_characteristics_values.category_characteristic_id) inner join products_characteristics on(categories_characteristics.characteristic_id=products_characteristics.characteristic_id) where products_info.category_id=${category} group by grouping sets((categories_characteristics_values.category_characteristic_value,products_characteristics.characteristic_name)) order by characteristic_name;`,
"contextVarName":"categoryFilters"},
{"queryValue":`select max(product_length) as maxLength,min(product_length) as minLength,max(product_width) as maxWidth,min(product_width) as minWidth,max(product_height) as maxHeight,min(product_height) as minHeight,"maxPrice"(${category}),"minPrice"(${category}) from products_info where category_id=${category};`,
"contextVarName":"minMaxRanges",
"queryFunc":roundValues},
{"queryValue":`select products_info.category_id, products_info.product_id, product_name, product_rating, product_receipt_date, product_static_price, product_onsale_price FROM products_info where category_id=${category};`,
"contextVarName":"productsInfo"},
{"queryValue":`select product_brand_value as category_characteristic_value, 'brand' as characteristic_name from products_info inner join products_brands on(products_info.product_brand_id=products_brands.product_brand_id) where category_id=${category};`,
"contextVarName":"categoryBrands"},
{"queryValue":"select category_id, products_info.product_id, product_name, product_rating, product_static_price, product_onsale_price, product_top_header from products_info, products_top_gallery where products_info.product_id=products_top_gallery.product_id;",
"contextVarName":"topProducts"}];
}
function makeGoodsPage(category, id){
  return[{"queryValue":`select category_id, products_info.product_id, product_name, product_rating, product_static_price, product_onsale_price, product_description, product_length, product_width, product_height, product_weight, product_brand_value from products_info inner join products_brands on(products_info.product_brand_id=products_brands.product_brand_id) where products_info.category_id=${category} and product_id=${id};`,
  "contextVarName":"goodMainInformation",
  "queryFunc":addImgQuantityToQuery},
  {"queryValue":`select categories_characteristics_values.category_characteristic_value, products_characteristics.characteristic_name, products_characteristics_values.product_id from products_characteristics_values inner join categories_characteristics_values on(categories_characteristics_values.category_characteristic_value_id=products_characteristics_values.category_characteristic_value_id) inner join categories_characteristics on (categories_characteristics.category_characteristic_id=categories_characteristics_values.category_characteristic_id) inner join products_characteristics on(categories_characteristics.characteristic_id=products_characteristics.characteristic_id) where products_characteristics_values.product_id=${id} order by characteristic_name;`,
  "contextVarName":"characteristicValues"}];
}
function makeFiltersQuery(category, formData){
  debugger;
  let resultQuery=`create temp table products_values as select product_id, categories_characteristics.category_id, category_characteristic_value, characteristic_name from products_characteristics_values inner join categories_characteristics_values on (products_characteristics_values.category_characteristic_value_id=categories_characteristics_values.category_characteristic_value_id) inner join categories_characteristics on (categories_characteristics.category_characteristic_id=categories_characteristics_values.category_characteristic_id) inner join products_characteristics on(categories_characteristics.characteristic_id=products_characteristics.characteristic_id)inner join products_categories on(categories_characteristics.category_id=products_categories.category_id) where category_name='${category}' order by category_name; select distinct products_info.category_id, products_info.product_id, product_name, product_rating, product_static_price, product_receipt_date,  product_onsale_price FROM products_info inner join products_brands on(products_info.product_brand_id=products_brands.product_brand_id) inner join products_characteristics_values on(products_characteristics_values.product_id=products_info.product_id) inner join products_categories on(products_info.category_id=products_categories.category_id) where  category_name='${category}'`;
  let universalCharacteristics="";
  let categoriesCharacteristicsPrefix="and products_info.product_id in (";
  let categoriesCharacteristics="";
  let characteristicType="";
  let isBrandFilter=false;
  for(let el in formData){
    let elMas=el.split("_");
    if(isBrandFilter&&elMas[0]!=="brand"){
      universalCharacteristics+=")";
      isBrandFilter=false;
    }
    if(formData[el]!=="on"){
      if(elMas[0]==="price"){
        if(elMas[1]==="max"){
          universalCharacteristics+=`(product_onsale_price<=cast(${formData[el]} as money) or product_static_price<=cast(${formData[el]} as money))`;
        }else{
          universalCharacteristics+=`and (product_onsale_price>cast(${formData[el]} as money) or product_static_price>=cast(${formData[el]} as money)) and `;
        }
      }else{
        if(elMas[1]==="max"){
          universalCharacteristics+=` and product_${elMas[0]}<=${formData[el]}`;
        }else{
          universalCharacteristics+=` and product_${elMas[0]}>=${formData[el]}`;
        }
      }
    }else{
      if(elMas[0]==="brand"){
        if(isBrandFilter){
          universalCharacteristics+=` or product_brand_value='${elMas[1]}'`;
        }else{
          universalCharacteristics+=` and (product_brand_value='${elMas[1]}'`;
          isBrandFilter=true;
        }
        continue;
      }
      if(characteristicType!==elMas[0]){
        if(characteristicType){
          categoriesCharacteristics+=`intersect (select product_id from products_values where(category_characteristic_value='${elMas[1]}'))`;
        }else{
          categoriesCharacteristics+=`(select product_id from products_values where(category_characteristic_value='${elMas[1]}'))`;
        }
        characteristicType=elMas[0];
      }else{
        categoriesCharacteristics+=`union (select product_id from products_values where(category_characteristic_value='${elMas[1]}'))`;
      }
    }
  }
  resultQuery+=universalCharacteristics;
  if(categoriesCharacteristics){
    //categoriesCharacteristics=categoriesCharacteristics.slice(0,categoriesCharacteristics.lastIndexOf(" "));
    resultQuery+=categoriesCharacteristicsPrefix+categoriesCharacteristics+");";
  }else{
    resultQuery+=";";
  }
  resultQuery+="drop table if exists products_values;";
  console.log(resultQuery);
  return resultQuery;
}
app=express();
let urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(express.static(__dirname + '/public'));

let mainPage;
let categories;
let keys;
let catalogFormRegexp=pathToRegexp("\/catalog\/:category([^]{0,}):form([^]{0,})",keys,{delimiter:"?"});
let catalogRegexp=pathToRegexp("\/catalog\/:category");
const client = new Client(conf.get("postgresBd"));
client
  .connect()
  .then(() => console.log('connected'))
  .catch(e => console.error('connection error', err.stack))

client
  .query('select category_id, category_name from products_categories;')
  .then(result => {
    categories=result.rows;
    for(let i=0;i<categories.length;i++){
      categories[i].category_name=categories[i].category_name.toLowerCase().replace(/ /g,"");
    }
    console.log(categories);
  })
  .catch(e => console.error(e.stack))
  .then(()=>{
    return new Promise((resolve, reject)=>{
      fs.readFile("./templates/home/home.pug",(err,homeTemplate)=>{
        mainPage=pug.compile(homeTemplate,{"basedir":__dirname});
        console.log("hello");
        resolve();
      });
    });
  })
  .then((promise)=>{
    app.set("port", conf.get("port"));
    http.createServer(app).listen(conf.get("port"),()=>{
      console.log(`Listening ${conf.get("port")}`);
    });
  });
app.get(/\/goods\//,(req,res,next)=>{
  console.log("yews")
  let goodsTemplate=fs.readFileSync("./templates/goods/goods.pug");
  let goodsPage=pug.compile(goodsTemplate,{"basedir":__dirname});
  makeContext(makeGoodsPage(1,1),client,resultContext=>{
    console.log(resultContext);
    res.end(goodsPage(resultContext));
  });
});
app.get(catalogRegexp,(req,res,next)=>{
  console.log("?",req.url.match(/\/catalog\/[a-z?]*[a-z]$/));
  console.log("!",req.url.match(/\/catalog\/[^]*\?/));
  if(req.url.match(/\?/)){
    next();
    return;
  }
  let urlCategory=req.url.substring(9,req.url.length).replace(/\//g,"");
    console.log(urlCategory);
    let i=categories.findIndex((el,ind)=>{
      return urlCategory===el.category_name;
    });
    console.log(i);
    if(i!==-1){
      let catalogTemplate=fs.readFileSync("./templates/catalog/catalog.pug");
      let catalogPage=pug.compile(catalogTemplate,{"basedir":__dirname});
      makeContext(makecataloQueriesMas(categories[i].category_id),client,resultContext=>{
        resultContext["category_name"]=urlCategory;
        console.log(resultContext);
        res.end(catalogPage(resultContext));
      });
    }
});
app.get(catalogFormRegexp,urlencodedParser, function (req, res) {
  let i=categories.findIndex((el,ind)=>{
    return req.params[0]===el.category_name;
  });
  console.log(i);
  if(i===-1){
    console.log("error");
  }
  let filtersQuery=makeFiltersQuery(req.params[0],req.query);
  console.log(req.url);
  console.log(req.query);
  //res.end(filtersQuery);
  let getProductsFromFilters=[];

  getProductsFromFilters.push(new Promise((resolve, reject)=>{
    client
    .query(filtersQuery)
    .then(result=>{
      resolve(result[1].rows);
    })
    .catch(err=>{
      //console.log(err);
      reject(err);
    })
  }));
  getProductsFromFilters.push(new Promise((resolve, reject)=>{
    fs.readFile("./templates/catalog/catalog_product_grid.pug",(err,productsTemplate)=>{
      if(err){
        reject(err);
      }
      let productsGrid=pug.compile(productsTemplate,{"basedir":__dirname});
      resolve(productsGrid);
    });
  }));
  Promise.all(getProductsFromFilters)
  .then(results=>{
    console.log({"productsInfo":results[0]});
    let resultProductsHtml=results[1]({"productsInfo":results[0]});
    console.log(resultProductsHtml);
    res.end(resultProductsHtml);
  })
  .catch(err=>{
    console.log(err);
  });
});
app.use((req,res,next)=>{
  console.log("why?",req.url);
    if(req.url=="/"){
      makeContext(homeQueriesMas, client, resultContext=>{
        //console.log(resultContext);
        res.end(mainPage(resultContext));
      });
    }
});
/*app.use((err,req,res,next)=>{
  res.status(404).send(err.message);
});*/
