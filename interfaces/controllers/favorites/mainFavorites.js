"use strict";

const makePage=require("../../utilities/makePage.js");
let convertFavoritesCookieToArr=require("../../utilities/convertFavoritesCookieToArr.js");
let listFavorites=require("../../../application/favoritesUseCases/listFavorites.js");
let FavoritesRepository=require("../../dataAccess/favoritesDataAccess/favoritesRepository.js");
module.exports=async (req,res)=>{
  let favoritesContent=convertFavoritesCookieToArr(req.cookies.favoritesContent);
  let favoritesRepository=new FavoritesRepository();
  let favoritesInfo= await listFavorites(favoritesContent,favoritesRepository);
  let favoritesPageContext={
    "favoritesProducts":favoritesInfo,
    "favoritesProductsQuantity":Number.parseInt(req.cookies.favoritesCounter)||0
  };
  let favoritesPage=new makePage(req,res,"favorites","favorites","pug",favoritesPageContext);

  let pageContent=await favoritesPage.makePage();

  res.end(pageContent);
}