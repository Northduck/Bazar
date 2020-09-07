module.exports=({config})=>{
    return knex=require("knex")({
        client: 'pg',
        connection: config.get("postgresBd"),
        searchPath: ["Bazar"]
    });
}