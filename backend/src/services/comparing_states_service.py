from google.cloud import bigquery

client = bigquery.Client()

ALLOWED_BASES = {
    "permanente": "basedosdados.br_ibge_pam.lavoura_permanente",
    "temporaria": "basedosdados.br_ibge_pam.lavoura_temporaria",
}

def _get_base(tipo: str) -> str:
    if tipo not in ALLOWED_BASES:
        raise ValueError(f"Tipo de base inválido: {tipo}")
    return ALLOWED_BASES[tipo]


def get_products_and_ufs_by_year(ano: int, tipo: str = "permanente"):
    base = _get_base(tipo)

    query = f"""
        SELECT DISTINCT produto, sigla_uf
        FROM `{base}`
        WHERE ano = @ano
          AND quantidade_produzida > 0
        ORDER BY produto, sigla_uf
    """

    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("ano", "INT64", ano)
        ]
    )

    df = client.query(query, job_config=job_config).to_dataframe()

    produtos_ufs = {}
    for _, row in df.iterrows():
        produto = row["produto"]
        uf = row["sigla_uf"]
        if produto not in produtos_ufs:
            produtos_ufs[produto] = []
        produtos_ufs[produto].append(uf)

    result = [{"produto": p, "ufs": ufs} for p, ufs in produtos_ufs.items()]
    return result


def compare_states_by_product_and_year(produto: str, ano: int, ufs: list[str] = None, tipo: str = "permanente"):
    base = _get_base(tipo)

    query = f"""
        SELECT
            sigla_uf,
            ano,
            SUM(quantidade_produzida) AS total_producao,
            SUM(area_colhida) AS area_colhida,
            AVG(rendimento_medio_producao) AS rendimento_medio_producao,
            SUM(valor_producao) AS valor_producao
        FROM `{base}`
        WHERE produto = @produto
          AND ano = @ano
    """

    params = [
        bigquery.ScalarQueryParameter("produto", "STRING", produto),
        bigquery.ScalarQueryParameter("ano", "INT64", ano),
    ]

    if ufs and len(ufs) > 0:
        uf_params = []
        placeholders = []
        for i, uf in enumerate(ufs):
            param_name = f"uf{i}"
            uf_params.append(bigquery.ScalarQueryParameter(param_name, "STRING", uf))
            placeholders.append(f"@{param_name}")
        query += f" AND sigla_uf IN ({','.join(placeholders)})"
        params.extend(uf_params)

    query += """
        GROUP BY sigla_uf, ano
        ORDER BY total_producao DESC
    """

    job_config = bigquery.QueryJobConfig(query_parameters=params)
    df = client.query(query, job_config=job_config).to_dataframe()
    return df.to_dict(orient="records")
