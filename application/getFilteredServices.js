/*
    TODO: Обернуть в try catch
*/
module.exports=async (urlQuery,filterExecutor)=>{
    let categoriesArray=[];
    for(let queryEl in urlQuery){
        let underlinePos=queryEl.indexOf("_");
        if(urlQuery[queryEl]==='on'){
            let checkboxName=queryEl.slice(0,underlinePos);
            let checkboxValue=queryEl.slice(underlinePos+1);
            if(checkboxName==="category"){
                categoriesArray.push(checkboxValue);
            }
        }
    }
    let filteredProducts=await filterExecutor(categoriesArray);
    return filteredProducts;
}