const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.set('view engine','ejs');
app.set('views','Views');
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use(express.urlencoded({extended:true}));

const {userRoutes} = require("./Routes/user");
app.use(userRoutes);

app.use((req,res,next)=>{
    res.send("No page found");
    next();
})

mongoose.connect(process.env.MONGO_URL).then((result)=>{
    console.log(result);
    app.listen(3003);
    console.log("Successfully connected to db");
})
