# LanCon - Cross-Language Communication Platform

A real-time communication platform enabling seamless conversations between English and Japanese speakers through instant message and voice translation.

## Overview

LanCon bridges language barriers by providing instant translation capabilities for text and voice communications. It offers natural, fluid conversations between speakers of different languages without requiring either party to know the other's language.

## Core Features

- Real-time message translation between English and Japanese
- Voice-to-voice translation capabilities
- User authentication and profile management
- Secure WebSocket-based chat system
- Text-to-speech conversion
- Theme customization options
- User search functionality
- Bilingual interface support

## Technical Architecture

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

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 19+
- MongoDB Atlas account
- Google Cloud API key
- Gemini AI API key

### Environment Configuration

1. Configure backend environment:
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

### Development Server

1. Start backend server:
```bash
cd backend
uvicorn main:app --reload
```

2. Start frontend development server:
```bash
cd frontend
npm start
```

Access points:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

## API Documentation

### Authentication Endpoints
- POST `/users/register` - User registration
- POST `/users/token` - Authentication
- GET `/users/me` - Profile retrieval

### Communication Endpoints
- WebSocket `/ws/{user_id}` - Chat connection
- GET `/search` - User search
- POST `/upload-audio` - Audio processing

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
    ├── src/
    │   ├── components/ # React components
    │   ├── models/     # Frontend models
    │   ├── utils/      # Utility functions
    │   └── App.js      # Main React component
    └── package.json
```

## Future Development

### Language Support Expansion
- Integration of major Asian languages
- European language support
- Arabic and RTL language implementation

### Feature Enhancements
- Video chat with live translations
- Mobile applications
- Enhanced AI translation accuracy
- Gaming-specific translation modules

### Technical Roadmap
- Offline functionality
- Accent adaptation
- Voice modulation
- End-to-end encryption
- Regional server deployment

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/enhancement`)
3. Commit changes (`git commit -m 'Add enhancement'`)
4. Push to branch (`git push origin feature/enhancement`)
5. Open a Pull Request

## License

Proprietary software. All rights reserved.
See [LICENSE](LICENSE) for terms.