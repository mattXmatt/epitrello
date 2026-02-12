"use client";
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './../contexts/AuthContext';
import './../styles/FormPage.css';

import { createBoard } from './../services/api';

const CreateBoardPage = () => {
    const [boardName, setBoardName] = useState('');
    const [description, setDescription] = useState('');
    const { isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/auth');
        }
    }, [isAuthenticated, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newBoard = await createBoard(boardName, description);
            router.push(`/boards/${newBoard.id}`);
        } catch (error) {
            console.error('Failed to create board', error);
        }
    };

    if (!isAuthenticated) {
        // Render nothing or a loading spinner while redirecting
        return null;
    }

    return (
        <div className="form-container">
            <h1>Create a New Board</h1>
            <form onSubmit={handleSubmit} className="form">
                <div className="form-group">
                    <label htmlFor="boardName">Board Name</label>
                    <input
                        id="boardName"
                        type="text"
                        value={boardName}
                        onChange={(e) => setBoardName(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit" className="submit-button">Create Board</button>
            </form>
        </div>
    );
};

export default CreateBoardPage;
