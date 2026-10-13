# Apresentação Profissional — Data-Roots (Raízes)

## Identidade e Proposta de Valor

O **Data-Roots (Raízes)** é uma plataforma analítica geoespacial que une engenharia de dados, cartografia interativa e inteligência artificial para democratizar o acesso aos dados da produção agropecuária brasileira. Integrando um frontend em **Angular 16**, mapas interativos com **Leaflet**, gráficos avançados com **Apache ECharts**, um backend assíncrono em **FastAPI** e consultas em larga escala no **Google Cloud BigQuery**, a solução traduz milhões de registros do IBGE em decisões territoriais visíveis e claras.

Diferenciais da solução:
- **Inteligência Cartográfica**: Geolocalização de municípios através de coordenadas geográficas centróides (`ST_X` e `ST_Y`), permitindo visualização de densidade produtiva diretamente no mapa.
- **Análise Multidimensional**: Comparação instantânea entre safras de lavouras permanentes e temporárias, rendimento médio por hectare (kg/ha) e valor financeiro de produção.
- **Síntese Acelerada por IA**: Módulo integrado à API da OpenAI para geração automática de relatórios executivos sobre o panorama agrícola de cada microrregião.

---

## Texto Estruturado para Publicação / Portfólio

> A plataforma **Data-Roots (Raízes)** foi construída para solucionar o desafio de transformar microdados complexos da Pesquisa Agrícola Municipal (PAM/IBGE) em inteligência territorial acionável. Utilizando **FastAPI**, **Angular 16**, **Leaflet** e **Google Cloud BigQuery**, o sistema realiza agregações analíticas em tempo real sobre tabelas massivas do repositório *Base dos Dados*. O usuário pode selecionar qualquer estado, cultura e ano para visualizar rankings municipais, áreas colhidas e rendimentos médios projetados em mapas interativos, complementados por sínteses analíticas automáticas geradas por LLMs. O projeto comprova proficiência em arquitetura orientada a dados, computação geoespacial e integração de modelos generativos a sistemas de BI.

---

## Resultados da Validação Real

- **Resolução de Dependências**: Ambiente FastAPI configurado com sucesso com bibliotecas analíticas (`google-cloud-bigquery`, `pyarrow`, `pandas`, `openai`).
- **Validação de Contratos de API**: 9 endpoints testados via TestClient sob padrão RESTful, retornando status `HTTP 200 OK` e dados estruturados para renderização geoespacial.
- **Transparência de Infraestrutura**: Formalização dos requisitos de credenciais GCP/OpenAI, assegurando integridade técnica e reprodutibilidade do projeto.

---

## Evidências Visuais e Técnicas

1. **Diagrama Arquitetural Geoespacial**: [`evidencias/arquitetura_pipeline_geoespacial.png`](evidencias/arquitetura_pipeline_geoespacial.png)
2. **Painel de Produção Agrícola PAM/IBGE**: [`evidencias/painel_producao_agricola_ibge.png`](evidencias/painel_producao_agricola_ibge.png)
3. **Registro de Testes Funcionais da API**: [`evidencias/log_execucao_real.txt`](evidencias/log_execucao_real.txt)
