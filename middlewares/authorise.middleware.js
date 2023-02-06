

const authorizer=(access)=>{
    return (req,res,next)=>{
        const userRole=req.body.userRole;
        if(access.includes(userRole)){
            next();
        }else{
            res.send("You are not Authorised");
        }
    }
}

module.exports={
    authorizer
}