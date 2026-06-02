import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine

from app.routers.products import router as product_router
from app.routers.customers import router as customer_router
from app.routers.orders import router as order_router
from app.routers.dashboard import router as dashboard_router

# ⚠️ Only for dev (safe)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Inventory Management API")

# -------------------------
# ENV based CORS (IMPORTANT)
# -------------------------
FRONTEND_URL = os.getenv("FRONTEND_URL")

allowed_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://inventory-management-system-cyan-seven.vercel.app",
]

if FRONTEND_URL:
    allowed_origins.append(FRONTEND_URL)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------------
# ROUTES
# -------------------------
app.include_router(product_router)
app.include_router(customer_router)
app.include_router(order_router)
app.include_router(dashboard_router)

# -------------------------
# HEALTH CHECK
# -------------------------
@app.get("/")
def home():
    return {
        "message": "Inventory API Running 🚀"
    }