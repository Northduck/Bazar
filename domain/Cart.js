"use strict";

module.exports=class Cart{
    constructor(cartContent){
        if(cartContent===undefined){
            this.cartContent=[];
            this.cartQuantity=0;
            return;
        }
        if(Array.isArray(cartContent)!==true){
            let typeError=new Error("Wrong type in cart constructor");
            throw typeError;
        }
        this.cartContent=cartContent;
        this.cartQuantity=this.countCartQuantity();
    }
    countCartQuantity(){
        let cartQuantity=0;
        for(let i=0;i<this.cartContent.length;i++){
            cartQuantity+=Number.parseInt(this.cartContent[i]["productQuantity"]);
        }
        return cartQuantity;
    }
    getCartContent(){
        return this.cartContent;
    }
    getProductInfo(productIndex){
        if(productIndex>=this.cartContent.length){
            return undefined;
        }else{
            return this.cartContent[productIndex];
        }
    }
    getCartQuantity(){
        return this.cartQuantity;
    }
    addProductToCart(productToAdd){
        if(typeof productToAdd!=="object"&&productToAdd["productID"]==undefined&&productToAdd["productQuantity"]==undefined&&
        typeof productToAdd["productID"]!=="number"&&typeof productToAdd["productQuantity"]!=="number"){
            return false;
        }
        if(productToAdd["productQuantity"]<0||productToAdd["productQuantity"]>9){
            return false;
        }
        let newProductIndexInContent=this.cartContent.indexOf((cartElement,i)=>{
            if(cartElement["productID"]===productToAdd["productID"]){
                return true;
            }
        });
        if(newProductIndexInContent!==-1){
            this.cartContent[newProductIndexInContent]["productQuantity"]+=productToAdd["productQuantity"];
            let correctQuantity=this.cartContent[newProductIndexInContent]["productQuantity"]%10;
            this.cartContent[newProductIndexInContent]["productQuantity"]-=correctQuantity;
            productToAdd["productQuantity"]-=correctQuantity;
        }else{
            this.cartContent.push(productToAdd);
        }
        this.cartQuantity+=productToAdd["productQuantity"];
        return true;
    }
    deleteProductFromCart(productToDelete){
        if(typeof productToDelete!=="object"&&productToDelete["productID"]==undefined&&productToDelete["productQuantity"]==undefined&&
        typeof productToDelete["productID"]!=="number"&&typeof productToDelete["productQuantity"]!=="number"){
            return false;
        }
        if(productToDelete["productQuantity"]<0||productToDelete["productQuantity"]>9){
            return false;
        }
        let newProductIndexInContent=this.cartContent.indexOf((cartElement,i)=>{
            if(cartElement["productID"]===productToDelete["productID"]){
                return true;
            }
        });
        if(newProductIndexInContent!==-1){
            let productTempQuan=this.cartContent[newProductIndexInContent]["productQuantity"];
            this.cartContent[newProductIndexInContent]["productQuantity"]-=productToDelete["productQuantity"];
            if(this.cartContent[newProductIndexInContent]["productQuantity"]<=0){
                this.cartQuantity-=productTempQuan;
                this.cartContent.splice(newProductIndexInContent,1);
            }else{
                this.cartQuantity-=productToDelete["productQuantity"];
            }
            if(this.cartQuantity<=0){
                this.cartContent=[];
                this.cartQuantity=0;
            }
            return true;
        }else{
            return false;
        }
    }
};