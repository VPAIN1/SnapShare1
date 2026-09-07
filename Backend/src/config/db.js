import mongoose from 'mongoose';
import 'dotenv/config';

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URL);
        console.log("Connected to DB");
    }
    catch(error) {
        console.log("Error to connect DB");
    }
}

export default connectDB;