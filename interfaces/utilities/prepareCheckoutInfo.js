let preparationCheckoutFunctions={
    'receivingMethod':function (req) {
        let checkoutReceivingInfo;
        if(req.query.receivingMethod==="pickup"){
            checkoutReceivingInfo={
                receivingMethod:"pickup", 
                pickupPlace:req.query.pickupPlace
            };
        }else{
            if(req.query.receivingMethod==="shipment"){
                checkoutReceivingInfo={
                    receivingMethod:"shipment", 
                    city:req.query["Shipment-city"],
                    street:req.query["Shipment-street"],
                    house:req.query["Shipment-house"],
                    apartment:req.query["Shipment-apartment"]||""
                };
            }
        }
        if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
            checkoutReceivingInfo.currentStage=1;
        }else{
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                checkoutReceivingInfo.currentStage=0;
            }
        }
        return checkoutReceivingInfo;
    },
    'contactInformation':function contactInformationHandler(req) {
        let contactInfo={
            phoneNumber:req.query["Fulfillment-phone-number"],
            email:req.query["Fulfillment-email"],
            name:req.query["Fulfillment-name"],
            userID:Number.parseInt(req.session["userInfo"]["user_id"])
        };
        if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
            contactInfo.currentStage=2;
        }else{
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                contactInfo.currentStage=1;
            }
        }
        return contactInfo;
    },
    'paymentMethod':function paymentMethodHandler(req){
        let paymentMethod={"paymentMethod":req.query["Payment-method"]};
        if(req.query.stageDirection!==undefined&&req.query.stageDirection==="forward"){
            paymentMethod.currentStage=3;
        }else{
            if(req.query.stageDirection!==undefined&&req.query.stageDirection==="backward"){
                paymentMethod.currentStage=2;
            }
        }
        return paymentMethod;
    }
};
module.exports=preparationCheckoutFunctions;