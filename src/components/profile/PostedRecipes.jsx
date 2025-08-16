import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PostedRecipes.scss';
import { getAuth } from 'firebase/auth';
import { IoClose } from 'react-icons/io5';

const PostedRecipes = ({ onClose }) => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPostedRecipes = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) return;

    const token = await user.getIdToken();

    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/recipes/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userRecipes = response.data.recipes.filter(
        (recipe) => recipe.userId === user.uid
      );

      setRecipes(userRecipes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user recipes:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPostedRecipes();
  }, []);

  return (
    <div className="posted-recipe-page">
      <div className="overlay" />
      <div className="posted-container">
        <button className="close-btn" onClick={onClose}>
          <IoClose />
        </button>
        <h1>Your Posted Recipes</h1>
        {loading ? (
          <p>Loading recipes...</p>
        ) : recipes.length === 0 ? (
          <p>No recipes posted yet.</p>
        ) : (
          <div className="posted-recipes-list">
            {recipes.map((recipe) => (
              <div key={recipe._id} className="posted-recipe-card">
                <img
                  src={recipe.image || 'https://via.placeholder.com/150'}
                  alt={recipe.name}
                />
                <div className="posted-recipe-details">
                  <h2>{recipe.name}</h2>
                  <p><strong>Category:</strong> {recipe.category || 'N/A'}</p>
                  <p><strong>Area:</strong> {recipe.area || 'N/A'}</p>
                  <p><strong>Main Ingredient:</strong> {recipe.mainIngredient || 'N/A'}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PostedRecipes;
