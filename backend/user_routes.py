from fastapi import APIRouter,FastAPI, Depends, HTTPException, Header
from models import User
from db import supabase
from typing import Optional
from market_routes import ticker, quotes

router = APIRouter()

@router.get("/ping")
async def ping():
    return {"message": "user"}


@router.get("/allUsers")
def get_all_users():
    try: 
        response = supabase.table("User").select("*").execute()
        users = User(**response.data)
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    return users  


@router.get("/{id}")
def get_user(id: int):    
    try: 
        response = supabase.table("User").select("*").eq("id", id).execute()
        user = response.data
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    if not user:
        raise HTTPException(status_code=404, detail='User cannot be found\n')
        
    return user[0]

#calculate portfolio metrics 
@router.get("/{id}/{symbol}")
async def calculate_stock_metrics(id: int, symbol: str):
    #get all holdings 
    # we get info - quantity and average price 
    mock_data = {
        "GOOG":{"quantity": 2, "avg_price": 193},
        "NVDA": {"quantity": 0.95, "avg_price": 724.9},
        "META": {"quantity": 0.524, "avg_price": 770.0}}
    curr_data =  await ticker("GOOG")
    avg_price = mock_data[symbol]["avg_price"]
    quantity = mock_data[symbol]["quantity"]
    curr_price = curr_data["price"]
    market_val = curr_data["price"] * quantity 
    cost_basis = avg_price * quantity 
    unrealized_pl = (curr_data["price"] - avg_price) * quantity 
    todays_return_pct = ((curr_data["price"]-curr_data["prevClose"])/curr_data["prevClose"]) * 100 
    todays_return_val = (curr_data["price"]- curr_data["prevClose"]) * quantity 
    portfolio_symbols = ",".join(mock_data.keys())
    portfolio_data = await quotes(portfolio_symbols)
    portfolio_market_value = 0
    for symbol, stock in portfolio_data.items(): 
        stock_quantity = mock_data[symbol]["quantity"]
        stock_curr_val = portfolio_data[symbol]["price"]
        portfolio_market_value += (stock_quantity * stock_curr_val)
    portfolio_weight = (market_val / portfolio_market_value) * 100 
    stock_metrics = {
        "avg_price": avg_price, 
        "quantity": quantity, 
        "cost_basis": cost_basis, 
        "curr_price": curr_price,
        "market_value": market_val, 
        "unrealized_pl": unrealized_pl, 
        "portfolio_weight": portfolio_weight,
        "todays_return_val": todays_return_val,
        "todays_return_pct": todays_return_pct
    }
    return stock_metrics 


@router.delete("deleteUser/{id}")
def delete_user(id: int):
    try:
        response = supabase.table("User").delete().eq("id", id)
    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
        
@router.get("watchlist/")
def get_watchlist(x_demo_user: Optional[str] = Header(None)):
    try: 
        response = supabase.table("user_watchlist").select("symbol").eq("user_id", x_demo_user).execute()
        if response.data is not None: 
            symbols = [d["symbol"] for d in response.data]
        else: 
            raise HTTPException(status_code=400, detail=f"Table not found: {e}\n")
            
        if not x_demo_user:
            raise HTTPException(status_code=404, detail='User cannot be found\n')

    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    
    return {"user_id": x_demo_user, "symbols": symbols}

@router.post("/watchlist/add")
def add_symbol(payload: dict, x_demo_user: Optional[str] = Header(None)):
    try: 
        symbol = payload.get("symbol").upper()
        
        supabase.table("user_watchlist").upsert({"user_id": x_demo_user, "symbol": symbol}, on_conflict="user_id,symbol", ignore_duplicates=True).execute()
        response = supabase.table("user_watchlist").select("symbol").eq("user_id", x_demo_user).execute()
        symbols = [d["symbol"] for d in response.data]
        
        if response.data is not None: 
            symbols = [d["symbol"] for d in response.data]
        else: 
            raise HTTPException(status_code=400, detail=f"Table not found: {e}\n")
            
        if not x_demo_user:
            raise HTTPException(status_code=404, detail='User cannot be found\n')

    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")

    return {"user_id": x_demo_user, "symbols": symbols}

@router.post("/watchlist/remove")
def remove_symbol(payload: dict, x_demo_user: Optional[str] = Header(None)):
    try: 
        symbol = payload.get("symbol").upper()
        supabase.table("user_watchlist").delete().eq("user_id", x_demo_user).eq("symbol", symbol).execute()
        response = supabase.table("user_watchlist").select("symbol").eq("user_id", x_demo_user).execute()
        symbols = [d["symbol"] for d in response.data]

        if response.data is not None: 
            symbols = [d["symbol"] for d in response.data]
        else: 
            raise HTTPException(status_code=400, detail=f"Table not found: {e}\n")
            
        if not x_demo_user:
            raise HTTPException(status_code=404, detail='User cannot be found\n')

    except Exception as e: 
        raise HTTPException(status_code=500, detail=f"Database session connection issue: {e}\n")
    
    return {"user_id": x_demo_user, "symbols": symbols}
