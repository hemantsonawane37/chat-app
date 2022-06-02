const express = require("express");
const { accessChat, fetchChats, CreateGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controllers/chatController");
const { IsLogin } = require("../middilware/auth");
const Router = express.Router();


Router.route('/accesschat').post(IsLogin,accessChat)
Router.route('/fetchchats').get(IsLogin,fetchChats)
Router.route('/creategroupchat').post(IsLogin,CreateGroupChat);
Router.route('/renamegroup').put(IsLogin,renameGroup);
Router.route('/removefromgroup').put(IsLogin,removeFromGroup);
Router.route('/addtogroup').put(IsLogin,addToGroup);









module.exports = Router;
