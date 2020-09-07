let Cart=require("../../domain/Cart.js");
module.exports=async (cartContent,cartRepository)=>{
    let cart=new Cart(cartContent);
    if(cart.getCartQuantity()===0){
        return [];
    }
    let cartInfo;
    try {
        cartInfo=await cartRepository.listCart(cart);
    } catch (error) {
        console.log(error);
    }
    return cartInfo;
}