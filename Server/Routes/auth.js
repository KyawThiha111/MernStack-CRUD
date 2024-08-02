const express = require("express");
const Route = express.Router();
const AuthRoutes = require("../Controller/auth")

Route.get("/signup",AuthRoutes.getSignup);
Route.post("/signup",AuthRoutes.postSignup)
Route.get("/login",AuthRoutes.getLoginRoute);
Route.post("/login",AuthRoutes.postLogin);
Route.post("/logout",AuthRoutes.postLogout);
Route.get("/login/changepassword",AuthRoutes.changePasswordGetRoute);
Route.post("/login/sendemailtoresetPassword",AuthRoutes.sendemailtoresetPasswordPost);
Route.get("/login/changepwpage/:token",AuthRoutes.getchangePWpage)
Route.post("/login/resetPassword",AuthRoutes.changePasswordPostRoute)
module.exports = {authRoutes: Route};