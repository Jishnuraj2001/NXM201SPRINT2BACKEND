const express=require("express");
const userRouter=express.Router();
const bcrypt = require('bcrypt');
const jwt=require("jsonwebtoken");
require("dotenv").config();
const fs=require("fs");

const{Usermodel}=require("../models/user.model");

userRouter.post("/signup",async(req,res)=>{
    const{name,email,password,role}=req.body;
    try {
        bcrypt.hash(password,7,async(err, hash)=>{
            if(hash){
                const user=new Usermodel({name,email,password:hash,role});
                await user.save();
                res.send({"message":"signup successful"});
            }else{
                res.send("signup failed!")
            }
        });
    } catch (error) {
        console.log(error.message);
        res.send("signup failed!!!!!");
    }
})

userRouter.post("/login",async(req,res)=>{
    const{email,password}=req.body;
    try {
        const user=await Usermodel.findOne({email});
        if(user){
            bcrypt.compare(password,user.password,(err, result)=>{
                if(result==true){
                    const token = jwt.sign({ userId:user._id,userRole:user.role },process.env.normal_secret,{ expiresIn: 60 });
                    const refresh_token = jwt.sign({ userId:user._id,userRole:user.role },process.env.refresh_secret,{ expiresIn:300 });
                    res.cookie("token",token,{httpOnly:true});
                    res.cookie("refresh_token",refresh_token,{httpOnly:true});
                    res.send("login successful");
                }else{
                    res.send("login failed!!,Wrong credentials");
                }
            });
        }else{
            res.send("Wrong credentials,login failed!!");
        }
    } catch (error) {
        console.log(error.message);
        res.send("login failed!!!!!");
    }
})

userRouter.get("/newtoken",async(req,res)=>{
    const refresh_token=req.cookies.refresh_token;
    try {
        if(refresh_token){
            jwt.verify(refresh_token,process.env.refresh_secret,(err, decoded)=>{
                if(decoded){
                    const token = jwt.sign({userId:decoded.userId,userRole:decoded.userRole},process.env.normal_secret,{ expiresIn: 60 });
                    res.cookie("token",token,{httpOnly:true});
                    res.send("token renewal successful.");
                }else{
                    res.send({"message":"connot get new token","err":err.message});
                }
              });
        }else{
            res.send("connot get new token");
        }
    } catch (error) {
        console.log(error.message);
        res.send("connot get new token!!!");
    }
})


userRouter.get("/logout",(req,res)=>{
    const token=req.cookies.token;
    if(token){
        const blacklist=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
        blacklist.push(token);
        fs.writeFileSync("./blacklist.json",JSON.stringify(blacklist));
        res.send("logged out successfully");
    }else{
        res.send("unable to logout");
    }
})



module.exports={
    userRouter
}