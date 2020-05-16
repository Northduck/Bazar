let service = require('express').Router();
let servicePage=require("../../controllers/services/servicesPage.js");
service.post("/services/newfeedback/:categoryId([^]*)\?",require("../../controllers/services/newFeedback"));

service.get("/services/:serviceId([^]*)",servicePage);

module.exports=service;