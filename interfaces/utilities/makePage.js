/*  TODO: Обернуть в try catch
    TODO: Валидация полей
    TODO: Переработать расширение контекста
*/
const container=require("../../infrastructure/infrastructureContainer.js");
const {view,money,rates}=container.cradle;
const makeContext=require("./makeContextFromQueries.js");
module.exports=class pageMaker{
    constructor(req, res, pageFold, pageName, templateStrategy, pageContext, isExpandingContext, contextArguments){

        this.pageRequest=req;

        this.pageResult=res;

        this.pageFold=pageFold;

        this.pageName=pageName;

        this.contextArguments=contextArguments;

        this.pageContext=pageContext||{"money":money};
        
        this.pageContext["money"]=money;

        this.isExpandingContext=Boolean(isExpandingContext);

        this.pageContent=undefined;

        this.templateStrategy=templateStrategy||"pug";
        
        this.addToContextRequestMas=["session"];

        this.addToContextResultMas=["i18n"];
    }
    async expandPageContext(){
        this.addToContextRequestMas.forEach((element) => {
            this.pageContext[element]=this.pageRequest[element];
        });
        this.addToContextResultMas.forEach((element) => {
            this.pageContext[element]=this.pageResult[element];
        });
        this.pageContext["currencyRates"]=await rates("https://api.coinbase.com/v2/exchange-rates");
    }
    async makePage(){
        let queriesContext=await makeContext(this.pageName,this.contextArguments,this.isExpandingContext);

        Object.assign(this.pageContext,queriesContext);
        
        await this.expandPageContext();
        
        this.pageContent=await view[this.templateStrategy].buildPage(this.pageFold, this.pageName, this.pageContext);
        
        return this.pageContent;
    }
};