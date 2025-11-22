const express = require("express");
const router = express.Router();
const connectDB = require("../db");

// Debugging log
router.use((req, res, next) => {
  console.log("🥗 Foods route hit:", req.method, req.url);
  next();
});

// ------------------------------------------------------
// ✅ GET ALL FOODS + Search + Random
// ------------------------------------------------------
router.get("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("foods");

    const { search, random } = req.query;
    let query = {};

    if (search) {
      const keyword = new RegExp(search, "i");
      query = {
        $or: [
          { name: keyword },
          { description: keyword },
          { tags: keyword }
        ]
      };
    }

    const foods = await collection.find(query).toArray();

    if (random && foods.length > 0) {
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      return res.json(randomFood);
    }

    res.json(foods);
  } catch (err) {
    console.error("🔥 Error fetching foods:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------------------------------------
// ✅ GET FOOD BY ID
// ------------------------------------------------------
router.get("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("foods");
    const foodId = parseInt(req.params.id);

    const food = await collection.findOne({ id: foodId });
    if (!food)
      return res.status(404).json({ message: "Food item not found" });

    res.json(food);
  } catch (err) {
    console.error("🔥 Error fetching food by ID:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------------------------------------
// ✅ CREATE FOOD ITEM (POST)
// ------------------------------------------------------
router.post("/", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("foods");

    const newFood = {
      id: Date.now(),
      name: req.body.name,
      description: req.body.description,
      image: req.body.image || "",
      isVegetarian: req.body.isVegetarian ?? true,
      tags: req.body.tags || [],
      createdAt: new Date()
    };

    await collection.insertOne(newFood);

    res.status(201).json({
      message: "Food item created successfully",
      food: newFood
    });
  } catch (err) {
    console.error("🔥 Error creating food:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------------------------------------
// ✅ UPDATE FOOD (PUT)
// ------------------------------------------------------
router.put("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("foods");
    const foodId = parseInt(req.params.id);

    const updatedData = req.body;

    const result = await collection.updateOne(
      { id: foodId },
      { $set: updatedData }
    );

    if (result.matchedCount === 0)
      return res.status(404).json({ message: "Food item not found" });

    res.json({ message: "Food updated successfully" });
  } catch (err) {
    console.error("🔥 Error updating food:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------------------------------------
// ✅ DELETE FOOD (DELETE)
// ------------------------------------------------------
router.delete("/:id", async (req, res) => {
  try {
    const db = await connectDB();
    const collection = db.collection("foods");
    const foodId = parseInt(req.params.id);

    const result = await collection.deleteOne({ id: foodId });

    if (result.deletedCount === 0)
      return res.status(404).json({ message: "Food item not found" });

    res.json({ message: "Food deleted successfully" });
  } catch (err) {
    console.error("🔥 Error deleting food:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------------------------------------
// 🌿 GET ONLY VEGETARIAN FOODS
// ------------------------------------------------------
router.get("/filter/vegetarian/only", async (req, res) => {
  try {
    const db = await connectDB();
    const foods = await db.collection("foods").find({ isVegetarian: true }).toArray();

    res.json(foods);
  } catch (err) {
    console.error("🔥 Error fetching veg foods:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------------------------------------
// 🍗 GET ONLY NON-VEGETARIAN FOODS
// ------------------------------------------------------
router.get("/filter/nonveg/only", async (req, res) => {
  try {
    const db = await connectDB();
    const foods = await db.collection("foods").find({ isVegetarian: false }).toArray();

    res.json(foods);
  } catch (err) {
    console.error("🔥 Error fetching non-veg foods:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// ------------------------------------------------------
// 🏷 GET FOODS BY TAG
// ------------------------------------------------------
router.get("/tag/:tag", async (req, res) => {
  try {
    const db = await connectDB();
    const tag = req.params.tag;

    const foods = await db.collection("foods").find({
      tags: { $regex: new RegExp(tag, "i") }
    }).toArray();

    if (!foods.length)
      return res
        .status(404)
        .json({ message: "No foods found for this tag" });

    res.json(foods);
  } catch (err) {
    console.error("🔥 Error fetching foods by tag:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
