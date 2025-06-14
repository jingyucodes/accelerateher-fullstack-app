import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, loading, error: authContextError, clearAuthError } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        return () => {
            if (clearAuthError) clearAuthError();
        };
    }, [clearAuthError]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (clearAuthError) clearAuthError();

        if (!username.trim()) {
            return;
        }
        if (!password.trim()) {
            return;
        }

        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="login-page-container-right-form">
            <div className="login-form-wrapper-dbs-style">
                <div className="login-logo-placeholder" style={{ textAlign: 'center' }}>
                    <h2>AccelerateHer</h2>
                </div>

                <form onSubmit={handleSubmit} className="login-form-dbs">
                    <div className="form-group-dbs">
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            autoComplete="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => { setUsername(e.target.value); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    <div className="form-group-dbs">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    {authContextError && (
                        <div className="login-error-dbs">
                            {authContextError}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn-login-dbs"
                    >
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '0.9rem' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" className="login-create-account-link">
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default LoginPage; 