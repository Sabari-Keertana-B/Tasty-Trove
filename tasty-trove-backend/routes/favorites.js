const express = require("express");
const router = express.Router();
const Favorite = require("../models/Favorite"); // adjust path if needed

// Save a favorite recipe
router.post("/save", async (req, res) => {
  try {
    const { recipeId, recipeName, recipeImage, recipeInstructions, recipeIngredients, userId } = req.body;

    if (!recipeId || !recipeName || !recipeImage || !recipeInstructions || !recipeIngredients || !userId) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newFavorite = new Favorite({
      recipeId,
      recipeName,
      recipeImage,
      recipeInstructions,
      recipeIngredients,
      userId,
    });

    await newFavorite.save();
    res.status(201).json({ message: "Favorite saved successfully." });
  } catch (error) {
    console.error("Error saving favorite:", error);
    res.status(500).json({ message: "Internal server error." });
  }
});

// Get all favorite recipes for a specific user
router.get("/user/:userId", async (req, res) => {
    const { userId } = req.params;
  
    try {
      const favorites = await Favorite.find({ userId });
      res.status(200).json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ message: "Internal server error." });
    }
  });
  

module.exports = router;
