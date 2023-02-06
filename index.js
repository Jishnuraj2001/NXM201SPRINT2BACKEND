const mongoose=require("mongoose");
mongoose.set('strictQuery', true);

const cookieParser = require('cookie-parser')
const express=require("express");
const app=express();
app.use(express.json());
app.use(cookieParser());
require("dotenv").config();


const{connection}=require("./config/db");
const{userRouter}=require("./routes/user.router");
const{productRouter}=require("./routes/product.router");

app.get("/",(req,res)=>{
    res.send("basic API endpoint");
})

app.use("/users",userRouter);
app.use("/products",productRouter);


app.listen(process.env.port,async()=>{
    try {
        await connection;
        console.log("Connected to DB");
        console.log(`server is running at http://localhost:${process.env.port}`);
    } catch (error) {
        console.log(error.message);
        console.log("Unable to Connect to DB");
    }
})
