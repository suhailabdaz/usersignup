const express=require("express");
const adrouter=express.Router()
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")

const {usersModel}=require("./router")
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
    if(req.session.isadAuth){
        next()
    }
    else{
        res.redirect("/admin")
    }
}

adrouter.get("/",(req,res)=>{
    if(req.session.isadAuth){
        res.redirect("/admin/adminpanel")
    }
    else{
    res.render("admin")
    }
    
})

// adrouter.get("/adminpanel",adcheck,(req,res)=>{
//     if(req.session.isAuth){
//         res.render("adminpanel")
//     }
//     else{
//         res.redirect("/admin")
//     }
// })


adrouter.post("/adminlogin",async(req,res)=>{
        try{
            const data=await adminModel.findOne({username:req.body.username})
            if(data.password==req.body.password){
                req.session.isadAuth=true;
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

    adrouter.get("/adlogout",(req,res)=>{
        req.session.isadAuth=false;
        req.session.destroy()
        res.redirect("/admin")
    })

    adrouter.route('/adminpanel').get( adcheck, async (req, res) => {
        if (req.session.isadAuth) {
    
            const data = await usersModel.find({});
            res.render('adminpanel', { users: data })
        }
        else{
            ren.redirect("/admin")
        }
    }).post(adcheck,async(req,res)=>{
        if (req.session.isadAuth) {
            const name=req.body.search;
            const data = await usersModel.find({username:{$regex:new RegExp(name,'i')}});
            res.render('adminpanel', { users: data })
        } else {
            res.redirect('/admin')
        }
        })

    adrouter.route("/adduser").get(adcheck,(req,res)=>{
        res.render("adduser")

    })

    adrouter.post("/addnewuser",async(req,res)=>{
        const emailexists=await usersModel.findOne({email:req.body.email})
        if(emailexists){
            res.render("adduser",{erroremail:"email exists"})
        }
        else{
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await usersModel.insertMany([{username:req.body.username,email:req.body.email,password:hashedPassword}])
            res.redirect('/admin/adminpanel')
            }
       
    })

    adrouter.get('/delete/:email',adcheck,async (req, res) => {
        if (req.session.isadAuth) {
            const useremail = req.params.email;
            await usersModel.deleteOne({email:useremail})
            res.redirect('/admin/adminpanel')
        } else {
            res.redirect('/admin')
        }
    })

    adrouter.get('/update/:email', adcheck, async (req, res) => {
        if (req.session.isadAuth) {
            const useremail = req.params.email;
            const user = await usersModel.findOne({ email: useremail })
            res.render('update', { data: user })
        } else {
            res.redirect('/admin')
        }
    })
    adrouter.post('/update/:email', adcheck, async (req, res) => {
        if (req.session.isadAuth) {
            const useremail = req.params.email;
            await usersModel.updateOne({email:useremail }, { username: req.body.username, email:req.body.email })
            res.redirect('/admin/adminpanel')
        }
        else {
            res.redirect('/admin')
        }
    })





module.exports=adrouter