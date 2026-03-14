const mongoose = require('mongoose');
const { ref } = require('process');

const userSchema = new mongoose.Schema({
    username:{type:String , required:true , unique:true , trim:true},
    email:{type:String , required:true , unique:true , lowercase:true},
    password:{type:String , required:true},
    avatar:{type:String , default:""},
    role:{type:String , enum:["user" , "admin"] , default:"user"},
    solvedProblems:[{
        type:mongoose.Schema.Types.ObjectId, ref: "Problem"
    }],
    submissions : [{
        type:mongoose.Schema.Types.ObjectId, ref:"Submission"
    }],
    streak:{type:Number,default:0},
    lastSolvedDate:{type:Date}


},{timestamps : true});

module.exports = mongoose.model("User",userSchema);