import "./leaderboard.css";

import { useState, useEffect } from "react";
import TestSupabase from "./TestSupabase";
import NavBar from "./navBar";
import "./App.css";

function App() {
  // How to organize this data? - How will we fetch it from the backend?
  // make a list of 5 names and their associated data

  type LeaderboardEntry = {
    name: string;
    university: string;
    number_of_trades: number;
    points: number;
    return_percentage: number;
  };

  // User stats
  const rank = 2;
  const points = 1000;
  const percentRet = 20;
  const trades = 11;

  const user: LeaderboardEntry = {
    name: "You",
    university: "Virginia Tech",
    number_of_trades: trades,
    points: points,
    return_percentage: percentRet,
  };

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  let sorted_entries = [...entries].sort((a, b) => b.points - a.points);

  useEffect(() => {
    fetch("/leaderboard.json")
      .then((res) => res.json())
      .then((json) => setEntries([...json.leaderboard, user]))
      .catch((err) => console.error("Error loading JSON:", err));

    sorted_entries = [...entries].sort((a, b) => b.points - a.points);
  }, []);

  const handleClick = (buttonName: string) => {
    if (buttonName === "Daily") {
      // get different info for daily
      " Daily";
    }
    if (buttonName === "Weekly") {
      // get different info for weekly
      " Weekly";
    }
    if (buttonName === "Monthly") {
      // get different info for monthly
      " Monthly";
    }

    alert("Weekly clicked");
  };

  return (
    <div className="container">
      <NavBar />
      <div className="wrapper">
        <h3> Leaderboard </h3>
        {/* Current Position (Rank, Points, Return, Trades) */}
        <div className="content">
          <div className="box box-1">
            <div className="position-header">Your Current Position</div>
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-value rank-value">#{rank}</div>
                <div className="stat-label">Rank</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{points}</div>
                <div className="stat-label">Points</div>
              </div>
              <div className="stat-item">
                <div className="stat-value return-value">{percentRet}%</div>
                <div className="stat-label">Return</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">{trades}</div>
                <div className="stat-label">Trades</div>
              </div>
            </div>
          </div>
          <br />
          {/* Middle Row: Box 2 (leaderboard) and right-side 2x2 grid */}
          <div className="box-row">
            <div className="box box-2">
              <div className="mini-header">Top Traders</div>
              <div className="tabs">
                <button className="tab active">Daily</button>
                <button className="tab" onClick={() => handleClick("Daily")}>
                  Weekly
                </button>
                <button className="tab">Monthly</button>
              </div>
              <div className="trader-list">
                {sorted_entries.map((entry, index) => (
                  <div className="trader-row">
                    <div className="trader-left">
                      <div className="rank-badge">{index + 1}</div>
                      <div className="trader-info">
                        <div className="trader-name">{entry.name}</div>
                        <div className="trader-trades">{entry.number_of_trades} trades</div>
                      </div>
                    </div>
                    <div className="trader-right">
                      <div className="trader-points">
                        <div className="points-value">{entry.points}</div>
                        <div className="points-label">points</div>
                      </div>
                      <div className="trader-return">
                        <div className="return-percent">+{entry.return_percentage}%</div>
                        <div className="return-label">return</div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* your rank */}
                <div className="ellipsis">...</div>
                <div className="trader-row highlighted">
                  <div className="trader-left">
                    <div className="rank-badge">{23}</div>
                    <div className="trader-info">
                      <div className="trader-name">You</div>
                      <div className="trader-trades">18 trades</div>
                    </div>
                  </div>
                  <div className="trader-right">
                    <div className="trader-points">
                      <div className="points-value">2,847</div>
                      <div className="points-label">points</div>
                    </div>
                    <div className="trader-return">
                      <div className="return-percent">+12.4%</div>
                      <div className="return-label">return</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right-grid">
              <div className="box box-3">
                <div className="mini-header">Achievement Leaders</div>
                <div className="achievement-col">
                  <div className="trader-name">Risk Master</div>
                  <div className="trader-trades">Lowest Average Risk Per Trade</div>
                  <div className="trader-name">{"John"}</div>
                </div>
              </div>
              <div className="box box-4">
                <div className="placeholder-text">Box 4</div>
              </div>
              <div className="box box-5">
                <div className="placeholder-text">Box 5</div>
              </div>
              <div className="box box-6">
                <div className="placeholder-text">Box 6</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
