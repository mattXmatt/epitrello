"use client";
import React from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/contexts/AuthContext';
import './Header.css';

const Header = () => {
    const { isAuthenticated, user, logout } = useAuth();

    return (
        <header className="header">
            <div className="header-left">
                <Link href="/" className="logo">EpiTrello</Link>
                <nav className="nav">
                    {isAuthenticated && <Link href="/my-boards" className="nav-link">Mes boards</Link>}
                    <Link href="/boards" className="nav-link">Tous les boards</Link>
                    <Link href="/documentation" className="nav-link">Documentation</Link>
                </nav>
            </div>
            <div className="header-right">
                <div className="user-profile">
                    {isAuthenticated && user ? (
                        <div className="profile-dropdown">
                            <span>{user.username}</span>
                            <div className="dropdown-content">
                                <button onClick={logout}>Se déconnecter</button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth" className="nav-link login-btn">Connexion</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;
