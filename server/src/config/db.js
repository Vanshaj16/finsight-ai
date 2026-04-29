import mongoose from "mongoose";

const connectDb = async (mongoUri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(mongoUri);
};

export default connectDb;
