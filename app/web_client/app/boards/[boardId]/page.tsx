"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BoardColumn from '@/app/components/boards/BoardColumn';
import { getBoard, createColumn, updateBoardSettings, inviteUser, Board } from '@/app/services/api';
import '../../styles/BoardPage.css';

const BoardPage = () => {
    const params = useParams();
    const boardId = params.boardId as string;
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');
    

    const [bgColor, setBgColor] = useState('#ffffff');
    const [inviteEmail, setInviteEmail] = useState('');

    const refreshBoard = async () => {
        if (boardId) {
            const data = await getBoard(boardId);
            setBoard(data);
            if (data.backgroundColor) setBgColor(data.backgroundColor);
        }
    };

    useEffect(() => {
        if (boardId) {
            getBoard(boardId).then(data => {
                setBoard(data);
                setBgColor(data.backgroundColor || '#ffffff');
                setLoading(false);
            });
        }
    }, [boardId]);

    const handleAddColumn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newColumnName.trim() || !board) return;
        const newColumn = await createColumn(board.id, newColumnName);
        setBoard(prev => prev ? { ...prev, columns: [...prev.columns, newColumn] } : null);
        setNewColumnName('');
        setShowModal(false);
    };

    const handleSaveSettings = async () => {
        await updateBoardSettings(boardId, bgColor);
        if(inviteEmail) {
            await inviteUser(boardId, inviteEmail);
            alert(`User ${inviteEmail} invited!`);
            setInviteEmail('');
        }
        setShowSettings(false);
        refreshBoard();
    };

    if (loading) return <div>Loading...</div>;
    if (!board) return <div>Board not found</div>;

    return (
        <div className="board-page-container" style={{ backgroundColor: bgColor, minHeight: '100vh' }}>
            <div className="board-header">
                <h1>{board.boardName}</h1>
                <div style={{display: 'flex', gap: '10px'}}>
                    <button onClick={() => setShowSettings(true)}>Settings</button>
                    <button onClick={() => setShowModal(true)} className="add-column-btn">+ Column</button>
                </div>
            </div>
            
            <div className="board-columns-container">
                {board.columns.map(column => (
                    <BoardColumn 
                        key={column.id} 
                        column={column} 
                        onRefreshBoard={refreshBoard}
                    />
                ))}
            </div>

            {showSettings && (
                <div className="modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Board Settings</h2>
                        <label>Background Color</label>
                        <input 
                            type="color" 
                            value={bgColor} 
                            onChange={(e) => setBgColor(e.target.value)} 
                            style={{width: '100%', height: '40px', marginBottom: '20px'}}
                        />
                        <label>Invite Member (Email)</label>
                        <input 
                            type="email" 
                            value={inviteEmail} 
                            onChange={(e) => setInviteEmail(e.target.value)} 
                            placeholder="friend@example.com"
                            style={{width: '100%', padding: '8px', marginBottom: '20px'}}
                        />
                        <div className="modal-actions">
                            <button onClick={handleSaveSettings}>Save</button>
                            <button onClick={() => setShowSettings(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>New Column</h2>
                        <form onSubmit={handleAddColumn}>
                            <input value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder="Name" required />
                            <div className="modal-actions">
                                <button type="submit">Add</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardPage;