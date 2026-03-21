const mongoose = require('mongoose');
const { ref } = require('process');

const userSchema = new mongoose.Schema({
    name:{type:String , required:true , unique:true , trim:true},
    email:{type:String , required:true , unique:true , lowercase:true},
    password:{type:String , required:true},
    mobile_number: {
  type: Number,
  unique: true,
  sparse: true
},
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

// userSchema.pre("save", async function () {
//   if (!this.isModified("password")) return;
//   this.password = await bcrypt.hash(this.password, 10);
// });

// // compare password
// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };


module.exports = mongoose.model("User",userSchema);