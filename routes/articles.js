const express = require("express");
const router = express.Router();
const connectDB = require("../db");

// Debug log middleware
router.use((req, res, next) => {
  console.log("🛠 Articles route hit:", req.method, req.url);
  next();
});


// ✅ GET all, search, or random
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("articles");

    const { search, random } = req.query;
    let query = {};

    if (search) {
      const keyword = new RegExp(search, "i");
      query = { $or: [{ title: keyword }, { category: keyword }] };
    }

    const articles = await collection.find(query).toArray();

    if (random && articles.length > 0) {
      const randomArticle = articles[Math.floor(Math.random() * articles.length)];
      return res.json(randomArticle);
    }

    res.json(articles);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ GET by ID
router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("articles");
    const articleId = parseInt(req.params.id);

    const article = await collection.findOne({ id: articleId });
    if (!article) return res.status(404).json({ message: "Article not found" });

    res.json(article);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ POST (Create)
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("articles");

    const newArticle = {
      id: Date.now(),
      title: req.body.title,
      description: req.body.description,
      category: req.body.category || "General",
      image: req.body.image || "",
      createdAt: new Date(),
    };

    await collection.insertOne(newArticle);
    res.status(201).json({ message: "Article created successfully", article: newArticle });
  } catch (err) {
    console.error("🔥 Error creating article:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ PUT (Update)
router.put("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("articles");
    const articleId = parseInt(req.params.id);

    const updatedData = req.body;
    const result = await collection.updateOne(
      { id: articleId },
      { $set: updatedData }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Article not found" });

    res.json({ message: "Article updated successfully" });
  } catch (err) {
    console.error("🔥 Error updating article:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("articles");
    const articleId = parseInt(req.params.id);

    const result = await collection.deleteOne({ id: articleId });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Article not found" });

    res.json({ message: "Article deleted successfully" });
  } catch (err) {
    console.error("🔥 Error deleting article:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


// ✅ GET articles by category
router.get("/category/:category", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("articles");

    const categoryName = req.params.category;

    const articles = await collection
      .find({ category: { $regex: new RegExp(categoryName, "i") } })
      .toArray();

    if (!articles.length) {
      return res.status(404).json({ message: "No articles found for this category" });
    }

    res.json(articles);
  } catch (err) {
    console.error("🔥 Error fetching category articles:", err);
    res.status(500).json({ message: "Server Error" });
  }
});


module.exports = router;
