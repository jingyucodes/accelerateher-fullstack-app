import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const API_BASE_URL = "http://localhost:8000/api";

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const login = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            // Create form data for OAuth2
            const formData = new URLSearchParams();
            formData.append('username', username);
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
                setError(errData.detail || 'Invalid username or password');
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

    const signup = async (username, password) => {
        setLoading(true);
        setError(null);
        try {
            // Create new user in database
            const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    password,
                    email: `${username}@example.com` // Temporary email since backend requires it
                }),
            });

            console.log('Signup response status:', response.status);

            if (response.ok) {
                const userData = await response.json();
                console.log('Signup successful, user data:', userData);

                // After successful signup, login automatically
                const loginSuccess = await login(username, password);
                if (loginSuccess) {
                    return loginSuccess;
                } else {
                    setError('Account created but login failed');
                    return null;
                }
            } else {
                const errData = await response.json();
                console.error('Signup failed:', errData);
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
        localStorage.removeItem('authToken'); // Also remove the auth token
    };

    const clearAuthError = () => {
        setError(null);
    };

    // Check for stored user and token on mount
    React.useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const storedToken = localStorage.getItem('authToken');

        if (storedUser && storedToken) {
            // Parse the JWT token to check expiration
            try {
                const tokenParts = storedToken.split('.');
                if (tokenParts.length === 3) {
                    const payload = JSON.parse(atob(tokenParts[1]));
                    const expTime = payload.exp * 1000; // Convert to milliseconds

                    if (expTime > Date.now()) {
                        // Token is still valid
                        setUser(JSON.parse(storedUser));
                    } else {
                        // Token has expired
                        console.log('Token expired, logging out');
                        logout();
                    }
                }
            } catch (err) {
                console.error('Error parsing token:', err);
                logout();
            }
        } else {
            // If either user or token is missing, clear both
            logout();
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