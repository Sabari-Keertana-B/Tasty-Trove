import React, { useEffect, useState } from 'react';
import './SavedRecipes.scss';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const SavedRecipes = ({ onClose }) => {
  const [savedDishes, setSavedDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDish, setSelectedDish] = useState(null); // To track the selected dish for full details

  useEffect(() => {
    const fetchSavedDishes = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
          const response = await axios.get(`http://localhost:5000/api/favorites/user/${user.uid}`);
          setSavedDishes(response.data);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching saved dishes:", error);
        setLoading(false);
      }
    };

    fetchSavedDishes();
  }, []);

  const handleRecipeClick = (dish) => {
    setSelectedDish(dish); // Set the selected dish to display full details
  };

  const handleCloseDetails = () => {
    setSelectedDish(null); // Close the details view
  };

  if (loading) {
    return (
      <div className="saved-recipe-page">
        <div className="overlay" />
        <div className="saved-container">
          <button className="close-btn" onClick={onClose}>
            <IoClose />
          </button>
          <h1>Saved Recipes</h1>
          <p>Loading your saved recipes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="saved-recipe-page">
      <div className="overlay" />
      <div className="saved-container">
  <button className="close-btn" onClick={onClose}>
    <IoClose />
  </button>
  <h1>Saved Recipes</h1>

  <div className="recipes-list">
    {savedDishes.length > 0 ? (
      savedDishes.map((dish) => (
        <div key={dish._id} className="recipe-card" onClick={() => handleRecipeClick(dish)}>
          <img src={dish.recipeImage} alt={dish.recipeName} />
          <div className="recipe-details">
            <h2>{dish.recipeName}</h2>
            <p>{dish.recipeInstructions.slice(0, 100)}...</p>
          </div>
        </div>
      ))
    ) : (
      <p>No saved recipes yet.</p>
    )}
  </div>

  {/* ⬇️ Move this here */}
  {selectedDish && (
    <div className="recipe-detail-modal">
      <button className="close-btn" onClick={handleCloseDetails}>
        <IoClose />
      </button>
      <h2>{selectedDish.recipeName}</h2>
      <img src={selectedDish.recipeImage} alt={selectedDish.recipeName} className="detail-img" />
      <h3>Ingredients:</h3>
      <ul className="no-bullets">
        {selectedDish.recipeIngredients.map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h3>Instructions:</h3>
      <p>{selectedDish.recipeInstructions}</p>
    </div>
  )}
</div>

    </div>
  );
};

export default SavedRecipes;
