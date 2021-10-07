const express = require("express");
const Admin = require("../model/adminSchema");
const Contents= require("../model/contentSchema");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt=require("jsonwebtoken");
const cookieParser = require('cookie-parser')
const authenticate=require("../middlewar/authenticate")

// connect to database
require('../db/conn');
router.use(cookieParser());

// HOME PAGE 
router.get('/', (req, res) => {
    res.send("homePage server");
})

router.post('/signup', async (req, res) => {

    const { name, email, password } = req.body;

    try {
        const admin = new Admin({ name, email, password });
        await admin.save();
        res.status(201).json({ message: "admin sign up success" });
    } catch (err) {
        console.log(`error is ${err}`);
    }
})

// LOGIN PAGE
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
   
    try {
        if (!email || !password) {
            res.status(400).json({ error: "Please fill the all data" })
        }
        const adminLogin = await Admin.findOne({ email: email })

        if (adminLogin) {
            const isMatch = await bcrypt.compare(password, adminLogin.password);
            const token= await adminLogin.generateAuthToken();
            res.cookie("jwtoken",token,{
                expires:new Date(Date.now()+25892000000),
                httpOnly:true
            })
            

            if (!isMatch) {
                res.status(400).json({ error: "Invalid email or password" })
            } else {
                res.json({ message: "Login succeeessfull" })
            }
        } else {
            res.status(400).json({ error: "Invalid email or password" })
        }
    } catch (err) {
        console.log(`error is ${err}`);
    }

})


// AUTHENTICATION 
router.get('/admin',authenticate,(req,res)=>{
    res.send(req.rootAdmin);
})



// UPADATE THE CONTENT OF DIV
router.patch("/content/:id",async (req,res)=>
{
    try{
        const _id=req.params.id;
        const changeContent = await Contents.findByIdAndUpdate(_id,req.body,{
            new:true
        });
        res.status(201).json({ message: "success" });

    }catch(err)
    {
        res.status(500).send(err)
        console.log(err);
    }
})

// GET ALL DATA OF API
router.get("/homecontents",async (req,res)=>{
    try{

        const getContent=await Contents.find({});
        res.send(getContent);
    }catch(err){
        res.status(400).send(err);
    }
})

// LOGOUT PAGE
router.get("/logout",(req,res)=>{
    res.clearCookie("jwtoken",{path:'/'});
    res.status(200).send("Logout")
})


module.exports = router;