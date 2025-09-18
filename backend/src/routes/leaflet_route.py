from fastapi import APIRouter, Query
from typing import Optional
from services.leaflet_service import get_ufs, get_produtos_por_uf_ano, get_municipios_com_quantidade

router = APIRouter(prefix="/leaflet", tags=["Leaflet"])

@router.get("/ufs")
def ufs(tipo: str = Query("permanente", description="Tipo da base (permanente ou temporaria)")):
    return get_ufs(tipo=tipo)


@router.get("/produtos")
def produtos(
    uf: str = Query(..., description="Sigla da UF"),
    ano: int = Query(..., description="Ano de referência"),
    tipo: str = Query("permanente", description="Tipo da base (permanente ou temporaria)")
):
    return get_produtos_por_uf_ano(uf, ano, tipo=tipo)


@router.get("/municipios")
def municipios(
    uf: str = Query(..., description="Sigla da UF"),
    ano: int = Query(..., description="Ano"),
    produto: str = Query(..., description="Nome do produto"),
    limit: int = Query(10, description="Quantidade máxima de municípios (padrão 10)"),
    tipo: str = Query("permanente", description="Tipo da base (permanente ou temporaria)")
):
    try:
        return get_municipios_com_quantidade(uf, ano, produto, limit, tipo=tipo)
    except Exception as e:
        return {"error": str(e)}
