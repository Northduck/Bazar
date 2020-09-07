"use strict";
let {Client}=require("pg");
let client;
let initDb=async ({config})=>{ 
  client = new Client(config.get("postgresBd"));
  try {
  await client.connect();
  } catch (error) {
    console.error('connection error', error);
  }
  let schemaSet= await client.query(`set schema 'Bazar';`);
  console.log('connected');
  return client;
}
let getDb=()=>{
  return client;
}

module.exports={
  initDb,
  getDb
};