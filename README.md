# 🔒 Anon Chat MVP

A simple, browser-based anonymous chat platform with basic spam protection and privacy features.

## Features

- **Anonymous Identity**: No registration, no phone numbers. Auto-generated usernames.
- **Real-Time Chat**: Instant messaging using WebSockets (Socket.IO)
- **Spam Protection**: Rate limiting (10 messages per 30 seconds) prevents abuse
- **Simple UI**: Clean, dark-themed interface optimized for privacy
- **Message History**: Full chat log maintained during session
- **Online Status**: See how many users are connected

## Quick Start

```bash
# Clone the repo
git clone https://github.com/GazSecOps/anon-chat-mvp.git
cd anon-chat-mvp

# Install dependencies
npm install

# Start the server
npm start
```

Visit http://localhost:3000 in your browser.

## How It Works

1. **Identity**: Each connection gets a randomly generated username (e.g., "ShadowHunter427")
2. **Rate Limiting**: Each user can send 10 messages per 30 seconds to prevent spam
3. **Messages**: Broadcast to all connected users in real-time
4. **Privacy**: No account creation, no phone numbers, no data collection

## Technical Details

- **Backend**: Node.js + Express
- **Real-Time Communication**: Socket.IO
- **Frontend**: Vanilla JavaScript + CSS
- **Rate Limiting**: In-memory tracking per socket ID
- **Message Size**: Maximum 500 characters per message

## Future Improvements

- [ ] Private direct messages
- [ ] Room/channel support
- [ ] End-to-end encryption
- [ ] Persistent message history
- [ ] User-generated usernames
- [ ] Better spam detection
- [ ] Mobile app

## Security Notes

This is an MVP for testing and learning. In production:
- Add HTTPS/WSS
- Implement proper authentication (WebAuthn, cryptographic identities)
- Add message encryption
- Add moderation tools
- Use proper session management
- Deploy with proper security headers

## License

MIT

---

Built for fun and learning. Privacy matters.
