const express=require("express");
const { registerPartials } = require("hbs");
const router=express.Router()
router.use(express.urlencoded({extended:true}))
const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const handlebars = require('hbs');



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
        console.log("main extra");
       
    }
    // else if(req.session.isadAuth){
    //     res.redirect("/admin")
    // }
    else{
    res.render("login")
    }
})



router.get("/home",check,(req,res)=>{
        if(req.session.isAuth){
            const cardContents = [
                {
                    title: "India",
                    text: "In every corner of India, you'll find a story, in every taste, there's history, and in every smile, there's a warmth that touches your heart",
                    urlimg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lfzQk7NraNcuS87iT_B2IOjlfFJu4x_sWg&usqp=CAU"
                },
                {
                    title: "Italy",
                    text:"Within Italy's every nook,a story unfolds, in each bite, a culinary legacy beckons, and every greeting carries the embrace of heart." ,
                    urlimg: "https://www.state.gov/wp-content/uploads/2019/04/shutterstock_720444505v2-2208x1406-1.jpg"
                },
                {
                    title: "Turkiye",
                    text: "In Turkiye, every corner delights with history, mouthwatering cuisine, and warm, inviting hospitality.",
                    urlimg: "https://static.toiimg.com/photo/msid-89349701,width-96,height-65.cms"
                },
                {
                    title: "spain",
                    text: "In Spain, where history whispers, flavors dazzle, and the passionate spirit envelops you at every turn.",
                    urlimg: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkcmlkfGVufDB8fDB8fHww&w=1000&q=80"
                },
                {
                    title: "Turkiye",
                    text: "In Turkiye, every corner delights with history, mouthwatering cuisine, and warm, inviting hospitality.",
                    urlimg: "https://static.toiimg.com/photo/msid-89349701,width-96,height-65.cms"
                },
                {
                    title: "India",
                    text: "In every corner of India, you'll find a story, in every taste, there's history, and in every smile, there's a warmth that touches your heart",
                    urlimg: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5lfzQk7NraNcuS87iT_B2IOjlfFJu4x_sWg&usqp=CAU"
                },
                {
                    title: "spain",
                    text: "In Spain, where history whispers, flavors dazzle, and the passionate spirit envelops you at every turn.",
                    urlimg: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bWFkcmlkfGVufDB8fDB8fHww&w=1000&q=80"
                },
                {
                    title: "Italy",
                    text:"Within Italy's every nook,a story unfolds, in each bite, a culinary legacy beckons, and every greeting carries the embrace of heart." ,
                    urlimg: "https://www.state.gov/wp-content/uploads/2019/04/shutterstock_720444505v2-2208x1406-1.jpg"
                },
            ];
            res.render('home', { cardContents })
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
            res.render('login',{passerror:"Invalid Password"})
        
        }
    }
    catch{
        res.render('login', {nameerror:"Invalid username" })
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





