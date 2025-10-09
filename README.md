# LanCon - Break Language Barriers, Connect Hearts 🌍✨

> *Don't speak Japanese? No problem! Chat in your own language and let LanCon handle the rest.*

## 🎯 What is LanCon?

LanCon is your bridge across languages - a revolutionary chat application that instantly translates between English and Japanese. Whether you're typing messages or speaking, LanCon makes cross-language communication as natural as talking to someone who speaks your language.

## ✨ Why LanCon?

- 🗣️ **Speak Naturally** - Just talk in English, and your Japanese friends will hear it in Japanese!
- 💬 **Type Freely** - Write in your language, and watch as messages magically transform
- 🎤 **Voice Freedom** - Record voice messages in English, get Japanese audio back
- 🚀 **Real-time Magic** - No delays, no awkward pauses - just smooth conversations
- 🌐 **Break Barriers** - Make friends across cultures without language holding you back

## Features

- 🔒 User authentication (signup/login)  
- 💬 Real-time chat with automatic message translation
- 🎤 Voice recording with English to Japanese translation
- 🔊 Text-to-speech for Japanese translations
- 🌓 Dark/Light theme support
- 🌐 Bilingual interface (English/Japanese)
- 👥 User profile management
- 🔍 User search functionality

## Tech Stack

### Frontend
- React 19
- React Router v7
- TailwindCSS 
- WebSocket API
- Web Audio API

### Backend
- FastAPI
- MongoDB
- WebSocket
- Whisper (OpenAI) for speech recognition
- Gemini AI for translation
- gTTS (Google Text-to-Speech)

## Prerequisites

- Python 3.12+
- Node.js 19+
- MongoDB Atlas account
- Google Cloud API key
- Gemini AI API key

## Environment Setup

1. Create a `.env` file in the `/backend` directory:

```env
MONGO_URL=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_ai_api_key
```

2. Install backend dependencies:

```bash
cd backend
pip install fastapi uvicorn motor pymongo python-jose[cryptography] passlib python-multipart whisper google-cloud-translate gtts google-generativeai python-dotenv
```

3. Install frontend dependencies:

```bash
cd frontend
npm install
```

## Running the Application

1. Start the backend server:

```bash
cd backend
uvicorn main:app --reload
```

2. Start the frontend development server:

```bash
cd frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## API Routes

### Authentication
- POST `/users/register` - Register new user
- POST `/users/token` - Login and get access token
- GET `/users/me` - Get current user profile

### Chat
- WebSocket `/ws/{user_id}` - Real-time chat connection
- GET `/search` - Search for users

### Audio
- POST `/upload-audio` - Upload and translate voice recordings

## Project Structure

```
lancon/
├── backend/
│   ├── app/
│   │   ├── auth/       # Authentication logic
│   │   ├── chat/       # WebSocket handling
│   │   ├── config/     # App configuration
│   │   ├── database/   # Database connection
│   │   ├── models/     # Data models
│   │   ├── routers/    # API routes
│   │   └── translation/# Translation services
│   └── main.py         # FastAPI application
└── frontend/
    ├── public/
    ├── src/
    │   ├── components/ # React components
    │   ├── models/     # Frontend models
    │   ├── utils/      # Utility functions
    │   └── App.js      # Main React component
    └── package.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


## 🚀 Future Roadmap

### Multilingual Expansion
- 🌏 Support for all major Asian languages (Korean, Mandarin, Hindi, Thai)
- 🌍 European language integration (Spanish, French, German, Italian)
- 🌎 Support for Arabic and right-to-left languages

### Enhanced Features
- 🎥 Real-time video chat with live subtitle translations
- 📱 Mobile applications for iOS and Android
- 🤖 Improved AI translation accuracy with context awareness
- 🎮 Gaming-specific translation modules for better gaming terminology

### Community Features
- 👥 Language exchange matching system
- 🏫 Virtual language learning rooms
- 🎯 Dialect support within languages
- 🤝 Cultural exchange recommendations

### Technical Improvements
- ⚡ Offline mode support
- 🔄 Real-time accent adaptation
- 🎛️ Custom voice modulation per language
- 🔐 End-to-end encryption for all communications
- 🌐 Regional server deployment for reduced latency

Stay tuned as we work to make LanCon the ultimate global communication platform! 


## License

This project is proprietary software. All rights reserved.
See the [LICENSE](LICENSE) file for full license terms.