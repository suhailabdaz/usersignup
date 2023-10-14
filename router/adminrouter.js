const express=require("express");
const adrouter=express.Router()
const mongoose=require("mongoose")
adrouter.use(express.urlencoded({extended:true}))

mongoose.connect("mongodb://127.0.0.1:27017/details")
.then(console.log("done in admin"))
.catch((err)=>console.log(err));

const adminSchema = new mongoose.Schema({
    username: String,
    password: String
})

const adminModel=new mongoose.model("adusers",adminSchema)

function adcheck(req,res,next){
    if(req.session.isAuth){
        next()
    }
    else{
        res.redirect("/admin")
    }
}

adrouter.get("/",(req,res)=>{
    if(req.session.isAuth){
        res.redirect("/admin/adminpanel")
    }
    else{
    res.render("admin")
    }
    
})

adrouter.get("/adminpanel",adcheck,(req,res)=>{
    if(req.session.isAuth){
        res.render("adminpanel")
    }
    else{
        res.redirect("/admin")
    }
})


adrouter.post("/adminlogin",async(req,res)=>{
        try{
            const data=await adminModel.findOne({username:req.body.username})
            if(data.password==req.body.password){
                req.session.isAuth=true;
                res.redirect("/admin/adminpanel")
            }
            else{
                res.render('admin', { passworderror: "Invalid Password" })
            }
        }
        catch (error) {
            console.log(error);
            res.status(500).send("Internal Server Error");
        }
    })




module.exports=adrouter