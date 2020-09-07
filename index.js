"use strict";

const container=require("./infrastructure/infrastructureContainer.js");
const Server=require("./interfaces/server/index.js");

const {app}=container.cradle;
async function startApplication() {
  const newServer=new Server(app);
  await newServer.start();
}
startApplication();