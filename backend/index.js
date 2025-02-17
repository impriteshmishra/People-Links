import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import connectDB from "./utils/database.js";
import userRoute from "./routes/user.route.js";
import postRoute from "./routes/post.route.js";
import messageRoute from "./routes/message.route.js";
import { app, server } from "./socket/socket.js";
import path from "path";


dotenv.config({});


const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// console.log("directory name",__dirname);


// app.get("/", (req, res) => {
//     return res.status(200).json({
//         message: "Hey from backend.",
//         success: true
//     })
// })


//middleware
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.URL_FRONTEND,
    credentials: true
}
app.use(cors(corsOptions));

//here api call
app.use("/api/v1/user", userRoute);
app.use("/api/v1/post", postRoute);
app.use("/api/v1/message", messageRoute);


//deploying setup (backend automatically surf the frontend)
app.use(express.static(path.join(__dirname, "frontend", "dist")));
app.get("*", (req,res)=>{
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))  //path to get frontend
})

server.listen(PORT, () => {
    connectDB();
    console.log(`Server listen from ${PORT}`);
})