"use strict";

module.exports=class CheckoutProducts{
    constructor(orderContent){
        if(orderContent===undefined){
            this.receiving={};
            this.contactInfo={};
            this.paymentMethod=undefined;
            this.cart=undefined;
            this.currentStage=0;
            this.isOrdered=false;
            this.userID=undefined;
            this.orderNumber="";
            this.orderSumm=undefined;
            return;
        }
        this.receiving=orderContent["receiving"]||{};
        this.contactInfo=orderContent["contactInfo"]||{};
        this.paymentMethod=orderContent["paymentMethod"]||undefined;
        this.cart=orderContent["cart"]||undefined;
        this.currentStage=orderContent["currentStage"]||0;
        this.isOrdered=false;
        this.userID=orderContent["userID"]||undefined;
        this.orderNumber=orderContent["orderNumber"]||undefined;
        this.orderSumm=orderContent["orderSumm"]||undefined;
    }
    getReceivingInfo(){
        return this.receiving;
    }
    setReceivingInfo(receiving){
        if(receiving==undefined||receiving==={}){
            throw new Error("argument type error");
        }
        this.receiving=receiving;
    }
    getContactInfo(){
        return this.contactInfo;
    }
    setContactInfo(contactInfo){
        if(contactInfo==undefined||contactInfo==={}){
            throw new Error("argument type error");
        }
        this.contactInfo=contactInfo;
    }
    getPaymentMethod(){
        return this.paymentMethod;
    }
    setPaymentMethod(paymentMethod){
        if(paymentMethod==undefined||typeof paymentMethod!=="string"){
            throw new Error("argument type error");
        }
        this.paymentMethod=paymentMethod;
    }
    getCurrentStage(){
        return this.currentStage;
    }
    setCurrentStage(currentStage){
        if(currentStage==undefined||typeof currentStage!=="number"){
            throw new Error("argument type error");
        }
        this.currentStage=currentStage;
    }
    getCart(){
        return this.cart;
    }
    setCart(cart){
        if(cart==undefined||cart==={}){
            throw new Error("argument type error");
        }
        this.cart=cart;
    }
    getUserID(){
        return this.userID;
    }
    setUserID(userID){
        if(userID==undefined||typeof userID!=="number"){
            throw new Error("argument type error");
        }
        this.userID=userID;
    }
    getOrderSumm(){
        return this.orderSumm;
    }
    setOrderSumm(orderSumm){
        if(orderSumm==undefined||typeof orderSumm!=="number"){
            throw new Error("argument type error");
        }
        this.orderSumm=orderSumm;
    }
    generateOrderNumber() {
        let orderNumber      = '';
        let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for ( let i = 0; i < 10; i++ ) {
            orderNumber += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        this.orderNumber=orderNumber;
    }
    getOrderNumber(){
        return this.orderNumber;
    }
};