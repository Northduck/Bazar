"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
let {database,queryBuilder}=container.cradle;
module.exports=class ServiceReviewsRepository{
    async addNewReview(reviewContent,userId){
        let addingNewReviewQuery=queryBuilder.insert({
            "service_review_id":"default",
            "service_review_rating":reviewContent["rating"],
            "service_review_text":reviewContent["text"],
            "service_review_date":"NOW()",
            "service_id":reviewContent["id"],
            "user_id":userId,
            "service_user_pseudonym":reviewContent["signature"]
        })
        .into("services_reviews")
        .toString().replace(/'default'/g,"default");
        let addingNewReviewResult;
        try {
            addingNewReviewResult=(await database.query(addingNewReviewQuery)).rows;
        } catch (error) {
            console.log(error);
        }
    }

    async recalculateServiceRating(serviceId){
        let serviceReviewsQuery=queryBuilder.select("service_review_id","service_review_rating")
        .from("services_reviews")
        .where("service_id",serviceId)
        .toString();
        let serviceReviewsResult;
        try {
            serviceReviewsResult=(await database.query(serviceReviewsQuery)).rows;
        } catch (error) {
            console.log(error);
        }
        let serviceRatingNumerator=serviceReviewsResult.reduce((numeratorSumm,reviewContent)=>{
            numeratorSumm+=Number.parseInt(reviewContent["service_review_rating"]);
            return numeratorSumm;
        },0);
        let serviceRating=serviceRatingNumerator/serviceReviewsResult.length;
        serviceRating=serviceRating.toFixed(1);
        let updateServiceRating=queryBuilder("services")
        .update("service_rating",serviceRating)
        .where("service_id",serviceId)
        .toString();
        let updateServiceResult;
        try {
            updateServiceResult=(await database.query(updateServiceRating)).rows;
        } catch (error) {
            console.log(error);
        }
    }
};