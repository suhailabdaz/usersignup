const express=require("express")
const session = require('express-session');
const {router}=require("./router/router")
const nocache=require("nocache")
const adRouter=require("./router/adminrouter")
const app=express()

app.set("view engine","hbs")
app.use(express.static(__dirname + './public'));
app.use(express.urlencoded({extended:true}))
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));
app.use(nocache())
// app.use(function (req, res, next) {
//     res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
//     res.header('Expires', '-1');
//     res.header('Pragma', 'no-cache');
//     next()
// });

app.use("/",router)
app.use("/admin",adRouter)


app.listen(3000)