import React, { useState } from 'react';
import axios from 'axios';
import './postrecipe.scss'; // Import SCSS file
import { getAuth } from 'firebase/auth'; // Firebase Auth

const PostRecipe = () => {
  const [name, setName] = useState('');
  const [ingredients, setIngredients] = useState('');
  const [instructions, setInstructions] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [area, setArea] = useState('');
  const [mainIngredient, setMainIngredient] = useState('');

  const handleSubmit = async (e) => {
  e.preventDefault();

  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    setMessage('Please Login to post your recipe.');
    return;
  }

  try {
    const token = await user.getIdToken();

    // Fetch user name from your backend users API
    const userResponse = await axios.get(`http://localhost:5000/api/users/${user.uid}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const userName = userResponse.data.name; // assuming backend sends { name: "Keertz", ... }

    // Now post the recipe including userId and userName
    const response = await axios.post(
      'http://localhost:5000/api/recipes/add',
      {
        name,
        ingredients: ingredients.split(',').map(item => {
          const [name, quantity] = item.split('-').map(str => str.trim());
          return { name, quantity };  
        }),
        instructions,
        image,
        category,
        area,
        mainIngredient,
        userId: user.uid,    // Firebase UID
        userName: userName,  // Name fetched from backend
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 201) {
      setMessage('Recipe added successfully!');
      setName('');
      setIngredients('');
      setInstructions('');
      setImage('');
      setCategory('');
      setArea('');
      setMainIngredient('');
    } else {
      setMessage('Failed to add recipe.');
    }
  } catch (error) {
    console.error('Error adding recipe:', error);
    setMessage('Failed to add recipe. Please try again.');
  }

  setTimeout(() => setMessage(''), 3000);
};


  return (
    <div className="post-recipe-container">
      <div className="form-container">
        <h2>Post Your Recipe</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Recipe Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
           placeholder="Ingredients (e.g., Toor dal - 100g, Salt - 1 tsp, Oil - 2 tbsp)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            required
          />

          <textarea
            placeholder="Instructions"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
          <input
            type="text"
            placeholder="Area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
          <input
            type="text"
            placeholder="Main Ingredient"
            value={mainIngredient}
            onChange={(e) => setMainIngredient(e.target.value)}
          />
          <button type="submit">Submit</button>
          {message && (
            <p className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
              {message}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default PostRecipe;
