from google.cloud import bigquery

def load_data_bigquery():
    client = bigquery.Client()
    query = """
    SELECT
        dados.ano as ano,
        dados.sigla_uf AS sigla_uf,
        dados.id_municipio AS id_municipio,
        dados.produto as produto
    FROM `basedosdados.br_ibge_pam.lavoura_permanente` AS dados
    LIMIT 100
    """
    df = client.query(query).to_dataframe()
    return df
