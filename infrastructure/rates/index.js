module.exports=({fetch})=>{
    return async(endPoint)=>{
        if(endPoint==undefined||endPoint===""){
            let variableError=new Error("end point isn't declared");
            throw variableError;
        }
        let ratesResponse=await fetch(endPoint,{method:"GET"});
        let rates=await ratesResponse.json();
        return rates;
    }
}