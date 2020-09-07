const express=require("express");
const appRoot = require('app-root-path');
module.exports=express.static(appRoot+'/public/');