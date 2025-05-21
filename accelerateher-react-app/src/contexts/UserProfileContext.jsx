// src/contexts/UserProfileContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const UserProfileContext = createContext();

export const useUserProfile = () => useContext(UserProfileContext);

const API_BASE_URL = "http://localhost:8000/api"; // Your backend API URL

// For now, let's assume a fixed user_id for demonstration.
// In a real app, this would come from an authentication system.
const DEMO_USER_ID = "learner123";

export const UserProfileProvider = ({ children }) => {
    const [userProfile, setUserProfileState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUserProfile = useCallback(async (userId) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/profile/${userId}`);
            if (response.ok) {
                const data = await response.json();
                setUserProfileState(data); // Data from backend includes user_id as _id
            } else if (response.status === 404) {
                setUserProfileState(null); // Profile doesn't exist yet
            } else {
                const errData = await response.json();
                console.error("Error fetching user profile:", errData.detail || response.statusText);
                setError(errData.detail || "Failed to fetch profile");
                setUserProfileState(null);
            }
        } catch (err) {
            console.error("Network error fetching user profile:", err);
            setError("Network error fetching profile.");
            setUserProfileState(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUserProfile(DEMO_USER_ID);
    }, [fetchUserProfile]);

    const saveUserProfile = async (profileDataToSave) => {
        setLoading(true);
        setError(null);
        // The backend expects the profile data without the user_id in the body
        const { user_id, ...payload } = profileDataToSave; // user_id might be our _id from DB
        const effectiveUserId = user_id || DEMO_USER_ID;

        try {
            const response = await fetch(`${API_BASE_URL}/profile/${effectiveUserId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });
            if (response.ok) {
                const savedData = await response.json();
                setUserProfileState(savedData); // Update context with saved data (includes _id as user_id)
                return savedData;
            } else {
                const errData = await response.json();
                console.error("Error saving user profile:", errData.detail || response.statusText);
                setError(errData.detail || "Failed to save profile");
                return null;
            }
        } catch (err) {
            console.error("Network error saving user profile:", err);
            setError("Network error saving profile.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = () => {
        // In a real app with backend auth, you'd call a logout endpoint.
        // For now, just clear local state. The profile itself remains in the DB.
        setUserProfileState(null);
        // localStorage.removeItem('someAuthToken'); // If you were using tokens
    };

    return (
        <UserProfileContext.Provider value={{ userProfile, saveUserProfile, logoutUser, loading, error, fetchUserProfile, currentUserId: DEMO_USER_ID }}>
            {children}
        </UserProfileContext.Provider>
    );
};