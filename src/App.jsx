import React, { useRef, useState, useEffect  } from "react";
import "./app.scss";
import FirstPage from "./components/firstpage/FirstPage";
import FeaturedRecipe from "./components/featuredrecipes/FeaturedRecipe";
import ParallaxPage from "./components/parallax/ParallaxPage";
import RecipeFilter from "./components/recipefilter/RecipeFilter";
import ContactPage from "./components/contacts/ContactPage";
import PostRecipe from "./components/postrecipes/PostRecipe";

import MyProfile from "./components/profile/MyProfile";
import SavedRecipes from "./components/profile/SavedRecipes";
import PostedRecipes from "./components/profile/PostedRecipes";

const App = () => {
  const featuredRef = useRef(null);
  const recipeFilterRef = useRef(null); 
  const contactRef = useRef(null); // ✅ ADDED contactRef
  const [activeDropdownPage, setActiveDropdownPage] = useState("");

  useEffect(() => {
    if (activeDropdownPage) {
      const section = document.getElementById(activeDropdownPage);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [activeDropdownPage]);

  const handleDropdownClick = (option) => {
    setActiveDropdownPage(option);
  };

  return (
    <div>
      <section className="app-container">
        <FirstPage 
          featuredRef={featuredRef} 
          contactRef={contactRef} // ✅ PASSED contactRef to FirstPage
          onDropdownClick={handleDropdownClick} 
        />
      </section>

      {activeDropdownPage === "profile" && (
        <section id="profile"><MyProfile onClose={() => setActiveDropdownPage("")} /></section>
      )}
      {activeDropdownPage === "saved" && (
        <section id="saved"><SavedRecipes onClose={() => setActiveDropdownPage("")} /></section>
      )}
      {activeDropdownPage === "postedrecipes" && (
        <section id="postedrecipes"><PostedRecipes onClose={() => setActiveDropdownPage("")} /></section>
      )}

      <section ref={featuredRef}><FeaturedRecipe /></section>
      <section>
        <ParallaxPage recipeFilterRef={recipeFilterRef} />
      </section>
      <section ref={recipeFilterRef}><RecipeFilter /></section>
      <section></section>
      <section><PostRecipe /></section>
      <section ref={contactRef}><ContactPage /></section> {/* ✅ ATTACHED contactRef */}
    </div>
  );
};

export default App;
