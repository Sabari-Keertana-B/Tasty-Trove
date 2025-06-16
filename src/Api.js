import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/recipes', // your backend base URL
});

// Add a recipe
export const addRecipe = (recipeData) => API.post('/add', recipeData);

// Get all recipes
export const getRecipes = () => API.get('/all');
