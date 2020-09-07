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
let productInfoNav=document.querySelectorAll(".Product-info-nav>li");
let ProductInfoContent=document.querySelectorAll(".Product-info-content>li");
console.log(productInfoNav,ProductInfoContent);
makeSliderWithNavListeners(productInfoNav,ProductInfoContent,"Product-info-active-tab","visually-hidden",1);

let NewproductsButton=document.querySelectorAll(".New-products-catalog .Catalog-slider-btn-wrapper button");
let NewproductsPages=document.querySelectorAll(".Products-category-pages-list>li");
console.log(NewproductsButton,NewproductsPages);
makeSliderWithNavListeners(NewproductsButton,NewproductsPages,"Active-slide-btn","visually-hidden");

let galleryContent=document.querySelectorAll(".Shop-page-product-left-column")[0];
let galleryMainImages=document.querySelectorAll(".Product-active-img")[0];
    galleryContent.querySelectorAll(".Product-imgs-list li").forEach((linkListEl,j)=>{
        let galleryListImg=linkListEl.firstChild;
        linkListEl.addEventListener("click",event=>{
            event.preventDefault();
            galleryMainImages.src=galleryListImg.src;
        });
    });
    let shiftInitial=0;
    let galleryShiftBtns=galleryContent.querySelectorAll(".Product-img-slider button");
    galleryShiftBtns.forEach((el,j)=>{
        let imgsList=galleryContent.querySelectorAll(".Gallery-item");
        el.addEventListener("click",event=>{
            event.preventDefault();
            if(j===0){
                if(shiftInitial!==0){
                    imgsList[shiftInitial-1].classList.remove("visually-hidden");
                    imgsList[shiftInitial-- + 3].classList.add("visually-hidden"); 
                }
            }else{
                if(imgsList.length>=4&&(4+shiftInitial)!==imgsList.length){
                    imgsList[shiftInitial].classList.add("visually-hidden");
                    imgsList[shiftInitial++ + 4].classList.remove("visually-hidden");
                }
            }
        });
});
function serialize(formData){
    let url="?"
    for (var [key, value] of formData.entries()) { 
        url=url+key+"="+value+"&";
    }  
    url=url.replace(/ /g,"%20");
    url=url.substring(0,url.length-1);
    return url;
}
function handleNewFeedbackResponse(response){
    let addReviewWrapper=document.getElementsByClassName("Add-review-wrapper")[0];
    let resultString=document.createElement("span");
    resultString.classList.add("Response-string");
    if(response.code===-1){
        resultString.innerHTML="Sorry, server is on the pressure, reload the tab or try a bit later";
        addReviewWrapper.innerHTML=resultString;
        return;
    }
    location.reload();
}
let ratingRadio=document.getElementsByClassName(".New-user-review-rating-group");
for (let i = 0; ratingRadio!=null&&i < ratingRadio.length; i++) {
    ratingRadio[i].addEventListener("click",(event)=>{
        ratingRadio[i].classList.remove("User-rating-is-empty");
    });
}

let newReviewForm=document.getElementsByClassName("User-review-form");
for (let i = 0; newReviewForm!=null&&i < newReviewForm.length; i++) {
    newReviewForm[i].addEventListener("submit",async(event)=>{
        event.preventDefault();
        let data=new FormData(newReviewForm[i]);
        let finalUrl=window.location.href.substring(0,window.location.href.lastIndexOf("/"))+"/newfeedback/";
        console.log(window.location.pathname.match(/[0-9]*/));
        finalUrl+=window.location.pathname.match(/[\d]+/)[0]+serialize(data);
        if(finalUrl.indexOf("review-rating")===-1){
            ratingRadio.classList.add("User-rating-is-empty");
            return;
        }
        let serverResponse=await fetch(finalUrl,{
            method:"POST"
        });
        let serverResponseContent=await serverResponse.json();
        console.log(serverResponseContent);
        handleNewFeedbackResponse(serverResponseContent);
    
    });
}
