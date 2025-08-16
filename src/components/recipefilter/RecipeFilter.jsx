import React, { useState, useEffect } from "react";
import "./recipefilter.scss";
import axios from 'axios';
import { getAuth } from 'firebase/auth'; 

const RecipeFilter = () => {
  const [recipes, setRecipes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedArea, setSelectedArea] = useState("");
  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [savedRecipeIds, setSavedRecipeIds] = useState([]);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [userNames, setUserNames] = useState([]);
  const [selectedUserName, setSelectedUserName] = useState("");


  // Fetch filters (categories, areas, and ingredients) from the backend
  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/filters`);  // Ensure the URL matches your backend
        const data = await response.json();

        if (data) {
        setCategories(data.categories || []);
        setAreas(data.areas || []);
        setIngredients(data.mainIngredients || []);
        setUserNames(data.userNames || []);  // Add this
      }

      } catch (error) {
        console.error("Error fetching filters:", error);
      }
    };

    fetchFilters();
  }, []);

  // Fetch some default recipes at the beginning
  useEffect(() => {
    const fetchDefaultRecipes = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/all`);  // Backend endpoint for all recipes
        const data = await response.json();
        setRecipes(data.recipes || []);
      } catch (error) {
        console.error("Error fetching default recipes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDefaultRecipes();
  }, []);

  // Fetch recipes with applied filters
  const fetchRecipes = async () => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      // Show popup instead of fetching recipes
      setShowLoginPopup(true);
      return;
    }
  
    try {
      setLoading(true);
      let url = "http://localhost:5000/api/recipes/all?";
  
      if (selectedCategory) url += `category=${selectedCategory}&`;
      if (selectedArea) url += `area=${selectedArea}&`;
      if (selectedIngredient) url += `mainIngredient=${selectedIngredient}&`;
      if (selectedUserName) url += `userName=${encodeURIComponent(selectedUserName)}&`;  // Add this
      if (url.endsWith("&")) url = url.slice(0, -1);
  
      const response = await fetch(url);
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };
  

  // Fetch recipe details when a recipe card is clicked
  const fetchRecipeDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/recipes/${id}`);
      const data = await response.json();
      setSelectedRecipe(data.recipe);
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFavorite = async (recipe) => {
    const auth = getAuth();
    const user = auth.currentUser;
  
    if (!user) {
      alert("Please log in to save your favorite recipes.");
      return;
    }
  
    try {
      const token = await user.getIdToken();
  
      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/favorites/save`,
        {
          recipeId: recipe._id,
          recipeName: recipe.name,
          recipeImage: recipe.image,
          recipeInstructions: recipe.instructions,
          recipeIngredients: recipe.ingredients.map(i => `${i.name}${i.quantity ? ` - ${i.quantity}` : ''}`).join(", "),
          userId: user.uid,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setSavedRecipeIds((prev) => [...prev, recipe._id]);
      alert("Recipe saved to favorites!");
    } catch (error) {
      console.error("Error saving favorite:", error);
      alert("Failed to save favorite.");
    }
  };
  
  return (
    <div className="recipe-filter-page">
        {showLoginPopup && (
    <div className="login-popup-overlay">
      <div className="login-popup">
        <p>You must be logged in to use filters.</p>
        <button
          onClick={() => {
            setShowLoginPopup(false);
            window.scrollTo({ top: 0, behavior: "smooth" });  // Scroll to top smoothly
          }}
        >
          Close
        </button>

      </div>
    </div>
  )}
      {/* Quote Section */}
      <div className="quote-container">
        <p className="quote">
          "Cooking is an art, but all art requires knowing something about the techniques and materials." – Nathan Myhrvold
        </p>
      </div>

      <div className="recipe-container">
        <h1 className="title">Find the Perfect Recipe!</h1>

        <div className="filters">
          <select onChange={(e) => setSelectedCategory(e.target.value)} value={selectedCategory}>
            <option value="">Filter by Category</option>
            {categories.length > 0 ? (
              categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))
            ) : (
              <option disabled>No categories available</option>
            )}
          </select>

          <select onChange={(e) => setSelectedArea(e.target.value)} value={selectedArea}>
            <option value="">Filter by Area</option>
            {areas.length > 0 ? (
              areas.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))
            ) : (
              <option disabled>No areas available</option>
            )}
          </select>

          <select onChange={(e) => setSelectedIngredient(e.target.value)} value={selectedIngredient}>
            <option value="">Filter by Main Ingredient</option>
            {ingredients.length > 0 ? (
              ingredients.map((ing) => (
                <option key={ing} value={ing}>
                  {ing}
                </option>
              ))
            ) : (
              <option disabled>No ingredients available</option>
            )}
          </select>

          <select onChange={(e) => setSelectedUserName(e.target.value)} value={selectedUserName}>
          <option value="">Filter by Cook</option>
          {userNames.length > 0 ? (
            userNames.map((name) => (
            <option key={name} value={name}>
            {name}
            </option>
          ))
          ) : (
            <option disabled>No Cooks available</option>
          )}
        </select>


          <button onClick={fetchRecipes} className="apply-filter">
            Apply Filters
          </button>
        </div>

        {loading ? (
          <p className="loading-text">Loading recipes...</p>
        ) : selectedRecipe ? (
  <div className="recipe-details">
    <button className="back-button" onClick={() => setSelectedRecipe(null)}>
      ← Back to Recipes
    </button>
    <h2 className="recipe-name">{selectedRecipe.name}</h2>
    <p><strong>Posted by:</strong> {selectedRecipe.userName || 'Unknown'}</p>  {/* <-- Add this */}
    <img src={selectedRecipe.image} alt={selectedRecipe.name} className="recipe-image-large" />
    <h3>Ingredients</h3>
    <ul className="ingredients-list">
      {selectedRecipe.ingredients.map((ingredient, index) => (
        <li key={index}>
          {ingredient.name}{ingredient.quantity ? ` - ${ingredient.quantity}` : ''}
        </li>
      ))}
    </ul>

    <h3>Instructions</h3>
    <p className="instructions">{selectedRecipe.instructions}</p>
    <button
      onClick={() => handleSaveFavorite(selectedRecipe)}
      className="save-btn"
      disabled={savedRecipeIds.includes(selectedRecipe._id)}
    >
      {savedRecipeIds.includes(selectedRecipe._id) ? "Saved" : "Save to Favorites"}
    </button>
  </div>
): (
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div key={recipe._id} className="recipe-card" onClick={() => fetchRecipeDetails(recipe._id)}>
                  <img src={recipe.image} alt={recipe.name} className="recipe-image" />
                  <div className="recipe-info">
                    <h3 className="recipe-name">{recipe.name}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="instructions-text">
                Use the filters above to find your favorite recipes!
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default RecipeFilter;
