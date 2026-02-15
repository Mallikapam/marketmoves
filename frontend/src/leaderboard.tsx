import "./leaderboard.css";

import { useState } from "react";
import TestSupabase from "./TestSupabase";
import NavBar from "./navBar";
import "./App.css";

function App() {
  //const [count, setCount] = useState(0)
  const rank = 2;
  const points = 1000;
  const percentRet = 20;
  const trades = 11;

  // How to organize this data? - How will we fetch it from the backend?
  // make a list of 5 names and their associated data

  const firstName = "Name1";
  const p1trades = 10;
  const p1points = 3000;
  const p1return = 100;
  const secondName = "Name2";
  const p2trades = 20;
  const p2points = 3000;
  const p2return = 200;
  const thirdName = "Name3";
  const p3trades = 34;
  const p3points = 2000;
  const p3return = 300;
  const fourthName = "Name4";
  const p4trades = 44;
  const p4points = 1000;
  const p4return = 400;
  const fifthName = "Name5";
  const p5trades = 54;
  const p5points = 10;
  const p5return = 500;

  const position = 23;

  const handleClick = (buttonName: string) => {
    if (buttonName === "Daily") {
      // get different info for daily
      firstName + " Daily";
    }
    if (buttonName === "Weekly") {
      // get different info for weekly
      secondName + " Weekly";
    }
    if (buttonName === "Monthly") {
      // get different info for monthly
      thirdName + " Monthly";
    }

    alert("Weekly clicked");
  };

  return (
    <div className="container">
      <NavBar />
      <div className="wrapper">
        <br />
        <h3> Leaderboard </h3>
        <br />
        {/* Current Position (Rank, Points, Return, Trades) */}
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

        {/* Middle Row: Box 2 and 3 - 70/30 Split */}
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
              {/* 1 out of 5 traders */}
              <div className="trader-row">
                <div className="trader-left">
                  <div className="rank-badge">1</div>
                  <div className="trader-info">
                    <div className="trader-name">{firstName}</div>
                    <div className="trader-trades">{p1trades} trades</div>
                  </div>
                </div>
                <div className="trader-right">
                  <div className="trader-points">
                    <div className="points-value">{p1points}</div>
                    <div className="points-label">points</div>
                  </div>
                  <div className="trader-return">
                    <div className="return-percent">+{p1return}%</div>
                    <div className="return-label">return</div>
                  </div>
                </div>
              </div>
              {/* 2 out of 5 traders */}
              <div className="trader-row">
                <div className="trader-left">
                  <div className="rank-badge">2</div>
                  <div className="trader-info">
                    <div className="trader-name">{secondName}</div>
                    <div className="trader-trades">{p2trades} trades</div>
                  </div>
                </div>
                <div className="trader-right">
                  <div className="trader-points">
                    <div className="points-value">{p2points}</div>
                    <div className="points-label">points</div>
                  </div>
                  <div className="trader-return">
                    <div className="return-percent">+{p2return}%</div>
                    <div className="return-label">return</div>
                  </div>
                </div>
              </div>
              {/* 3 out of 5 traders */}
              <div className="trader-row">
                <div className="trader-left">
                  <div className="rank-badge">3</div>
                  <div className="trader-info">
                    <div className="trader-name">{thirdName}</div>
                    <div className="trader-trades">{p3trades} trades</div>
                  </div>
                </div>
                <div className="trader-right">
                  <div className="trader-points">
                    <div className="points-value">{p3points}</div>
                    <div className="points-label">points</div>
                  </div>
                  <div className="trader-return">
                    <div className="return-percent">+{p3return}%</div>
                    <div className="return-label">return</div>
                  </div>
                </div>
              </div>
              {/* 4 out of 5 traders */}
              <div className="trader-row">
                <div className="trader-left">
                  <div className="rank-badge">4</div>
                  <div className="trader-info">
                    <div className="trader-name">{fourthName}</div>
                    <div className="trader-trades">{p4trades} trades</div>
                  </div>
                </div>
                <div className="trader-right">
                  <div className="trader-points">
                    <div className="points-value">{p4points}</div>
                    <div className="points-label">points</div>
                  </div>
                  <div className="trader-return">
                    <div className="return-percent">+{p4return}%</div>
                    <div className="return-label">return</div>
                  </div>
                </div>
              </div>
              {/* 5 out of 5 traders */}
              <div className="trader-row">
                <div className="trader-left">
                  <div className="rank-badge">5</div>
                  <div className="trader-info">
                    <div className="trader-name">{fifthName}</div>
                    <div className="trader-trades">{p5trades} trades</div>
                  </div>
                </div>
                <div className="trader-right">
                  <div className="trader-points">
                    <div className="points-value">{p5points}</div>
                    <div className="points-label">points</div>
                  </div>
                  <div className="trader-return">
                    <div className="return-percent">+{p5return}%</div>
                    <div className="return-label">return</div>
                  </div>
                </div>
              </div>

              {/* your rank */}
              <div className="ellipsis">...</div>

              <div className="trader-row highlighted">
                <div className="trader-left">
                  <div className="rank-badge">{position}</div>
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
          <div className="box box-3">
            <div className="mini-header">Achievement Leaders</div>
            <div className="achievement-col">
              <div className="trader-name">Risk Master</div>{" "}
              {/* Probably should switch the className of these elements*/}
              <div className="trader-trades">Lowest Average Risk Per Trade</div>
              <div className="trader-name">{secondName}</div>
            </div>
          </div>
        </div>
        <br />
        {/* Bottom Row: Box 4, 5, and 6 - Equal Width */}
        <div className="box-grid">
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
  );
}

export default App;
