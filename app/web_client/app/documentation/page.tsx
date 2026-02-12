import React from 'react';
import '../styles/DashboardPage.css';

const DocumentationPage = () => {
    // Mock data, will be replaced with API call
    const documentation = {
        documentName: 'EpiTrello API Documentation',
        content: 'This is the documentation for the EpiTrello API. It covers all the available endpoints and how to use them.'
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
