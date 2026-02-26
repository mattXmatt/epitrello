"use client";
import React, { useState, useEffect } from 'react';
import BoardCard from '@/app/components/boards/BoardCard';
import { getBoards, createBoard, Board } from '@/app/services/api';
import { useRouter } from 'next/navigation';
import './../styles/DashboardPage.css';

const MyBoardsPage = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreate, setShowCreate] = useState(false);
    const [boardName, setBoardName] = useState('');
    const [description, setDescription] = useState('');
    const [creating, setCreating] = useState(false);
    const router = useRouter();

    const fetchBoards = () => {
        setLoading(true);
        getBoards()
            .then(data => { setBoards(data); setLoading(false); })
            .catch(err => { console.error(err); setLoading(false); });
    };

    useEffect(() => { fetchBoards(); }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!boardName.trim()) return;
        setCreating(true);
        try {
            const res = await createBoard(boardName, description);
            const id = res?.result?.id ?? res?.id;
            if (id) { router.push(`/boards/${id}`); }
            else { setShowCreate(false); setBoardName(''); setDescription(''); fetchBoards(); }
        } catch (err) {
            console.error(err);
            setCreating(false);
        }
    };

    const closeModal = () => { setShowCreate(false); setBoardName(''); setDescription(''); };

    if (loading) return <div className="page-container"><div className="loading-state">Chargement...</div></div>;

    return (
        <div className="page-container">
            <div className="page-header">
                <h1 className="page-title">Mes boards</h1>
                <button className="btn-primary" onClick={() => setShowCreate(true)}>+ Nouveau board</button>
            </div>

            <div className="boards-grid">
                {boards.map(board => (
                    <BoardCard key={board.id} id={board.id} boardName={board.boardName} description={board.description} />
                ))}
                {boards.length === 0 && (
                    <div className="empty-state">
                        <p>Aucun board pour le moment.</p>
                        <button className="btn-primary" onClick={() => setShowCreate(true)}>Créer mon premier board</button>
                    </div>
                )}
            </div>

            {showCreate && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-box" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Nouveau board</h2>
                            <button className="modal-close" onClick={closeModal}>✕</button>
                        </div>
                        <form onSubmit={handleCreate} className="modal-form">
                            <div className="form-group">
                                <label htmlFor="boardName">Nom du board</label>
                                <input id="boardName" type="text" value={boardName}
                                    onChange={e => setBoardName(e.target.value)}
                                    placeholder="Ex: Sprint Q1, Marketing..." required autoFocus />
                            </div>
                            <div className="form-group">
                                <label htmlFor="desc">Description <span className="optional">(optionnel)</span></label>
                                <textarea id="desc" rows={3} value={description}
                                    onChange={e => setDescription(e.target.value)}
                                    placeholder="Décrivez l'objectif de ce board..." />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="btn-secondary" onClick={closeModal}>Annuler</button>
                                <button type="submit" className="btn-primary" disabled={creating}>
                                    {creating ? 'Création...' : 'Créer le board'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyBoardsPage;
