/*
    TODO: Реализовать поддержку каталога списком
*/
"use strict";
let getFilteredServices=require("../../../application/getFilteredServices.js");
let filterExecutor=require("../../dataAccess/servicesCatalog/index.js");
const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res,next)=>{
  let filteredServices=await getFilteredServices(req.query, filterExecutor);

  let pageContext={
    "servicesInfo":filteredServices
  };

  let servicesCatalog=new makePage(req,res,"catalog_services","catalog_services_product_grid","pug",pageContext);

  let pageContent=await servicesCatalog.makePage();

  res.end(pageContent);
}