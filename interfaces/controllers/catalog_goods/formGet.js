/*
    TODO: Реализовать поддержку каталога списком
*/
"use strict";
let getFilteredProducts=require("../../../application/getFilteredProducts.js");
let filterExecutor=require("../../dataAccess/productsCatalog/index.js");
const makePage=require("../../utilities/makePage.js");
module.exports=async (req,res,next)=>{
  let catalogViewType=req.query["viewType"];
  delete req.query["viewType"];
  let filteredProducts=await getFilteredProducts(req.params.categoryId, req.query, filterExecutor);

  let pageContext={
    "productsInfo":filteredProducts,
    "viewType":catalogViewType
  };
  let productsCatalogContentFile;
  if(catalogViewType==="list"){
    productsCatalogContentFile="catalog_goods_product_list";
  }else{
    productsCatalogContentFile="catalog_goods_product_grid";
  }
  let productsCatalog=new makePage(req,res,"catalog_goods",productsCatalogContentFile,"pug",pageContext);

  let pageContent=await productsCatalog.makePage();

  res.end(pageContent);
}