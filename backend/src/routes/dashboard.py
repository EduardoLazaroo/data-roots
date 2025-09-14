from fastapi import APIRouter, Query
from services.dashboard_service import get_top_produtos_ano_uf

router = APIRouter(prefix="/dashboard")

@router.get("/top-produtos-ano-uf")
def top_produtos_ano_uf(
    ano: int = Query(...),
    uf: str = Query(...),
    top_n: int = Query(100)
):
    return get_top_produtos_ano_uf(ano, uf, top_n)
