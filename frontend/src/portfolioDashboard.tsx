import "./portfolioDashboard.css";
import NavBar from "./navBar";
import { PortfolioStockCard } from "./components/PortfolioStockCard";
import { useEffect, useState } from "react";

/** Dev: same-origin /api → Vite proxies to :8000. Prod: set VITE_API_BASE_URL. */
function portfolioApiUrl(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  const fromEnv = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/$/, "");
  if (fromEnv) return `${fromEnv}${p}`;
  if (import.meta.env.DEV) return `/api${p}`;
  return `http://127.0.0.1:8000${p}`;
}

type MostActiveRow = {
  symbol: string;
  name: string;
  price: number;
  change: string;
};

function App() {
  const [activeTab, setActiveTab] = useState("individual");
  const [mostActive, setMostActive] = useState<MostActiveRow[]>([]);
  const [mostActiveLoading, setMostActiveLoading] = useState(true);
  const [mostActiveError, setMostActiveError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setMostActiveLoading(true);
      setMostActiveError(null);
      try {
        const res = await fetch(
          portfolioApiUrl("/market/most-active-stocks?n=10")
        );
        if (!res.ok) {
          throw new Error((await res.text()) || res.statusText);
        }
        const data: unknown = await res.json();
        if (!Array.isArray(data)) throw new Error("Unexpected response");
        const rows: MostActiveRow[] = data.map((item) => {
          const row = item as Record<string, unknown>;
          return {
            symbol: String(row.symbol ?? ""),
            name: String(row.name ?? row.symbol ?? ""),
            price: Number(row.price ?? 0),
            change: String(row.change ?? "—"),
          };
        });
        if (!cancelled) setMostActive(rows.filter((r) => r.symbol));
      } catch (e) {
        console.error("Most active stocks:", e);
        if (!cancelled) {
          setMostActive([]);
          setMostActiveError(
            e instanceof TypeError && e.message === "Failed to fetch"
              ? "Could not reach the API. Is the backend running?"
              : e instanceof Error
                ? e.message
                : "Could not load stocks"
          );
        }
      } finally {
        if (!cancelled) setMostActiveLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="container">
      <NavBar />
      <div className="wrapper">
        <div className="leftSide">
          {/* Portfolio Value Section */}
          {/* Has the total amount of money & ETF's*/}
          <div className="portfolio-value">Portfolio Value</div>
          <div className="total-money">$12,345.67</div>

          <div className="row">
            <div className="SP-container">
              <div className="info">
                <h3>S&P 500</h3>
                <p>Standard & Poor's</p>
              </div>
              <div className="change">+49,50%</div>
            </div>

            <div className="SP-container">
              <div className="info">
                <h3>DOW</h3>
                <p>Dow Jones</p>
              </div>
              <div className="change">+49,50%</div>
            </div>
          </div>

          <div className="wishlist-header">
            <h1 className="wishlist-title">Wishlist</h1>
            <button className="add-button">
              {/*Add a stock to wishlist button finish this later*/}
            </button>
          </div>

          {/*Stock cards*/}
          <div className="stock-grid">
            <div className="stock-card">
              <div className="stock-info">
                <div className="stock-details">
                  <h2>AMZN</h2>
                  <p>Amazon, Inc</p>
                </div>
              </div>
              <div className="stock-change negative">- 0.05%</div>
            </div>

            <div className="stock-card">
              <div className="stock-info">
                <div className="stock-details">
                  <h2>ADBE</h2>
                  <p>Adobe, Inc</p>
                </div>
              </div>
              <div className="stock-change positive">+ 0.32%</div>
            </div>
          </div>

          <div className="total-money">Stocks</div>
          <p className="portfolio-stocks-subtitle">Top 10 most active</p>
          {mostActiveLoading ? (
            <p className="portfolio-most-active-status">
              Loading most active stocks…
            </p>
          ) : mostActiveError ? (
            <p className="portfolio-most-active-status portfolio-most-active-error">
              {mostActiveError}
            </p>
          ) : mostActive.length === 0 ? (
            <p className="portfolio-most-active-status">
              No most active data available.
            </p>
          ) : (
            mostActive.map((r) => (
              <PortfolioStockCard
                key={r.symbol}
                symbol={r.symbol}
                name={r.name}
                price={r.price}
                changeLabel={r.change}
              />
            ))
          )}
        </div>
        <div className="rightSide">
          <div className="personal-stats">
            <div className="buying-power">
              <p>Buying Power</p>
              <h2>$1,234.56</h2>
              <h6>$ Available to trade</h6>
            </div>
            <div className="points-earned">
              <p>Points Earned</p>
              <h2>1250</h2>
              <h6>+ 120 this week</h6>
            </div>
            <div className="your-rank">
              <p>Your Rank</p>
              <h2>#41</h2>
              <h6>Up 8 positions</h6>
            </div>
          </div>
          <div className="live-leaderboard">
            <div className="leaderboard-header">Live Leaderboard</div>
            <div className="ranking-button">
              <button
                className={`button ${activeTab === "individual" ? "active" : "inactive"
                  }`}
                onClick={() => setActiveTab("individual")}
              >
                Individual Rankings
              </button>
              <button
                className={`button ${activeTab === "university" ? "active" : "inactive"
                  }`}
                onClick={() => setActiveTab("university")}
              >
                University Rankings
              </button>
            </div>
            <div className="leaderboard-entries">
              {/* Figure out getting / setting data later*/}
              <LeaderBoardEntry
                place="1"
                userName=""
                schoolName="VT"
                points="100"
              />
              <LeaderBoardEntry
                place="2"
                userName=""
                schoolName="UVA"
                points="10"
              />
              <LeaderBoardEntry
                place="3"
                userName=""
                schoolName="VT"
                points="100"
              />
              <LeaderBoardEntry
                place="4"
                userName=""
                schoolName="VT"
                points="100"
              />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
              <LeaderBoardEntry />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;

interface LeaderBoardEntryProps {
  place?: string;
  userName?: string;
  schoolName?: string;
  points?: string;
}

function LeaderBoardEntry(props: LeaderBoardEntryProps) {
  return (
    <div className="leaderboard-entry">
      <div className="name-info">
        <div className="entry-rank">{props.place}</div>
        <div className="entry-name">{props.userName}</div>
        <div className="school-name">{props.schoolName}</div>
      </div>
      <div className="entry-information">
        <div className="entry-points">1500 pts</div>
        <div className="entry-percent">+25% this week</div>
      </div>
    </div>
  );
}
