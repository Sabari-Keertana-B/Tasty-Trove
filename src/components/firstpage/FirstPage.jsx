import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { auth } from "../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./firstpage.scss";

const FirstPage = ({ featuredRef, contactRef, onDropdownClick }) => {
  const [showSignup, setShowSignup] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const navbarRef = useRef(null); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (message || error) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [message, error]);

  const scrollToFeatured = () => {
    if (featuredRef.current) {
      featuredRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  const scrollToContact = () => {
    if (contactRef?.current) {
      contactRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };
  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    setError("Passwords do not match!");
    return;
  }

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
    const firebaseUser = userCredential.user;

    // Save user data to MongoDB
    await axios.post(`${import.meta.env.VITE_API_URL}/api/users`, {
      uid: firebaseUser.uid,
      name: formData.name,
      email: formData.email,
    });

    setMessage("Signup successful!");
    setShowSignup(false);
  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || err.message);
  }
};


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setMessage("Welcome back!");
      setShowLogin(false);
    } catch (err) {
      setError("User not Found. Please Signup!");
    }
  };

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, formData.email);
      setMessage("Reset email sent!");
      setShowForgotPassword(false);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setShowDropdown(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="landing-page">
      {/* Navbar */}
      <motion.nav
        ref={navbarRef} 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="navbar"
      >
        <div className="logo-container">
          <img src="/logo.png" alt="Tasty Trove Logo" className="logo" />
          <h1>Tasty Trove</h1>
        </div>

        <div className="nav-container">
          <ul>
            <li>Home</li>
            <li onClick={scrollToFeatured}>Recipes</li>
            <li onClick={() => setShowAbout(true)}>About</li>
            <li onClick={scrollToContact}>Contact</li>

          </ul>

          {!user ? (
            <button className="auth-button" onClick={() => setShowLogin(true)}>
              Login
            </button>
          ) : (
            <div className="profile-menu" onClick={() => setShowDropdown(!showDropdown)}>
              <img
                src={user.photoURL || "/profileimage.png"}
                alt="Profile"
                className="avatar"
              />
              {showDropdown && (
                <div className="dropdown">
                <p onClick={() => onDropdownClick("profile")}>My Profile</p>
                <p onClick={() => onDropdownClick("saved")}>Saved Recipes</p>
                <p onClick={() => onDropdownClick("postedrecipes")}>Posted Recipes</p>
                <p onClick={handleLogout}>Logout</p>
                </div>
              )}

            </div>
          )}
        </div>
      </motion.nav>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="quote-section"
      >
        <h2>"Savor the flavor, treasure the taste – Welcome to Tasty Trove!"</h2>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="cta-button"
          onClick={scrollToFeatured}
        >
          Discover More
        </motion.button>
      </motion.div>

      {/* Signup Popup */}
      {showSignup && (
        <div className="popup">
          <div className="popup-content">
            <h2>Sign Up</h2>
            <form onSubmit={handleSignup}>
              <input type="text" name="name" placeholder="Name" required onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              <input type="password" name="confirmPassword" placeholder="Confirm Password" required onChange={handleChange} />
              {error && <p className="error">{error}</p>}
              <button type="submit">Sign Up</button>
              <p>Already have an account? <span onClick={() => { setShowSignup(false); setShowLogin(true); }}>Login</span></p>
            </form>
            <button className="close-btn" onClick={() => setShowSignup(false)}>X</button>
          </div>
        </div>
      )}

      {/* Login Popup */}
      {showLogin && (
        <div className="popup">
          <div className="popup-content">
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
              <input type="email" name="email" placeholder="Email" required onChange={handleChange} />
              <input type="password" name="password" placeholder="Password" required onChange={handleChange} />
              {error && <p className="error">{error}</p>}
              <button type="submit">Login</button>
              <p>Forgot password? <span onClick={() => { setShowLogin(false); setShowForgotPassword(true); }}>Reset here</span></p>
              <p>Don't have an account? <span onClick={() => { setShowLogin(false); setShowSignup(true); }}>Sign up</span></p>
            </form>
            <button className="close-btn" onClick={() => setShowLogin(false)}>X</button>
          </div>
        </div>
      )}

      {/* Forgot Password Popup */}
      {showForgotPassword && (
        <div className="popup">
          <div className="popup-content">
            <h2>Forgot Password</h2>
            <form onSubmit={handleForgotPassword}>
              <input type="email" name="email" placeholder="Enter your email" required onChange={handleChange} />
              {error && <p className="error">{error}</p>}
              <button type="submit">Send Reset Email</button>
              <p>Remembered your password? <span onClick={() => { setShowForgotPassword(false); setShowLogin(true); }}>Login</span></p>
            </form>
            <button className="close-btn" onClick={() => setShowForgotPassword(false)}>X</button>
          </div>
        </div>
      )}

      {/* Success and Error Messages */}
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {showAbout && (
        <div className="popup">
          <div className="popup-content">
          <h2>About</h2>
          <p>
            Tasty Trove is your personal recipe companion – discover, save, and share recipes from around the world.
            Whether you're a beginner or a seasoned chef, our app offers something for everyone: curated recipes, custom
            creations, and powerful filters for ingredients, regions, and categories. Sign up, explore, and savor the journey!
        </p>
      <button className="close-btn" onClick={() => setShowAbout(false)}>X</button>
    </div>
  </div>
)}

    </div>
  );
};

export default FirstPage;
