const { PostMessage, GetAllMessages } = require("../controllers/messagesController");
const { IsLogin } = require("../middilware/auth");

const Routes = require("express").Router();


Routes.route("/message/sent").post(IsLogin,PostMessage);
Routes.route("/message/messages").get(IsLogin,GetAllMessages);





module.exports = Routes;