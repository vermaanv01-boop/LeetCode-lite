const mongoose = require('mongoose')
const { configDotenv } = require('dotenv');
configDotenv();

const url = process.env.DB_URL

const connectDB = async () => {
    try {
        const db = await mongoose.connect(url);
        console.log(`DB connected`)
    } catch (err) {
        return console.log(`DB not connected`, err);

    }

    // .then((data) => console.log(`DB connected`))
    // .catch((err) => console.log(`DB Error`))
}


module.exports = connectDB;