const userModel = require("../Model/user");
const bcryptjs = require("bcryptjs");
const nodeMailer = require("nodemailer");
require("dotenv").config();

const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth:{
    user:process.env.SENDER_MAIL,
    pass: process.env.MAIL_PASSWORD
  }
})
exports.getSignup = (req, res) => {
  res.render("Auth/signup", { title: "Sign Up",userExistMessage:req.flash('error') });
};

exports.postSignup = async(req,res)=>{
  const {username,email,password} = req.body;
  try {
    const user = await userModel.findOne({
      $or: [
        {username:username},
        {email:email}
      ]
    })
    if(user){
      req.flash('error','User already exists!')
     return res.redirect("/signup")
    }
    const hashedPW = await bcryptjs.hash(password,8);
    await userModel.create({username:username,email:email,password:hashedPW});
    console.log("Successfully Signed Up!")
    await transporter.sendMail({
      from: process.env.SENDER_MAIL,
      to : email,
      subject:"Successfully Signed Up!",
      text: "Welcome to our website!",
      html: "<p class='text-success'>Don't forget to add friends.</p>"
    })
    return res.redirect("/login")
  } catch (error) {
    console.log(error)
    return res.status(500).send("Server error");
  }
}

exports.getLoginRoute = (req, res) => {
  res.render("Auth/login", { title: "Login",errorMsg:req.flash("error") });
};

 exports.postLogin = async (req, res) => {
   const {username,email,password} = req.body;
   try {
    const user = await userModel.findOne({
      $and: [
        {username:username},
        {email:email}
      ]
    });
    if(!user){
      req.flash("error","User Not Found!")
      return res.redirect("/login")
    }
    
    const isMatch = await bcryptjs.compare(password,user.password);
    if(!isMatch){
     return res.redirect("/login")
    }else{
     req.session.isLogin = true
     req.session.userInfo = user
     req.session.save(err=>{
         if(err){
             console.log(err)
             return
         }
         return res.redirect("/user/")
     })
    }
   } catch (error) {
     console.log(error)
   }
}

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session");
    }
    res.redirect("/user/");
  });
};
