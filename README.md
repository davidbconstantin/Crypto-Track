# CryptoTrack

CryptoTrack is a cryptocurrency market dashboard built with React, TypeScript and Vite. Its main page fetches the top 100 cryptocurrencies from CoinGecko.

## Features
- Top 100 coins ranked by market capitalisation
- Refresh button and loading/error messages
- Responsive  layout

## Run the frontend
Install Node.js, open a terminal in the `frontend` folder and run:

```bash
npm install
npm run dev
```
If running into 'disabled scripts on system' run this
```bash
npm.cmd install
npm.cmd run dev
```

Open the URL printed by Vite, normally or open it from the terminal by clicking it ;`http://localhost:5173`.

## API
The page uses CoinGecko's public `/api/v3/coins/markets` endpoint with `per_page=100` and `page=1`. No API key is hardcoded. Public API requests can be rate limited, so if the request fails, wait a little and press **Refresh**.

A private API key will be added in the next batch to upgrade the API Fetch rates.

This is a learning project, not a financial service. Cryptocurrency prices are for information only and are not financial advice.
