"use client";
import React, { useState, useEffect } from 'react';
import BoardCard from '@/app/components/boards/BoardCard';
import { getBoards, Board } from '@/app/services/api';
import './../styles/DashboardPage.css';

const AllBoardsPage = () => {
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getBoards()
            .then(data => {
                setBoards(data);
                setLoading(false);
            })
            .catch(error => {
                console.error(error);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="dashboard-container">
            <h1>All Boards</h1>
            <div className="boards-grid">
                {boards.map((board) => (
                    <BoardCard key={board.id} id={board.id} boardName={board.boardName} description={board.description} />
                ))}
            </div>
        </div>
    );
};

export default AllBoardsPage;
