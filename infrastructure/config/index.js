const path=require('path');
const nconf = require('nconf');

module.exports=()=>{
  nconf.argv()
  .env()
  .file({ file: path.join(__dirname,"config.json")});
  return nconf;
};