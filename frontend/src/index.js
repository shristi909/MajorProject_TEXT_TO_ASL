import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "../src/App";
import Web from "../src/Web";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Web />} />
        <Route path="/meeting" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);
