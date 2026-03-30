import mongoose from "mongoose";
export const connect = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Successfully connected to MongoDB");
  } catch (error) {
    console.log(error.message);
  }
};
