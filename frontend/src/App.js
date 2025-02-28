import { useState, useRef } from "react";

function App() {
  const [videos, setVideos] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);

  const fetchVideos = async () => {
    setError(null);
    setCurrentIndex(0); // Reset index when fetching new videos
    try {
      const response = await fetch("http://localhost:5000/api/speech-to-video");
      const data = await response.json();

      if (response.ok) {
        setVideos(data.videos);
      } else {
        setError(data.error || "Error fetching videos");
      }
    } catch (err) {
      setError("Failed to fetch data. Is the backend running?");
    }
  };

  const handleVideoEnd = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  return (
    <div>
      <h1>ASL Translator</h1>
      <button onClick={fetchVideos}>🎤 Speak & Translate</button>

      {error && <p style={{ color: "red" }}>⚠️ {error}</p>}

      {videos.length > 0 && (
        <div>
          <h2>🎥 Playing ASL Videos</h2>
          <video
            ref={videoRef}
            src={videos[currentIndex]}
            controls
            autoPlay
            width="400"
            onEnded={handleVideoEnd} // Play next video when the current one ends
          />
        </div>
      )}
    </div>
  );
}

export default App;
