# import azure.cognitiveservices.speech as speechsdk
# import cv2
# import os
# import json

# # Azure Speech Service credentials
# speech_key = "EoZRBDWpS12UUXeG9fPIAnpyriwHRAjnGHLLEHV7UYxVpyxIFF7HJQQJ99BBACGhslBXJ3w3AAAYACOG9r75"
# service_region = "centralindia"

# # Set the path to the ASL videos folder
# VIDEO_FOLDER = os.path.join(os.path.dirname(__file__), "videos")

# # Load word-to-video mapping from JSON (if available)
# MAPPING_FILE = os.path.join(os.path.dirname(__file__), "video_mapping.json")

# if os.path.exists(MAPPING_FILE):
#     with open(MAPPING_FILE, "r") as f:
#         word_to_video = json.load(f)
# else:
#     word_to_video = {}  # Empty mapping if no JSON file exists

# def play_video(word):
#     """Plays the ASL video for the given word if it exists."""
    
#     # Get video filename from mapping or use word directly
#     video_filename = word_to_video.get(word, f"{word}.mp4").replace("..", ".")  # ✅ Fix extra dot issue
#     video_path = os.path.join(VIDEO_FOLDER, video_filename)

#     print(f"🔍 Looking for: {video_path}")  # ✅ Debugging print

#     if os.path.exists(video_path):
#         cap = cv2.VideoCapture(video_path)
        
#         if not cap.isOpened():
#             print(f"[ERROR] Unable to open: {video_path}")
#             return
        
#         while cap.isOpened():
#             ret, frame = cap.read()
#             if not ret:
#                 break
#             cv2.imshow("ASL Translation", frame)
#             if cv2.waitKey(30) & 0xFF == ord('q'):  # Press 'q' to exit video
#                 break

#         cap.release()
#         cv2.destroyAllWindows()

#     else:
#         print(f"[WARNING] No video found for: {word}")

# def speech_to_text():
#     """Converts spoken words to text using Azure Speech Service."""
#     speech_config = speechsdk.SpeechConfig(subscription=speech_key, region=service_region)
#     audio_config = speechsdk.AudioConfig(use_default_microphone=True)

#     recognizer = speechsdk.SpeechRecognizer(speech_config=speech_config, audio_config=audio_config)

#     print("🎤 Speak now...")
#     result = recognizer.recognize_once()

#     if result.reason == speechsdk.ResultReason.RecognizedSpeech:
#         recognized_text = result.text.lower()
#         print(f"✅ Recognized: {recognized_text}")

#         # Split words and play corresponding ASL videos **sequentially**
#         words = recognized_text.split()
#         for word in words:
#             play_video(word)  # ✅ Plays one video at a time before moving to the next

#     elif result.reason == speechsdk.ResultReason.NoMatch:
#         print("❌ No speech could be recognized.")
#     elif result.reason == speechsdk.ResultReason.Canceled:
#         print("⚠️ Speech recognition canceled.")

# # Run the program
# if __name__ == "__main__":
#     speech_to_text()

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app, origins='*')


# Path to video folder
VIDEO_FOLDER = os.path.join(os.getcwd(), "videos")
if not os.path.exists(VIDEO_FOLDER):
    os.makedirs(VIDEO_FOLDER)

# Load word-to-video mapping
MAPPING_FILE = os.path.join(os.getcwd(), "backend", "video_mapping.json")
if os.path.exists(MAPPING_FILE):
    with open(MAPPING_FILE, "r") as f:
        word_to_video = json.load(f)
else:
    word_to_video = {}

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the ASL Translation API!"})

@app.route('/api/speech-to-video', methods=['POST'])
def speech_to_video():
    data = request.get_json()
    text = data.get("text", "").lower()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    words = text.split()
    video_list = []

    for word in words:
        video_file = word_to_video.get(word, f"{word}.mp4")  # Get mapped video or default to word.mp4
        video_path = os.path.join(VIDEO_FOLDER, video_file)
        
        if os.path.exists(video_path):  # Check if the file exists
            video_list.append(f"https://msteams-2.onrender.com/videos/{video_file}")  # Local URL

    if not video_list:
        return jsonify({"error": "No matching videos found"}), 404

    return jsonify({"text": text, "videos": video_list})

@app.route("/videos/<path:filename>")
def serve_video(filename):
    """Serve ASL videos from the 'videos' folder."""
    return send_from_directory(VIDEO_FOLDER, filename, as_attachment=False)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
