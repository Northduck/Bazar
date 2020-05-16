function handleNewRegisterResponse(data){
    switch (data.code) {
        case -1:
            if(!document.querySelector(".Login-wrong-values")){
                let errorText=document.createElement("span");
                errorText.classList.add("Login-wrong-values");
                errorText.append("You entered wrong password or login (email)");
                loginForm.prepend(errorText);
            }
            passwordInput.value="";
        break;
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

let loginForm=document.querySelector(".Login-form");
let passwordInput=loginForm.querySelector(".Login-password-input");
loginForm.addEventListener("submit",(event)=>{
    event.preventDefault();
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
});