const express = require("express");
const Route = express.Router();
const AuthRoutes = require("../Controller/auth")

Route.get("/login",AuthRoutes.getLoginRoute);
Route.post("/login",AuthRoutes.postLogin);
module.exports = {authRoutes: Route};