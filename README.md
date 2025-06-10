# ASL Integration for Online Meeting Platforms

**Enhancing accessibility by converting speech to American Sign Language (ASL) in real-time**  
This project integrates ASL interpretation into video conferencing (like Microsoft Teams) using Azure Speech-to-Text and a React-based interface.


## 🔧 Project Structure
.
├── frontend/ # React meeting UI with ASL video rendering
├── server/ # Flask backend (Azure Speech-to-Text API)
└── README.md

text

## 🚀 Quick Start

### Backend (Flask)
1. Navigate to the server directory:
   ```bash
   cd server
Install dependencies:

bash
pip install -r requirements.txt
or manually:

bash
pip install flask flask-cors azure-cognitiveservices-speech
Run the server:

bash
python app.py
Runs at http://localhost:5000

Frontend (React)
In a new terminal, navigate to frontend:

bash
cd frontend
Install dependencies:

bash
npm install
Start the development server:

bash
npm run start
Opens at http://localhost:3000


🔌 API Configuration
Set these environment variables in server/.env:

AZURE_SPEECH_KEY=your_api_key
AZURE_SERVICE_REGION=region
