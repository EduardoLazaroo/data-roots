import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produto, MunicipioProduzido } from '../models/leaflet-models.model';

@Injectable({ providedIn: 'root' })
export class LeafletService {
  private API_URL = 'http://localhost:8000/leaflet/';

  constructor(private http: HttpClient) {}

  getUFs(tipo: string = 'permanente'): Observable<{ sigla_uf: string; nome: string }[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http.get<{ sigla_uf: string; nome: string }[]>(`${this.API_URL}ufs`, { params });
  }

  getProdutosPorUF(uf: string, ano: number, tipo: string = 'permanente'): Observable<Produto[]> {
    const params = new HttpParams()
      .set('uf', uf)
      .set('ano', ano.toString())
      .set('tipo', tipo);
    return this.http.get<Produto[]>(`${this.API_URL}produtos`, { params });
  }

  getMunicipios(
    uf: string,
    ano: number,
    produto: string,
    limit: number = 10,
    tipo: string = 'permanente'
  ): Observable<MunicipioProduzido[]> {
    let params = new HttpParams()
      .set('uf', uf)
      .set('ano', ano.toString())
      .set('produto', encodeURIComponent(produto))
      .set('limit', limit.toString())
      .set('tipo', tipo);

    return this.http.get<MunicipioProduzido[]>(`${this.API_URL}municipios`, { params });
  }
}
