from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json
import azure.cognitiveservices.speech as speechsdk
import re

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

@app.route('/')
def home():
    return "✅ Flask ASL Speech-to-Video API is running!"

from dotenv import load_dotenv
import os
load_dotenv()

speech_key = os.getenv("AZURE_SPEECH_KEY")
service_region = os.getenv("AZURE_REGION")

# Video storage path
VIDEO_FOLDER = os.path.join(os.getcwd(), "videos")
os.makedirs(VIDEO_FOLDER, exist_ok=True)

# Load word-to-video mapping
MAPPING_FILE = os.path.join(os.getcwd(), "video_mapping.json")
if os.path.exists(MAPPING_FILE):
    with open(MAPPING_FILE, "r") as f:
        word_to_video = json.load(f)
else:
    word_to_video = {}

def clean_word(word):
    """Removes punctuation and converts to lowercase."""
    return re.sub(r"[^\w\s]", "", word).strip().lower()

def preprocess_sentence(text):
    """Removes auxiliary verbs and unnecessary words."""
    auxiliary_verbs = {"is", "are", "was", "were", "am", "be", "being", "been", "and"}
    words = text.split()
    return " ".join([word for word in words if clean_word(word) not in auxiliary_verbs])

def speech_to_text():
    """Converts spoken words to text using Azure Speech Service."""
    speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
    audio_config = speechsdk.AudioConfig(use_default_microphone=True)
    recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

    print("🎤 Speak now...")
    result = recognizer.recognize_once()

    if result.reason == speechsdk.ResultReason.RecognizedSpeech:
        return result.text.lower()
    return None

@app.route('/api/speech-to-video', methods=['POST'])
def speech_to_video():
    """API to convert speech to video list. Falls back to letters if word not found."""
    text = speech_to_text()
    if not text:
        return jsonify({"error": "Speech not recognized"}), 400

    processed_text = preprocess_sentence(text)
    words = [clean_word(word) for word in processed_text.split()]
    video_list = []

    for word in words:
        # Try full word video first
        video_file = word_to_video.get(word, f"{word}.mp4").replace("..", ".")
        video_path = os.path.join(VIDEO_FOLDER, video_file)

        if os.path.exists(video_path):
            video_list.append(f"http://localhost:5000/videos/{video_file}")
        else:
            # Fall back to spelling the word using letter videos
            for letter in word:
                letter_file = f"{letter.lower()}.mp4"
                letter_path = os.path.join(VIDEO_FOLDER, letter_file)
                if os.path.exists(letter_path):
                    video_list.append(f"http://localhost:5000/videos/{letter_file}")

    if not video_list:
        return jsonify({"error": "No matching videos found"}), 404

    return jsonify({
        "original_text": text,
        "processed_text": processed_text,
        "videos": video_list
    })

@app.route("/videos/<path:filename>")
def serve_video(filename):
    """Serve ASL videos from the 'videos' folder."""
    return send_from_directory(VIDEO_FOLDER, filename, as_attachment=False)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
