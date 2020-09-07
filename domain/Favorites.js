"use strict";

module.exports=class Favorites{
    constructor(favoritesContent){
        if(favoritesContent===undefined){
            this.favoritesContent=[];
            return;
        }
        if(Array.isArray(favoritesContent)!==true){
            let typeError=new Error("Wrong type in cart constructor");
            throw typeError;
        }
        this.favoritesContent=favoritesContent;
    }
    getFavoritesContent(){
        return this.favoritesContent;
    }
    addProductToFavorites(productToAdd){
        if(typeof productToAdd!=="number"&&productToAdd==undefined){
            return false;
        }
        let newProductIndexInContent=this.favoritesContent.indexOf((favoritesElement,i)=>{
            if(favoritesElement===productToAdd){
                return true;
            }
        });
        if(newProductIndexInContent!==-1){
            return false;
        }else{
            this.favoritesContent.push(productToAdd);
        }
        return true;
    }
    deleteProductFromFavorites(productToDelete){
        if(typeof productToDelete!=="number"&&productToDelete==undefined){
            return false;
        }
        let newProductIndexInContent=this.favoritesContent.indexOf((favoritesElement,i)=>{
            if(favoritesElement===productToDelete){
                return true;
            }
        });
        if(newProductIndexInContent!==-1){
            this.favoritesContent.splice(newProductIndexInContent,1);
            return true;
        }else{
            return false;
        }
    }
};