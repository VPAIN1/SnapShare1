import app from "./src/app.js";
import express from 'express';
import 'dotenv/config' 
import connectDB from './src/config/db.js'

connectDB();

const PORT = process.env.PORT;
app.listen(PORT,()=>{
    console.log(`Server Connected To Port : ${PORT}`);
})