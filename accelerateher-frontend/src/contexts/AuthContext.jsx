import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (userId, password) => {
        setLoading(true);
        setError(null);
        try {
            const formData = new URLSearchParams();
            formData.append('username', userId);
            formData.append('password', password);

            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: formData,
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.user);
                localStorage.setItem('authToken', data.access_token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return data.user;
            } else {
                const errData = await response.json();
                setError(errData.detail || 'Invalid User ID or password');
                return null;
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('Login failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const signup = async (userId, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    password,
                }),
            });

            if (response.ok) {
                const loginSuccess = await login(userId, password);
                if (loginSuccess) {
                    return loginSuccess;
                } else {
                    setError('Account created but login failed');
                    return null;
                }
            } else {
                const errData = await response.json();
                setError(errData.detail || 'Signup failed');
                return null;
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError('Signup failed');
            return null;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('authToken');
    };

    const clearAuthError = () => {
        setError(null);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        console.log('AuthContext initialization - checking stored auth:', {
            hasUser: !!storedUser,
            hasToken: !!storedToken
        });

        if (storedUser && storedToken) {
            try {
                const tokenParts = storedToken.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    const expTime = payload.exp * 1000;
                    const now = Date.now();

                    // Give 10 minutes buffer before auto-logout
                    if (expTime > (now - 600000)) {
                        console.log('Token is valid, restoring user session');
                        setUser(JSON.parse(storedUser));
                    } else {
                        console.log('Token expired, clearing session');
                        logout();
                    }
                } else {
                    console.log('Invalid token format, clearing session');
                    logout();
                }
            } catch (err) {
                console.error('Error parsing stored auth data:', err);
                logout();
            }
        } else {
            console.log('No stored auth data found');
            // Don't call logout() here as it might clear valid data
            setUser(null);
        }
    }, []);

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            error,
            login,
            signup,
            logout,
            clearAuthError,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
}; 