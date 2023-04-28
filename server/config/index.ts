import dotenv from "dotenv";

dotenv.config();

// Consts variables
export const MONGO_URI =
  (process.env.MONGO_URI as string)
  "mongodb+srv://kuzma:mr.doctor0104@cluster0.danmkpq.mongodb.net/bitsport?retryWrites=true&w=majority";

export const SECRET_KEY = (process.env.SECRET_KEY as string) || "bitsport-bitpool-node-project";

export const SERVER_PORT = (process.env.SERVER_PORT as string) || 8000;
