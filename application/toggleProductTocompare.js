"use strict";
module.exports=(compareCategoryId, compareProductId, targetObj)=>{
    if(targetObj===undefined){
        targetObj=[];
    }
    let existingCategoryIndex=targetObj.findIndex((arrayEl)=>{
        if(arrayEl["compareCategoryId"]===compareCategoryId){
            return true;
        }
    });
    if(existingCategoryIndex!==-1){
        let existingProductIndex=targetObj[existingCategoryIndex]["compareProducts"].findIndex((arrayEl)=>{
            if(arrayEl===compareProductId){
                return true;
            }
        });
        if(existingProductIndex===-1){
            targetObj[existingCategoryIndex]["compareProducts"].push(compareProductId);
        }else{
            targetObj[existingCategoryIndex]["compareProducts"].splice(existingProductIndex,1);
            if(targetObj[existingCategoryIndex]["compareProducts"].length===0){
                targetObj.splice(existingCategoryIndex,1);
            }
        }
    }else{
        targetObj.push(
            {
                "compareCategoryId":compareCategoryId,
                "compareProducts": [compareProductId]
            }
        );
    }
    return targetObj;
}