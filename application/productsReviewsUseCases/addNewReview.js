"use strict";
module.exports=async(reviewInfo,userId,productReviewsRepository)=>{
    let response={
        "code":1
    };
    if(reviewInfo["signature"]==undefined||reviewInfo["signature"]===""){
        reviewInfo["signature"]="anonymous";
    }
    let addingNewReviewResponse;
    try {
        addingNewReviewResponse=await productReviewsRepository.addNewReview(reviewInfo,userId);
    } catch (error) {
        console.log(error);
        response["code"]=-1;
        return response;
    }
    let updateNewReviewResponse;
    try {
        updateNewReviewResponse=await productReviewsRepository.recalculateProductRating(reviewInfo["id"]);
    } catch (error) {
        console.log(error);
        response["code"]=-1;
        return response;
    }
    return response;
}