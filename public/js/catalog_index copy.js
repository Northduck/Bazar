let selElmnt, selectedItem, itemsWrapper, selectItem, arrow;
let selectWrapper = document.getElementsByClassName("custom-select");
for (let i = 0; i < selectWrapper.length; i++) {
  selElmnt = selectWrapper[i].getElementsByTagName("select")[0];
  selectedItem = document.createElement("div");
  selectedItem.classList.add("select-selected");
  selectedItem.setAttribute("tabindex","0");
  selectedItem.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
  selectedItem.setAttribute("data-sort-type",selElmnt.options[selElmnt.selectedIndex].value);
  selectWrapper[i].appendChild(selectedItem);
  itemsWrapper = document.createElement("ul");
  itemsWrapper.classList.add("select-items","visually-hidden");
  for (let j = 0; j < selElmnt.length; j++) {
    selectItem = document.createElement("li");
    if(j===0){
      selectItem.classList.add("same-as-selected");
    }
    selectItem.setAttribute("tabindex","0");
    selectItem.innerHTML = selElmnt.options[j].innerHTML;
    selectItem.setAttribute("data-sort-type",selElmnt.options[j].value);
    function changeSelectItem(e){
      this.parentNode.parentNode.getElementsByTagName("select")[0].selectedIndex = j;
      let selectedItem= this.parentNode.previousSibling;
      selectedItem.innerHTML = this.innerHTML;
      selectedItem.setAttribute("data-sort-type",this.getAttribute("data-sort-type"));
      this.parentElement.getElementsByClassName("same-as-selected")[0].classList.remove("same-as-selected");
      this.classList.add("same-as-selected");
      sortItems(this.getAttribute("data-sort-type"));
      selectedItem.click();
    }
    selectItem.addEventListener("click",changeSelectItem);
    selectItem.addEventListener("keypress",function(event){
      let key = event.which || event.keyCode;
      if(key===13){
        let newChange=changeSelectItem.bind(this);
        newChange(event);
      }
    });
    itemsWrapper.appendChild(selectItem);
  }
  selectWrapper[i].appendChild(itemsWrapper);
  function popUp(e) {
    e.stopPropagation();
    closeAllSelect(this);
    if(e.type==="focus"){
      if(!this.classList.contains("visually-hidden")){
        this.nextSibling.classList.remove("visually-hidden");
        this.parentNode.getElementsByClassName("fas")[0].classList.toggle("select-arrow-active");
      }
    }else{
      this.nextSibling.classList.toggle("visually-hidden");
      this.parentNode.getElementsByClassName("fas")[0].classList.toggle("select-arrow-active");
    }
  }
  function blurFunc(event){
    let newFunc=popUp.bind(this);
    setTimeout(()=>{
      newFunc(event);
    },100);
  }
  selectedItem.addEventListener("click", popUp);
  selectedItem.addEventListener("focus", blurFunc);
}
function sortItems(sortType){
  let compares=new Array(5);
  compares[0]=function(a,b){//rating
    let aRating=Number.parseFloat(a.getElementsByClassName("Item-rating")[0].getAttribute("data-value-rating"));
    let bRating=Number.parseFloat(b.getElementsByClassName("Item-rating")[0].getAttribute("data-value-rating"));
    if (aRating > bRating) { 
      return 1; } 
    if (aRating < bRating) { 
      return -1; } 
    return 0; 
  }
  compares[1]=function(a,b){//price_low
    let aPrice=Number.parseFloat(a.getElementsByClassName("New-price")[0].innerText.slice(1));
    let bPrice=Number.parseFloat(b.getElementsByClassName("New-price")[0].innerText.slice(1));
    if (aPrice > bPrice) { 
      return 1; } 
    if (aPrice < bPrice) { 
      return -1; } 
    return 0; 
  }
  compares[2]=function(a,b){//price_high
    let aPrice=Number.parseFloat(a.getElementsByClassName("New-price")[0].innerText.slice(1));
    let bPrice=Number.parseFloat(b.getElementsByClassName("New-price")[0].innerText.slice(1));
    if (aPrice < bPrice) { 
      return 1; } 
    if (aPrice > bPrice) { 
      return -1; } 
    return 0; 
  }
  compares[3]=function(a,b){//alphabet
    let aName=a.getElementsByClassName("Item-header")[0].innerText;
    let bName=b.getElementsByClassName("Item-header")[0].innerText;
    if (aName > bName) { 
      return 1; } 
    if (aName < bName) { 
      return -1; } 
    return 0; 
  }
  compares[4]=function(a,b){//date
    let aDate=new Date(a.getAttribute("data-receipt-date"));
    let bDate=new Date(b.getAttribute("data-receipt-date"));
    if (aDate.valueOf() < bDate.valueOf()) { 
      return 1; } 
    if (aDate.valueOf() > bDate.valueOf()) { 
      return -1; } 
    return 0; 
  }
  let itemsWrapper=document.getElementsByClassName("Products-catalog-grid")[0];
  let itemsMas=itemsWrapper.getElementsByClassName("Products-catalog-item");
  let sortMas=[];
  for(let i=0;i<itemsMas.length;i++){
    sortMas.push(itemsMas[i]);
  }
  itemsWrapper.innerHTML='<i class="fas fa-spinner"></i>';
  sortMas.sort(compares[sortType-1]);
  itemsWrapper.innerHTML="";
  for(let i=0;i<sortMas.length;i++){
    itemsWrapper.innerHTML+=sortMas[i].outerHTML;
  }
}
function closeAllSelect(elmnt) {
  var x, y, i, arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  for (i = 0; i < y.length; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i)
    }
  }
  for (i = 0; i < x.length; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("visually-hidden");
    }
  }
}
document.addEventListener("click", closeAllSelect);
function takeInputValue(input){
  return Number.parseInt(input.value);
}
let ranges=document.getElementsByClassName("Range-subcategory");
for(let i=0;i<ranges.length;i++){
  let buttons=ranges[i].getElementsByTagName("button");
  let activePart=ranges[i].getElementsByClassName("Range-silder-active-part")[0];
  let inputs=ranges[i].getElementsByTagName("input");
  let step=(takeInputValue(inputs[1])-takeInputValue(inputs[0]))/242;
  let minValue=takeInputValue(inputs[0])+step;
  for(let j=0;j<2;j++){
    inputs[j].addEventListener("change",function(event){
      if(!event.isTrusted){
        return;
      }
      event.preventDefault();
      event.stopPropagation(); 
      if(j===0){
        buttons[0].style.zIndex=10; 
        buttons[1].style.zIndex=2; 
        if(Number.parseInt(inputs[j].value)>Number.parseInt(inputs[j].getAttribute("data-value"))){
          let maxValue=takeInputValue(inputs[1]);
          if(takeInputValue(inputs[0])>=maxValue){
            buttons[0].style.left=buttons[1].style.left
            inputs[0].value=inputs[1].value;
          }else{
            buttons[0].style.left=Math.round((takeInputValue(inputs[0])-minValue)/step) +"px";
          }
        }else{
          buttons[j].style.left="-1px";
          inputs[0].value=Number.parseInt(inputs[0].getAttribute("data-value"))
        }
        activePart.style.left=leftCoordToInt(buttons[0])+2+"px";
        activePart.style.width=leftCoordToInt(buttons[1])-leftCoordToInt(buttons[0])+"px";
      }else{
        buttons[1].style.zIndex=10; 
        buttons[0].style.zIndex=2; 
        if(Number.parseInt(inputs[j].value)<Number.parseInt(inputs[j].getAttribute("data-value"))){
          let minValue=takeInputValue(inputs[0]);
          if(takeInputValue(inputs[1])<=minValue){
            buttons[1].style.left=buttons[0].style.left
            inputs[1].value=inputs[0].value;
          }else{
            buttons[1].style.left=Math.round((takeInputValue(inputs[1])-minValue)/step) +"px";
          }     
        }else{
          buttons[j].style.left="241px";
          inputs[1].value=Number.parseInt(inputs[1].getAttribute("data-value"))
        }
        activePart.style.width=leftCoordToInt(buttons[1])-leftCoordToInt(activePart)+2+"px";  
      }
    });
  }
  buttons[0].addEventListener("mousedown",function(event){
    drag(this,event,"left",buttons[1],activePart,inputs[0],step,minValue,inputs[1]);
  });
  buttons[1].addEventListener("mousedown",function(event){
    drag(this,event,"right",buttons[0],activePart,inputs[1],step,minValue,inputs[0]);
  });
}
function getScrollOffsets(w) {
  // Use the specified window or the current window if no argument
  w = w || window;

  // This works for all browsers except IE versions 8 and before
  if (w.pageXOffset != null) return {x: w.pageXOffset, y:w.pageYOffset};

  // For browsers in Quirks mode
  return { x: d.body.scrollLeft, y: d.body.scrollTop };
}
function leftCoordToInt(element){
  return Number.parseInt(element.style.left.substring(0,element.style.left.length-2));
}
function drag(elementToDrag, event, buttonType, nearButton, activePart, input, valueStep, minValue, nextInput) {

  var scroll = getScrollOffsets();  
  var startX = event.clientX + scroll.x;
  let nearButtonLeftPos=leftCoordToInt(nearButton);

  var origX = elementToDrag.offsetLeft;

  var deltaX = startX - origX;

  if (document.addEventListener) {
      document.addEventListener("mousemove", moveHandler, true);
      document.addEventListener("mouseup", upHandler, true);
  }

  if (event.stopPropagation) event.stopPropagation(); 

  if (event.preventDefault) event.preventDefault();   

  function moveHandler(e) {
    elementToDrag.style.zIndex=10; 
    nearButton.style.zIndex=2; 
    e.preventDefault();
    e.stopPropagation();
    var scroll = getScrollOffsets();
    if(buttonType==="left"){
      if((e.clientX + scroll.x - deltaX)>=-1){
        if((e.clientX + scroll.x - deltaX)>=nearButtonLeftPos){
          elementToDrag.style.left=nearButtonLeftPos+"px";
          input.value=nextInput.value;
          return;
        }else{
          elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
        }
      }else{
        elementToDrag.style.left= "-1px";
      }
      activePart.style.left=leftCoordToInt(elementToDrag)+2+"px";
      activePart.style.width=nearButtonLeftPos-leftCoordToInt(elementToDrag)+"px";
      input.value=Math.floor(minValue+leftCoordToInt(elementToDrag)*valueStep);
    }else{
      if((e.clientX + scroll.x - deltaX)<242){
        if((e.clientX + scroll.x - deltaX)<=nearButtonLeftPos){
          elementToDrag.style.left=nearButtonLeftPos+"px";
          input.value=nextInput.value;
          return;
        }else{
          elementToDrag.style.left = (e.clientX + scroll.x - deltaX) + "px";
        }
      }else{
        elementToDrag.style.left= "241px";
      }
      activePart.style.width=leftCoordToInt(elementToDrag)-leftCoordToInt(activePart)+2+"px";
      input.value=takeInputValue(input)-valueStep;
      input.value=Math.ceil(minValue+leftCoordToInt(elementToDrag)*valueStep);
    }
  }
  function upHandler(e) {
    e.preventDefault();
    let inputChangeEvent=new Event("change");
    input.dispatchEvent(inputChangeEvent);
      if (document.removeEventListener) {
          document.removeEventListener("mouseup", upHandler, true);
          document.removeEventListener("mousemove", moveHandler, true);
      } 
      if (e.stopPropagation) e.stopPropagation(); 
  }
}
let filtersForm=document.getElementsByClassName("Filters-form")[0];
let filtersInputs=filtersForm.querySelectorAll("input");
let showResultsBtn=filtersForm.getElementsByClassName("Show-results")[0];
filtersInputs.forEach(element => {
  element.addEventListener("change",function(event){
    let submitEvent=new Event("submit");
    filtersForm.dispatchEvent(submitEvent);
    let formTopCoord=filtersForm.getBoundingClientRect().y;
    let elementCoord=element.getBoundingClientRect().y;
    showResultsBtn.style.top=(elementCoord-formTopCoord)+"px";
    showResultsBtn.classList.remove("visually-hidden");
  });
});
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
let newCatalogResults=document.getElementsByClassName("Products-catalog-grid-new")[0];
filtersForm.addEventListener("submit", function(event){
  newCatalogResults.innerHTML='<i class="fas fa-spinner"></i>';  
  event.preventDefault();
  let data=new FormData(filtersForm);
  fetch(window.location.href+serialize(data),{
    method:"GET"
  })
  .then(response=>{
    return response.text().then(function(text) {
      showFiltersResults(text);
    });
  })
  .catch(error => console.error(error));
});
showResultsBtn.addEventListener("click",event=>{
  event.preventDefault();
  let catalogResults=document.getElementsByClassName("Products-catalog-grid")[0];
  catalogResults.innerHTML=newCatalogResults.innerHTML;
  newCatalogResults.innerHTML="";
  showResultsBtn.classList.add("visually-hidden");
});

function showFiltersResults(result){
  let newCatalogResults=document.getElementsByClassName("Products-catalog-grid-new")[0];
  if(!newCatalogResults.innerHTML){
    let catalogResults=document.getElementsByClassName("Products-catalog-grid")[0];
    catalogResults.innerHTML=result;
  }else{
    newCatalogResults.innerHTML=result;
  }
}