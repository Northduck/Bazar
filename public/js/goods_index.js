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
console.log("ctr",quantityControls);
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

let galleryContent=document.getElementsByClassName("Shop-page-product-left-column")[0];
let galleryMainImages=document.getElementsByClassName("Product-active-img")[0];
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
    if(response.code===1){
        resultString.innerHTML="Thank you for feedback";
    }else if(response.code===2){
        resultString.innerHTML="Your feedback has been updated";
    }
    addReviewWrapper.innerHTML="";
    addReviewWrapper.appendChild(resultString);
    let productRating=document.querySelector(".Product-users-rating-row .Product-rating");
    let reviewsContainer=document.getElementsByClassName("Product-info-content-reviews-wrapper")[0];
    let reviewsCountTab=document.querySelectorAll(".Product-info-nav .Reviews-count")[0];
    let reviewsCountLink=document.getElementsByClassName("Product-reviews-counter")[0];
    productRating.innerHTML=response.rating;
    reviewsContainer.firstChild=response.reviews;
    reviewsCountTab.innerHTML=response.reviewsCount;
    reviewsCountLink.innerHTML=`${response.reviewsCount} views`;
}
let ratingRadio=document.getElementsByClassName("New-user-review-rating-group")[0];
ratingRadio.addEventListener("click",(event)=>{
    ratingRadio.classList.remove("User-rating-is-empty");
});
let newReviewForm=document.getElementsByClassName("User-review-form")[0];
newReviewForm.addEventListener("submit",(event)=>{
    event.preventDefault();
    let data=new FormData(newReviewForm);
    let finalUrl=window.location.href.substring(0,window.location.href.lastIndexOf("/"))+"/newfeedback/";
    finalUrl+=window.location.href.match(/[0-9]*\_[0-9]*/)[0]+serialize(data);
    if(finalUrl.indexOf("product-rating")===-1){
        ratingRadio.classList.add("User-rating-is-empty");
        return;
    }
    fetch(finalUrl,{
      method:"POST"
    })
    .then(response=>{ 
        return response.json();
    })
    .then(data=>{
        console.log(data);
        handleNewFeedbackResponse(data);
    })
    .catch(error => console.error(error));
});