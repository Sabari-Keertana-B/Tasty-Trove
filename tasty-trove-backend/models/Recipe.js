//recipe.js
const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  ingredients: [
    {
      name: { type: String, required: true },
      quantity: { type: String, required: false }
    }
  ],
  instructions: {
    type: String,
    required: true,
  },
  image: {
    type: String, // URL of the recipe image
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  userId: {
    type: String,
    required: true,
  },
  userName: {
    type: String,     // Add this field
    required: true,   // mark it required if every recipe must have a userName
  },
  category: {
    type: String, // Optional: You can set it as required later if needed
  },
  area: {
    type: String, // Optional: You can set it as required later if needed
  },
  mainIngredient: {
    type: String, // Optional: You can set it as required later if needed
  }
});


const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

