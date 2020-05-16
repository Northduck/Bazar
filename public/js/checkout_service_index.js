"use strict";
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
function checkSecondStage(){
    let neededInputs=document.querySelectorAll(".Contact-information-form label.Input-needed ~ input");
    let formFlag=true;
    for (let i = 0; i < neededInputs.length; i++) {
        let regExp=new RegExp(neededInputs[i].getAttribute("data-reg-exp"));
        console.log(regExp);
        console.log(neededInputs[i].value);
        console.log(neededInputs[i].value.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/));
        if(neededInputs[i].value.match(regExp)){
            neededInputs[i].classList.remove("Bad-input");
            neededInputs[i].classList.add("Good-input");
        }else{
            neededInputs[i].classList.add("Bad-input");
            formFlag=false;
        }
    }
    return formFlag;
},
function checkThirdStage(){
    return true;
}
];
let stagesForm=[
    ()=>{
        return document.querySelector(".Contact-information-form");
    },
    ()=>{
        return document.querySelector(".Payment-method-form");
    }
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
        let chekoutContainer=document.querySelector(".Checkout-section");
        chekoutContainer.innerHTML=`<div class="Fulfillment-final"><i class='Register-ok-icon far fa-check-circle'></i>
        <p class='Register-ok-par'>Thank you for purchase! Your order number: №${response["orderNumber"]}</p>
        <a href='/' class='Register-return-link'>Return to main page</a></div>`;
    }
}
async function changeStageForward(currentStage) {
    if(stagesChekingHandlers[currentStage]()===true){
        let serverResponse=await sendStageInfoToServer(currentStage,"forward");
        handleResponse(serverResponse);
        if(serverResponse["returnCode"]===1){
            changeLayoutStageForward(currentStage);
        }
    }
}
async function changeStageBackward(currentStage) {
        let serverResponse=await sendStageInfoToServer(currentStage-1,"backward");
        handleResponse(serverResponse);
        if(serverResponse["returnCode"]===1){
            changeLayoutStageBackward(currentStage);
        }
}
let stagesHead=document.querySelectorAll(".Fulfillment-stages-head > li");
let stagesContentList=document.querySelector(".Fulfillment-stages");
let stagesLength=stagesContentList.children.length;
let stagesContent=stagesContentList.children;
let stagesControl=document.querySelectorAll(".Fulfillment-stages-control-btns button");
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
