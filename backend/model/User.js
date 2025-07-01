import mongoose from "mongoose";


const userModel= mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
   
    email:{
          type:String,
    },
   
    
    contact:{
        type: Number,
        required:true,
   
    },
    isAdmin:{
        type:Boolean,
    },
    passWord:{
         type:String,
         required:true
    },
    contestgiven:[{type:String}]
},{timestamps:true})

export const  User =mongoose.model("User",userModel);