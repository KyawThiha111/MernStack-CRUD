const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
require("dotenv").config();

const app = express();
app.set('view engine','ejs');
app.set('views','Views');

app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.urlencoded({extended:true}));

const userModel = require("./Model/user");
const {userRoutes} = require("./Routes/user");
const {authRoutes} = require("./Routes/auth");
const csrfProtection = csrf();
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
app.use(csrfProtection)
app.use(flash())
app.use((req,res,next)=>{
     res.locals.csrfToken = req.csrfToken(); 
    next()
})

app.use(userRoutes);
app.use(authRoutes);
app.use((req,res,next)=>{
    res.send("No page found");
})

mongoose.connect(process.env.MONGO_URL).then((result)=>{
    app.listen(3003);
    console.log("Successfully connected to db");
})

