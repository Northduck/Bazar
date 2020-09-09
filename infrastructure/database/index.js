"use strict";
let {Pool}=require("pg");
let pool;

if(process.env.NODE_ENV==="production"){
  pool=new Pool({
    connectionString:process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });
}else{
  pool=new Pool({
      "host":process.env.HOST,
      "database":process.env.DATABASE,
      "user":process.env.USER,
      "schema":process.env.SCHEMA,
      "password":process.env.PASSWORD
  });
}

let client;
let initDb=async ()=>{ 
  try {
    client=await pool.connect();
  } catch (error) {
    console.error('connection error', error);
  }
  try {
    await client.query(`set schema 'Bazar';`);
  } catch (error) {
    console.error(error);
  }
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