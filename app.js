import express from "express";
import "dotenv/config";
import { connectToDatabase, getDb } from "./db/index.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.post("/products", async (req, res) => {
  try {
    const db = getDb();
    const product = req.body;

    if (!product.name || !product.price) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await db.collection("products").insertOne({
      name: product.name,
      price: product.price,
      description: product.description,
    });

    res.status(201).json("Product created successfully");
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error creating product" });
  }
});

connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });
