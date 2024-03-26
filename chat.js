const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const mysql = require('mysql');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const db = mysql.createConnection({
    host: 'localhost',
    user: 'username',
    password: 'password',
    database: 'chat_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

wss.on('connection', function connection(ws) {
    console.log('New WebSocket connection');

    // Handle incoming messages
    ws.on('message', function incoming(message) {
        // Save message to database
        db.query('INSERT INTO messages SET ?', { message }, (err, result) => {
            if (err) throw err;
            console.log('Message saved to database');
        });

        // Broadcast message to all clients
        wss.clients.forEach(function each(client) {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });
});

server.listen(3000, () => {
    console.log('Server started on port 3000');
});
