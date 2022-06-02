const { use } = require("./app");
const app = require("./app");
const dbConnection = require("./config/dbconnection");
const errorhandler = require("./ErrorHandlers/ErrorHandler");
const cloudinary = require("cloudinary").v2;
dbConnection();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

app.use(errorhandler);

const server = app.listen(process.env.PORT, () => {
  console.log(`server Listning to Localhost:${process.env.PORT}`);
});

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000/",
  },
});

io.on("connection", (socket) => {
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User join to chat :" + room);
  });

  socket.on('typing',(room) => socket.in(room).emit('typing'))
  socket.on('stop typing',(room) => socket.in(room).emit('stop typing'))

  socket.on("newMessage", (newMessage) => {
    const chat = newMessage.chat;
    chat.users.forEach((user) => {
      if (user._id === newMessage.sender._id) {
        return;
      }
      socket.in(user._id).emit("messageRecieved", newMessage);
    });
  });
});
