import React, { useEffect } from 'react';

const WebSocketDemo = () => {
    useEffect(() => {
        // Create WebSocket connection.
        const ws = new WebSocket('ws://localhost:8000/ws');

        // Connection opened
        ws.addEventListener('open', () => {
            console.log('Connected to the server');
            // Send a message to the server
            ws.send('Hello, server!');
        });

        // Listen for messages
        ws.addEventListener('message', (event) => {
            console.log('Message from server:', event.data);
        });

        // Clean up on component unmount
        return () => {
            ws.close();
            console.log('Disconnected from the server');
        };
    }, []); // Empty array ensures this runs once on mount only

    return (
        <div>
            Check the console for WebSocket messages.
        </div>
    );
};

export default WebSocketDemo;
