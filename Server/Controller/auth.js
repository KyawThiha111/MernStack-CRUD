
exports.getLoginRoute = ((req,res)=>{
    res.render("Auth/login",{title:"Login"})
})

exports.postLogin = ((req,res)=>{
    res.setHeader("Set-Cookie","isLogin=true");
    res.redirect("/user/");
})