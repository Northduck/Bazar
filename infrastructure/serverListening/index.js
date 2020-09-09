/*
    TODO: Обернуть в try catch
*/
"use strict";

const { promisify } = require('util');
module.exports=({config, app})=>{
    return async ()=>{
        /*app.set("port", config.get("port"));
        const promisifyListening=promisify(app.listen);
        await promisifyListening(app.get("port"));
        console.log(`Listening ${config.get("port")}`);*/
        app.set("port", process.env.PORT);
        app.listen(app.get("port"), () => {
            console.log(`Listening ${config.get("port")}`);
        });
    }
}