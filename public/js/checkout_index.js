"use strict";
import {getCookie, setCookie, updateProductCookie, replaceCookie} from "./modules/cookie_methods.js";
function serialize(formData){
    let url="?"
    for (var [key, value] of formData.entries()) { 
      key=key.replace(/\&/g,"%26");
      url=url+key+"="+encodeURIComponent(value)+"&";
    }  
    url=url.replace(/ /g,"%20");
    url=url.substring(0,url.length-1);
    return url;
  }
function changeLayoutStageBackward(currentStage){
    stagesContent[currentStage].classList.add("visually-hidden");
    stagesContent[currentStage-1].classList.remove("visually-hidden");
    stagesHead[currentStage].classList.remove("Current-stage-head");
    stagesHead[currentStage-1].classList.add("Current-stage-head");
    stagesHead[currentStage-1].classList.remove("Ready-stage-head");
    stagesContentList.setAttribute("data-current-stage",(currentStage-1));
}
function changeLayoutStageForward(currentStage){
    stagesContent[currentStage].classList.add("visually-hidden");
    stagesContent[currentStage+1].classList.remove("visually-hidden");    
    stagesHead[currentStage].classList.remove("Current-stage-head");
    stagesHead[currentStage].classList.add("Ready-stage-head");
    stagesHead[currentStage+1].classList.add("Current-stage-head");
    stagesContentList.setAttribute("data-current-stage",(currentStage+1));
}
let stageHandlers=[];
let stagesChekingHandlers=[
function checkFirstStage() {
    if(stagesContent[0].getAttribute("data-receiving-method")==="pickup"){
        if(document.querySelectorAll(".Receiving-pickup-form input:checked").length!==0){
            return true;
        }else{
            return false;
        }
    }else if(stagesContent[0].getAttribute("data-receiving-method")==="shipment"){
        let shipmentInputs=document.querySelectorAll(".Shipment-form input");
        let formFlag=true;
        let inputChangeEvent=new Event("change");
        for (let i = 0; i < shipmentInputs.length; i++) {
            shipmentInputs[i].dispatchEvent(inputChangeEvent);
            let dataCorrection=shipmentInputs[i].getAttribute("data-is-good-field");
            if(dataCorrection==="no"){
                formFlag=false;
                break;
            }
        }
        return formFlag;
    }
},
function checkSecondStage(){
    let contactInfoInputs=document.querySelectorAll(".Fulfillment-contact-information-form input");
    let formFlag=true;
    let inputChangeEvent=new Event("change");
    for (let i = 0; i < contactInfoInputs.length; i++) {
        contactInfoInputs[i].dispatchEvent(inputChangeEvent);
        let dataCorrection=contactInfoInputs[i].getAttribute("data-is-good-field");
        if(dataCorrection==="no"){
            formFlag=false;
            break;
        }
    }
    
    return formFlag;
},
function checkThirdStage(){
    if(document.querySelectorAll(".Payment-method-form input:checked").length!==0){
        return true;
    }else{
        return false;
    }
}
];
let stagesForm=[
    ()=>{
        if(document.querySelector(".Fulfillment-receiving-method").getAttribute("data-receiving-method")==="pickup"){
            return document.querySelector(".Receiving-pickup-form");
        }else{
            return document.querySelector(".Receiving-shipment-form");
        }
    },
    ()=>{
        return document.querySelector(".Contact-information-form");
    },
    ()=>{
        return document.querySelector(".Payment-method-form");
    },
];
async function sendStageInfoToServer(currentStage, changeDirection) {
    let stageUrl=window.location.href;
    console.log(stagesForm[currentStage]());
    stageUrl+=serialize(new FormData(stagesForm[currentStage]()));
    if(changeDirection==="forward"){
        stageUrl+="&stageDirection=forward";
    }else{
        if(changeDirection==="backward"){
            stageUrl+="&stageDirection=backward";
        }
    }
    let stageResponse=await fetch(stageUrl,{
        method:"POST"
    });
    return await stageResponse.json();
}
function handleResponse(response) {
    if(response["currentStage"]===3){
        let locale=getCookie("language")||"end";
        let chekoutContainer=document.querySelector(".Checkout-section");
        switch (locale) {
            case "end":
                chekoutContainer.innerHTML=`<div class="Fulfillment-final"><i class='Register-ok-icon far fa-check-circle'></i>
                <p class='Register-ok-par'>Thank you for purchase! Your order number: №:  ${response["orderNumber"]}</p>
                <a href='/' class='Register-return-link'>Return to main page</a></div>`;
                break;
            case "ru":
                chekoutContainer.innerHTML=`<div class="Fulfillment-final"><i class='Register-ok-icon far fa-check-circle'></i>
                <p class='Register-ok-par'>Спасибо за покупку! Номер вашего заказа: №:  ${response["orderNumber"]}</p>
                <a href='/' class='Register-return-link'>Вернуться на главную страницу</a></div>`;
                break;
            default:
                break;
        }
        
    }
}
async function changeStageForward(currentStage) {
    if(stagesChekingHandlers[currentStage]()===true){
        let serverResponse=await sendStageInfoToServer(currentStage,"forward");
        handleResponse(serverResponse);
        if(serverResponse["responseCode"]===1&&serverResponse["currentStage"]!==3){
            changeLayoutStageForward(currentStage);
        }
    }
}
async function changeStageBackward(currentStage) {
        let serverResponse=await sendStageInfoToServer(currentStage-1,"backward");
        handleResponse(serverResponse);
        if(serverResponse["responseCode"]===1&&serverResponse["currentStage"]!==0){
            changeLayoutStageBackward(currentStage);
        }
}
let stagesHead=document.querySelectorAll(".Fulfillment-stages-head > li");
let stagesContentList=document.querySelector(".Fulfillment-stages");
let stagesLength=stagesContentList.children.length;
let stagesContent=stagesContentList.children;
let stagesControl=document.querySelectorAll(".Fulfillment-stages-control-btns button");
let receivingMethods=document.querySelectorAll(".Receiving-method-content > li");
let receivingMethodsBtns=document.querySelectorAll(".Receiving-method-head button");
(()=>{
    let currentEl=0;
    receivingMethodsBtns.forEach((navEl, i) => {
        navEl.addEventListener("click",event=>{
            event.preventDefault();
            if(currentEl===i){
                return;
            }
            if(i===0){
                stagesContent[0].setAttribute("data-receiving-method","pickup");
            }else{
                stagesContent[0].setAttribute("data-receiving-method","shipment");
            }
            receivingMethodsBtns[i].classList.add("Current-receiving-method-btn");
            receivingMethodsBtns[currentEl].classList.remove("Current-receiving-method-btn");
            receivingMethods[i].classList.remove("visually-hidden");
            receivingMethods[currentEl].classList.add("visually-hidden");  
            currentEl=i;  
        });
    });
})()

stagesControl.forEach((val,i)=>{
    val.addEventListener("click",(event)=>{
        event.preventDefault();
        let currentStage=(Number.parseInt(stagesContentList.getAttribute("data-current-stage")));
        if(i===0){
            if(currentStage!==0){
                changeStageBackward(currentStage);
            }
        }else{
            if(currentStage!==stagesLength){
                changeStageForward(currentStage);
            }
        }
    });
});
let receivePickupVariantsList=document.querySelector(".Pickup-place-list");
let receivePickupForm=document.querySelector(".Receiving-pickup-form");
let receivePickupSelectedContent=document.querySelector(".Selected-pickup-place .Pickup-content");
let receivePickupPlaces=receivePickupForm.querySelectorAll(".Pickup-place-element");
let receivePickupChoosePlace=receivePickupForm.querySelectorAll(".Pickup-place-choose-btn");
receivePickupChoosePlace.forEach((val,i)=>{
    val.addEventListener("click",(event)=>{
        event.preventDefault();
        let receivePickupPlaceInput=receivePickupPlaces[i].querySelector("input[type=radio]");
        receivePickupSelectedContent.innerHTML=receivePickupPlaces[i].querySelector(".Pickup-content").innerHTML;
        receivePickupPlaces[i].querySelector(".Pickup-radio").classList.add("Selected-pickup-radio");
        let previousElementNumb=Number.parseInt(receivePickupForm.getAttribute("data-current-element"));
        receivePickupPlaces[previousElementNumb-1].querySelector(".Pickup-radio").classList.remove("Selected-pickup-radio");
        receivePickupPlaces[previousElementNumb-1].querySelector("input[type=radio]").checked=false;
        receivePickupPlaceInput.checked=true;
        receivePickupForm.setAttribute("data-current-element",i+1);
        receivePickupVariantsList.classList.toggle("visually-hidden");
    });
});
document.querySelector(".Selected-pickup-change-btn").addEventListener("click",(event)=>{
    event.preventDefault();
    receivePickupVariantsList.classList.toggle("visually-hidden");
});
let paymentMethods=document.querySelectorAll(".Fulfillment-payment-method-list>li");
(()=>{
    let defaultNumb=0;
    let paymentRadioSpan=document.querySelectorAll(".Fulfillment-payment-method-list .Element-radio-btn-span");
    let paymentRadioBtn=document.querySelectorAll(".Fulfillment-payment-method-list .Payment-radio-btn");
    paymentMethods.forEach((val,i)=>{
        val.addEventListener("click",(event)=>{
            event.preventDefault();
            if(defaultNumb===i){
                return;
            }
            paymentRadioSpan[i].classList.add("Selected-Element-radio-btn-span");
            paymentRadioSpan[defaultNumb].classList.remove("Selected-Element-radio-btn-span");
            paymentRadioBtn[i].checked=true;
            paymentRadioBtn[defaultNumb].checked=false;
            defaultNumb=i;
        });
    });
}
)();

function checkInputs(input,regExpMas,isOptional,isReverse){
    input.addEventListener("change",event=>{
        let regExpRes=regExpMas.every((regExpElement)=>{
            return input.value.match(regExpElement);
        });
        if(isReverse===true){
            regExpRes=!regExpRes;
        }
        if(regExpRes===true||(isOptional===true&&input.value===""))
        {
            input.setAttribute("data-is-good-field","yes");
            input.classList.add("Good-input");
            input.classList.remove("Bad-input");
        }else{
            input.setAttribute("data-is-good-field","no");
            input.classList.add("Bad-input");
            input.classList.remove("Good-input");
        }
    });
}
let shipmentCityField=document.querySelector(".Shipment-form-city");
let shipmentStreetField=document.querySelector(".Shipment-form-street");
let shipmentHouseField=document.querySelector(".Shipment-form-house");
let shipmentApartmentField=document.querySelector(".Shipment-form-apartment");
let cityRegExp=[/[^a-zA-Z,. -_\dа-яА-Я]/];
let streetRegExp=[/[^a-zA-Z,. -_\dа-яА-Я]/];
let houseNumbRegExp=[/[^\d\/]/];
let apartmentNumbRegExp=[/[^\d]/];
checkInputs(shipmentCityField,cityRegExp,false,true);
checkInputs(shipmentStreetField,streetRegExp,false,true);
checkInputs(shipmentHouseField,houseNumbRegExp,false,true);
checkInputs(shipmentApartmentField,apartmentNumbRegExp,true,true);

let contactInformationPhone=document.querySelector(".Fulfillment-contact-information-phone-number");
let contactInformationEmail=document.querySelector(".Fulfillment-contact-information-email");
let contactInformationName=document.querySelector(".Fulfillment-contact-information-name");
let emailRegExp=[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/];
let phoneNumberRegExp=[/\+[\d]{11,16}/];
let nameRegExp=[/[^a-zA-zа-яА-Я ,.'-]+$/i];
checkInputs(contactInformationPhone,phoneNumberRegExp,false,false);
checkInputs(contactInformationEmail,emailRegExp,false,false);
checkInputs(contactInformationName,nameRegExp,true,true);

var phoneInput = document.querySelector(".Fulfillment-contact-information-phone-number");

phoneInput.addEventListener('keypress', e => {
    if(!/\d/.test(e.key)){
        e.preventDefault();
    }
});

phoneInput.addEventListener('keypress', function(event) {
    var key = event.keyCode || event.charCode;
    if( key === 8 ||key===46){
        return;
    }
    let newValue=phoneInput.value.replace(/[^\d]/g,"");
    var curLen = phoneInput.value.length;
    if (curLen >=16){
        event.preventDefault();
        phoneInput.value = phoneInput.value.substring(0, 16);
    }
});
phoneInput.addEventListener("keyup",(event)=>{
    let newValue=phoneInput.value.replace(/[^\d]/g,"");
    phoneInput.value="+"+newValue;
});
