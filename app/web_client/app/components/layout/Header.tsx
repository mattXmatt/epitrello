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
                    {isAuthenticated && <Link href="/my-boards" className="nav-link">My Boards</Link>}
                    <Link href="/boards" className="nav-link">All Boards</Link>
                    <Link href="/documentation" className="nav-link">Documentation</Link>
                    <Link href="/create-board" className="nav-link">Create Board</Link>
                </nav>
            </div>
            <div className="header-right">
                <div className="user-profile">
                    {isAuthenticated && user ? (
                        <div className="profile-dropdown">
                            <span>{user.username}</span>
                            <div className="dropdown-content">
                                <button onClick={logout}>Logout</button>
                            </div>
                        </div>
                    ) : (
                        <Link href="/auth" className="nav-link">Login / Register</Link>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;


