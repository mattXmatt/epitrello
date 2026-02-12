"use client";
import React from 'react';
import Link from 'next/link';
import './styles/DashboardPage.css';
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";

const DashboardPage = () => {
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    if (!isAuthenticated) {
        router.push("/auth");
        return null;
    }

    return (
        <div className="dashboard-container">
            <h1>Welcome to EpiTrello</h1>
            <p>Your collaborative project management tool.</p>
            <div className="dashboard-links">
                <Link href="/my-boards" className="dashboard-link">Go to My Boards</Link>
                <Link href="/boards" className="dashboard-link">Go to All Boards</Link>
                <Link href="/documentation" className="dashboard-link">Read the Documentation</Link>
            </div>
        </div>
    );
};

export default DashboardPage;

