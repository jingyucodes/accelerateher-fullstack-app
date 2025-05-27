// src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

const SignupPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [localError, setLocalError] = useState('');

    const { signup, loading, error: authContextError, clearAuthError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (clearAuthError) clearAuthError();
        };
    }, [clearAuthError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLocalError('');
        if (clearAuthError) clearAuthError();

        if (!username.trim()) {
            setLocalError('Username is required.');
            return;
        }

        if (password.length < 6) {
            setLocalError('Password must be at least 6 characters long.');
            return;
        }

        if (!/[a-zA-Z]/.test(password)) {
            setLocalError('Password must contain at least one letter.');
            return;
        }

        if (!/\d/.test(password)) {
            setLocalError('Password must contain at least one number.');
            return;
        }

        if (password !== confirmPassword) {
            setLocalError('Passwords do not match.');
            return;
        }

        const success = await signup(username, password);

        if (success) {
            navigate('/profile');
        } else {
            console.log('Signup failed:', authContextError);
        }
    };

    return (
        <>
            <Header pageTitle="Create Account" />
            <div className="wizard-container">
                <h1>Create Account</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                    Join our community and start your learning journey
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            autoComplete="username"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid var(--border-light)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setLocalError(''); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid var(--border-light)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setLocalError(''); if (clearAuthError) clearAuthError(); }}
                        />
                        <div style={{
                            fontSize: '0.85rem',
                            color: '#666',
                            marginTop: '0.5rem',
                            padding: '0.5rem',
                            backgroundColor: '#f8f8f8',
                            borderRadius: '4px'
                        }}>
                            Password must:
                            <ul style={{ paddingLeft: '1.2rem', marginTop: '0.3rem' }}>
                                <li>Be at least 6 characters long</li>
                                <li>Contain at least one letter</li>
                                <li>Contain at least one number</li>
                            </ul>
                        </div>
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="confirm-password" style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                            Confirm Password
                        </label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            autoComplete="new-password"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid var(--border-light)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(''); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    {(localError || authContextError) && (
                        <div style={{
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            backgroundColor: '#fff3f3',
                            border: '1px solid #ffa7a7',
                            borderRadius: '4px',
                            color: '#d63031'
                        }}>
                            {localError || authContextError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'var(--accent)',
                            marginBottom: '1rem'
                        }}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default SignupPage;