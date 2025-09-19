from google.cloud import bigquery
from urllib.parse import unquote

client = bigquery.Client()

ALLOWED_BASES = {
    "permanente": "basedosdados.br_ibge_pam.lavoura_permanente",
    "temporaria": "basedosdados.br_ibge_pam.lavoura_temporaria",
}

def _get_base(tipo: str) -> str:
    if tipo not in ALLOWED_BASES:
        raise ValueError(f"Tipo de base inválido: {tipo}")
    return ALLOWED_BASES[tipo]


def get_ufs(tipo: str = "permanente"):
    base = _get_base(tipo)
    query = f"""
        SELECT DISTINCT sigla_uf, sigla_uf AS nome
        FROM `{base}`
        ORDER BY sigla_uf
    """
    df = client.query(query).to_dataframe()
    return df.to_dict(orient="records")


def get_produtos_por_uf_ano(uf: str, ano: int, tipo: str = "permanente"):
    base = _get_base(tipo)
    query = f"""
        SELECT produto, 
            SUM(quantidade_produzida) AS quantidade_total
        FROM `{base}`
        WHERE sigla_uf = @uf
          AND ano = @ano
        GROUP BY produto
        HAVING SUM(quantidade_produzida) >= 1.0
        ORDER BY quantidade_total DESC
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("uf", "STRING", uf),
            bigquery.ScalarQueryParameter("ano", "INT64", ano)
        ]
    )
    df = client.query(query, job_config=job_config).to_dataframe()
    return df.to_dict(orient="records")


def get_municipios_com_quantidade(
    uf: str, ano: int, produto: str, limit: int = 10, tipo: str = "permanente"
):
    produto = unquote(produto)
    limit = max(1, min(limit, 100))  # limite seguro
    base = _get_base(tipo)

    query = f"""
        SELECT
            m.id_municipio,
            m.nome AS municipio,
            ST_Y(ANY_VALUE(m.centroide)) AS latitude,
            ST_X(ANY_VALUE(m.centroide)) AS longitude,
            SUM(p.quantidade_produzida) AS quantidade_total,
            SUM(p.area_colhida) AS area_colhida,
            AVG(p.rendimento_medio_producao) AS rendimento_medio_producao,
            SUM(p.valor_producao) AS valor_producao
        FROM `{base}` AS p
        LEFT JOIN `basedosdados.br_bd_diretorios_brasil.municipio` AS m
          ON p.id_municipio = m.id_municipio
        WHERE p.sigla_uf = @uf
          AND p.ano = @ano
          AND p.produto = @produto
        GROUP BY m.id_municipio, m.nome
        ORDER BY quantidade_total DESC
        LIMIT @limit
    """

    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("uf", "STRING", uf),
            bigquery.ScalarQueryParameter("ano", "INT64", ano),
            bigquery.ScalarQueryParameter("produto", "STRING", produto),
            bigquery.ScalarQueryParameter("limit", "INT64", limit),
        ]
    )

    df = client.query(query, job_config=job_config).to_dataframe()

    if df.empty:
        return []

    df = df.fillna(0)
    df["id_municipio"] = df["id_municipio"].astype(int)
    return df.to_dict(orient="records")
