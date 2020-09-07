let productCategoriesFunc=require("../../dataAccess/productsCategories/index.js");
let productCategories;
(async ()=>{
    productCategories=await productCategoriesFunc();
})()
module.exports=(req,res,next)=>{
    let urlCategory=req.params.categoryName;
    let categoryIndex=productCategories.findIndex((el)=>{
        return urlCategory===el.product_category_name_en;
    });
    if(categoryIndex===-1){
        let err = new Error(`Category doesn't exist`);
        err.statusCode = 404;
        err.name="categoryError";
        next(err);
    }else{
        req.params.categoryId=productCategories[categoryIndex]["product_category_id"];
        next();
    }
}