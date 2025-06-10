# Clone or navigate to your project directory first

# ---------- SETUP BACKEND ----------
cd server
python -m venv venv
pip install -r requirements.txt || pip install flask flask-cors azure-cognitiveservices-speech

# Set up environment variables
echo "AZURE_SPEECH_KEY=your_api_key" >> .env
echo "AZURE_SERVICE_REGION=your_service_region" >> .env

# Start the backend server
python app.py &

# ---------- SETUP FRONTEND ----------
cd ../frontend
npm install
npm run start
