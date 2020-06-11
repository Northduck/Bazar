let fs=require("fs");
let makeContext=require("../../makeContextFromQueries");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let conf=require("./../../config/index_config");
let knex=require("knex")({
    client: 'pg',
    connection: conf.get("postgresBd"),
    searchPath: ["Bazar"]
  });
let addPage;
module.exports=async (req,res)=>{
    console.log(req.body);
    if(req.body["charact"]!=undefined){
        for(let elName in req.body){
            if(elName.search(/characteristic*/)!=-1){
                let characteristicID=elName.split("_");
                let insertCharacteristic=knex.insert({
                    "product_characteristic_value_id":"default",
                    "product_characteristic_value_en":req.body[elName][0],
                    "product_characteristic_id":characteristicID[1],
                    "product_id":req.body["productID"],
                    "product_characteristic_value_ru":req.body[elName][1]
                }).into("products_characteristics_values").toString().replace(/'default'/g,"default");
                
                console.log(insertCharacteristic);
                let insertedCharacteristic=(await client.query(insertCharacteristic)).rows;
            }
        }
        res.redirect("/");
        return;
    }
    let insertProduct=knex.returning("product_id").insert({
        "product_id":'default',
        "product_category_id":req.body["productCategory"],
        "product_name_en":req.body["product_name_en"],
        "product_current_price":req.body["product_current_price"],
        "product_previous_price":req.body["product_previous_price"],
        "product_description_en":req.body["product_description_en"],
        "product_receipt_date":req.body["product_receipt_date"],
        "product_name_ru":req.body["product_name_ru"],
        "product_description_ru":req.body["product_description_ru"]
    }).into("products").toString().replace(/'default'/g,"default");

    console.log(insertProduct);
    let insertedproductID=(await client.query(insertProduct)).rows;
    console.log(insertedproductID);
    fs.readFile("./templates/add_furniture/add_characteristics.pug",(error,data)=>{
        if(error){
          console.log(error);
          throw(error);
        }
        function makePageQueries(category) {
            return [
              {"queryValue":`select * from products_characteristics where product_category_id=${category}`,
            "contextVarName":"productsCharacteristics"}
            ];
          }
        addPage=pug.compile(data,{"basedir":"./"});
        makeContext(makePageQueries(req.body["productCategory"]), client, (resultContext)=>{
          resultContext.session=req.session;
          resultContext["newProductID"]=insertedproductID[0]["product_id"];
          resultContext["newProductCategoryID"]=insertedproductID[0]["product_id"];
          console.log("\n\nContext",resultContext);
          resultContext.i18n=res.locals;
          res.end(addPage(resultContext));
        });
      });
}