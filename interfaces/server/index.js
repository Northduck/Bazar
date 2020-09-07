const container=require("../../infrastructure/infrastructureContainer.js");
const {serverListener}=container.cradle;
class Server{
    constructor(app){
        this.app=app;
    }
    async start(){
        const database=await container.resolve("databaseInit");
        const router=require("./router.js");
        router(this.app);
        await serverListener();
    }
    async shutdown(){
        console.log('Closed out remaining connections');
        process.exit(0);
    }
    
};
module.exports=Server;