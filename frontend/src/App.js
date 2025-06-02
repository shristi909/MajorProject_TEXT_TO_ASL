import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
  const [videos, setVideos] = useState([]);
  const [originalText, setOriginalText] = useState("");
  const [processedText, setProcessedText] = useState("");
  const [activeTab, setActiveTab] = useState("videos");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeVideo, setActiveVideo] = useState(1);

  const videoRef1 = useRef(null);
  const videoRef2 = useRef(null);

  const handleMicClick = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/speech-to-video",
        {
          method: "POST",
        }
      );

      const data = await response.json();
      if (data.videos && data.videos.length > 0) {
        setVideos(data.videos);
        setOriginalText(data.original_text);
        setProcessedText(data.processed_text);
        setCurrentIndex(0);
        setActiveVideo(1);
      } else {
        console.error("No videos found");
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  useEffect(() => {
    if (videos.length === 0) return;

    const currentRef =
      activeVideo === 1 ? videoRef1.current : videoRef2.current;
    const nextRef = activeVideo === 1 ? videoRef2.current : videoRef1.current;

    currentRef.src = videos[currentIndex];
    currentRef.load();

    currentRef.onloadeddata = () => {
      currentRef.style.opacity = 1;
      nextRef.style.opacity = 0;
      currentRef.play();
    };

    currentRef.onended = () => {
      const nextIndex = currentIndex + 1;
      if (nextIndex >= videos.length) return;

      nextRef.src = videos[nextIndex];
      nextRef.load();

      nextRef.onloadeddata = () => {
        nextRef.play();
        nextRef.style.opacity = 1;
        currentRef.style.opacity = 0;
        setCurrentIndex(nextIndex);
        setActiveVideo(activeVideo === 1 ? 2 : 1);
      };
    };
  }, [currentIndex, videos]);

  const getHighlightedIndex = () => {
    const words = processedText.split(" ");
    let indexCounter = 0;

    for (let i = 0; i < words.length; i++) {
      const word = words[i].toLowerCase();
      if (
        videos[indexCounter] &&
        videos[indexCounter].includes(`/${word}.mp4`)
      ) {
        if (indexCounter === currentIndex)
          return { wordIndex: i, charIndex: -1 };
        indexCounter++;
      } else {
        for (let j = 0; j < word.length; j++) {
          if (indexCounter === currentIndex)
            return { wordIndex: i, charIndex: j };
          indexCounter++;
        }
      }
    }

    return { wordIndex: -1, charIndex: -1 };
  };

  const highlighted = getHighlightedIndex();

  return (
    <div className="app">
      {/* Main Content */}
      <div className="main-content">
        <div className="header">
          <div className="meeting-info">
            <h2>Daily Standup Meeting</h2>
            <p>1:30:20</p>
          </div>
        </div>

        {/* Participants */}
        <div className="video-grid">
          <div className="video-item">
            <div className="participant-circle">JD</div>
            <div className="participant-name">John Doe</div>
            <div className="mic-status" onClick={handleMicClick}>
              🎤
            </div>
          </div>
          <div className="video-item">
            <div className="participant-circle">AS</div>
            <div className="participant-name">Alice Smith</div>
            <div className="mic-status muted">🎤</div>
          </div>
          <div className="video-item">
            <div className="participant-circle">RJ</div>
            <div className="participant-name">Robert Johnson</div>
            <div className="mic-status">🎤</div>
          </div>
          <div className="video-item">
            <div className="participant-circle">ME</div>
            <div className="participant-name">You</div>
            <div className="mic-status">🎤</div>
          </div>
        </div>

        <div className="control-bar">
          <button className="control-btn">🎤 Mute</button>
          <button className="control-btn">📹 Video</button>
          <button className="control-btn">✋ Raise Hand</button>
          <button className="control-btn">💻 Share</button>
          <button className="control-btn">••• More</button>
          <button className="leave-btn">Leave</button>
        </div>
      </div>

      {/* Side Panel */}
      <div className="side-panel">
        <div className="panel-header">
          <button
            className={`panel-btn ${activeTab === "videos" ? "active" : ""}`}
            onClick={() => setActiveTab("videos")}
          >
            Videos
          </button>
        </div>

        {activeTab === "videos" && (
          <div className="video-display">
            {videos.length > 0 ? (
              <div className="video-container">
                <div className="video-stack video-display">
                  <video
                    ref={videoRef1}
                    className={`video ${
                      activeVideo === 1 ? "visible" : "hidden"
                    }`}
                    muted
                    playsInline
                    controls={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  <video
                    ref={videoRef2}
                    className={`video ${
                      activeVideo === 2 ? "visible" : "hidden"
                    }`}
                    muted
                    playsInline
                    controls={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                </div>

                <div className="subtitles">
                  {processedText.split(" ").map((word, i) => {
                    if (
                      i === highlighted.wordIndex &&
                      highlighted.charIndex === -1
                    ) {
                      return (
                        <span
                          key={i}
                          style={{
                            fontWeight: "bold",
                            color: "#007bff",
                            marginRight: "6px",
                          }}
                        >
                          {word}
                        </span>
                      );
                    } else if (
                      i === highlighted.wordIndex &&
                      highlighted.charIndex !== -1
                    ) {
                      return (
                        <span key={i} style={{ marginRight: "6px" }}>
                          {word.split("").map((char, j) => (
                            <span
                              key={j}
                              style={{
                                fontWeight:
                                  j === highlighted.charIndex
                                    ? "bold"
                                    : "normal",
                                color:
                                  j === highlighted.charIndex
                                    ? "#007bff"
                                    : "#333",
                              }}
                            >
                              {char}
                            </span>
                          ))}
                        </span>
                      );
                    } else {
                      return (
                        <span key={i} style={{ marginRight: "6px" }}>
                          {word}
                        </span>
                      );
                    }
                  })}
                </div>
              </div>
            ) : (
              <p>No videos available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
