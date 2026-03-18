const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  problem:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Problem",
    required:true
  },

  code:{
    type:String,
    required:true
  },

  language:{
    type:String,
    enum:["javascript","python","cpp","java"],
    required:true
  },

  status:{
    type:String,
    enum:[
      "pending",
      "accepted",
      "wrong_answer",
      "runtime_error",
      "time_limit_exceeded"
    ],
    default:"pending"
  },

  executionTime:{
    type:Number
  },

  memoryUsed:{
    type:Number
  }

},{timestamps:true});

module.exports = mongoose.model("Submission",submissionSchema);