const express = require('express')
const Route = express.Router();
const postController = require("../Controller/post");
const {isLoginMW}  = require("../Middleware/loginMW")
Route.get("/user",postController.mainRoute)
Route.get("/",postController.mainRouteRedirect)
Route.get("/user/addpost",isLoginMW,postController.addPostRoute)
Route.get("/addpost",isLoginMW,postController.addPostRouteRedirect)
Route.post("/user/addpost",isLoginMW,isLoginMW,postController.addPostPostRoute);
Route.get("/user/addpost/:id",isLoginMW,postController.showEachRoute);
 Route.get("/user/addpost/edit/:id",isLoginMW, postController.editPostRoute);
Route.post("/user/addpost/edit/:id",isLoginMW, postController.editFormPost); 
Route.get("/user/addpost/delete/:id",isLoginMW, postController.deletePost)
module.exports = {userRoutes:Route};
