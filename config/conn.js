const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: './config/.env' });

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(`Database connected to ${conn.connection.host}`);
    } catch (error) {
        console.error(`Database connection error: ${error}`);
        process.exit(1);
    }
};

module.exports = connectDB;
