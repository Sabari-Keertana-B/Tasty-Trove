const express = require('express');
const Recipe = require('../models/Recipe');
const authenticateFirebaseToken = require('../firebase-back/firebaseAuthMiddleware'); // ✅ Import middleware

const router = express.Router();

router.post('/add', async (req, res) => {
  const { name, ingredients, instructions, image, category, area, mainIngredient, userId, userName } = req.body;

  if (!name || !ingredients || !instructions || !userId) {
    return res.status(400).json({ message: 'Missing required fields.' });
  }

  try {
    const newRecipe = new Recipe({
      name,
      ingredients,
      instructions,
      image,
      category,
      area,
      mainIngredient,
      userId,
      userName,
    });

    const savedRecipe = await newRecipe.save();
    res.status(201).json({ message: 'Recipe added successfully!', recipe: savedRecipe });
  } catch (error) {
    console.error('❌ Error saving recipe:', error);
    res.status(500).json({ message: 'Error saving recipe', error: error.message });
  }
});

// GET: Fetch all or searched recipes (with extra filters)
router.get('/all', async (req, res) => {
  const { search = "", category, area, mainIngredient, userId, userName } = req.query;

  try {
    let filter = {};

    // If userId is provided, filter by userId
    if (userId) {
      filter.userId = userId;
    }

    if (search) {
      filter.name = { $regex: search, $options: "i" }; // Case-insensitive search
    }
    if (category) {
      filter.category = category;
    }
    if (area) {
      filter.area = area;
    }
    if (mainIngredient) {
      filter.mainIngredient = mainIngredient;
    }
    if(userName){
      filter.userName = userName;
    }

    const recipes = await Recipe.find(filter);  // Fetch recipes from the database
    res.status(200).json({ recipes });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipes', error: error.message });
  }
});


// GET: Fetch filter options
router.get('/filters', async (req, res) => {
  try {
    const categories = await Recipe.distinct('category');
    const areas = await Recipe.distinct('area');
    const mainIngredients = await Recipe.distinct('mainIngredient');
    const userNames = await Recipe.distinct('userName');  // Add this line to get unique poster names

    console.log('Categories:', categories);
    console.log('Areas:', areas);
    console.log('Main Ingredients:', mainIngredients);
    console.log('User Names:', userNames);

    res.status(200).json({
      categories,
      areas,
      mainIngredients,
      userNames,  // Include userNames in the response
    });
  } catch (error) {
    console.error("Error fetching filters:", error);
    res.status(500).json({ message: "Failed to fetch filters", error: error.message });
  }
});



// GET: Fetch recipe by ID
router.get('/:id', async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: 'Recipe not found' });
    }
    res.status(200).json({ recipe });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch recipe', error: error.message });
  }
});

module.exports = router;
