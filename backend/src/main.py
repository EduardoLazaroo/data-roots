from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.dados import router as dados_router

app = FastAPI(title="API PAM IBGE")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Rotas
app.include_router(dados_router)
