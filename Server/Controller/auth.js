const userModel = require("../Model/user");
const bcryptjs = require("bcryptjs");
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
      $or: [
        {username:username}
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
