import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import connectDB from "./config/database.js";
import verifyRoute from "./routes/verifyRoute.js";
import userRoute from "./routes/userRoute.js";
import meetingRoute from "./routes/meetingRoutes.js";
import {Server} from "socket.io";
import socketHandler from "./socket.js";
import path from "path";
import fs from "fs";

import { fileURLToPath } from "url";

dotenv.config({});

const app = express();

const server = http.createServer(app);

// Socket.IO Setup
const io = new Server(server, {
  cors: {
    // origin: "http://localhost:3000",
    origin: process.env.CLIENT_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

socketHandler(io);

const PORT = process.env.PORT || 5000;

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// const corsOption = {
//   origin: "http://localhost:3000",
//   credentials: true,
// };

const corsOption = {
  origin: process.env.CLIENT_ORIGIN,
  credentials: true,
};

app.use(cors(corsOption));

// Serve static files from 'uploads' folder
app.use("/uploads", express.static("uploads"));

// Routes
app.use("/api/v1/auth", verifyRoute);
app.use("/api/v1/user", userRoute);
app.use("/api/v1/meeting", meetingRoute);


// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);
// const clientBuildPath = path.resolve(__dirname, "../frontend/build");
// app.use(express.static(clientBuildPath));

// app.get("*", (req, res) => {
//   res.sendFile(path.resolve(clientBuildPath, "index.html"))
// });

server.listen(PORT, () => {
  connectDB();
  console.log(` Server with Socket.IO is listening on port ${PORT}`);
});

