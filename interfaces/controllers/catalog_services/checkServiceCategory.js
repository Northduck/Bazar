let serviceCategoriesFunc=require("../../dataAccess/sevicesCategories/index.js");
let serviceCategories;
(async ()=>{
    serviceCategories=await serviceCategoriesFunc();
})()
module.exports=(req,res,next)=>{
    let urlCategory=req.params.categoryName;
    console.log(urlCategory);
    let categoryIndex=serviceCategories.findIndex((el)=>{
        return urlCategory===el.service_category_name_en;
    });
    console.log(categoryIndex);
    if(categoryIndex===-1){
        let err = new Error(`Category doesn't exist`);
        err.statusCode = 404;
        err.name="categoryError";
        next(err);
    }else{
        req.params.categoryId=serviceCategories[categoryIndex]["service_category_id"];
        next();
    }
}