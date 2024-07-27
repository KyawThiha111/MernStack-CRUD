const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

const app = express();
app.set('view engine','ejs');
app.set('views','Views');
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.urlencoded({extended:true}));

const userModel = require("./Model/user");
const {userRoutes} = require("./Routes/user");
const {authRoutes} = require("./Routes/auth");
const store = new MongoDBStore({
    uri:process.env.MONGO_URI ,
    collection: "sessions"
})
app.use(session({
    secret:process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: store
}))

app.use((req,res,next)=>{
    userModel.findById("66a10e8806bcc00eecdff8a0").then(user=>{
       req.user = user;
       next();
    })  
})
app.use(userRoutes);
app.use(authRoutes);
app.use((req,res,next)=>{
    res.send("No page found");
})

mongoose.connect(process.env.MONGO_URL).then((result)=>{
    app.listen(3003);
    console.log("Successfully connected to db");
    
    userModel.findOne().then(user=>{
        if(!user){
            return userModel.create({username:"User1",email:"user1@gmail.com",password:"user123"}).then(result=>{
                console.log(result)
            })
        }
        return user;
    }).catch(err=>{
        console.log(err)
    })
})

