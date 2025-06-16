import React, { useState, useEffect } from "react";
import "./featuredrecipe.scss"; // Import SCSS file

const BASE_URL = "http://localhost:5000/api/recipes"; // use your deployed URL if online

const FeaturedRecipe = () => {
  const [search, setSearch] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  // Fetch Indian cuisine recipes or search results
  const fetchRecipes = async (query) => {
    try {
      setLoading(true);
      const url = `${BASE_URL}/all?search=${query}`;
      const response = await fetch(url);
      const data = await response.json();
      setRecipes(data.recipes || []);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchRecipes(""); // Fetch all Indian recipes initially
  }, []);

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
    fetchRecipes(e.target.value);
  };

  // Fetch full recipe details when a recipe is selected
  const fetchRecipeDetails = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/${id}`);
      const data = await response.json();
      setSelectedRecipe(data.recipe); // Use correct property from backend
    } catch (error) {
      console.error("Error fetching recipe details:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    
    <div className="featured-recipe-page">
      
      <div className="recipe-container">
        <h1 className="title">The Ultimate Recipe Hunt Starts Here!</h1>

        <input
          type="text"
          placeholder="Search for a recipe..."
          value={search}
          onChange={handleSearch}
          className="search-bar"
        />

        {loading ? (
          <p className="loading-text">Loading recipes...</p>
        ) : selectedRecipe ? (
          <div className="recipe-details">
            <button className="back-button" onClick={() => setSelectedRecipe(null)}>
              ← Back to Recipes
            </button>
            <h2 className="recipe-name">{selectedRecipe.name}</h2>
            <img
              src={selectedRecipe.image}
              alt={selectedRecipe.name}
              className="recipe-image-large"
            />
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
          </div>
        ) : (
          <div className="recipe-grid">
            {recipes.length > 0 ? (
              recipes.map((recipe) => (
                <div
                  key={recipe._id}
                  className="recipe-card"
                  onClick={() => fetchRecipeDetails(recipe._id)}
                >
                  <img
                    src={recipe.image}
                    alt={recipe.name}
                    className="recipe-image"
                  />
                  <div className="recipe-info">
                    <h3 className="recipe-name">{recipe.name}</h3>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No recipes found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedRecipe;
