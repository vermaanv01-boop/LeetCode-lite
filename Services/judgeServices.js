const runCode = require("../utils/codeRunner");

const normalizeOutput = (output) => {
  return String(output)
    .trim()
    .replace(/\s+/g, " "); // normalize all whitespace
};

const evaluateSubmission = async (problem, code, language) => {
  try {
    const testCases = problem.testCases;

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      const result = await runCode(code, tc.input, language);

      // Runtime / execution error
      if (result.error) {
        return {
          status: "runtime_error",
          testCase: i + 1,
          input: tc.input,
          error: result.error,
        };
      }

      const expected = normalizeOutput(tc.output);
      const actual = normalizeOutput(result.output);

      // Wrong answer
      if (expected !== actual) {
        return {
          status: "wrong_answer",
          testCase: i + 1,
          input: tc.input,
          expected,
          actual,
        };
      }
    }

    // All passed
    return { status: "accepted" };

  } catch (error) {
    return {
      status: "system_error",
      error: error.message,
    };
  }
};

module.exports = { evaluateSubmission };