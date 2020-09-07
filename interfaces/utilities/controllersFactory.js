/*TODO: Обернуть в try catch
*/

const path=require("path");
module.exports=(controllerUri, controllerName)=>{
    const controllerPath = path.resolve(__dirname,'src/interfaces/http/modules', controllerUri,controllerName);
    const controller = require(controllerPath);
    return controller;
};