import React from 'react';
import '../styles/DashboardPage.css';

const DocumentationPage = () => {
    const documentation = {
        documentName: 'Documentation',
        content: 'This is the documentation you put in EpiTrello.'
    };

    return (
        <div className="dashboard-container">
            <h1>Documentation</h1>
            <div className="documentation-content">
                <h2>{documentation.documentName}</h2>
                <p>{documentation.content}</p>
            </div>
        </div>
    );
};

export default DocumentationPage;
