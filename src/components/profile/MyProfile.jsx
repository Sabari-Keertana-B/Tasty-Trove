import React, { useEffect, useState } from 'react';
import './MyProfile.scss';
import { IoClose } from 'react-icons/io5';
import axios from 'axios';
import { getAuth } from 'firebase/auth';

const MyProfile = ({ onClose }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;
        if (!currentUser) return;

        const uid = currentUser.uid;
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/${uid}`);

        setUser({
          name: response.data.name,
          email: response.data.email,
          joined: new Date(response.data.dateJoined).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        });
      } catch (err) {
        console.error('Failed to fetch user:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="profile-page">
      <div className="logo-container">
        <img src="logo.png" alt="App Logo" className="logo" />
        <span className="app-name">Tasty Trove</span>
      </div>
      <div className="profile-container">
        <button className="close-btn" onClick={onClose}>
          <IoClose />
        </button>

        <h2>My Profile</h2>
        <div className="profile-details">
          {user ? (
            <>
              <p><span>Name:</span> {user.name}</p>
              <p><span>Email:</span> {user.email}</p>
              <p><span>Joined:</span> {user.joined}</p>
            </>
          ) : (
            <p>Loading profile...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
