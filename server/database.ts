import { MONGO_URI } from "./config";
import mongoose from "mongoose";

/**
 * Connection to DB
 * Using Mongoose
 * MongoClientOptions
 */
mongoose.connect(MONGO_URI, {
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
