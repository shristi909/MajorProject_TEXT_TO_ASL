# ASL Integration in Online Meeting Platform

This project enhances accessibility by integrating **American Sign Language (ASL)** into a Microsoft Teams-like interface. It uses **speech recognition** to convert spoken words into ASL video clips.

## 🔧 Project Structure

- `frontend/` – React-based meeting UI  
- `server/` – Flask backend using Azure Speech-to-Text  

## 🚀 How to Run

### Backend (Flask)
cd server
pip install -r requirements.txt  # or manually install flask, flask-cors, azure-cognitiveservices-speech
python app.py

### Frontend 
cd frontend
npm install
npm run start
