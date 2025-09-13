# backend/src/routes/dados.py
from fastapi import APIRouter, Query
from typing import Optional
from services.data_loader import load_data_bigquery
import pandas as pd

router = APIRouter(prefix="/dados", tags=["Dados PAM"])

@router.get("/")
def get_dados(
    ano: Optional[int] = Query(None, description="Ano da produção"),
    sigla_uf: Optional[str] = Query(None, description="Sigla da UF"),
    produto: Optional[str] = Query(None, description="Nome do produto")
):
    """
    Retorna os dados do PAM, filtrados por ano, UF e produto.
    Se nenhum filtro for passado, retorna os 100 primeiros registros.
    """
    df = load_data_bigquery()

    if ano is not None:
        df = df[df["ano"] == ano]
    if sigla_uf is not None:
        df = df[df["sigla_uf"].str.upper() == sigla_uf.upper()]
    if produto is not None:
        df = df[df["produto"].str.lower() == produto.lower()]

    # limit 100
    if ano is None and sigla_uf is None and produto is None:
        df = df.head(100)

    # convert JSON
    return df.to_dict(orient="records")
