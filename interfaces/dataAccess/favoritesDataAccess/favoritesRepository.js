"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
let {database,queryBuilder}=container.cradle;
module.exports=class FavoritesRepository{
    async listFavorites(favorites){
        let favoritesMasInfo=favorites.getFavoritesContent();
        if(favoritesMasInfo.length<=0){
            return [];
        }
        let favoritesQuery=queryBuilder.select(queryBuilder.raw("products.product_category_id, products.product_id, product_name_en, product_name_ru, product_rating, product_receipt_date, product_current_price, product_previous_price"))
        .from("products")
        .where((builder)=>{
        let queryTemp=builder;
        for(let i=0;i<favoritesMasInfo.length;i++){
            queryTemp=queryTemp.orWhere("products.product_id",favoritesMasInfo[i]);
        }
        }).orderBy("products.product_id")
        .toString();
        let favoritesInfo;
        try {
            favoritesInfo=(await database.query(favoritesQuery)).rows;
        } catch (error) {
            console.log(error);
        }
        return favoritesInfo;
    }
};