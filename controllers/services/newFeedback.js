let fs=require("fs");
let pug=require("pug");
let db=require("../../connect");
let client=db.getClient();
let goodsReviews;
let newRating;
fs.readFile("./templates/goods/goods_reviews.pug",(error,data)=>{
  if(error){
    console.log(error);
  }
  goodsReviews=pug.compile(data,{"basedir":"./"});
});
fs.readFile("./templates/goods/goods_rating.pug",(error,data)=>{
  if(error){
    console.log(error);
  }
  newRating=pug.compile(data,{"basedir":"./"});
});
module.exports=(req,res)=>{
    let response={};
    client
    .query(`select "checkReview"('${JSON.stringify(req.query)}'::json,${Number.parseInt(req.params.productId)});`)
    .catch(err=>{
      console.log(err);
    })  
    .then(result=>{
      response.code=result.rows[0].checkReview;
      return client
      .query(`select user_name, product_rating, review_text, review_date from products_reviews where product_id=${Number.parseInt(req.params.productId)} order by review_date;`);
    })
    .then(result=>{
      response.reviews=goodsReviews({"goodReviews":result.rows});
      response.reviewsCount=result.rows.length;
      return client
      .query(`select product_rating from products where product_id=${Number.parseInt(req.params.productId)}`);
    })
    .then(result=>{
      response.rating=newRating({"newRating":result.rows[0].product_rating});
      res.end(JSON.stringify(response));
    });
  }