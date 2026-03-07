import "./leaderboard.css";

import { useState, useEffect } from "react";
import TestSupabase from "./TestSupabase";
import NavBar from "./navBar";
import "./App.css";

function App() {
  type LeaderboardEntry = {
    name: string;
    university: string;
    number_of_trades: number;
    weekly_return: number;
    monthly_return: number;
    yearly_return: number;
    alltime_return: number;
  };

  enum Interval {
    WEEKLY,
    MONTHLY,
    YEARLY,
    ALLTIME
  }

  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [interval, setInterval] = useState<Interval>(Interval.WEEKLY);

  const user: LeaderboardEntry = {
    name: "You",
    university: "Virginia Tech",
    number_of_trades: 15,
    weekly_return: 2,
    monthly_return: 4,
    yearly_return: 8,
    alltime_return: 30
  };

  useEffect(() => {
    fetch("/leaderboard.json")
      .then((res) => res.json())
      .then((json) => setEntries([...json.leaderboard, user]))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  const getReturn = (entry: LeaderboardEntry) => {
    switch (interval) {
      case Interval.WEEKLY:
        return entry.weekly_return
      case Interval.MONTHLY:
        return entry.monthly_return
      case Interval.YEARLY:
        return entry.yearly_return
      case Interval.ALLTIME:
        return entry.alltime_return
    }
  }

  const sorted_entries = [...entries].sort(
    (a, b) => getReturn(b) - getReturn(a)
  );

  const handleClick = (interval: Interval) => {
    setInterval(interval);
  };

  function UserComponent(props: any) {
    return (
      <div className="box box-1">
        <div className="position-header">Your Current Position</div>
        <div className="stats-row">
          <div className="stat-item">
            <div className="stat-value rank-value">#{7}</div>
            <div className="stat-label">Rank</div>
          </div>
          <div className="stat-item">
            <div className="stat-value return-value">{props.return_val}%</div>
            <div className="stat-label">Return</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{props.number_of_trades}</div>
            <div className="stat-label">Trades</div>
          </div>
        </div>
      </div>
    )
  }

  function IntervalComponent(props: any) {
    return (
      <div className="tabs">
        <button className="tab" onClick={() => handleClick(Interval.WEEKLY)}>Week</button>
        <button className="tab" onClick={() => handleClick(Interval.MONTHLY)}>Month</button>
        <button className="tab" onClick={() => handleClick(Interval.YEARLY)}>Year</button>
        <button className="tab" onClick={() => handleClick(Interval.ALLTIME)}>All-Time</button>
      </div>
    )
  }

  function LeaderboardEntryComponent(props: any) {
    return (
      <div className="trader-row">
        <div className="trader-left">
          <div className="rank-badge">{props.rank}</div>
          <div className="trader-info">
            <div className="trader-name">{props.name}</div>
            <div className="trader-trades">{props.number_of_trades} trades</div>
          </div>
        </div>
        <div className="trader-right">
          <div className="trader-return">
            <div className="return-percent">+{props.return_value}%</div>
            <div className="return-label">return</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container">
      <NavBar />
      <div className="wrapper">
        <h3> Leaderboard </h3>
        <div className="main-content">
          <UserComponent return_val={getReturn(user)} number_of_trades={user.number_of_trades} />
          <div className="leaderboard-section">
            <div className="leaderboard-panel">
              <div className="mini-header">Top Traders</div>
              <IntervalComponent />
              <div className="trader-list">
                {sorted_entries.map((entry, index) => (
                  <LeaderboardEntryComponent rank={index + 1} name={entry.name}
                    number_of_trades={entry.number_of_trades}
                    return_value={getReturn(entry)} />
                ))}
              </div>
            </div>
            <div className="stats-grid">
              <div className="box stat-box">
                <div className="mini-header">Achievement Leaders</div>
                <div className="achievement-col">
                  <div className="trader-name">Risk Master</div>
                  <div className="trader-trades">Lowest Average Risk Per Trade</div>
                  <div className="trader-name">{"John"}</div>
                </div>
              </div>
              <div className="box stat-box">
                <div className="placeholder-text">Box 4</div>
              </div>
              <div className="box stat-box">
                <div className="placeholder-text">Box 5</div>
              </div>
              <div className="box stat-box">
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
