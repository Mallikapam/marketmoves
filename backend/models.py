from pydantic import BaseModel, PositiveInt, Field
from supabase_auth import Optional


class User(BaseModel):
    user_id: int = Field(primary_key=True)  # primary_key needs to be unique and will increment automatically 
    email: str
    first_name: str
    last_name: str
    password: str
    balance: float = 10000.0        # default value
    school: Optional[str] = None



















# class Market_Order(BaseModel):
#     order_id: Optional[int] = None  # auto increment
#     user_id: int
#     stock: str
#     quantity: PositiveInt 
#     price: int                  # at the time of transaction
#     order_type: str            # buy or sell
# class Watchlist(BaseModel):
#     user_id: int = Field(primary_key=True)
#     watchlist_name: str = Field(primary_key=True)

    
# class Symbol(BaseModel):
#     ticker: str = Field(primary_key=True)      # ex: AAPL
#     name: str           # ex: Apple Inc.
#     exchange: str       # ex: NASDAQ

# class WatchlistSymbol(BaseModel):
#     user_id: int = Field(primary_key=True)
#     watchlist_name: str = Field(primary_key=True)
#     ticker: str    # ex: AAPL 

