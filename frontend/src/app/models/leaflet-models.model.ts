export interface MunicipioProduzido {
  id_municipio: number;
  municipio: string;
  latitude: number;
  longitude: number;
  quantidade_total: number; // <- espera esse nome
  area_colhida: number;
  rendimento_medio_producao: number;
  valor_producao: number;
}


export interface UF {
  sigla_uf: string;
  nome: string;
}

export interface Produto {
  produto: string;
  quantidade_total: number;
}
