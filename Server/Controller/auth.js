const userModel = require("../Model/user");
const bcryptjs = require("bcryptjs");
const nodeMailer = require("nodemailer");
const crypto = require("crypto")
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
  res.render("Auth/login", { title: "Login",errorMsg:req.flash("message") });
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
      req.flash("message","User Not Found!")
      return res.redirect("/login")
    }
    const isMatch = await bcryptjs.compare(password,user.password);
    if(!isMatch){
     return res.redirect("/login")
    }else{
      user.shitty = "Some Info"
      user.tokenExpiration = Date.now() + 10000
      user.save()
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

exports.changePasswordGetRoute = (req,res)=>{
  const Message = req.flash("message")
  res.render("Auth/changePWEmail",{title:"change password",Message})
}

/*sendemailtoresetPassword */
exports.sendemailtoresetPasswordPost = async (req,res)=>{
  const {email} = req.body;
 try {
   const token = await crypto.randomBytes(32).toString("hex");
    const user = await userModel.findOne({email});
    if(!user){
      req.flash("message","No user found!")
      return res.redirect("/login/changepassword")
    }
     user.token = token;
     user.tokenExpiration = Date.now() + 300000;
     await user.save();
     await transporter.sendMail({
      from: process.env.SENDER_MAIL,
      to: email,
      subject: "Hello!",
      html:`<h1>Here is the link to change your password.</h1> <a target="_blank" href="http://localhost:3003/login/changepwpage/${token}">Click Here</a>`
     })
     req.flash("message","Message Successfully Sent to your gmail!")
     res.redirect("/login/changepassword")
     console.log(user)
 } catch (error) {
     console.log(error)
 }
}

/* Change PW page */
exports.getchangePWpage =async (req,res)=>{
  const token = req.params.token;
  const user = await userModel.findOne({
    $and:[
      {token:token},
      {tokenExpiration: {$gt: new Date(Date.now())}} 
    ] 
  })
  if(!user){
    req.flash("message","Link Expired")
    return res.redirect("/login/changepassword")
  }
  console.log(user.tokenExpiration)
  console.log(new Date(Date.now()))
  res.render("Auth/changePWpage",{title:"Reset Password",user,message:req.flash("message")})
}

/* Change Password Post Route */
exports.changePasswordPostRoute = async (req,res)=>{
 const {password,confirm_password,id,token,tokenExpiration} = req.body;

 try {
  if(password!==password){
     req.flash("message","Check you new password!")
     return res.redirect(`/login/changepwpage/${token}`)
  }
  const user = await userModel.findOne({_id:id,token,tokenExpiration:{$gt:new Date(Date.now())}});
  if(!user){
    req.flash("message","Error! Try Again")
    return res.redirect("/login/changepassword")
  }
  const hashedPassword = await bcryptjs.hash(password,8);
   user.password = hashedPassword;
   user.token = ""
   user.tokenExpiration = new Date(Date.now())
   user.save()
   req.flash("message","You have changed your password!")
   res.redirect("/login");
 } catch (error) {
   console.log(error)
 }
}

