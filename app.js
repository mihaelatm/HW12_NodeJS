import express from "express";
import "dotenv/config";
import { connectToDatabase } from "./db/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
