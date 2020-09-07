"use strict";

module.exports=(cookieString)=>{
    if(cookieString==undefined||cookieString===""){
        return [];
    }
    let cookieFavoritesTempArr=cookieString.split("_");
    let returnFavoritesArr=Array(cookieFavoritesTempArr.length);
    for(let i=0;i<cookieFavoritesTempArr.length;i++){
        returnFavoritesArr[i]=Number.parseInt(cookieFavoritesTempArr[i]);
    }
    returnFavoritesArr.sort((a,b)=>{
        if(Number.parseInt(a)<Number.parseInt(b)){
            return -1;
        }
        if(Number.parseInt(a)>Number.parseInt(b)){
            return 1;
        }
        return 0;
    });
    return returnFavoritesArr;
}