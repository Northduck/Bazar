let hotDealsBtns=document.querySelectorAll(".Hot-deals-slider-btn-wrapper button");
let hotDealsProducts=document.querySelectorAll(".Hot-deals-middle .Hot-deal");
let timers=document.querySelectorAll(".Hot-deals-slider .Hot-deals-timer");
let now=new Date();
function makeSliderWithNavListeners(navElements, content, toggleNavClass, toggleContentClass, currentEl){
    if(!currentEl){
        currentEl=0;
    }
    navElements.forEach((navEl, i) => {
        navEl.addEventListener("click",event=>{
            event.preventDefault();
            content[currentEl].classList.add(toggleContentClass);
            content[i].classList.remove(toggleContentClass);
            navElements[currentEl].classList.remove(toggleNavClass);
            navElements[i].classList.add(toggleNavClass);  
            currentEl=i;  
        });
    });
}
let newFurnNav=document.querySelectorAll(".Products-catalog-nav a");
let newFurnCategories=document.querySelectorAll(".Products-category-list>li");

let topProdutsGalleryNav=document.querySelectorAll(".Gallery-nav a");
let topProdutsGalleycontent=document.querySelectorAll(".Gallery-content>li");

let feedbackBtns=document.querySelectorAll(".Feedback-section-top button");
let feedbackContent=document.querySelectorAll(".Feedback-content");

let blogArticlesBtns=document.querySelectorAll(".Blog-top button");
let blogArticlesContent=document.querySelectorAll(".Articles-pages .Articles-page");

makeSliderWithNavListeners(newFurnNav, newFurnCategories, "Active-tab", "visually-hidden", 0);
makeSliderWithNavListeners(hotDealsBtns, hotDealsProducts, "Active-slide-btn", "visually-hidden", 0);
makeSliderWithNavListeners(topProdutsGalleryNav, topProdutsGalleycontent, "Active-gallery-element", "visually-hidden", 0);
makeSliderWithNavListeners(feedbackBtns, feedbackContent, "Active-slide-btn", "visually-hidden", 0);
makeSliderWithNavListeners(blogArticlesBtns, blogArticlesContent, "Active-slide-btn", "visually-hidden", 0);
let specialOffers=document.querySelectorAll(".Special-offers-slider .Special-offer-slider-item");
let specialOffersControls=document.querySelectorAll(".Special-offer-slider-btn button");
let currentSlide=0;
specialOffersControls.forEach((controlEl,j)=>{
    controlEl.addEventListener("click",event=>{
        event.preventDefault();
        if(j===0){
            if(currentSlide!==0){
                specialOffers[currentSlide-1].classList.remove("visually-hidden");
                specialOffers[currentSlide--].classList.add("visually-hidden"); 
            }
        }else{
            if(currentSlide+1!==specialOffers.length){
                specialOffers[currentSlide+1].classList.remove("visually-hidden");
                specialOffers[currentSlide++].classList.add("visually-hidden");
            }
        }
    });
});
let galleryContent=document.querySelectorAll(".Gallery-content>li");
let galleryMainImages=document.getElementsByClassName("Gallery-img");
galleryContent.forEach((galleryEl,i)=>{
    galleryEl.querySelectorAll(".Gallery-item a").forEach((linkListEl,j)=>{
        let galleryListImg=linkListEl.getElementsByClassName("Gallery-photo");
        linkListEl.addEventListener("click",event=>{
            event.preventDefault();
            galleryMainImages[i].src=galleryListImg[0].src;
        });
    });
});
galleryContent.forEach((galleryEl,i)=>{
    let shiftInitial=0;
    let galleryShiftBtns=galleryEl.querySelectorAll(".Gallery-slider button");
    galleryShiftBtns.forEach((el,j)=>{
        let imgsList=galleryEl.querySelectorAll(".Gallery-item");
        el.addEventListener("click",event=>{
            event.preventDefault();
            if(j===0){
                if(shiftInitial!==0){
                    imgsList[shiftInitial-1].classList.remove("visually-hidden");
                    imgsList[shiftInitial-- + 5].classList.add("visually-hidden"); 
                }
            }else{
                if(imgsList.length>=6&&(6+shiftInitial)!==imgsList.length){
                    imgsList[shiftInitial].classList.add("visually-hidden");
                    imgsList[shiftInitial++ + 6].classList.remove("visually-hidden");
                }
            }
        });
    });
});


let endDateValues=[];
let endDate=[];
let diffs=[];
let timersValues=[];
timers.forEach((el,i)=>{
    timersValues.push({});
    timersValues[i].days=el.querySelector(".Hot-deals-timer-days");
    timersValues[i].hours=el.querySelector(".Hot-deals-timer-hrs");
    timersValues[i].mins=el.querySelector(".Hot-deals-timer-mins");
    timersValues[i].secs=el.querySelector(".Hot-deals-timer-secs");
    endDateValues[i]=el.getAttribute("data-end-date").split("-");
    endDate[i]=new Date(endDateValues[i][0],endDateValues[i][1],endDateValues[i][2]);
    diffs[i]=new Date(endDate[i]-now);
    timersValues[i].days.textContent=diffs[i].getDate();
    timersValues[i].hours.textContent=diffs[i].getHours();
    timersValues[i].mins.textContent=diffs[i].getMinutes();
    timersValues[i].secs.textContent=diffs[i].getSeconds();
});
let clock=setInterval(()=>{
    for(let i=0;i<timersValues.length;i++){
        if(--timersValues[i].secs.textContent==0){
            if(--timersValues[i].mins.textContent<0){
                if(--timersValues[i].hours.textContent<0){
                    if(((timersValues[i].days.textContent-1)<0)&&(timersValues[i].hours.textContent<=0)&&(timersValues[i].mins.textContent<=0)&&(timersValues[i].secs.textContent<=0)){
                        timersValues[i].mins.textContent=timersValues[i].hours.textContent=timersValues[i].days.textContent=0;
                        timersValues.splice(i,1)
                        return;
                    }
                    timersValues[i].days.textContent--;
                    timersValues[i].hours.textContent=23;
                }
                timersValues[i].mins.textContent=59;
            }
            timersValues[i].secs.textContent=59;
        }
    }
},1000);
