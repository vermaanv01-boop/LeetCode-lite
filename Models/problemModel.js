const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
    tittle:{type:String,required:true,unique:true,trim:true},
    description:{type:String,required:true},
    difficulty:{type:String,enum:["Easy","Medium","Hard"],required:true},
    tags:{type:String},
    constraints:{type:String},
    examples:[{input:String,ouput:String,explaination:String}],
    starterCode:{type:String},
    testCases:[{input:String,output:String}],
    createdBy:{type:mongoose.Schema.Types.ObjectId,ref:"User"}
},{timestamps:true});

module.exports=mongoose.model("Problem",problemSchema)