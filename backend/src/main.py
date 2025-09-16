from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.dashboard_route import router as dashboard_router
from routes.leaflet_route import router as leaflet_router
from routes.comparing_states_route import router as comparing_states_router

app = FastAPI(title="API PAM IBGE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(leaflet_router)
app.include_router(comparing_states_router)