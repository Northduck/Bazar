/*TODO: Обернуть в try catch
*/
const path=require("path");
const fs = require('fs');
const pug=require("pug");
const fsPromises = fs.promises;
module.exports=()=>{
    return {
        "pug":{
            "buildPage":async function (pageFold,pageName,pageContext) {
                let pageTemplatePath=path.resolve(__dirname,"../../templates",pageFold,`${pageName}.pug`);
                let pageData=await fsPromises.readFile(pageTemplatePath);
                const pageTemplateFn=pug.compile(pageData,{"basedir":"./"});
                return pageTemplateFn(pageContext);
            }
        },
        "react":{
            "buildPage":function () {
                throw Error("React template doesn't implemented");
            }
        }
    };
}