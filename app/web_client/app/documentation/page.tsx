"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getBoards, Board } from '@/app/services/api';
import '../styles/DashboardPage.css';

const DocumentationPage = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBoards()
            .then(data => { setBoards(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Documentation</h1>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', marginBottom: '28px', fontSize: '0.9375rem' }}>
                Sélectionnez un board pour accéder à son dépôt de fichiers.
            </p>
            {loading ? (
                <div className="loading-state">Chargement...</div>
            ) : (
                <div className="boards-grid">
                    {boards.map(board => (
                        <Link key={board.id} href={`/boards/${board.id}/documentation`} className="doc-board-card">
                            <span className="doc-board-name">{board.boardName}</span>
                            <span className="doc-board-sub">{board.description || 'Voir la documentation'}</span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DocumentationPage;
