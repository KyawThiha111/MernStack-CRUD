const userModel = require("../Model/user");
const bcryptjs = require("bcryptjs");
exports.getSignup = (req, res) => {
  res.render("Auth/signup", { title: "Sign Up" });
};

exports.postSignup = (req, res) => {
  const { username, email, password } = req.body;
  userModel
    .findOne({
      $or: [{ username: username }, { email: email }, { password: password }],
    })
    .then((user) => {
      if (user) {
        return res.redirect("/signup");
      }
      bcryptjs.hash(password, 8).then((encryPassword) => {
        userModel
          .create({ username, email, password: encryPassword })
          .then((result) => {
            console.log("Signed Up");
            res.redirect("/login");
          });
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
exports.getLoginRoute = (req, res) => {
  res.render("Auth/login", { title: "Login" });
};

exports.postLogin = async (req, res) => {
   const {username,email,password} = req.body;
   const user = await userModel.findOne({username});
   if(!user){
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
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session");
    }
    res.redirect("/user/");
  });
};
