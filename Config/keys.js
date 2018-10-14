//Keys.js - figure out what set of credentials to return

//NODE_ENV is a variable on heroku run-time.

if(process.env.NODE_ENV ==='production'){
  //we are in production - return the set of keys
  module.exports=require('./prod');
}
else{
  // we are in the development mode
  module.exports=require('./dev');
}

