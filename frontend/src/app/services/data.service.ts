import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface TopProduto {
  produto: string;
  ocorrencias: number;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private API_URL = 'http://localhost:8000/dashboard/';

  constructor(private http: HttpClient) {}

  getTopProdutosAnoUf(ano: number, uf: string, top_n: number = 100): Observable<TopProduto[]> {
    let params = new HttpParams()
      .set('ano', ano)
      .set('uf', uf)
      .set('top_n', top_n);

    return this.http.get<TopProduto[]>(`${this.API_URL}top-produtos-ano-uf`, { params });
  }
}
