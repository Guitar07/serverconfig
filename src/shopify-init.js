import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    // Create container if it doesn't exist
    let container = document.getElementById('server-configurator-root');
    if (!container) {
        container = document.createElement('div');
        container.id = 'server-configurator-root';
        document.body.appendChild(container);
    }

    // Initialize React
    try {
        const root = createRoot(container);
        root.render(
            <React.StrictMode>
                <App />
            </React.StrictMode>
        );
    } catch (error) {
        console.error('Failed to initialize React app:', error);
    }
});
