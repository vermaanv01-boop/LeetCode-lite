const express = require("express");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const connectDB = require("./Config/DB");
const userRoutes = require('./Routes/userRoutes');
const problemRouter = require('./Routes/problemRoutes');
const submissionRoutes = require('./Routes/submissionRoutes');

dotenv.config();

connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userRoutes);
app.use("/api/problems", problemRouter);
app.use("/api/submission", submissionRoutes);

app.listen(5000, () => {
    console.log("Server started on port 5000");
});

