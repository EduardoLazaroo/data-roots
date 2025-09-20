from fastapi import APIRouter
from pydantic import BaseModel
from services.chat_service import gerar_relatorio

router = APIRouter()

class AnalisarRequest(BaseModel):
    name: str
    content: dict

@router.post("/analisar")
async def analisar_dados(req: AnalisarRequest):
    try:
        resumo = gerar_relatorio({
            "componente": req.name,
            "dados": req.content
        })
        return {"relatorio": resumo}
    except Exception as e:
        return {"error": str(e)}
