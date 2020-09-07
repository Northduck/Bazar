import {getCookie} from "./modules/cookie_methods.js";
const errorExplanations={
    "login":{
        "ru":"Invalid characters entered",
        "en":"Введены недопустимые символы"
    },
    "password":{
        "ru":"Password shouldn't be empty",
        "en":"Пароль не может быть пустым"
    }
}
function sendErrorText(input,locale) {
    let targetItem=document.querySelector(`.Login-${input}-section`);
    let targetErrorSpan = document.createElement("span");
    targetErrorSpan.classList.add("Register-error");
    targetErrorSpan.append(errorExplanations[input][locale]);
    targetItem.append(targetErrorSpan);
}
function handleNewRegisterResponse(data){
    let userLocale=getCookie("language");
    switch (data.code) {
        case -1:
            if(!document.querySelector(".Login-wrong-values")){
                let errorText=document.createElement("span");
                errorText.classList.add("Login-wrong-values");
                switch (userLocale) {
                    case "ru":
                        errorText.append("Вы ввели неправильный логин (email) или пароль");
                        break;
                    case "en":
                        errorText.append("You entered wrong login (email) or password");
                        break;
                    default:
                        break;
                }
                loginForm.prepend(errorText);
            }
            passwordInput.value="";
        break;
        case -3:
            for(let i=0;i<data.problems;i++){
                switch (data.problems[i]) {
                    case "loginemail":
                        sendErrorText("login",userLocale);
                        break;
                    case "password":
                        sendErrorText("password",userLocale);
                        break;
                }
            }
        case 1:
            window.location.replace("/");
        break;    
        default:
            break;
    }
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
function checkInputs(input,regExpMas,isOptional,reverse){
    input.addEventListener("change",event=>{
        let regExpRes=regExpMas.some((regExpElement,i)=>{
            if(reverse!==undefined&&reverse[i]===true){
                return !input.value.match(regExpElement);
            }else{
                return input.value.match(regExpElement);
            }
        });
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
let regExpPassword=[/[^]+/];
let loginRegExp=[/[\W]+/,/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/];
let loginInput=document.querySelector(".Login-login-email-input");
let loginForm=document.querySelector(".Login-form");
let passwordInput=loginForm.querySelector(".Login-password-input");
checkInputs(passwordInput,regExpPassword,false);
checkInputs(loginInput,loginRegExp,false,[true, false]);
loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    if(loginInput.getAttribute("data-is-good-field")==="yes"&&passwordInput.getAttribute("data-is-good-field")==="yes"){
        let data=new FormData(loginForm);
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