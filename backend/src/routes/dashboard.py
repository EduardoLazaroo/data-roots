from fastapi import APIRouter, Query
from services.dashboard_service import (
    get_ufs,
    get_municipios_por_uf,
    get_produtos_por_municipio_ano
)

router = APIRouter(prefix="/dashboard")

@router.get("/ufs")
def ufs():
    try:
        data = get_ufs()
        return {"status": "success", "results": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/municipios")
def municipios(uf: str = Query(..., description="Sigla da UF")):
    try:
        data = get_municipios_por_uf(uf)
        return {"status": "success", "results": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}


@router.get("/produtos")
def produtos(
    uf: str = Query(..., description="Sigla da UF"),
    id_municipio: int = Query(..., description="ID do município"),
    ano: int = Query(..., description="Ano de referência"),
    min_area: float = Query(1.0, description="Área mínima colhida (ha)")
):
    try:
        data = get_produtos_por_municipio_ano(uf, id_municipio, ano, min_area)
        return {"status": "success", "results": data}
    except Exception as e:
        return {"status": "error", "message": str(e)}
