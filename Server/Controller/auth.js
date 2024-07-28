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

exports.postLogin = (req, res) => {
   const {username,email,password} = req.body;
   userModel.findOne({username}).then(user=>{
    if(user){
        return bcryptjs.compare(password,user.password).then(isMatch=>{
            if(isMatch){
               req.session.isLogin = true
               req.session.userInfo = user
               req.session.save(err=>{
                  console.log(err);
                  return res.redirect("/user/")
               })
            }else{
                return res.redirect("/login")
            }
        }).catch(err=>{
            console.log(err)
        })
    }
    return res.redirect("/login")
   }).catch(err=>{
    console.log(err)
   })
};

exports.postLogout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).send("Failed to destroy session");
    }
    res.redirect("/user/");
  });
};
