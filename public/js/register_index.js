import {getCookie} from "./modules/cookie_methods.js";
const errorExplanations={
    "login":{
        "error-1":{
            "ru":"Введенный логин уже используется",
            "en":"There is user with this login"
        },
        "error-3":{
            "ru":"Invalid characters entered",
            "en":"Введены недопустимые символы"
        }
    },
    "email":{
        "error-1":{
            "ru":"Введенный email уже используется",
            "en":"There is user with this email"
        },
        "error-3":{
            "ru":"Введите корректный email",
            "en":"Please enter a valid email"
        }
    },
    "phonenumber":{
        "error-3":{
            "ru":"Введите корректный телефонный номер",
            "en":"Please enter a valid phone number"
        }
    },
    "fullname":{
        "error-3":{
            "ru":"Введите ваше имя корректно",
            "en":"Please enter your name correctly"
        }
    }
};
function sendErrorText(input,errorParam,locale) {
    let targetItem=document.querySelector(`.Register-${input}-section`);
    let targetErrorSpan = document.createElement("span");
    targetErrorSpan.classList.add("Register-error");
    targetErrorSpan.append(errorExplanations[input][errorParam][locale]);
    targetItem.append(targetErrorSpan);
}
function handleNewRegisterResponse(response){
    let userLocale=getCookie("language");
    if(response.code===1){
        let formWrapper=document.querySelector(".Register-form-wrappper");
        formWrapper.innerHTML="";
        let okIcon = document.createElement("i");
        let okPar= document.createElement("p");
        let okLink=document.createElement("a");
        
        okLink.href="/";
        okLink.classList.add("Register-return-link");
        okIcon.classList.add("Register-ok-icon","far","fa-check-circle");
        okPar.classList.add("Register-ok-par");
        
        switch (userLocale) {
            case "en":
                okLink.append("Return to main page");
                okPar.append("Thank you for registration");
                break;
            case "ru":
                okLink.append("Вернутся на главную страницу");
                okPar.append("Спасибо за регистрацию!");                
                break;                    
        }
        formWrapper.classList.add("Flex-cross-centerer");
        formWrapper.append(okIcon);
        formWrapper.append(okPar);
        formWrapper.append(okLink);
        return;
    }
    if(response.code===-1||response.code===-3){
        let errorParam=`error-${response.code}`;
        for(let i=0;i<response.problems;i++){
            switch (response.problems[i]) {
                case "login":
                    sendErrorText("login",errorParam,userLocale);
                    break;
                case "email":
                    sendErrorText("email",errorParam,userLocale);
                    break;
                case "password":
                    checkInputs(registerPassword,regExpPassword,false);
                    break;
                case "phonenumber":
                    sendErrorText("phonenumber",errorParam,userLocale);
                    break;
                case "fullname":
                    sendErrorText("fullname",errorParam,userLocale);
                    break;
                case "birthdate":
                    checkInputs(registerbirthDate,birthDateRegExp,true);
                    break;
                default:
                    break;
            }
        }
    }
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
let registerPassword=document.querySelector(".Register-password-input");
let registerForm=document.querySelector(".Register-form");
let registerLogin=document.querySelector(".Register-login-input");
let registerEmail=document.querySelector(".Register-email-input");
let registerPhoneNumber=document.querySelector(".Register-phonenumber-input");
let registerFullname=document.querySelector(".Register-name-input");
let registerbirthDate=document.querySelector(".Register-birthdate-input");
let registerAddress=document.querySelector(".Register-address-input");
let regExpPassword=[/[^]{7,}/,/[0-9]{1,}/,/[A-ZА-Я]{1,}/];
let loginRegExp=[/[\W]+/];
let emailRegExp=[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/];
let phoneNumberRegExp=[/\+[\d]{11,16}/];
let nameRegExp=[/[a-zA-zа-яА-Я ,.'-]+$/i];
let birthDateRegExp=[/[\d]{4,4}-[\d]{2,2}-[\d]{2,2}/];
let addressRegExp=[/[a-zA-Z,.\dа-яА-Я]/];

checkInputs(registerPassword,regExpPassword,false);
checkInputs(registerLogin,loginRegExp,false,true);
checkInputs(registerEmail,emailRegExp,false);
checkInputs(registerPhoneNumber,phoneNumberRegExp,true);
checkInputs(registerFullname,nameRegExp,true);
checkInputs(registerbirthDate,birthDateRegExp,true);
checkInputs(registerAddress,addressRegExp,true);
registerForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    if(registerPassword.getAttribute("data-is-good-field")==="yes"&&registerLogin.getAttribute("data-is-good-field")==="yes"&&registerEmail.getAttribute("data-is-good-field")==="yes"){
        let data=new FormData(registerForm);
        let finalUrl=window.location.href;
        finalUrl+=serialize(data);
        fetch(finalUrl,{
            method:"POST"
        })
        .then(response=>{ 
            return response.json();
        })
        .then(data=>{
            console.log(data);
            handleNewRegisterResponse(data);
        })
        .catch(error => console.error(error));
    }
});



var phoneInput = document.querySelector(".Register-phonenumber-input");

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
