let conf=require("./../../config/index_config");
module.exports=(req,res)=>{
  console.log(res.locale);
  let newLanguage=req.query["change_language"];
  let supportedLanguages=conf.get("supported_languages");
  if(newLanguage!==undefined&&typeof newLanguage==="string"&&newLanguage!==req.cookies["language"]){
    let isSupported=supportedLanguages.find((el,i)=>{
      if(el===newLanguage){
        return true;
      }
    });
    if(isSupported!==undefined){
      req.session["language"]=newLanguage;
      res.cookie("language",newLanguage);
    }
  }
  res.end(JSON.stringify({returnValue:1}));
}