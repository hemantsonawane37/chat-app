const express = require("express")
const app = express()
app.use(express.json({limit:'5mb'}))
if(process.env.NODEENV !== "Production") require("dotenv").config({path:"backend/config/.env"})
const cors = require('cors');
app.use(cors())
const cookieParser = require('cookie-parser');
const messageRoutes = require("./Routes/messagesRoute");
const userRoutes = require("./Routes/userRoute");
const chatRoutes = require("./Routes/chatRoutes");
const path = require("path");

//Router.route('/').post(IsLogin,renameGroup);

app.use(cookieParser())




app.use("/api/v1",messageRoutes)
app.use("/api/v1",userRoutes)
app.use("/api/v1",chatRoutes)

app.use(express.static(path.join(__dirname,"../frontend/build")))
app.get("*",(req,res)=> {
    res.sendFile(path.join(__dirname,"../frontend/build/index.html"))
})



module.exports = app ;