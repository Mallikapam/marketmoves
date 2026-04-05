from collections import defaultdict
from fastapi import APIRouter, HTTPException, Query
import httpx
import json 
from dotenv import load_dotenv 
import os 
import time 
import asyncio
import requests 
# market_routes.py → stock websocket outputs 
router = APIRouter() 
load_dotenv() 
#Powershell command - curl http://127.0.0.1:8000/market/ping 
@router.get("/ping")
async def ping():
    # simple healthcheck
    return  {"ok": True}
@router.get("/ticker/{symbol}")
async def ticker(symbol: str):
    # 1. Uppercase the symbol
    # 2. Call Alpaca: GET /v2/stocks/{symbol}/snapshot
    # 3. Return JSON: symbol, price, changePct, open, high, low, prevClose, volume, asOf    
    start_time = time.perf_counter()
    client = httpx.AsyncClient()
    url = f"https://data.alpaca.markets/v2/stocks/{symbol.upper()}/snapshot"
     #creating an http session to get the data from the api 
    response = await client.get(url, headers=get_headers())
    if response.status_code == 200: 
        content = response.json()
        ticker_json = {
                "symbol": content["symbol"],
                "price": content["latestTrade"]["p"], 
                "changePct": ((content["latestTrade"]["p"] - content["prevDailyBar"]["c"])/ content["prevDailyBar"]["c"])*100, 
                "open": content["dailyBar"]["o"], 
                "high": content["dailyBar"]["h"], 
                "low": content["dailyBar"]["l"],
                "prevClose": content["prevDailyBar"]["c"],
                "volume": content["dailyBar"]["v"], 
                "asOf": content["latestTrade"]["t"]    
            }
        return ticker_json 
    elif response.status_code == 404: 
        return "The stock you are looking for does not exist."
    elif response.status_code == 400:
        return "Sorry, something went wrong. Please try again."




@router.get("/quotes")
async def quotes(symbols: str):
    """
    OUR API — batch quotes endpoint so the frontend can fetch a list of multiple tickers at once(like top 50, s&p 500, etc)!
    Query:  /market/quotes?symbols=AAPL,NVDA,MSFT
    Steps:
      1) Parse CSV → ["AAPL","NVDA","MSFT"] (uppercase, de-dup, cap to 50)
      2) For each symbol, call Alpaca: GET /v2/stocks/{symbol}/snapshot
      3) Compute changePct from price vs prevClose
      4) Return a list of { symbol, price, changePct, open, high, low, prevClose, volume, asOf }
    """
    start = time.time() 
    tickers = symbols.split(",") 
    async with httpx.AsyncClient() as client: 
        tasks = [] 
        for t in tickers: 
            tasks.append(asyncio.create_task(helper_ticker(t, client))) 
        tickers_data = await asyncio.gather(*tasks) 
    end = time.time() 
    return tickers_data

async def helper_ticker(symbol, client):
    # 1. Uppercase the symbol
    # 2. Call Alpaca: GET /v2/stocks/{symbol}/snapshot
    # 3. Return JSON: symbol, price, changePct, open, high, low, prevClose, volume, asOf    
    url = f"https://data.alpaca.markets/v2/stocks/{symbol.upper()}/snapshot"
     #creating an http session to get the data from the api 
    response = await client.get(url, headers=get_headers())
    if response.status_code == 200: 
        content = response.json()
        ticker_json = {
                "symbol": content["symbol"],
                "price": content["latestTrade"]["p"], 
                "changePct": ((content["latestTrade"]["p"] - content["prevDailyBar"]["c"])/ content["prevDailyBar"]["c"])*100, 
                "open": content["dailyBar"]["o"], 
                "high": content["dailyBar"]["h"], 
                "low": content["dailyBar"]["l"],
                "prevClose": content["prevDailyBar"]["c"],
                "volume": content["dailyBar"]["v"], 
                "asOf": content["latestTrade"]["t"]    
            }
        return ticker_json 
    elif response.status_code == 404: 
        return "The stock you are looking for does not exist."
    elif response.status_code == 400:
        return "Sorry, something went wrong. Please try again."
    

def get_headers():
    return {"accept": "application/json", "APCA-API-KEY-ID": os.getenv("APCA_API_KEY_ID"), "APCA-API-SECRET-KEY": os.getenv("APCA_API_SECRET_KEY"), "feed": "iex"}

@router.get("/most-active-stocks")
async def most_active_stocks(n: int = Query(10, ge=1, le=100)):
    """
    Top-N most active symbols (Alpaca screener), enriched with snapshot price / % change.
    Returns [{ "symbol", "name", "price", "change" }, ...].
    """
    url = f"https://data.alpaca.markets/v1beta1/screener/stocks/most-actives?by=volume&top={n}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url, headers=get_headers())
        if response.status_code != 200:
            try:
                body = response.json()
                msg = body.get("message", str(body))
            except Exception:
                msg = response.text or getattr(response, "reason_phrase", "") or "Request failed"
            raise HTTPException(status_code=response.status_code, detail=msg)

        payload = response.json()
        symbols = [item["symbol"] for item in payload.get("most_actives", [])]
        if not symbols:
            return []

        snapshots = await asyncio.gather(*[helper_ticker(sym, client) for sym in symbols])
        rows = []
        for sym, snap in zip(symbols, snapshots):
            if isinstance(snap, str):
                continue
            cp = snap["changePct"]
            rows.append(
                {
                    "symbol": sym,
                    "name": sym,
                    "price": snap["price"],
                    "change": f"{'+' if cp >= 0 else ''}{cp:.2f}%",
                }
            )
        return rows