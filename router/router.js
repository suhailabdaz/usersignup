const express=require("express");
const { registerPartials } = require("hbs");
const router=express.Router()
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
router.use(express.urlencoded({extended:true}))


mongoose.connect("mongodb://127.0.0.1:27017/details")
.then(console.log("done"))
.catch((err)=>console.log(err));

const usersSchema = new mongoose.Schema({
    username: String,
    email:String,
    password: String
})

const usersModel=new mongoose.model("users",usersSchema)

function check(req,res,next){
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect("/")
    }
}

router.get("/",(req,res)=>{
    if(req.session.isAuth){
        res.redirect("/home")
    }
    else{
    res.render("login")
    }
})

router.get("/home",check,(req,res)=>{
        if(req.session.isAuth){
            res.render("home")
        }
        else{
            res.redirect("/")
        }
})

router.post('/loginaction', async(req, res) => {
    try {
        const data = await usersModel.findOne({ username: req.body.username })
        const passwordMatch= await bcrypt.compare(req.body.password,data.password)
        if(passwordMatch){
            req.session.username = req.body.username;
            req.session.isAuth = true;
            res.redirect("/home")
        }
        else {
            res.render('login',{ passerror:"Invalid Password"})
        }
    }
    catch{
        res.render('login', { nameerror:"Invalid username" })
    }

})
router.get("/home",(req,res)=>{

    res.render("home")

})
router.get("/signup",(req,res)=>{
    res.render("signup")
})
router.post('/signaction', async (req, res) => {
    const emexist=await usersModel.findOne({email:req.body.email})
    if(emexist){
        res.render('signup',{emexist:"E-mail Already Exist"})
    }
    else{
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await usersModel.insertMany([{username:req.body.username,email:req.body.email,password:hashedPassword}])
    res.redirect('/')
    }
})

router.get("/logout",(req,res)=>{
    req.session.isAuth=false
    req.session.destroy()
    res.redirect("/")
})

    module.exports={router,usersModel}





