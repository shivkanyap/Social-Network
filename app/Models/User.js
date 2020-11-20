const mongoose =require('mongoose')
const Schema =mongoose.Schema

const userSchema=new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        type:String,
       
    },
    date:{
        type:String,
        default:Date.now
        // required:true
    }

})

module.exports=User=mongoose.model('users',userSchema)