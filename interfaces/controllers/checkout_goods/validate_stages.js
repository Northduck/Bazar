const checkoutStages=[
    "receivingMethod","contactInformation","paymentMethod"
];
module.exports=async(req,res,next)=>{
    let stageIndex=checkoutStages.findIndex((value)=>{
        if(req.query.stageName===value){
            return true;
        }
    });
    if(stageIndex!==-1){
        next();
    }else{
        let wrongStageError=new Error("Wrong stage");
        wrongStageError.statusCode=404;
        wrongStageError.isRedirecting=true;
        next(wrongStageError);
    }
}