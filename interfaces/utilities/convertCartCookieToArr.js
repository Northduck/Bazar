"use strict";
module.exports=(cookieString)=>{
    if(cookieString==undefined||cookieString===""){
        return [];
    }
    let cookieCartTempArr=cookieString.split("_");
    let returnCartArr=Array(cookieCartTempArr.length);
    for(let i=0;i<cookieCartTempArr.length;i++){
        let tempCartElement=cookieCartTempArr[i].split("-");
        returnCartArr[i]={
            "productID":Number.parseInt(tempCartElement[0]),
            "productQuantity":Number.parseInt(tempCartElement[1])
        };
    }
    returnCartArr.sort((a,b)=>{
        if(Number.parseInt(a["productID"])<Number.parseInt(b["productID"])){
            return -1;
        }
        if(Number.parseInt(a["productID"])>Number.parseInt(b["productID"])){
            return 1;
        }
        return 0;
    });
    return returnCartArr;
}
