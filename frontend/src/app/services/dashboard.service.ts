import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { UF, Municipio, Produto } from '../models/dashboard-models.model';

@Injectable({ providedIn: 'root' })
export class DataService {
  private API_URL_DASHBOARD = 'http://localhost:8000/dashboard/';
  private API_URL_COMPARING = 'http://localhost:8000/comparing-states/';

  constructor(private http: HttpClient) {}

  getUFs(tipo: 'permanente' | 'temporaria' = 'permanente'): Observable<UF[]> {
    const params = new HttpParams().set('tipo', tipo);
    return this.http
      .get<any>(this.API_URL_DASHBOARD + 'ufs', { params })
      .pipe(map((res) => res.results ?? []));
  }

  getMunicipios(
    uf: string,
    tipo: 'permanente' | 'temporaria' = 'permanente'
  ): Observable<Municipio[]> {
    let params = new HttpParams().set('uf', uf).set('tipo', tipo);
    return this.http
      .get<any>(this.API_URL_DASHBOARD + 'municipios', { params })
      .pipe(
        map((res) =>
          (res.results ?? []).map((m: any) => ({
            id_municipio: Number(m.id_municipio),
            municipio: m.municipio,
          }))
        )
      );
  }

  getProdutos(
    uf: string,
    id_municipio: number,
    ano: number,
    min_area: number = 1,
    tipo: 'permanente' | 'temporaria' = 'permanente'
  ): Observable<Produto[]> {
    let params = new HttpParams()
      .set('uf', uf)
      .set('id_municipio', id_municipio.toString())
      .set('ano', ano.toString())
      .set('min_area', min_area.toString())
      .set('tipo', tipo);

    return this.http
      .get<any>(this.API_URL_DASHBOARD + 'produtos', { params })
      .pipe(map((res) => res.results ?? []));
  }

  getProductsAndUfsByYear(
    ano: number,
    tipo: 'permanente' | 'temporaria' = 'permanente'
  ): Observable<any[]> {
    const params = new HttpParams().set('ano', ano.toString()).set('tipo', tipo);
    return this.http
      .get<any>(this.API_URL_COMPARING + 'products', { params })
      .pipe(map((res) => res.results ?? []));
  }

  compareStates(
    produto: string,
    ano: number,
    ufs: string[],
    tipo: 'permanente' | 'temporaria' = 'permanente'
  ): Observable<any[]> {
    let params = new HttpParams()
      .set('produto', produto)
      .set('ano', ano.toString())
      .set('tipo', tipo);

    ufs.forEach((uf) => {
      params = params.append('ufs', uf);
    });

    return this.http
      .get<any>(this.API_URL_COMPARING + 'compare', { params })
      .pipe(map((res) => res.results ?? []));
  }
}
