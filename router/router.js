const express=require("express");
const { registerPartials } = require("hbs");
const router=express.Router()
const mongoose=require("mongoose")
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

router.post("/loginaction",async(req,res)=>{
    try{
        const data=await usersModel.findOne({username:req.body.username})
        if(data.password==req.body.password){
            req.session.isAuth=true;
            res.redirect("/home")
        }
        else{
            res.render('login', { passerror: "Invalid Password" })
        }
    }
    catch{
        const error="wrong"
        console.log(error)
    }
})
router.get("/home",(req,res)=>{

    res.render("home")

})
router.get("/signup",(req,res)=>{
    res.render("signup")
})
router.post("/signaction",async(req,res)=>{
await usersModel.insertMany([{username:req.body.username,email:req.body.email,password:req.body.password}])
    res.redirect('/')
})

router.get("/logout",(req,res)=>{
    req.session.isAuth=false;
    req.session.destroy()
    res.redirect("/")
})




    module.exports=router





