import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ComponentData {
  name: string;
  content: any;
}

@Injectable({ providedIn: 'root' })
export class AnaliseService {
  private API_URL = 'http://localhost:8000/analisar';

  constructor(private http: HttpClient) {}

  gerarRelatorio(data: ComponentData): Observable<{ relatorio: string }> {
    return this.http.post<{ relatorio: string }>(this.API_URL, data);
  }
}
