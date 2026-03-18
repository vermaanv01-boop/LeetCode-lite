const Submission = require("../Models/submissionModel");
const Problem = require("../Models/Problem");

const submitCode = async (req,res)=>{
 try{

  const {problemId, code, language} = req.body;

  if(!problemId || !code || !language){
     return res.status(400).json({message:"Missing required fields"});
  }

  const problem = await Problem.findById(problemId);

  if(!problem){
     return res.status(404).json({message:"Problem not found"});
  }

  const submission = await Submission.create({
     user:req.user.id,
     problem:problemId,
     code,
     language,
     status:"pending"
  });

  res.status(201).json({
     message:"Submission received",
     submission
  });

 }catch(err){
   res.status(500).json({error:err.message});
 }
}

const getUserSubmissions = async (req,res)=>{
 try{

  const submissions = await Submission.find({user:req.params.userId})
  .populate("problem","title difficulty")
  .sort({createdAt:-1});

  res.json(submissions);

 }catch(err){
  res.status(500).json({error:err.message});
 }
}

module.exports = {submitCode,getUserSubmissions};