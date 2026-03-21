// const { exec } = require("child_process");
// const fs = require("fs");
// const path = require("path");
// const { v4: uuid } = require("uuid");

// const tempDir = path.join(__dirname, "../temp");

// // ensure temp folder exists
// if (!fs.existsSync(tempDir)) {
//   fs.mkdirSync(tempDir);
// }

// const runCode = (code, input, language) => {
//   return new Promise((resolve) => {
//     const jobId = uuid();

//     let filePath, command;

//     // ===== CREATE FILE BASED ON LANGUAGE =====
//     if (language === "javascript") {
//       filePath = path.join(tempDir, `${jobId}.js`);
//       fs.writeFileSync(filePath, code);
//       command = `node ${filePath}`;
//     }

//     else if (language === "python") {
//       filePath = path.join(tempDir, `${jobId}.py`);
//       fs.writeFileSync(filePath, code);
//       command = `python3 ${filePath}`;
//     }

//     else if (language === "cpp") {
//       const cppPath = path.join(tempDir, `${jobId}.cpp`);
//       const outPath = path.join(tempDir, `${jobId}.out`);

//       fs.writeFileSync(cppPath, code);
//       command = `g++ ${cppPath} -o ${outPath} && ${outPath}`;
//     }

//     else if (language === "java") {
//       const javaPath = path.join(tempDir, `Main${jobId}.java`);
//       const className = `Main${jobId}`;

//       // force class name match
//       const finalCode = code.replace(/class\s+\w+/, `class ${className}`);
//       fs.writeFileSync(javaPath, finalCode);

//       command = `javac ${javaPath} && java -cp ${tempDir} ${className}`;
//     }

//     else {
//       return resolve({ error: "Unsupported language" });
//     }

//     // ===== EXECUTE =====
//     const process = exec(
//       command,
//       { timeout: 2000 }, // 2 sec timeout (VERY IMPORTANT)
//       (error, stdout, stderr) => {

//         // cleanup
//         try {
//           fs.readdirSync(tempDir).forEach(file => {
//             if (file.includes(jobId)) {
//               fs.unlinkSync(path.join(tempDir, file));
//             }
//           });
//         } catch (e) {}

//         if (error) {
//           return resolve({
//             error: stderr || error.message,
//           });
//         }

//         return resolve({
//           output: stdout,
//         });
//       }
//     );

//     // pass input
//     if (process.stdin) {
//       process.stdin.write(input);
//       process.stdin.end();
//     }
//   });
// };

// module.exports = runCode;