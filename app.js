import express from "express";
import "dotenv/config";
import { connectToDatabase, getDb } from "./db/index.js";
import { ObjectId } from "mongodb";

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

app.get("/products", async (req, res) => {
  try {
    const db = getDb();

    const products = await db.collection("products").find().toArray();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ error: "Error to fetch products" });
  }
});

app.get("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const product = await db
      .collection("products")
      .findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ error: "Error fetching product" });
  }
});

app.put("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;
    const updatedProduct = req.body;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await db
      .collection("products")
      .updateOne({ _id: new ObjectId(productId) }, { $set: updatedProduct });

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json("Product updated successfully");
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ error: "Error updating product" });
  }
});

app.delete("/products/:id", async (req, res) => {
  try {
    const db = getDb();
    const productId = req.params.id;

    if (!ObjectId.isValid(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }

    const result = await db
      .collection("products")
      .deleteOne({ _id: new ObjectId(productId) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.status(200).json("Product deleted successfully");
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
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
