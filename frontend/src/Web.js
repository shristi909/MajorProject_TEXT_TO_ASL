import React from "react";
import { Link } from "react-router-dom";
import "./Web.css"; // Import the CSS file

const ASLTeamsPage = () => {
  return (
    <div className="asl-page">
      {/* Navbar */}
      <header className="navbar">
        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#pricing">Pricing</a>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </nav>
      </header>

      {/* Main Section */}
      <main className="main-section">
        <h1>ASL INTEGRATION IN ONLINE MEETING PLATFORM</h1>

        <div className="image-container">
          <img src="web.jpg" alt="ASL integration illustration" />
        </div>

        <p className="description">
          This project aims to incorporate American Sign Language into Microsoft
          Teams to enhance accessibility for deaf and hard of hearing users.
        </p>

        <Link to="/meeting" className="enter-button">
          ENTER MEETING
        </Link>
      </main>
    </div>
  );
};

export default ASLTeamsPage;
