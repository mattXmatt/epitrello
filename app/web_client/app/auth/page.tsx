"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import LoginBox from '../components/auth/login_box';
import RegisterBox from '../components/auth/register_box';

export default function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            router.push('/');
        }
    }, [isAuthenticated, router]);

    const toggleAuthMode = () => {
        setIsLogin(!isLogin);
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
            {isLogin ? (
                <LoginBox onSwitchToRegister={toggleAuthMode} />
            ) : (
                <RegisterBox onSwitchToLogin={toggleAuthMode} />
            )}
        </div>
    );
}
