const express = require('express')
const Route = express.Router();
const postController = require("../Controller/post");

Route.get("/user",postController.mainRoute)
Route.get("/",postController.mainRouteRedirect)
Route.get("/user/addpost",postController.addPostRoute)
Route.get("/addpost",postController.addPostRouteRedirect)
Route.post("/user/addpost",postController.addPostPostRoute);
Route.get("/user/addpost/:id",postController.showEachRoute);
Route.get("/user/addpost/edit/:id", postController.editPostRoute);
Route.post("/user/addpost/edit/:id", postController.editFormPost);
Route.get("/user/addpost/delete/:id", postController.deletePost)
module.exports = {userRoutes:Route};
