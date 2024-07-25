const Blogs = require("../Model/post");

exports.mainRoute = ((req,res)=>{
    Blogs.find().sort({createdAt: -1}).populate("userid","username").then(result=>{
        res.render("main",{title:"Main Page", Blogs:result});
        console.log(result)
    }).catch(err=>{
        console.log(err)
    })
})

exports.mainRouteRedirect= ((req,res)=>{
    res.render("/user/")
})

exports.addPostRoute = ((req,res)=>{
     res.render("newPost",{title:"Add Post Page"}); 
})

exports.addPostRouteRedirect = ((req,res)=>{
    res.redirect("user/addpost")
})

exports.addPostPostRoute = ((req,res)=>{
    const {title,snippet,blogtext} = req.body;
    Blogs.create({title,snippet,blogtext,userid:req.user}).then((result)=>{
        res.redirect("/user/")
    }).catch(err=>{
        console.log(err)
    })
})

exports.showEachRoute = ((req,res)=>{
    const ID = req.params.id;
    Blogs.findById(ID).then((result)=>{
    res.render("eachPost",{title:"Each Post",post:result})
    }).catch(err=>{
        console.log(err)
    })
})

exports.editPostRoute = ((req,res)=>{
    const id = req.params.id;
    Blogs.findById(id).then((result)=>{
        res.render("editPost",{title:"Edit Page", post:result})
    }).catch(err=>{
        console.log(err)
    }
    )
})

exports.editFormPost = (req,res)=>{
    const {title,snippet,blogtext,id} = req.body;
    Blogs.findByIdAndUpdate(id,{title,snippet,blogtext}).then(result=>{
         res.redirect("/user/")
    }).catch(err=>{
        console.log(err)
    }
    )
}

exports.deletePost = (req,res)=>{
    const id = req.params.id;
    Blogs.findByIdAndDelete(id).then((result)=>{
        res.redirect("/user/")
    }).catch(err=>{
        console.log(err)
    })
}
