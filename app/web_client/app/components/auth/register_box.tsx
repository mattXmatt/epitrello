"use client";
import { useState } from 'react';
import InputBar from "../utils/input/input_bar";
import "./register_box.css";
import { useAuth } from '@/app/contexts/AuthContext';

interface RegisterBoxProps {
    onSwitchToLogin: () => void;
}

export default function RegisterBox({ onSwitchToLogin }: RegisterBoxProps) {
    const [surname, setSurname] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const { register } = useAuth();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        try {
            await register({ 
                name: name.trim(), 
                surname: surname.trim(), 
                email: email.trim(), 
                password 
            });
        } catch (error: any) {
            setError(error.message || 'Registration failed');
            console.error('Registration failed', error);
        }
    };

    const handleSwitchToLogin = () => {
        setError(null);
        onSwitchToLogin();
    }

    return (
        <div className="registerBox">
            <form onSubmit={handleRegister}>
                <h1>Sign up</h1>
                <hr className="divider" />
                
                <p className="login-text">
                    You have an account ? <span className="login-link" onClick={handleSwitchToLogin}>Login</span>
                </p>

                {error && <p className="error-message">{error}</p>}

                <div className="inputs-container">
                    <div className="input-row">
                        <InputBar 
                            label="Surname" 
                            labelClassName="input-bar-label" 
                            inputClassName="input-bar-input" 
                            value={surname}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSurname(e.target.value)}
                        />
                        <InputBar 
                            label="Name" 
                            labelClassName="input-bar-label" 
                            inputClassName="input-bar-input" 
                            value={name}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        />
                    </div>

                    <InputBar 
                        label="Email" 
                        labelClassName="input-bar-label" 
                        inputClassName="input-bar-input" 
                        value={email}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    />
                    
                    <InputBar 
                        label="Password" 
                        labelClassName="input-bar-label" 
                        inputClassName="input-bar-input" 
                        type="password"
                        value={password}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                        />
                </div>

                <button type="submit" className="signup-button">Sign up</button>
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