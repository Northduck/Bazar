/**
 TODO: Освободить middlewares от низкоуровневых зависимостей
 */
const container=require("../../infrastructure/infrastructureContainer.js");
const bodyParser=require("../../interfaces/middlewares/bodyParser.js");
const cookieParser=require("../../interfaces/middlewares/cookieParser.js");
const sessionStorage=require("../../interfaces/middlewares/sessionStorage.js");
const setLanguage=require("../../interfaces/middlewares/setLanguage.js");
const setCurrency=require("../../interfaces/middlewares/setCurrency.js");
const setInternalization=require("../../interfaces/middlewares/setInternalization.js");
const static=require("../../interfaces/middlewares/static.js");
const errorHandler=require("../../interfaces/middlewares/errorHandler.js")
const routes=require("../../interfaces/routes");

const {i18n}=container.cradle;

const handleMiddlewares=(app)=>{
    app.set('view engine', 'pug');

    app.use(static);

    app.use(bodyParser);

    app.use(cookieParser);

    app.use(sessionStorage);

    app.use(setLanguage);

    app.use(setCurrency);

    app.use(i18n.init);

    app.use(setInternalization);

    app.use("/",routes);

    app.use(errorHandler);
}
module.exports=handleMiddlewares;