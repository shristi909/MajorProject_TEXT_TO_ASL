 ASL Integration for Online Meeting Platforms
Enhancing accessibility by converting speech to American Sign Language (ASL) in real-time
This project integrates ASL interpretation into video conferencing platforms (like Microsoft Teams) using Azure Speech-to-Text and a React-based interface.

📁 Project Structure
.
├── frontend/     # React meeting UI with ASL video rendering
├── server/       # Flask backend (uses Azure Speech-to-Text API)
└── README.md

🚀 Quick Start
🔙 Backend (Flask)
Navigate to the server directory:
cd server

Install dependencies:
pip install -r requirements.txt
Or install manually:
pip install flask flask-cors azure-cognitiveservices-speech

Run the Flask server:
python app.py
Server will run at: http://localhost:5000

🎛 Frontend (React)
Open a new terminal and navigate to the frontend directory:

cd frontend
Install dependencies:
npm install
Start the development server:
npm run start
App will open at: http://localhost:3000

🔌 API Configuration
Create a .env file in the server/ directory and add the following:
AZURE_SPEECH_KEY=your_api_key
AZURE_SERVICE_REGION=your_service_region
