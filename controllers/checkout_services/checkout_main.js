let fs=require("fs");
let pug=require("pug");
let conf=require("./../../config/index_config");
let knex=require("knex")({
  client: 'pg',
  connection: conf.get("postgresBd"),
  searchPath: ["Bazar"],
});
let db=require("../../connect");
let client=db.getClient();
let pugContext={};
module.exports=(req,res)=>{
  if(req.session["userInfo"]===undefined){
    res.redirect("/login");
  }
  fs.readFile("./templates/checkout_services/checkout_services.pug",(error,data)=>{
    if(error){
      console.log(error);
    }
    if(req.session.serviceOrderInfo===undefined){
      req.session.serviceOrderInfo={
        currentStage:0,
      };
    }
    let purchasedServiceID=Number.parseInt(req.cookies["serviceOrder"]);
  console.log("serviceid",purchasedServiceID);
  (async ()=>{
    let purchasedServiceInfoQuery=`select service_id, service_current_price::numeric::float8 from services where service_id=${purchasedServiceID}`;
    console.log(purchasedServiceInfoQuery);
    let purchasedServiceInfoResult=(await client.query(purchasedServiceInfoQuery)).rows;
    console.log(purchasedServiceInfoResult);
    let totalPrice=Number.parseFloat(purchasedServiceInfoResult[0]["service_current_price"]);
    //req.session.orderInfo.currentStage=0;
    pugContext['totalPrice']=totalPrice;
    pugContext.session=req.session;
    pugContext.i18n=res.locals;
    checkoutPage=pug.compile(data,{"basedir":"./"});
    res.end(checkoutPage(pugContext));
  })();
  });
}