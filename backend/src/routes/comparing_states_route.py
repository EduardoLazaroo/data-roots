from fastapi import APIRouter, Query
from typing import List, Optional
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
    produto: str = Query(..., description="Nome do produto"),
    ano: int = Query(..., description="Ano da produção"),
    ufs: Optional[List[str]] = Query(None, description="Lista de UFs para comparar")
):
    return compare_states_by_product_and_year(produto=produto, ano=ano, ufs=ufs)
