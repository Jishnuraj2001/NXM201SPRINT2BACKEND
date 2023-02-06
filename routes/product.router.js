const express=require("express");
const productRouter=express.Router();

const{authenticator}=require("../middlewares/authenticate.middleware");
const{authorizer}=require("../middlewares/authorise.middleware");


productRouter.get("/",authenticator,(req,res)=>{
    res.send("all the products");
})

productRouter.get("/goldrate",authenticator,(req,res)=>{
    res.send("here is the gold ratess");
})

productRouter.get("/userstats",authenticator,authorizer(["manager"]),(req,res)=>{
    res.send("here is the user statss");
})

module.exports={
    productRouter
}