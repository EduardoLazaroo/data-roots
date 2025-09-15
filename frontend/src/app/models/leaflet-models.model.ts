export interface MunicipioProduzido {
  id_municipio: number;
  municipio: string;
  latitude: number;
  longitude: number;
  quantidade_produzida: number;
  area_destinada_colheita: number;
  area_colhida: number;
  rendimento_medio_producao: number;
  valor_producao: number;
}

export interface ProdutoUF {
  produto: string;
  area_colhida_total: number;
}
