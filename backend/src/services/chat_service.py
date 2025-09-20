# services/chat_service.py
from openai import OpenAI
import os

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def gerar_relatorio(content: dict) -> str:
    """
    Gera um relatório resumido em HTML, destacando pontos fortes e observações interessantes.
    Ideal para exibir diretamente no frontend.
    """
    prompt = f"""
Você é um analista agrícola. Gere um **relatório resumido** em **HTML**, mas **somente o conteúdo** (sem <html>, <head> ou <body>).
- Destaque apenas os **pontos fortes** e **observações mais interessantes**.
- Inclua informações como maior produção, rendimento médio e valor de produção.
- Foque nos destaques, evite listar todos os estados.
- Não leve em consideração o valor_producao na ánalise
- Estruture usando:
  - <h3> para título do componente
  - <ul> e <li> para bullets
  - <strong> para dados importantes
- Evite parágrafos longos e textos repetitivos.

Dados do componente:
{content}
"""

    try:
        resposta = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=600
        )

        escolha = resposta.choices[0].message
        if isinstance(escolha, dict):
            return escolha.get("content", "").strip()
        else:
            return escolha.content.strip()

    except Exception as e:
        return f"Erro ao gerar relatório: {e}"
