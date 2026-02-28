import './trade.css'
import NavBar from './navBar'
import { useState, useEffect, useRef } from 'react'
import { FiSearch } from 'react-icons/fi'
import bellIcon from './assets/bell.svg'
import appleIcon from './assets/apple_icon.svg'

interface TickerData {
    symbol: string
    price: number
    changePct: number
    open: number
    high: number
    low: number
    prevClose: number
    volume: number
    asOf: string
}

function Trade() {
    const [quantity, setQuantity] = useState(1)
    const [selectedStock, setSelectedStock] = useState('AAPL')
    const [price, setPrice] = useState(178.45)
    const [action, setAction] = useState<'buy' | 'sell'>('buy')
    const [timeframe, setTimeframe] = useState('1M')
    const [detailView, setDetailView] = useState<'summary' | 'details'>('details')
    const [tickerData, setTickerData] = useState<TickerData | null>(null)
    const intervalRef = useRef<number | null>(null)

    const API_BASE_URL = 'http://127.0.0.1:8000'

    // Fetch APPL Data from ticker endpoint
    const fetchAAPLData = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/market/ticker/AAPL`)
            if (!response.ok) {
                throw new Error('Failed to fetch ticker data')
            }
            const data: TickerData = await response.json()
            setTickerData(data)
            setPrice(data.price)
        } catch (error) {
            console.error('Error fetching AAPL data:', error)
        }
    }

    // polls data every 5 seconds
    useEffect(() => {
        fetchAAPLData()
        
        // updates every 5 seconds
        intervalRef.current = window.setInterval(() => {
            fetchAAPLData()
        }, 5000)
        
        // Cleanup 
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [])

    const trendingStocks = [
        { symbol: 'AAPL', name: 'Apple Inc.', price: 178.45, change: '+2.34%' },
        { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 141.20, change: '+1.85%' },
        { symbol: 'MSFT', name: 'Microsoft Corp.', price: 378.91, change: '-0.45%' },
        { symbol: 'TSLA', name: 'Tesla Inc.', price: 242.84, change: '+3.21%' },
        { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 894.22, change: '+0.62%' },
        { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 171.33, change: '+0.31%' },
    ]

    return (
        <div className="trade-page">
            {/* Navbar spans full width */}
            <div className="navbar-wrapper">
                <NavBar />
            </div>

            <div className="shell">
                {/* Centered search bar */}
                <div className="trade-search-bar">
                    <FiSearch className="search-icon" />
                    <input type="text" placeholder="Search Stocks" />
                </div>

                <div className="trade-columns">
                    {/* ===== LEFT ===== */}
                    <aside className="stocks-list">
                        <h3>Trending Stocks</h3>

                        <div className="stocks-scroll">
                            {trendingStocks.map((s) => (
                                <div
                                    key={s.symbol}
                                    className={`stock-card ${selectedStock === s.symbol ? 'active' : ''}`}
                                    onClick={() => { setSelectedStock(s.symbol); setPrice(s.price); }}
                                >
                                    <div>
                                        <strong>{s.symbol}</strong>
                                        <p>{s.name}</p>
                                    </div>
                                    <div className="stock-info">
                                        <span>${s.price}</span>
                                        <small style={{ color: s.change.includes('-') ? '#ef4444' : '#10b981' }}>
                                            {s.change}
                                        </small>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="trade-form">
                            <h4>{selectedStock}</h4>

                            <label>Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                            />

                            <div className="price-row">
                                <p>Estimated Total</p>
                                <strong>${(price * quantity).toFixed(2)}</strong>
                            </div>

                            <div className="toggle-buttons">
                                <button
                                    className={action === 'buy' ? 'active-buy' : ''}
                                    onClick={() => setAction('buy')}
                                >
                                    Buy
                                </button>
                                <button
                                    className={action === 'sell' ? 'active-sell' : ''}
                                    onClick={() => setAction('sell')}
                                >
                                    Sell
                                </button>
                            </div>

                            <button className={`submit-btn ${action === 'buy' ? 'green' : 'red'}`}>
                                {action === 'buy' ? `Buy ${selectedStock}` : `Sell ${selectedStock}`}
                            </button>
                            <small>+50 points for smart risk management</small>
                        </div>
                    </aside>

                    {/* ===== RIGHT ===== */}
                    <main className="chart-area">
                        <div className="stock-preview">
                            <div className="stock-symbol">
                                <img src={appleIcon} alt="Apple Inc." className="company-icon" />
                                <div>
                                    <strong>{selectedStock}</strong>
                                    <p>Apple Inc.</p>
                                </div>
                            </div>


                            <div className="stock-price">
                                <strong>
                                    {tickerData ? `$${tickerData.price.toFixed(2)}` : 'Loading...'}
                                </strong>
                                {tickerData && (
                                    <p className={tickerData.changePct >= 0 ? 'positive' : 'negative'}>
                                        {tickerData.changePct >= 0 ? '+' : ''}{tickerData.changePct.toFixed(2)}%
                                    </p>
                                )}
                            </div>

                            <div className="stock-price">
                                <strong>
                                    {tickerData ? `$${tickerData.prevClose.toFixed(2)}` : 'Loading...'}
                                </strong>
                                {tickerData && (() => {
                                    const change = tickerData.price - tickerData.prevClose
                                    const changePercent = (change / tickerData.prevClose) * 100
                                    return (
                                        <p className={changePercent >= 0 ? 'positive' : 'negative'}>
                                            {change >= 0 ? '+' : ''}{change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                                        </p>
                                    )
                                })()}
                            </div>

                            <button className="bell-btn" title="Notifications">
                                <img src={bellIcon} alt="Notify" />
                            </button>
                        </div>

                        <div className="chart-placeholder">
                            <p>📈 Chart Coming Soon</p>
                        </div>

                        <div className="chart-buttons">
                            {['1D', '1W', '1M', '1Y', '5Y', 'ALL'].map(btn => (
                                <button
                                    key={btn}
                                    className={timeframe === btn ? 'active' : ''}
                                    onClick={() => setTimeframe(btn)}
                                >
                                    {btn}
                                </button>
                            ))}
                        </div>

                        <div className="summary-buttons">
                            <button
                                onClick={() => setDetailView('summary')}
                                className={detailView === 'summary' ? 'active' : ''}
                            >Summary</button>
                            <button
                                onClick={() => setDetailView('details')}
                                className={detailView === 'details' ? 'active' : ''}
                            >Details</button>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    )
}

export default Trade
