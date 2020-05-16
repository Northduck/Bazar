import {getCookie} from "./modules/cookie_methods.js";
function handleNewRegisterResponse(response){
    let userLocale=getCookie("language");
    switch (response.code) {
        case -1:
            let loginItem=document.querySelector(".Register-login-section");
            let loginErrorSpan = document.createElement("span");
            loginErrorSpan.classList.add("Register-error");
            switch (userLocale) {
                case "en":
                    loginErrorSpan.append("There is user with this login");
                    break;
                case "ru":
                    loginErrorSpan.append("Введенный логин уже используется");
                    break;                    
            }
            loginItem.append(loginErrorSpan);
            break;
        case -2:
            let emailItem=document.querySelector(".Register-email-section");
            let emailErrorSpan = document.createElement("span");
            emailErrorSpan.classList.add("Register-error");
            switch (userLocale) {
                case "en":
                    emailErrorSpan.append("There is user with this email");
                    break;
                case "ru":
                    emailErrorSpan.append("Введенный email уже используется");
                    break;                    
            }
            emailItem.append(emailErrorSpan);
            break;
        case 1:
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
            break;

        default:
            break;
    }
}
function checkInputs(input,regExpMas){
    input.addEventListener("change",event=>{
        if(regExpMas.every(element=>{
            console.log(input.value.match(element))
            return input.value.match(element)
        }))
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
let regExpPassword=[/[^]{7,}/,/[0-9]{1,}/,/[A-Z]{1,}/];
let loginRegExp=[/[a-zA-Z0-9_-]+/];
let emailRegExp=[/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/];
checkInputs(registerPassword,regExpPassword);
checkInputs(registerLogin,loginRegExp);
checkInputs(registerEmail,emailRegExp);
registerForm.addEventListener("submit",event=>{
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