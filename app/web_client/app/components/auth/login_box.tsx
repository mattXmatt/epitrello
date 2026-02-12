"use client";
import { useState } from 'react';
import InputBar from "../utils/input/input_bar";
import "./login_box.css";
import { useAuth } from '@/app/contexts/AuthContext';

interface LoginBoxProps {
    onSwitchToRegister: () => void;
}

export default function LoginBox({ onSwitchToRegister }: LoginBoxProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { login } = useAuth();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await login({ email: email.trim(), password });
        } catch (error: any) {
            setError(error.message || 'Login failed');
            console.error('Login failed', error);
        }
    };

    const handleSwitchToRegister = () => {
        setError(null);
        onSwitchToRegister();
    }

    return (
        <div className="loginBox">
            <form onSubmit={handleLogin}>
                <h1>Login</h1>
                <hr className="divider" />
                
                <p className="signup-text">
                    No account ? <span className="signup-link" onClick={handleSwitchToRegister}>Sign up</span>
                </p>

                {error && <p className="error-message">{error}</p>}

                <div className="inputs-container">
                    <InputBar 
                        label="Email" 
                        labelClassName="input-bar-label" 
                        placeholder="" 
                        inputClassName="input-bar-input"
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    <InputBar 
                        label="Password" 
                        labelClassName="input-bar-label" 
                        placeholder="" 
                        inputClassName="input-bar-input" 
                        type="password"
                        value={password}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    />
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>

            <div className="social-section">
                <p>Or sign in with:</p>
                <div className="social-icons">
                    <div className="icon-wrapper"><img src="/google.png" alt="Google" /></div>
                    <div className="icon-wrapper"><img src="/ms.png" alt="MS" /></div>
                    <div className="icon-wrapper"><img src="/discord.png" alt="Discord" /></div>
                    <div className="icon-wrapper"><img src="/apple.png" alt="Apple" /></div>
                </div>
            </div>
        </div>
    );
}