const Problem = require("../models/problemModel");

// ================= CREATE PROBLEM =================
const createProblem = async (req, res) => {
  try {
    const {
      title,
      description,
      difficulty,
      tags = [],
      constraints = "",
      examples = [],
      starterCode = "",
      testCases = [],
    } = req.body;

    if (!title || !description || !difficulty) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Normalize title
    const normalizedTitle = title.trim().toLowerCase();

    const existing = await Problem.findOne({ normalizedTitle }).lean();
    if (existing) {
      return res.status(400).json({ message: "Problem already exists" });
    }

    const problem = await Problem.create({
      title: title.trim(),
      normalizedTitle,
      description,
      difficulty,
      tags,
      constraints,
      examples,
      starterCode,
      testCases,
      createdBy: req.user.id,
    });

    return res.status(201).json({
      message: "Problem created",
      problemId: problem._id,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL PROBLEMS =================
const getAllProblems = async (req, res) => {
  try {
    const { difficulty, tag } = req.query;

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = 10;
    const skip = (page - 1) * limit;

    const query = {};
    if (difficulty) query.difficulty = difficulty;
    if (tag) query.tags = { $in: [tag] };

    const [problems, total] = await Promise.all([
      Problem.find(query)
        .select("title difficulty tags createdAt")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),

      Problem.countDocuments(query),
    ]);

    return res.status(200).json({
      page,
      total,
      totalPages: Math.ceil(total / limit),
      problems,
    });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= GET SINGLE PROBLEM =================
const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id)
      .select("-testCases")
      .lean();

    if (!problem) {
      return res.status(404).json({ message: "Problem not found" });
    }

    return res.status(200).json(problem);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE PROBLEM =================
const updateProblem = async (req, res) => {
  try {
    const allowedFields = [
      "title",
      "description",
      "difficulty",
      "tags",
      "constraints",
      "examples",
      "starterCode",
      "testCases",
    ];

    const updates = {};
    for (let key of allowedFields) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    if (updates.title) {
      updates.normalizedTitle = updates.title.trim().toLowerCase();
    }

    const problem = await Problem.findOneAndUpdate(
      {
        _id: req.params.id,
        createdBy: req.user.id, // authorization in query
      },
      updates,
      { new: true, runValidators: true }
    ).lean();

    if (!problem) {
      return res.status(404).json({ message: "Problem not found or unauthorized" });
    }

    return res.status(200).json(problem);

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// ================= DELETE PROBLEM =================
const deleteProblem = async (req, res) => {
  try {
    const result = await Problem.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user.id,
    });

    if (!result) {
      return res.status(404).json({ message: "Problem not found or unauthorized" });
    }

    return res.status(200).json({ message: "Problem deleted" });

  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  getProblemById,
  updateProblem,
  deleteProblem,
};