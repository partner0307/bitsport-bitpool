import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
/**
 * Connection to DB
 * Using Mongoose
 * MongoClientOptions
 */
mongoose.connect(process.env.MONGO_URI as string, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once("open", () => {
  console.log(">> MongoDB is Connected!");
});

connection.on("error", (err) => {
  console.log(err);
});
