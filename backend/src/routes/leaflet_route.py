from fastapi import APIRouter, Query
from services.leaflet_service import get_ufs, get_produtos_por_uf_ano, get_municipios_com_quantidade

router = APIRouter(prefix="/leaflet", tags=["Leaflet"])

@router.get("/ufs")
def ufs():
    return get_ufs()


@router.get("/produtos")
def produtos(
    uf: str = Query(..., description="Sigla da UF"),
    ano: int = Query(..., description="Ano de referência")
):
    return get_produtos_por_uf_ano(uf, ano)


@router.get("/municipios")
def municipios(
    uf: str = Query(..., description="Sigla da UF"),
    ano: int = Query(..., description="Ano"),
    produto: str = Query(..., description="Nome do produto"),
    limit: int = Query(10, description="Quantidade máxima de municípios (padrão 10)")
):
    try:
        return get_municipios_com_quantidade(uf, ano, produto, limit)
    except Exception as e:
        # mensagem de erro
        return {"error": str(e)}