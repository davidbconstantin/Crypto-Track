import { useEffect, useMemo, useState } from "react";

//coin information
type Coin = {
  id: string; market_cap_rank: number | null; name: string; symbol: string;
  image: string; current_price: number | null; price_change_percentage_24h: number | null;
  market_cap: number | null; total_volume: number | null;
};

//public api url for coin gecko
const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";

//formatting functions for money and change
function money(value: number | null, compact = false) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", notation: compact ? "compact" : "standard", maximumFractionDigits: value < 1 ? 6 : 2 }).format(value);
}
function changeText(value: number | null) {
  if (value == null) return "—";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

//main app component
export default function App() {
  const [coins, setCoins] = useState<Coin[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  //function to load coin data from the coingecko API
  async function loadCoins() {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(response.status === 429 ? "CoinGecko rate limit reached. Wait a moment and try again." : "Could not load market data. Please try again.");
      }
      const data: Coin[] = await response.json();
      setCoins(data);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong while loading prices.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadCoins(); }, []);
//filter coins based on search query
  const filteredCoins = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return coins;
    return coins.filter((coin) => coin.name.toLowerCase().includes(query) || coin.symbol.toLowerCase().includes(query));
  }, [coins, search]);

  //calculate market cap, gainers, and losers for the stats section
  const marketCap = coins.reduce((total, coin) => total + (coin.market_cap || 0), 0);
  const gainers = coins.filter((coin) => (coin.price_change_percentage_24h || 0) > 0).length;
  const losers = coins.filter((coin) => (coin.price_change_percentage_24h || 0) < 0).length;

  //render the app shell with header, main content, and the footer 
  return <div className="app-shell">
    <header className="site-header">
      <a className="brand" href="#top"><span className="brand-mark">C</span><span>Crypto<span className="brand-light">Track</span></span></a>
      <nav className="main-nav"><a className="active" href="#markets">Top 100</a></nav>
      <button className="refresh-button" onClick={() => void loadCoins()} disabled={loading}><span className={loading ? "refresh-icon spinning" : "refresh-icon"}>↻</span>{loading ? "Loading" : "Refresh"}</button>
    </header>

    <main id="top" className="content">
   

      <section className="market-section" id="markets">
        <div className="section-title-row"><div><div className="eyebrow muted-eyebrow">THE LATEST NUMBERS</div><h2>Cryptocurrency prices</h2><p className="section-subtitle">The top 100 coins ranked by market capitalisation.</p></div>
          <div className="update-label"><span className="live-dot" />{lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "Connecting to API"}</div>
        </div>
     
        <div className="table-panel">
        
          <div className="table-toolbar"><div><h3>Top cryptocurrencies</h3><p>Market data supplied by CoinGecko</p></div>
G
          </div>
          {error && <div className="message-box error-message"><strong>Market data unavailable</strong><span>{error}</span><button onClick={() => void loadCoins()}>Try again</button></div>}
          {loading && coins.length === 0 && !error && <div className="loading-state"><span className="loader" /><strong>Loading cryptocurrency prices</strong><span>Connecting to CoinGecko…</span></div>}
          {!loading && !error && filteredCoins.length === 0 && <div className="empty-state">No coins match “{search}”. Try another name or symbol.</div>}
          {filteredCoins.length > 0 && <div className="table-scroll"><table><thead><tr><th className="rank-column">#</th><th className="coin-column">Name</th><th>Price</th><th>24h change</th><th>Market cap</th><th className="volume-column">24h volume</th></tr></thead>
            <tbody>{filteredCoins.map((coin, index) => { const change = coin.price_change_percentage_24h; return <tr key={coin.id}>
              <td className="rank-cell">{coin.market_cap_rank || index + 1}</td><td><div className="coin-name"><img src={coin.image} alt="" loading="lazy" /><div><strong>{coin.name}</strong><span>{coin.symbol.toUpperCase()}</span></div></div></td>
              <td className="price-cell">{money(coin.current_price)}</td><td><span className={`change-pill ${(change || 0) >= 0 ? "up" : "down"}`}>{(change || 0) >= 0 ? "↗" : "↘"} {changeText(change)}</span></td><td>{money(coin.market_cap, true)}</td><td className="volume-column">{money(coin.total_volume, true)}</td>
            </tr>; })}</tbody></table></div>}
          <div className="table-bottom"><span>Showing {filteredCoins.length} of {coins.length || 100} coins</span><span>Prices in USD · Data may be delayed</span></div>
        </div>
      </section>

    </main>
    <footer className="site-footer"><a className="brand footer-brand" href="#top"><span className="brand-mark">C</span><span>Crypto<span className="brand-light">Track</span></span></a><span>Final Year Project</span><span>Prices are for information only, not financial advice.</span></footer>
  </div>;
}
