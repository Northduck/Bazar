module.exports=class{
    constructor(){
        if(arguments.length===1&&typeof arguments[0]==="object"){
            let userInfo=arguments[0];
            this.id=userInfo["id"];
            this.login=userInfo["login"];
            this.email=userInfo["email"];
            this.password=userInfo["password"];
            this.fullName=userInfo["fullname"];
            this.birthdate=userInfo["birthdate"];
            this.phoneNumber=userInfo["phonenumber"];
            this.address=userInfo["address"];
        }else{
            
            this.login=arguments[0]||null;
            this.email=arguments[1]||null;
            this.password=arguments[2]||null;
            this.fullName=arguments[3]||null;
            this.birthdate=arguments[4]||null;
            this.phoneNumber=arguments[5]||null;
            this.address=arguments[6]||null;   
            this.id=arguments[7]||null;        
        }

    }
    getId(){
        return this.id;
    }
    getLogin(){
        return this.login;
    }
    getEmail(){
        return this.email;
    }
    getPassword(){
        return this.password;
    }
    getBirthdate(){
        return this.birthdate;
    }
    getFullName(){
        return this.fullName;
    }
    getPhoneNumber(){
        return this.phoneNumber;
    }
    getAddress(){
        return this.address;
    }
}