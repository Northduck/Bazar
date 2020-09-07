let service = require('express').Router();
let checkServiceID=require("../../controllers/services/checkServiceID.js");
let servicePage=require("../../controllers/services/servicesPage.js");
let newfeedbackHandler=require("../../controllers/services/newFeedback");
let isAuthorized=require("../../middlewares/isAuthorized.js");
service.post("/services/newfeedback/:serviceId\?",isAuthorized,newfeedbackHandler);

service.get("/services/:serviceId",checkServiceID,servicePage);

module.exports=service;