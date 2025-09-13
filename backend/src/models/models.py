from pydantic import BaseModel

class DadosAgricolas(BaseModel):
    ano: int
    estado: str
    municipio: str
    cultura: str
    producao: float
    area_plantada: float
