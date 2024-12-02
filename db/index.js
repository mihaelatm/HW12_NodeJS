import { MongoClient } from "mongodb";
import "dotenv/config";

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

let dbConnection;

async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
    dbConnection = client.db();
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

function getDb() {
  if (!dbConnection) {
    throw new Error("Database not connected");
  }
  return dbConnection;
}

export { connectToDatabase, getDb };
