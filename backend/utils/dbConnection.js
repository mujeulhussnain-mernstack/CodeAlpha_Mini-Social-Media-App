import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Successfully connected to the MongoDB.");
    return mongoose.connection;
  } catch (error) {
    console.log("An error occur while connecting to the MongoDB.", error);
    process.exit(1);
  }
};

export default dbConnection;
