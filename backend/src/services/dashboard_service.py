from google.cloud import bigquery

from google.cloud import bigquery

def get_top_produtos_ano_uf(ano: int, uf: str, top_n: int = 100):
    """
    Retorna os produtos mais frequentes em um determinado ano e UF,
    considerando apenas os top_n registros da tabela.
    """
    client = bigquery.Client()

    query = """
        WITH top_items AS (
            SELECT produto
            FROM `basedosdados.br_ibge_pam.lavoura_permanente`
            WHERE ano = @ano
              AND sigla_uf = @uf
            LIMIT @top_n
        )
        SELECT produto,
               COUNT(*) AS ocorrencias
        FROM top_items
        GROUP BY produto
        ORDER BY ocorrencias DESC
    """

    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("ano", "INT64", ano),
            bigquery.ScalarQueryParameter("uf", "STRING", uf),
            bigquery.ScalarQueryParameter("top_n", "INT64", top_n),
        ]
    )

    df = client.query(query, job_config=job_config).to_dataframe()
    return df.to_dict(orient="records")
