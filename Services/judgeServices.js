const runCode = require("../utils/codeRunner");

const evaluateSubmission = async (problem, code, language) => {
  for (const tc of problem.testCases) {
    const result = await runCode(code, tc.input, language);

    if (result.error) {
      return { status: "runtime_error", detail: result.error };
    }

    // normalize whitespace for comparison
    const expected = String(tc.output).trim();
    const actual = String(result.output).trim();

    if (expected !== actual) {
      return { status: "wrong_answer" };
    }
  }

  return { status: "accepted" };
};

module.exports = { evaluateSubmission };