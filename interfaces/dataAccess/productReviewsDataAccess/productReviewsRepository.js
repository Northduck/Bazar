"use strict";
const container=require("../../../infrastructure/infrastructureContainer.js");
let {database,queryBuilder}=container.cradle;
module.exports=class ProductReviewsRepository{
    async addNewReview(reviewContent,userId){
        let addingNewReviewQuery=queryBuilder.insert({
            "product_review_id":"default",
            "product_review_rating":reviewContent["rating"],
            "product_review_text":reviewContent["text"],
            "product_review_date":"NOW()",
            "product_id":reviewContent["id"],
            "user_id":userId,
            "product_user_pseudonym":reviewContent["signature"]
        })
        .into("products_reviews")
        .toString().replace(/'default'/g,"default");
        let addingNewReviewResult;
        try {
            addingNewReviewResult=(await database.query(addingNewReviewQuery)).rows;
        } catch (error) {
            console.log(error);
        }
    }

    async recalculateProductRating(productId){
        let productReviewsQuery=queryBuilder.select("product_review_id","product_review_rating")
        .from("products_reviews")
        .where("product_id",productId)
        .toString();
        let productReviewsResult;
        try {
            productReviewsResult=(await database.query(productReviewsQuery)).rows;
        } catch (error) {
            console.log(error);
        }
        let productRatingNumerator=productReviewsResult.reduce((numeratorSumm,reviewContent)=>{
            numeratorSumm+=Number.parseInt(reviewContent["product_review_rating"]);
            return numeratorSumm;
        },0);
        let productRating=productRatingNumerator/productReviewsResult.length;
        productRating=productRating.toFixed(1);
        let updateProductRating=queryBuilder("products")
        .update("product_rating",productRating)
        .where("product_id",productId)
        .toString();
        let updateProductResult;
        try {
            updateProductResult=(await database.query(updateProductRating)).rows;
        } catch (error) {
            console.log(error);
        }
    }
};