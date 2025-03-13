import "dotenv/config";
import http from "http";
import app from "./app.js";
import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Project from "./models/project.model.js";
import User from "./models/user.model.js";
import { generateResult } from "./services/ai.service.js";

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

// Socket IO auth middleware
io.use(async (socket, next) => {
  try {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers.authorization?.split(" ")[1];
    const projectId = socket.handshake.query.projectId;

    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      return next(new Error("Invalid Project ID"));
    }

    socket.project = await Project.findById(projectId);

    if (!token) {
      return next(new Error("Authentication Error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return next(new Error("Invalid Token"));
    }

    socket.user = decoded;
    next();
  } catch (error) {
    next(error);
  }
});

io.on("connection", (socket) => {
  socket.roomId = socket.project._id.toString();

  console.log("a user connected");

  // Join the room -> In this case it is the current project
  socket.join(socket.roomId);

  socket.on("project-message", async (data) => {
    const senderId = data.sender;

    const user = await User.findById(senderId);

    socket.broadcast
      .to(socket.roomId)
      .emit("project-message", { text: data.message, user });

    const userMessage = data.message;

    const aiIsPresentInMessage = userMessage.includes("@ai");

    if (aiIsPresentInMessage) {

        const prompt = userMessage.replace('@ai' , '');

        const result = await generateResult(prompt);


        io.to(socket.roomId).emit('project-message' , {

            text:result,
            user:{

                _id: 'ai',
                email: 'AI'
            }
        })

        return;
    }

    
  });
  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.leave(socket.roomId);
  });
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
