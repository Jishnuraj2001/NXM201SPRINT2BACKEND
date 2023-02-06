const fs=require("fs");
const jwt=require("jsonwebtoken");
require("dotenv").config();

const authenticator=(req,res,next)=>{
    const token=req.cookies.token;
    if(token){
        const blacklist=JSON.parse(fs.readFileSync("./blacklist.json","utf-8"));
        if(blacklist.includes(token)){
            res.send("YOu have to login again.");
        }else{
            jwt.verify(token,process.env.normal_secret,(err, decoded)=>{
                if(decoded){
                    req.body.userRole=decoded.userRole;
                    next();
                }else{
                    res.send({"message":"please login again","err":err.message});
                }
              });
        }
    }else{
        res.send("login First!");
    }
}

module.exports={
    authenticator
}