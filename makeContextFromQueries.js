function checkQueriesMas(queries){
    if(!Array.isArray(queries)){
      return false;
    }
    for(var i=0;i<queries.length;i++){
      if(typeof queries[i].queryValue!="string"||typeof queries[i].contextVarName!="string"){
        return false;
      }
    }
    return true;
}
var makeContext=(queriesMas, dbClient, callback)=>{
  if(!checkQueriesMas(queriesMas)){
    return;
  }
  var promMas=[];
  var context={};
  queriesMas.forEach(queryObj=>{
      promMas.push(new Promise((resolve, reject)=>{
        dbClient.query(queryObj.queryValue,(err,res)=>{
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
  Promise.all(promMas).then(queriesResult=>{
    for(var i=0;i<queriesResult.length;i++){
      context[queriesMas[i].contextVarName]=queriesResult[i];
    }
    callback(context);
  });
}
module.exports=makeContext;