"use strict";
let {Client}=require("pg");
let conf=require("./config/index_config.js");
const _client = new Client(conf.get("postgresBd"));
let initDb=async (callback)=>{ 
  await _client
  .connect()
  .then(async () => {
    let searchPath= (await _client.query(`show search_path;`)).rows;
    let schemaSet= await _client.query(`set schema 'Bazar';`);
    searchPath=(await _client.query(`show search_path;`)).rows;
    console.log('connected');
    callback(null,_client);
  })
  .catch(err =>{
    console.error('connection error', err.stack);
    callback(err,_client);
  });
}
let getClient=()=>{
  return _client;
}
module.exports = {
    getClient,
    initDb
};
