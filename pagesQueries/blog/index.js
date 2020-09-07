
module.exports=function makeBlogQueries() {
  return [
    {"queryValue":"select * from blog_articles",
    "contextVarName":"articles"}
  ];
}