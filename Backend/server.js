import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js"; 
import 'dotenv/config';
import connectDB from './src/config/db.js';

connectDB();

const server = http.createServer(app);
const io = new Server(server, {
    cors: { 
        origin: [
            "http://localhost:5173",                 
            "https://snapshare-oj60.onrender.com"    
        ], 
        methods: ["GET", "POST"],
        credentials: true
    }
});

app.set("socketio", io);

io.on("connection", (socket) => {
    socket.on("disconnect", () => {
    });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(`Server Connected To Port : ${PORT}`);
});