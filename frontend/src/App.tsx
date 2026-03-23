import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import TestSupabase from "./TestSupabase";
import "./App.css";

// for routing
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./auth";
import Leaderboard from "./leaderboard";
import Portfolio from "./portfolioDashboard";
import SignUp from "./signUp";
import Trade from "./trade";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/trade" element={<Trade />} />
      </Routes>
    </Router>
  );
}

export default App;
