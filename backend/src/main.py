from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.dashboard import router as dashboard_router 

app = FastAPI(title="API PAM IBGE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router) 