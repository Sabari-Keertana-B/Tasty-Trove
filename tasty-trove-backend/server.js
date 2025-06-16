const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); // to load .env file

const app = express();

// ✅ Middleware should be before routes
app.use(cors());
app.use(express.json());

// ✅ Import and use routes
const recipeRoutes = require('./routes/recipeRoutes');
app.use('/api/recipes', recipeRoutes);

const favoriteRoutes = require('./routes/favorites');
app.use('/api/favorites', favoriteRoutes);

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

// ✅ Test route
app.get('/', (req, res) => {
  res.send('Tasty Trove Backend is Running 🚀');
});

// ✅ Connect to MongoDB and start the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(5000, () => console.log('🚀 Server running on port 5000'));
  })
  .catch((err) => console.error('❌ MongoDB Connection Error:', err));
