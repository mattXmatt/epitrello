import React from 'react';
import Link from 'next/link';
import './board_card.css';

interface BoardCardProps {
    boardName: string;
    description: string;
    id: string;
}

const BoardCard: React.FC<BoardCardProps> = ({ boardName, description, id }) => {
    return (
        <Link href={`/boards/${id}`} className="board-card-link">
            <div className="board-card">
                <h2>{boardName}</h2>
                <p>{description}</p>
            </div>
        </Link>
    );
};

export default BoardCard;

