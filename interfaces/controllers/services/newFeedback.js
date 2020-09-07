let prepareReviewInfo=require("../../utilities/prepareReviewInfo.js");
let addNewReview=require("../../../application/servicesReviewsUseCases/addNewReview.js");
let ServiceReviewsRepository=require("../../dataAccess/serviceReviewsDataAccess/serviceReviewsRepository.js");
module.exports=async(req,res)=>{
  let preparedReviewInfo=prepareReviewInfo(req.query);
  preparedReviewInfo["id"]=req.params["serviceId"]%10000;
  let userId=req.session["userInfo"]["user_id"];
  let serviceReviewsRepository=new ServiceReviewsRepository();
  let addingReviewResponse=await addNewReview(preparedReviewInfo,userId,serviceReviewsRepository);
  res.end(JSON.stringify(addingReviewResponse));
}