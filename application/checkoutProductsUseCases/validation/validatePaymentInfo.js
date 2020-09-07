"use strict";
module.exports=(paymentInfo)=>{
    let response={"responseCode":1,"problems":[]};
    if(paymentInfo["paymentMethod"]!=="inStore"&&paymentInfo["paymentMethod"]!=="online"){
        response.responseCode=-1;
        response.problems.push({"paymentInfo":"paymentMethod"});
    }
    return response;
}