from fastapi import APIRouter, Query
from services.comparing_states_service import (
    compare_states_by_product_and_year, get_products_and_ufs_by_year
)

router = APIRouter(
    prefix="/comparing-states",
    tags=["Comparing States"]
)

@router.get("/products")
def products(ano: int = Query(..., description="Ano da produção")):
    return get_products_and_ufs_by_year(ano=ano)


@router.get("/compare")
def compare(
    uf1: str = Query(..., description="Sigla da primeira UF"),
    uf2: str = Query(..., description="Sigla da segunda UF"),
    produto: str = Query(..., description="Nome do produto"),
    ano: int = Query(..., description="Ano da produção")
):
    return compare_states_by_product_and_year(uf1=uf1, uf2=uf2, produto=produto, ano=ano)