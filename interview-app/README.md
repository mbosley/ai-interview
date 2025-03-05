# AI Interview Application

A web-based AI interview application where participants engage in a dynamic, voice-enabled interview. The system adapts its questions in real time using a flexible LLM API, while maintaining strict anonymity. It also includes a researcher dashboard for monitoring live sessions and analyzing anonymized data.

## Key Features

- **Natural Voice Chat**: Real-time speech-to-text (STT) and text-to-speech (TTS) for conversational interactions.
- **Dynamic Interviewing**: Adaptive questioning using a flexible LLM integration.
- **Multi-modal Input/Output**: Support for both text and voice responses.
- **Real-Time Progress & Session Summary**: Visual progress tracking during the interview and a final summary.
- **Anonymous Participation**: No account creation or personal identifiers.
- **Researcher Dashboard**: Secure interface for live session monitoring and historical data review.
- **Security & Compliance**: Robust security measures ensuring data privacy and IRB compliance.
- **Customizable Interview Modules**: Support for different interview types via JSON configuration files.
- **Fine-grained AI Control**: Extensive prompting system allowing precise control over interviewer behavior.
- **Adjustable TTS Speed**: Control text-to-speech playback rate from 0.5x to 2.0x.

## Technology Stack

### Frontend
- React
- Libraries: react-speech-recognition, axios, socket.io-client, React Router, Material-UI

### Backend
- Node.js with Express
- Libraries: socket.io, mongoose (MongoDB), axios, dotenv, helmet, cors, morgan, jsonwebtoken

### LLM Integration
- LLM abstraction layer with OpenAI provider
- Default model: GPT-4o (easily configurable per interview module)

### Deployment & Containerization
- Docker, cloud hosting (Render, AWS, DigitalOcean)
- HTTPS, using Let's Encrypt or provider-supplied certificates

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
```
git clone https://github.com/mbosley/ai-interview.git
cd ai-interview
```

2. Set up environment variables
```
# Backend environment file (.env)
PORT=4000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/ai-interview
CORS_ORIGIN=http://localhost:3000
ADMIN_TOKEN=admin_secret_token_123
JWT_SECRET=jwt_secret_for_auth_tokens_456
OPENAI_API_KEY=your_openai_api_key_here
LLM_PROVIDER=openai

# Frontend environment file (.env)
REACT_APP_API_URL=http://localhost:4000/api
REACT_APP_SOCKET_URL=http://localhost:4000
```

3. Install dependencies and start the application

Frontend:
```
cd frontend
npm install
npm start
```

Backend:
```
cd backend
npm install
npm run dev
```
