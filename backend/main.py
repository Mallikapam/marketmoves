from fastapi import Depends, FastAPI, HTTPException
import auth_routes, routes, trade_routes
import market_routes, user_routes
from models import User
from fastapi.security import HTTPBearer
from db import init_db

from firebase_auth import verify_token

init_db()
app = FastAPI()
security = HTTPBearer()

# router is a mini-FastAPI app that holds its own endpoints
# Without routers, all endpoints go into main.py which is messy
app.include_router(routes.router)
app.include_router(auth_routes.router, prefix="/auth", tags=["Auth"])
app.include_router(trade_routes.router, prefix="/trade", tags=["Trade"])
app.include_router(market_routes.router, prefix="/market",  tags=["Market"])
app.include_router(user_routes.router, prefix="/user", tags=["User"])