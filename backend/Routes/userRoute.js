const express = require("express");
const Router = express.Router();
const {RegisterUser, Login, AllUsers} = require("../controllers/userController");
const { IsLogin } = require("../middilware/auth");

Router.route('/').post(RegisterUser)
Router.route('/login').post(Login)
Router.route('/users').get(IsLogin,AllUsers)


module.exports = Router;
