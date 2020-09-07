let prepareReviewInfo=require("../../utilities/prepareReviewInfo.js");
let addNewReview=require("../../../application/productsReviewsUseCases/addNewReview.js");
let ProductReviewsRepository=require("../../dataAccess/productReviewsDataAccess/productReviewsRepository.js");
module.exports=async(req,res)=>{
  let preparedReviewInfo=prepareReviewInfo(req.query);
  preparedReviewInfo["id"]=req.params["goodId"]%10000;
  let userId=req.session["userInfo"]["user_id"];
  let productReviewsRepository=new ProductReviewsRepository();
  let addingReviewResponse=await addNewReview(preparedReviewInfo,userId,productReviewsRepository);
  res.end(JSON.stringify(addingReviewResponse));
}