import {phoneNumberEntering} from "./modules/phone_number_entering.js";
function makeSliderWithNavListeners(navElements, content, toggleNavClass, toggleContentClass, currentEl){
    if(!currentEl){
        currentEl=0;
    }
    navElements.forEach((navEl, i) => {
        navEl.addEventListener("click",event=>{
            console.log("content",content,"i",i);
            if(i>=content.length){
                return;
            }
            event.preventDefault();
            content[currentEl].classList.add(toggleContentClass);
            content[i].classList.remove(toggleContentClass);
            navElements[currentEl].classList.remove(toggleNavClass);
            navElements[i].classList.add(toggleNavClass);  
            currentEl=i;  
        });
    });
}
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
let accountTabsNav=document.querySelectorAll(".Account-nav li button");
let accountTabsContent=document.querySelectorAll(".Account-content>li");
let accountOrdersNav=document.querySelectorAll(".Account-orders-type-el button");
let accountOrdersContent=document.querySelectorAll(".Account-orders-type-content>div");
let accountReviewsNav=document.querySelectorAll(".Account-review-type-el button");
let accountReviewsContent=document.querySelectorAll(".Account-review-type-content>div");
let accountRevealProductsBtn=document.querySelectorAll(".Orders-history-order-el .Order-products-open-btn");
let accountOrderProducts=document.querySelectorAll(".Orders-history-order-products-list");
makeSliderWithNavListeners(accountTabsNav,accountTabsContent,"Current-account-tab","visually-hidden",0);
makeSliderWithNavListeners(accountOrdersNav,accountOrdersContent,"Current-account-tab","visually-hidden",0);
makeSliderWithNavListeners(accountReviewsNav,accountReviewsContent,"Current-account-tab","visually-hidden",0);
accountRevealProductsBtn.forEach((el,i)=>{
    el.addEventListener("click",(event)=>{
        event.preventDefault()
        accountOrderProducts[i].classList.toggle("visually-hidden");
    });
});
function closeAllOtherChanges(exceptIndex) {
    for (let i = 0; i < changeUserInfoBtns.length; i++) {
        if(i!==exceptIndex){
            closeChange(i);
        }
    }
}

let userLogin=document.querySelector(".Account-login-input");
let userEmail=document.querySelector(".Account-email-input");
let userPhoneNumber=document.querySelector(".Account-phonenumber-input");
phoneNumberEntering(userPhoneNumber);
let userFullname=document.querySelector(".Account-name-input");
let userbirthDate=document.querySelector(".Account-birthdate-input");
let userAddress=document.querySelector(".Account-address-input");
let regExpPassword=[/[^]{7,}/,/[0-9]{1,}/,/[A-ZА-Я]{1,}/];
let loginRegExp=[/[\W]+/];
let emailRegExp=[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/];
let phoneNumberRegExp=[/\+[\d]{11,16}/];
let nameRegExp=[/[a-zA-zа-яА-Я ,.'-]+$/i];
let birthDateRegExp=[/[\d]{4,4}-[\d]{2,2}-[\d]{2,2}/];
let addressRegExp=[/[a-zA-Z,.\dа-яА-Я]/];

checkInputs(userLogin,loginRegExp,false,true);
checkInputs(userEmail,emailRegExp,false);
checkInputs(userPhoneNumber,phoneNumberRegExp,true);
checkInputs(userFullname,nameRegExp,true);
checkInputs(userbirthDate,birthDateRegExp,true);
checkInputs(userAddress,addressRegExp,true);

let changeUserInfoBtns=document.querySelectorAll(".User-change-info-btn");
let cancelUserInfoChangingBtns=document.querySelectorAll(".User-cancel-btn");
let confirmUserInfoChangingBtns=document.querySelectorAll(".User-confirm-btn");
let userInfoPar=document.querySelectorAll(".User-info-par");
let userInfoInputsWrappers=document.querySelectorAll(".User-info-input-wrapper");
let userInfoInputs=document.querySelectorAll(".User-info-input-wrapper input");
function closeChange(index) {
    changeUserInfoBtns[index].classList.remove("visually-hidden");
    cancelUserInfoChangingBtns[index].classList.add("visually-hidden");
    confirmUserInfoChangingBtns[index].classList.add("visually-hidden");
    userInfoPar[index].classList.remove("visually-hidden");
    userInfoInputsWrappers[index].classList.add("visually-hidden");
}
function openChange(index) {
    changeUserInfoBtns[index].classList.add("visually-hidden");
    cancelUserInfoChangingBtns[index].classList.remove("visually-hidden");
    confirmUserInfoChangingBtns[index].classList.remove("visually-hidden");
    userInfoPar[index].classList.add("visually-hidden");
    userInfoInputsWrappers[index].classList.remove("visually-hidden");
}
changeUserInfoBtns.forEach((changeBtn,i)=>{
    changeBtn.addEventListener("click",(event)=>{
        event.preventDefault();
        closeAllOtherChanges(i);
        openChange(i);
    });
});
cancelUserInfoChangingBtns.forEach((cancelBtn,i)=>{
    cancelBtn.addEventListener("click",(event)=>{
        event.preventDefault();
        closeAllOtherChanges(-1);
    });
});
confirmUserInfoChangingBtns.forEach((confirmBtn,i)=>{
    confirmBtn.addEventListener("click",async(event)=>{
        event.preventDefault();
        let changeEvent=new Event("change");
        userInfoInputs[i].dispatchEvent(changeEvent);
        if(userInfoInputs[i].getAttribute("data-is-good-field")!=="yes"){
            return;
        }
        confirmBtn.innerHTML=`<i class="fas fa-spinner"></i>`;
        let changeInfoUrl=`/change_user_info?${userInfoInputs[i].name}=${userInfoInputs[i].value}`;
        let serverResponse=await fetch(changeInfoUrl,{"method":"POST"});
        let serverResponseContent=await serverResponse.json();
        switch (serverResponseContent["code"]) {
            case 1:
                userInfoPar[i].innerText=userInfoInputs[i].value;
                closeChange(i);
                break;
            case -1:
                userInfoInputs[i].classList.add("Bad-input");
                userInfoInputs[i].classList.remove("Good-input");
                userInfoInputs[i].setAttribute("data-is-good-field","no");
                break;
            default:
                break;
        }
        confirmBtn.innerHTML=`<i class="fas fa-check"></i>`;
    });
});