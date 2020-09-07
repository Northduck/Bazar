function phoneNumberEntering(phoneInput) {
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
}
export {phoneNumberEntering};