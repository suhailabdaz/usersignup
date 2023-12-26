const express=require("express")
const session = require('express-session');
const {router}=require("./router/router")
const nocache=require("nocache")
const adRouter=require("./router/adminrouter")
const app=express()

app.use(express.urlencoded({extended:true}))
app.set("view engine","hbs")
app.use(express.static(__dirname + '/public'));


app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(nocache())


app.use("/",router)
app.use("/admin",adRouter)

app.get("*",(req,res)=>{
    res.status(404).send("page not found")
})



app.listen(3000)