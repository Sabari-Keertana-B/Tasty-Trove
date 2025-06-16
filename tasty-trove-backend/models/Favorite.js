const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema({
  recipeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Recipe', required: true },
  recipeName: { type: String, required: true },
  recipeImage: { type: String, required: true },
  recipeInstructions: { type: String, required: true },
  recipeIngredients: { type: [String], required: true },
  userId: { type: String, required: true }, // Firebase user ID
}, { timestamps: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
