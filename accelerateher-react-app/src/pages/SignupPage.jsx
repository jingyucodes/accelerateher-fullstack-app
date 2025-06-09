// src/pages/SignupPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
            setLocalError('User ID is required.');
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
            navigate('/dashboard');
        } else {
            // Error is handled by AuthContext, but localError can also be set if needed
            // console.log('Signup failed on page:', authContextError);
        }
    };

    return (
        <div className="login-page-container-right-form">
            <div className="login-form-wrapper-dbs-style">
                <div className="login-logo-placeholder" style={{ textAlign: 'center' }}>
                    <h2>Create Account</h2>
                </div>
                <p style={{ textAlign: 'center', marginBottom: '25px', color: '#666', fontSize: '0.9rem' }}>
                    Join our community and start your learning journey
                </p>

                <form onSubmit={handleSubmit} className="login-form-dbs">
                    <div className="form-group-dbs">
                        <label htmlFor="username">User ID</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            autoComplete="username"
                            placeholder="Enter your User ID"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); setLocalError(''); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    <div className="form-group-dbs">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); setLocalError(''); if (clearAuthError) clearAuthError(); }}
                        />
                        <div style={{
                            fontSize: '0.8rem',
                            color: '#6c757d',
                            marginTop: '8px',
                            padding: '8px 12px',
                            backgroundColor: '#f8f9fa',
                            borderRadius: '4px',
                            border: '1px solid #e9ecef'
                        }}>
                            Password must:
                            <ul style={{ paddingLeft: '1.2rem', marginBlockStart: '0.5em', marginBlockEnd: '0.5em' }}>
                                <li>Be at least 6 characters long</li>
                                <li>Contain at least one letter</li>
                                <li>Contain at least one number</li>
                            </ul>
                        </div>
                    </div>

                    <div className="form-group-dbs">
                        <label htmlFor="confirm-password">Confirm Password</label>
                        <input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="Confirm your password"
                            value={confirmPassword}
                            onChange={(e) => { setConfirmPassword(e.target.value); setLocalError(''); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    {(localError || authContextError) && (
                        <div className="login-error-dbs">
                            {localError || authContextError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-login-dbs"
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                        Already have an account?{' '}
                        <Link to="/login" className="login-create-account-link">
                            Sign in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignupPage;