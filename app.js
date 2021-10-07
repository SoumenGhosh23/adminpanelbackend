const dotenv=require("dotenv");
const mongoose=require("mongoose"); 
const express=require("express");
const port =process.env.PORT || 5000;
const app=express();


dotenv.config({path:'./config.env'});
require('./db/conn');

app.use(express.json());
app.use(require('./rout/routing'))

app.get('/',(req,res)=>{
    res.send("homepoage");
})
app.listen(5000,()=>{
    console.log("Server is no port 5000");
})