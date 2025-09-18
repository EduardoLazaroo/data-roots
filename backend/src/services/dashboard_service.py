from google.cloud import bigquery

client = bigquery.Client()

# Bases permitidas
ALLOWED_BASES = {
    "permanente": "basedosdados.br_ibge_pam.lavoura_permanente",
    "temporaria": "basedosdados.br_ibge_pam.lavoura_temporaria"
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


def get_municipios_por_uf(uf: str, tipo: str = "permanente"):
    base = _get_base(tipo)
    query = f"""
        SELECT DISTINCT m.id_municipio, m.nome AS municipio
        FROM `{base}` AS p
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
    min_area: float = 1.0,
    tipo: str = "permanente"
):
    base = _get_base(tipo)
    query = f"""
        SELECT 
            produto, 
            area_colhida,
            rendimento_medio_producao, 
            valor_producao, 
            quantidade_produzida
        FROM `{base}`
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
