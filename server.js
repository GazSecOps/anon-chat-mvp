const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Rate limiting map - prevents spam
const rateLimits = new Map();
const RATE_LIMIT_WINDOW = 30000; // 30 seconds
const MAX_MESSAGES_PER_WINDOW = 10;

// Simple identity cache
const users = new Map();
let messageCount = 0;

// Serve static files
app.use(express.static('public'));

// Rate limit check
function canSendMessage(userId) {
  const now = Date.now();
  const userLimits = rateLimits.get(userId) || { count: 0, resetTime: now + RATE_LIMIT_WINDOW };

  if (now > userLimits.resetTime) {
    // Reset window
    rateLimits.set(userId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (userLimits.count >= MAX_MESSAGES_PER_WINDOW) {
    return false;
  }

  userLimits.count++;
  rateLimits.set(userId, userLimits);
  return true;
}

// Generate random username
function generateUsername() {
  const adjectives = ['Silent', 'Shadow', 'Ghost', 'Phantom', 'Cipher', 'Stealth', 'Hidden', 'Mystery'];
  const nouns = ['Agent', 'Walker', 'Runner', 'Hunter', 'Seeker', 'Finder', 'Observer', 'Watcher'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  const num = Math.floor(Math.random() * 1000);
  return `${adj}${noun}${num}`;
}

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Generate or retrieve username
  let username = users.get(socket.id);
  if (!username) {
    username = generateUsername();
    users.set(socket.id, username);
  }

  // Send welcome message with info
  socket.emit('welcome', {
    username,
    messageCount: io.engine.clientsCount
  });

  // Broadcast new user joined
  io.emit('system', `${username} joined the chat (${io.engine.clientsCount} online)`);

  // Handle messages
  socket.on('message', (data) => {
    if (!data || !data.text || typeof data.text !== 'string') return;

    // Rate limit check
    if (!canSendMessage(socket.id)) {
      socket.emit('error', 'Message rate limit exceeded. Please wait.');
      return;
    }

    // Basic message length limit
    if (data.text.length > 500) {
      socket.emit('error', 'Message too long (max 500 characters)');
      return;
    }

    // Sanitize and send
    const message = {
      id: messageCount++,
      username,
      text: data.text,
      timestamp: new Date().toISOString()
    };

    io.emit('message', message);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    const username = users.get(socket.id);
    users.delete(socket.id);
    rateLimits.delete(socket.id);
    io.emit('system', `${username} left the chat (${io.engine.clientsCount} online)`);
    console.log(`User disconnected: ${socket.id}`);
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Anonymous Chat MVP running at http://localhost:${PORT}`);
  console.log(`Connected users: ${io.engine.clientsCount}`);
});
