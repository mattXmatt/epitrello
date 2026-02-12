"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BoardColumn from '@/app/components/boards/BoardColumn';
import { getBoard, createColumn, Board } from '@/app/services/api';
import '../../styles/BoardPage.css';
import '../../styles/FormPage.css';

const BoardPage = () => {
    const params = useParams();
    const boardId = params.boardId as string;
    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [newColumnName, setNewColumnName] = useState('');

    useEffect(() => {
        if (boardId) {
            getBoard(boardId)
                .then(data => {
                    setBoard(data);
                    setLoading(false);
                })
                .catch(error => {
                    console.error(error);
                    setLoading(false);
                });
        }
    }, [boardId]);

    const handleAddColumn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newColumnName.trim() || !board) return;
        try {
            const newColumn = await createColumn(board.id, newColumnName);
            setBoard(prevBoard => {
                if (!prevBoard) return null;
                return {
                    ...prevBoard,
                    columns: [...prevBoard.columns, newColumn],
                };
            });
            setNewColumnName('');
            setShowModal(false);
        } catch (error) {
            console.error('Failed to create column', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (!board) return <div>Board not found</div>;

    return (
        <div className="board-page-container">
            <div className="board-header">
                <h1>{board.boardName}</h1>
                <p>{board.description}</p>
                <button onClick={() => setShowModal(true)} className="add-column-btn">
                    + Add Column
                </button>
            </div>
            <div className="board-columns-container">
                {board.columns.map(column => (
                    <BoardColumn key={column.id} column={column} />
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Column</h2>
                        <form onSubmit={handleAddColumn}>
                            <input
                                type="text"
                                value={newColumnName}
                                onChange={(e) => setNewColumnName(e.target.value)}
                                placeholder="Column Name"
                                required
                            />
                            <div className="modal-actions">
                                <button type="submit">Add Column</button>
                                <button type="button" onClick={() => setShowModal(false)}>
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardPage;