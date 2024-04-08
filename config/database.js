const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const connectDB = async () => {
    console.log('Username: ', process.env.MONGO_USERNAME);
    try {
        const username = process.env.MONGO_USERNAME;
        const password = process.env.MONGO_PASSWORD;
        const dbname = process.env.MONGO_DBNAME;

        if (!username || !password || !dbname) {
            throw new Error('MongoDB credentials are not provided');
        }

        const uri = `mongodb+srv://${username}:${password}@cluster0.dftjv.mongodb.net/${dbname}?retryWrites=true&w=majority&appName=Cluster0`;

        await mongoose.connect(uri);

        console.log('MongoDB connection SUCCESS!');
    } catch (error) {
        console.error('MongoDB connection FAIL');
        console.error(error);
        process.exit(1);
    }
};

module.exports = connectDB;