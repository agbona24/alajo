import React from 'react';
import { createRoot } from 'react-dom/client';
import './bootstrap';

function App() {
    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif' }}>
            <h1>Welcome to Alajo Savings App</h1>
            <p>Fresh Laravel + React Installation</p>
            <p>✅ Laravel Backend Running</p>
            <p>✅ React Frontend Running</p>
            <p>✅ Vite Hot Module Replacement Working</p>
        </div>
    );
}

const root = document.getElementById('app');
if (root) {
    createRoot(root).render(<App />);
}
