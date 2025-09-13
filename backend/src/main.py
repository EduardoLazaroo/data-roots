from fastapi import FastAPI
from routes.dados import router as dados_router

app = FastAPI(title="API PAM IBGE")

app.include_router(dados_router)

@app.get("/")
def root():
    return {"message": "API PAM IBGE rodando!"}
