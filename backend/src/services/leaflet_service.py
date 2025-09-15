from google.cloud import bigquery
from urllib.parse import unquote

client = bigquery.Client()

def get_ufs():
    query = """
        SELECT DISTINCT sigla_uf, sigla_uf AS nome
        FROM `basedosdados.br_ibge_pam.lavoura_permanente`
        ORDER BY sigla_uf
    """
    df = client.query(query).to_dataframe()
    return df.to_dict(orient="records")

def get_produtos_por_uf_ano(uf: str, ano: int):
    query = """
        SELECT produto, SUM(area_colhida) AS area_colhida_total
        FROM `basedosdados.br_ibge_pam.lavoura_permanente`
        WHERE sigla_uf = @uf
          AND ano = @ano
        GROUP BY produto
        HAVING SUM(area_colhida) >= 1.0
        ORDER BY area_colhida_total DESC
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("uf", "STRING", uf),
            bigquery.ScalarQueryParameter("ano", "INT64", ano)
        ]
    )
    df = client.query(query, job_config=job_config).to_dataframe()
    return df.to_dict(orient="records")

def get_municipios_com_quantidade(uf: str, ano: int, produto: str, limit: int = 10):
    produto = unquote(produto)
    limit = max(1, min(limit, 100))  # limite seguro

    query = """
        SELECT
            m.id_municipio,
            m.nome AS municipio,
            ST_Y(ANY_VALUE(m.centroide)) AS latitude,
            ST_X(ANY_VALUE(m.centroide)) AS longitude,
            SUM(p.quantidade_produzida) AS quantidade_produzida,
            SUM(p.area_destinada_colheita) AS area_destinada_colheita,
            SUM(p.area_colhida) AS area_colhida,
            AVG(p.rendimento_medio_producao) AS rendimento_medio_producao,
            SUM(p.valor_producao) AS valor_producao
        FROM `basedosdados.br_ibge_pam.lavoura_permanente` AS p
        LEFT JOIN `basedosdados.br_bd_diretorios_brasil.municipio` AS m
          ON p.id_municipio = m.id_municipio
        WHERE p.sigla_uf = @uf
          AND p.ano = @ano
          AND p.produto = @produto
        GROUP BY m.id_municipio, m.nome
        ORDER BY quantidade_produzida DESC
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
    df["id_municipio"] = df["id_municipio"].astype(int)
    return df.to_dict(orient="records")
