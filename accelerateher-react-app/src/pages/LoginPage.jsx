import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

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

        const success = await login(username, password);
        if (success) {
            navigate('/dashboard');
        }
    };

    return (
        <>
            <Header pageTitle="Sign In" />
            <div className="wizard-container">
                <h1>Sign In</h1>
                <p style={{ textAlign: 'center', marginBottom: '2rem', color: '#666' }}>
                    Welcome back! Continue your learning journey
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
                            onChange={(e) => { setUsername(e.target.value); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '0.5rem', color: '#333' }}>
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="current-password"
                            style={{
                                width: '100%',
                                padding: '0.5rem',
                                border: '1px solid var(--border-light)',
                                borderRadius: '4px',
                                fontSize: '1rem'
                            }}
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => { setPassword(e.target.value); if (clearAuthError) clearAuthError(); }}
                        />
                    </div>

                    {authContextError && (
                        <div style={{
                            padding: '0.75rem',
                            marginBottom: '1rem',
                            backgroundColor: '#fff3f3',
                            border: '1px solid #ffa7a7',
                            borderRadius: '4px',
                            color: '#d63031'
                        }}>
                            {authContextError}
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
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>

                    <p style={{ textAlign: 'center', marginTop: '1rem' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: 'var(--accent)', textDecoration: 'none' }}>
                            Create account
                        </Link>
                    </p>
                </form>
            </div>
        </>
    );
};

export default LoginPage; 