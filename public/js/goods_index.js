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

let quantityControls=document.querySelectorAll(".Quantity-controls button");
let quantityInput=document.getElementsByClassName("Product-quantity-value")[0];
for(let i=0;i<2;i++){
    quantityControls[i].addEventListener("click",function(event){
        event.preventDefault();
        if(i==0){
            quantityInput.value=Number.parseInt(quantityInput.value)-1;
        }else{
            quantityInput.value=Number.parseInt(quantityInput.value)+1;
        }
        let changeEvent=new Event("input");
        quantityInput.dispatchEvent(changeEvent);
    });
}
quantityInput.addEventListener("input",function(event){
    event.preventDefault();
    let checkvalue=quantityInput.value.match(/[1-9]?/);
    console.log(checkvalue);
    if((checkvalue.input.length!=0)&&(!checkvalue[0]||checkvalue.input.length>1)){
        quantityInput.value=quantityInput.getAttribute("data-previous-value");
        return;
    }
    quantityInput.setAttribute("data-previous-value",quantityInput.value);
});
quantityInput.addEventListener("input",function(event){
    event.preventDefault();
    let checkvalue=quantityInput.value.match(/[1-9]?/);
    console.log(checkvalue);
    if((checkvalue.input.length!=0)&&(!checkvalue[0]||checkvalue.input.length>1)){
        quantityInput.value=quantityInput.getAttribute("data-previous-value");
        return;
    }
    quantityInput.setAttribute("data-previous-value",quantityInput.value);
});
quantityInput.addEventListener("keyup",function(event){   
    if(event.keyCode == 13){
        quantityInput.blur();
    }
});

let galleryContent=document.querySelectorAll(".Shop-page-product-left-column")[0];
let galleryMainImages=document.querySelectorAll(".Product-active-img")[0];
let galleryImgElements=galleryContent.querySelectorAll(".Product-imgs-list li");
galleryImgElements.forEach((linkListEl,j)=>{
    let galleryListImg=linkListEl.firstChild;
    linkListEl.addEventListener("click",event=>{
        event.preventDefault();
        galleryMainImages.setAttribute("data-current-element",j);
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

function openModal(modal,overlay) {
    if (modal == null) return
    modal.classList.add('active');
    overlay.classList.add('active');
    bodyElement.classList.add('active');
}
function closeModal(modal,overlay) {
    if (modal == null) return
    modal.classList.remove('active');
    overlay.classList.remove('active');
    bodyElement.classList.remove('active');
}

let expandImgSliderBtn=document.querySelector(".Expand-img-btn");
let overlayWindow=document.querySelector(".Overlay");
let modalWindowSlider=document.querySelector(".Modal-img-slider-wrapper");
let bodyElement=document.querySelector("body");
let modalWindowImg=document.querySelector(".Modal-img-wrapper img");
let activeSliderImg=document.querySelector(".Product-active-img");
let modalWindowSliderBtns=document.querySelectorAll(".Modal-img-slider-wrapper button.Slide");
let galleryImgs=galleryContent.querySelectorAll(".Product-imgs-list li img");
let cloaseModalBtn=modalWindowSlider.querySelector(".Close-modal-window");

modalWindowSliderBtns.forEach((sliderBtn,i)=>{
    sliderBtn.addEventListener("click",(event)=>{
        let currentModalImg=Number.parseInt(galleryMainImages.getAttribute("data-current-element"));
        let newCurrentImg=currentModalImg;
        if(i===0){
            if(currentModalImg-1>=0){
                --newCurrentImg;
                modalWindowImg.src=galleryImgs[newCurrentImg].src;
                galleryMainImages.src=galleryImgs[newCurrentImg].src;
            }
        }else{
            if(currentModalImg+1<galleryImgElements.length){
                ++newCurrentImg;
                modalWindowImg.src=galleryImgs[newCurrentImg].src;
                galleryMainImages.src=galleryImgs[newCurrentImg].src;
            }
        }
        galleryMainImages.setAttribute("data-current-element",newCurrentImg);
    });
});
expandImgSliderBtn.addEventListener("click",(event)=>{
    event.preventDefault();
    openModal(modalWindowSlider,overlayWindow,bodyElement);
    modalWindowImg.src=activeSliderImg.src;
});
overlayWindow.addEventListener('click', () => {
    closeModal(modalWindowSlider,overlayWindow,bodyElement);
});

cloaseModalBtn.addEventListener('click', () => {
    closeModal(modalWindowSlider,overlayWindow,bodyElement);
});