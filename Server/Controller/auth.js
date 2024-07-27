
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
