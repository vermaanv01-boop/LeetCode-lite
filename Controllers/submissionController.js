const Submission = require("../Models/submissionModel");
const Problem = require("../models/Problem");

const submitCode = async (req,res)=>{
 try{

  const {problemId, code, language} = req.body;

  const problem = await Problem.findById(problemId);

  if(!problem){
    return res.status(404).json({message:"Problem not found"});
  }

  const submission = await Submission.create({
    user:req.user.id,
    problem:problemId,
    code,
    language
  });

  res.status(201).json(submission);

 }catch(err){
  res.status(500).json({error:err.message});
 }
}