/*
  TODO: Подумать над хранением запросов
  TODO: Обернуть в try/catch
*/
function checkpageQueriesMas(queries){
  if(!Array.isArray(queries)){
    return false;
  }
  for(let i=0;i<queries.length;i++){
    if(typeof queries[i].queryValue!="string"||typeof queries[i].contextVarName!="string"){
      return false;
    }
  }
  return true;
}
const container=require("../../infrastructure/infrastructureContainer.js");
const path=require("path");
const commonQueriesMas=require("../../pagesQueries/commonQueries.js")();
let {database}= container.cradle;
let makeContext=async (pageName, contextArguments, isExpanding)=>{
  let fullPageQueriesMas;
  if(isExpanding===true){
    const queriesMasPath=path.resolve(__dirname,"../../pagesQueries",pageName,"index.js");
    let pageQueriesFunc=require(queriesMasPath);
    let pageQueriesMas=pageQueriesFunc(contextArguments);
    fullPageQueriesMas=pageQueriesMas.concat(commonQueriesMas);
  }else{
    fullPageQueriesMas=commonQueriesMas;
  }
  
  let promMas=[];
  let context={};
  fullPageQueriesMas.forEach(queryObj=>{
    promMas.push(new Promise((resolve, reject)=>{
      database.query(queryObj.queryValue,(err,res)=>{
          if (err){
              reject(err);
          }
          if(!queryObj.queryFunc){
              resolve(res.rows);
          }else{
            queryObj.queryFunc(res.rows,funcResult=>{
              resolve(funcResult);
            })
          }
        });                
    }));
  });
  let queriesResult= await Promise.all(promMas);
  for(let i=0;i<queriesResult.length;i++){
    context[fullPageQueriesMas[i].contextVarName]=queriesResult[i];
  }
  return context;
}
module.exports=makeContext;