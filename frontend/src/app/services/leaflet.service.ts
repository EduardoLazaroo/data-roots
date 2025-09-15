import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProdutoUF, MunicipioProduzido } from '../models/leaflet-models.model';

@Injectable({ providedIn: 'root' })
export class LeafletService {
  private API_URL = 'http://localhost:8000/leaflet/';

  constructor(private http: HttpClient) {}

  getUFs(): Observable<{ sigla_uf: string; nome: string }[]> {
    return this.http.get<{ sigla_uf: string; nome: string }[]>(
      `${this.API_URL}ufs`
    );
  }

  getProdutosPorUF(uf: string, ano: number): Observable<ProdutoUF[]> {
    const params = new HttpParams().set('uf', uf).set('ano', ano.toString());
    return this.http.get<ProdutoUF[]>(`${this.API_URL}produtos`, { params });
  }

  getMunicipios(uf: string, ano: number, produto: string, limit: number = 10): Observable<MunicipioProduzido[]> {
    let params = new HttpParams()
      .set('uf', uf)
      .set('ano', ano.toString())
      .set('produto', encodeURIComponent(produto)) // força encode seguro
      .set('limit', limit.toString());

    return this.http.get<MunicipioProduzido[]>(`${this.API_URL}municipios`, { params });
  }
}
