const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./Config/DB");

dotenv.config();

connectDB();

const app = express();
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Server running");
});

app.listen(5000,()=>{
    console.log("Server started");
});

app.get("/test", (req,res)=>{
    res.send("API working");
})