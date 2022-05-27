const express = require("express");
const app = express();
const mongoose = require('mongoose')
const PORT = 5000;
const {MONGOURL} = require('./keys')

mongoose.connect(MONGOURL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})

//OklPsnUPMhyIPuhu

mongoose.connection.on('connected',()=>{
    console.log("Mongo Started")
})

mongoose.connection.on('error',(err)=>{
    console.log("Error :",err)
})


app.listen(PORT, () => {
  console.log("app is running on", PORT);
});
