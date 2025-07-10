// src/contexts/UserProfileContext.js
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useAuth } from './AuthContext';

const UserProfileContext = createContext();

export const useUserProfile = () => useContext(UserProfileContext);

const API_BASE_URL = "http://localhost:8000/api";

export const UserProfileProvider = ({ children }) => {
    const [userProfile, setUserProfileState] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { user, logout } = useAuth();

    const handleUnauthorized = useCallback(() => {
        console.log('Unauthorized access detected - may need to refresh auth');
        // Don't immediately logout, give user a chance to refresh or navigate
        setError('Authentication may have expired. Please refresh the page or login again.');
        // Only logout after user action or multiple failed attempts
    }, []);

    const fetchUserProfile = useCallback(async (userId) => {
        console.log('fetchUserProfile called with userId:', userId);

        if (!userId) {
            console.log('No userId provided, returning early');
            setUserProfileState(null);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError(null);

        console.log('Starting profile fetch for userId:', userId);

        try {
            const token = localStorage.getItem('authToken');
            console.log('Token found:', !!token);

            if (!token) {
                console.log('No token found, skipping profile fetch');
                setUserProfileState(null);
                setLoading(false);
                return;
            }

            const requestUrl = `${API_BASE_URL}/profile/${userId}`;
            console.log('Making request to:', requestUrl);

            const response = await fetch(requestUrl, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('Profile data received:', data);
                setUserProfileState(data);
            } else if (response.status === 401) {
                console.log('401 Unauthorized - will retry on next navigation');
                setError('Authentication expired. Please refresh or login again.');
                setUserProfileState(null);
            } else if (response.status === 404) {
                console.log('404 Profile not found');
                setUserProfileState(null);
            } else {
                const errData = await response.json().catch(() => ({ detail: "Failed to parse error response" }));
                console.error(`Error fetching user profile (${response.status}):`, errData.detail || response.statusText);
                setError(errData.detail || `Failed to fetch profile (status ${response.status})`);
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
        console.log('UserProfileContext useEffect triggered:', { user, userId: user?.id });
        if (user) {
            console.log('Calling fetchUserProfile with userId:', user.id);
            fetchUserProfile(user.id);
        } else {
            console.log('No user found, setting profile to null');
            setUserProfileState(null);
            setLoading(false);
        }
    }, [user, fetchUserProfile]);

    const saveUserProfile = async (profileDataToSave) => {
        if (!user) {
            setError("No authenticated user");
            return null;
        }

        setLoading(true);
        setError(null);
        const { user_id, ...payload } = profileDataToSave;

        try {
            const token = localStorage.getItem('authToken');
            if (!token) {
                setError('No authentication token available');
                setLoading(false);
                return null;
            }

            const response = await fetch(`${API_BASE_URL}/profile/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                const savedData = await response.json();
                setUserProfileState(savedData);
                return savedData;
            } else if (response.status === 401) {
                setError('Authentication expired. Please refresh or login again.');
                return null;
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

    return (
        <UserProfileContext.Provider value={{
            userProfile,
            saveUserProfile,
            loading,
            error,
            fetchUserProfile,
            currentUserId: user?.id
        }}>
            {children}
        </UserProfileContext.Provider>
    );
};