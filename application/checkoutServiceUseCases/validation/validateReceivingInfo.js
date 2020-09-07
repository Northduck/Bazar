"use strict";
module.exports=(receivingInfo)=>{
    let response={"responseCode":1,"problems":[]};
    if(receivingInfo["receivingMethod"]!=="shipment"){
        response["responseCode"]=-1;
        response.problems.push("receivingMethod");
        return response;
    }
    let cityRegExp=/[^a-zA-Z,. -_\dа-яА-Я]/;
    let streetRegExp=/[^a-zA-Z,. -_\dа-яА-Я]/;
    let houseNumbRegExp=/[^\d\/]/;
    let apartmentNumbRegExp=/[^\d]/;
    if(receivingInfo["city"]==undefined||receivingInfo["city"].match(cityRegExp)!=null){
        response["responseCode"]=-1;
        response.problems.push({"shipment":"city"});
    }
    if(receivingInfo["street"]==undefined||receivingInfo["street"].match(streetRegExp)!=null){
        response["responseCode"]=-1;
        response.problems.push({"shipment":"street"});
    }
    if(receivingInfo["house"]==undefined||receivingInfo["house"].match(houseNumbRegExp)!=null){
        response["responseCode"]=-1;
        response.problems.push({"shipment":"house"});
    }
    if(receivingInfo["apartment"]!=undefined&&receivingInfo["apartment"].match(apartmentNumbRegExp)!=null){
        response["responseCode"]=-1;
        response.problems.push({"shipment":"apartment"});
    }
    return response;
}