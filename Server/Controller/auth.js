const userModel = require("../Model/user");
exports.getSignup = ((req,res)=>{
    res.render("Auth/signup",{title:"Sign Up"})
})

exports.postSignup = ((req,res)=>{
    const {username,email,password} = req.body;
    userModel.findOne({
        $or: [
            {username:username},
            {email:email},
            {password:password}
        ]
    }).then(user=>{
        if(user){
           return res.redirect("/signup")
        }
        return userModel.create({username,email,password}).then(result=>{
            console.log("Signed Up");
            res.redirect("/login")
        })
    }).catch((err)=>{
        console.log(err)
    })
})
exports.getLoginRoute = ((req,res)=>{
    res.render("Auth/login",{title:"Login"})
})

exports.postLogin = ((req,res)=>{
    req.session.isLogin = true;
    res.redirect("/user/");
})

exports.postLogout = ((req,res)=>{
    req.session.destroy((err)=>{
        if(err){
            return res.status(500).send('Failed to destroy session');
        }
        res.redirect("/user/");
    })
})
