/*
    TODO: Обернуть в try catch
*/
module.exports=async (categoryIndex,urlQuery,filterExecutor)=>{
    let checkboxFilters=[];
    let rangeFilters=[];
    let isRangeMax=false;
    let i=0,j=0;
    let priceRange=new Array(2);
    let lengthCorrection=0;
    let prevCheckboxName="";
    priceRange[0]=urlQuery["price_min"];
    priceRange[1]=urlQuery["price_max"];
    delete urlQuery["price_min"];
    delete urlQuery["price_max"];
    for(let queryEl in urlQuery){
        let underlinePos=queryEl.indexOf("_");
        if(urlQuery[queryEl]==='on'){
        checkboxFilters.push({});
        checkboxFilters[j].checkboxName=queryEl.slice(0,underlinePos);
        checkboxFilters[j].checkboxValue=queryEl.slice(underlinePos+1);
        if(prevCheckboxName===checkboxFilters[j].checkboxName){
            lengthCorrection++;
        }
        prevCheckboxName=checkboxFilters[j].checkboxName;
        j++;
        }else{
            if(!isRangeMax){
                rangeFilters.push({});
                rangeFilters[i].rangeName=queryEl.slice(0,underlinePos);
                rangeFilters[i].between=new Array(2);
                rangeFilters[i].between[0]=urlQuery[queryEl];
                isRangeMax=true;
            }else{
                rangeFilters[i].between[1]=urlQuery[queryEl];
                i++;
                isRangeMax=false;
            }
        }
    }
    let filteredProducts=await filterExecutor(categoryIndex,priceRange,checkboxFilters,rangeFilters,lengthCorrection);
    return filteredProducts;
}