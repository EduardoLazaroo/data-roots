export interface UF {
  sigla_uf: string;
  nome: string;
}
export interface Municipio {
  id_municipio: number;
  municipio: string;
}
export interface Produto {
  area_colhida: number;
  produto: string;
  quantidade_produzida: number;
  rendimento_medio_producao: number;
  valor_producao: number;
}

export interface ComparacaoProduto {
  sigla_uf: string;
  total_producao: number;
  area_colhida: number;
  rendimento_medio_producao: number;
  valor_producao: number;
}
