const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Config/DB");
const userRoutes = require('./Routes/userRoutes');
const problemRoter = require('./Routes/problemRoutes')

dotenv.config();

connectDB();

const app = express();
app.use(express.json());


app.listen(5000,()=>{
    console.log("Server started");
});
app.use("/api/users",userRoutes)
app.use("api/problems",problemRoter);

