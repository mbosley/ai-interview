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
- Docker, cloud hosting (Heroku, AWS, DigitalOcean)
- HTTPS, using Let's Encrypt or provider-supplied certificates

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB
- OpenAI API key

### Installation

1. Clone the repository
```
git clone https://github.com/your-username/ai-interview-app.git
cd ai-interview-app
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

3. Quick Start using shell scripts

```
# Start the backend
./start-backend.sh

# In a separate terminal window
./start-frontend.sh
```

### Deploying to Render

1. Create a Render account at https://render.com/

2. Push your code to a GitHub or GitLab repository

3. Deploy the backend:
   - In Render dashboard, click "New" → "Web Service"
   - Connect your repository
   - Configure:
     - Name: interview-app-backend
     - Root Directory: backend
     - Runtime: Node
     - Build Command: `npm install`
     - Start Command: `npm start`
     - Add environment variables from your `.env` file
     - Set PORT=10000 (Render default)

4. Deploy the frontend:
   - In Render dashboard, click "New" → "Static Site"
   - Connect your repository
   - Configure:
     - Name: interview-app-frontend
     - Root Directory: frontend
     - Build Command: `npm install && npm run build`
     - Publish Directory: `build`
     - Add environment variable: `REACT_APP_API_URL=https://your-backend-url.onrender.com/api`
     - Add environment variable: `REACT_APP_SOCKET_URL=https://your-backend-url.onrender.com`

5. Update CORS settings:
   - In your backend environment variables on Render, set:
   - `CORS_ORIGIN=https://your-frontend-url.onrender.app`

Your application will be automatically built and deployed, and will update on new commits to your repository.

4. Manual Installation

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

## Usage

- **Participant**: Navigate to http://localhost:3000 and follow the consent process to begin an interview.
- **Researcher**: Access the dashboard at http://localhost:3000/dashboard using the admin token from your .env file.

## Interview Modules

The application supports customizable interview modules through JSON configuration files in the `backend/src/modules` directory. Each module defines:

- **Name and Description**: Human-readable information about the module's purpose
- **System Prompts**: Instructions for the AI interviewer's behavior (initial, follow-up, summary)
- **Settings**: Technical parameters like interview length, temperature, and model

### Example Module Configuration:

```json
{
  "name": "Technical Interview",
  "description": "A technical interview focused on programming concepts",
  "systemPrompts": {
    "initial": "You are a technical interviewer evaluating programming skills...",
    "followUp": "Based on the candidate's previous answers, ask a relevant technical question...",
    "summary": "Provide a detailed assessment of the candidate's technical abilities..."
  },
  "settings": {
    "interviewLength": 12,
    "temperature": 0.4,
    "model": "gpt-4"
  }
}
```

To add a new module, create a JSON file in the modules directory with the format above. The system will automatically load all module configurations at startup.

## Development

- The application uses React for the frontend and Express for the backend
- Socket.io is used for real-time communication between clients and server
- MongoDB is used for data storage
- OpenAI's API is used for generating interview questions and summaries

## License

This project is licensed under the MIT License - see the LICENSE file for details.
