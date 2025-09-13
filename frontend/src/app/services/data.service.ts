import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Dado {
  ano: number;
  sigla_uf: string;
  id_municipio: string;
  produto: string;
  [key: string]: any; // caso venham outras colunas
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private API_URL = 'http://localhost:8000/dados/';

  constructor(private http: HttpClient) {}

  getDados(filtros?: { ano?: number; sigla_uf?: string; produto?: string }): Observable<Dado[]> {
    let params = new HttpParams();

    if (filtros) {
      if (filtros.ano) params = params.set('ano', filtros.ano.toString());
      if (filtros.sigla_uf) params = params.set('sigla_uf', filtros.sigla_uf);
      if (filtros.produto) params = params.set('produto', filtros.produto);
    }

    return this.http.get<Dado[]>(this.API_URL, { params });
  }
}
