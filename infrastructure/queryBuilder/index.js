module.exports=()=>{
    let connectionInfo;
    if(process.env.NODE_ENV==="production"){
        connectionInfo=process.env.DATABASE_URL;
    }else{
        connectionInfo={
            "host":process.env.HOST,
            "database":process.env.DATABASE,
            "user":process.env.USER,
            "schema":process.env.SCHEMA,
            "password":process.env.PASSWORD
        };
    }
    return knex=require("knex")({
        client: 'pg',
        connection: connectionInfo,
        searchPath: ["Bazar"]
    });
}