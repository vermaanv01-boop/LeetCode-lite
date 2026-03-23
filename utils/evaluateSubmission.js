const runCode = require("./codeRunner.js");

// Normalize output (VERY important)
const normalizeOutput = (output) => {
  return String(output)
    .trim()
    .replace(/\r/g, "")        // remove carriage return (Windows issue)
    .replace(/\s+/g, " ");     // normalize multiple spaces/newlines
};

const evaluateSubmission = async (problem, code, language) => {
  try {
    const testCases = problem.testCases;

    if (!testCases || testCases.length === 0) {
      return {
        status: "system_error",
        error: "No test cases found",
      };
    }

    for (let i = 0; i < testCases.length; i++) {
      const tc = testCases[i];

      let result;

      try {
        result = await runCode(code, tc.input, language);
      } catch (err) {
        return {
          status: "system_error",
          testCase: i + 1,
          error: err.message,
        };
      }

      // ===== Runtime / execution error =====
      if (result.error) {
        return {
          status: "runtime_error",
          testCase: i + 1,
          input: tc.input,
          error: result.error,
        };
      }

      // ===== Output comparison =====
      const expected = normalizeOutput(tc.output);
      const actual = normalizeOutput(result.output);

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

    // ===== All test cases passed =====
    return {
      status: "accepted",
    };

  } catch (error) {
    return {
      status: "system_error",
      error: error.message,
    };
  }
};

module.exports = { evaluateSubmission };