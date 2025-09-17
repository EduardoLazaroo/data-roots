from google.cloud import bigquery

client = bigquery.Client()

def get_ufs():
    query = """
        SELECT DISTINCT sigla_uf, sigla_uf AS nome
        FROM `basedosdados.br_ibge_pam.lavoura_permanente`
        ORDER BY sigla_uf
    """
    df = client.query(query).to_dataframe()
    return df.to_dict(orient="records")


def get_municipios_por_uf(uf: str):
    query = """
        SELECT DISTINCT m.id_municipio, m.nome AS municipio
        FROM `basedosdados.br_ibge_pam.lavoura_permanente` AS p
        LEFT JOIN `basedosdados.br_bd_diretorios_brasil.municipio` AS m
          ON p.id_municipio = m.id_municipio
        WHERE p.sigla_uf = @uf
        ORDER BY m.nome
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[bigquery.ScalarQueryParameter("uf", "STRING", uf)]
    )
    df = client.query(query, job_config=job_config).to_dataframe()
    df["id_municipio"] = df["id_municipio"].astype(int)
    return df.to_dict(orient="records")


def get_produtos_por_municipio_ano(
    uf: str,
    id_municipio: int,
    ano: int,
    min_area: float = 1.0
):
    query = """
        SELECT 
            produto, 
            area_colhida, 
            area_destinada_colheita, 
            rendimento_medio_producao, 
            valor_producao, quantidade_produzida
            quantidade_produzida
        FROM `basedosdados.br_ibge_pam.lavoura_permanente`
        WHERE sigla_uf = @uf
          AND CAST(id_municipio AS INT64) = @id_municipio
          AND ano = @ano
          AND area_colhida >= @min_area
        ORDER BY produto
    """
    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("uf", "STRING", uf),
            bigquery.ScalarQueryParameter("id_municipio", "INT64", id_municipio),
            bigquery.ScalarQueryParameter("ano", "INT64", ano),
            bigquery.ScalarQueryParameter("min_area", "FLOAT64", min_area)
        ]
    )
    df = client.query(query, job_config=job_config).to_dataframe()
    return df.to_dict(orient="records")
