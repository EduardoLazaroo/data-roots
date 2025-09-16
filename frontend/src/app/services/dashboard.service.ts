import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UF, Municipio, Produto } from '../models/dashboard-models.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private API_URL_DASHBOARD = 'http://localhost:8000/dashboard/';
  private API_URL_COMPARING = 'http://localhost:8000/comparing-states/';

  constructor(private http: HttpClient) {}

  getUFs(): Observable<UF[]> {
    return this.http
      .get<any>(this.API_URL_DASHBOARD + 'ufs')
      .pipe(map((res) => res.results ?? []));
  }

  getMunicipios(uf: string): Observable<Municipio[]> {
    const params = new HttpParams().set('uf', uf);
    return this.http.get<any>(this.API_URL_DASHBOARD + 'municipios', { params }).pipe(
      map((res) =>
        (res.results ?? []).map((m: any) => ({
          id_municipio: Number(m.id_municipio),
          municipio: m.municipio,
        }))
      )
    );
  }

  getProdutos(uf: string, id_municipio: number, ano: number, min_area: number = 1): Observable<Produto[]> {
    const params = new HttpParams()
      .set('uf', uf)
      .set('id_municipio', id_municipio.toString())
      .set('ano', ano.toString())
      .set('min_area', min_area.toString());

    return this.http
      .get<any>(this.API_URL_DASHBOARD + 'produtos', { params })
      .pipe(map((res) => res.results ?? []));
  }

  getProductsAndUfsByYear(ano: number): Observable<any[]> {
    const params = new HttpParams().set('ano', ano.toString());
    return this.http
      .get<any>(this.API_URL_COMPARING + 'products', { params })
      .pipe(map((res) => res ?? []));
  }

  compareStates(uf1: string, uf2: string, produto: string, ano: number): Observable<any[]> {
    const params = new HttpParams()
      .set('uf1', uf1)
      .set('uf2', uf2)
      .set('produto', produto)
      .set('ano', ano.toString());

    return this.http
      .get<any>(this.API_URL_COMPARING + 'compare', { params })
      .pipe(map((res) => res ?? []));
  }
}
