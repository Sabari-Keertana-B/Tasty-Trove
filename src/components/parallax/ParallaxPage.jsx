import React from "react";
import { motion } from "framer-motion";
import "./parallaxpage.scss";

const ParallaxPage = ({ recipeFilterRef }) => {
  // Function to scroll smoothly to the Recipe Filter section
  const scrollToRecipeFilter = () => {
    if (recipeFilterRef.current) {
      recipeFilterRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="parallax-container">
      {/* Floating Logo & Name */}
      <motion.div 
        className="logo-banner"
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1 }}
      >
        <img src="/logo.png" alt="Tasty Trove" className="logo" />
        <h1 className="site-name">Tasty Trove</h1>
      </motion.div>

      {/* Parallax Quote Section */}
      <div className="parallax-section">
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          "Good food is the foundation of genuine happiness."
        </motion.h2>
        <motion.button
          className="cta-button"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToRecipeFilter} // Scroll to Recipe Filter
        >
          Find Recipes Now!
        </motion.button>
      </div>

      {/* Floating Watermark */}
      <div className="watermark">
        <img src="/logo.png" alt="Tasty Trove" className="watermark-logo" />
        <span className="watermark-text">Tasty Trove</span>
      </div>
    </div>
  );
};

export default ParallaxPage;
