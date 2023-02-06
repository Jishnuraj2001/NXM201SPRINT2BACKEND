const mongoose=require("mongoose");

const userSchema=mongoose.Schema({
    name:String,
    email:String,
    password:String,
    role:{type:String,enum:["customer","manager"],default:"customer"}
})

const Usermodel=mongoose.model("user",userSchema);

module.exports={
    Usermodel
}