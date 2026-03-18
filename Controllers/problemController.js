const Problem = require("../Models/problemModel");

const createProblem = async (req, res) => {
  try {
    const {
      tittle,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      starterCode,
      testCases,
    } = req.body;

    const existingProblem = await Problem.findOne({ tittle });

    if (existingProblem) {
      return res.status(400).json({ message: "Problem already exists" });
    }
    const problem = await Problem.create({
      tittle,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      starterCode,
      testCases,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Problem created",
      problem,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getAllProblem = async (req, res) => {
  try {
    const problem = await Problem.find().select(
      "Title difficulty tags createdAt",
    );
    res.status(200).json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id).select("-testCases");
    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }
    res.status(200).json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const updateProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteProblem = async (req, res) => {
  try {
    const problem = await Problem.findByIdAndDelete(req.params.id);

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    res.json({ message: "Problem deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createProblem,
  getAllProblem,
  getProblemById,
  updateProblem,
  deleteProblem,
};
