function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, value, options = {}) {
  options = {
    path: '/',
    ...options
  };
  if (options.expires&&options.expires.toUTCString) {
    options.expires = options.expires.toUTCString();
  }
  let updatedCookie = encodeURIComponent(name) + "=" + encodeURIComponent(value);
  for (let optionKey in options) {
    updatedCookie += "; " + optionKey;
    let optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += "=" + optionValue;
    }
  }
  document.cookie = updatedCookie;
}
function updateProductCookie(cookieName,productId,toDo,cookiesOptions){
  let cookieValue=getCookie(cookieName);
  let productIdIndex=cookieValue.indexOf(`${productId}-`);
  let productInfo=cookieValue.slice(productIdIndex).split("_")[0].split("-");
  let productRegexp=RegExp(`${productInfo[0]}-${productInfo[1]}`);
  let resCookie=cookieValue.replace(productRegexp,(match)=>{
    if(toDo==="+"){
      return `${productInfo[0]}-${(Number.parseInt(productInfo[1]))+1}`;
    }else{
      return `${productInfo[0]}-${(Number.parseInt(productInfo[1]))-1}`;
    }
  });
  setCookie(cookieName,resCookie,cookiesOptions);
}
function replaceCookie(cookieName,cookiePrev,cookieNew,cookiesOptions) {
    let cookieValue=getCookie(cookieName);
    let searchingVal=RegExp(cookiePrev);
    let resCookie=cookieValue.replace(searchingVal,(match)=>{
      return cookieNew;
    });
    setCookie(cookieName,resCookie,cookiesOptions);
}
export {getCookie, setCookie, updateProductCookie, replaceCookie};