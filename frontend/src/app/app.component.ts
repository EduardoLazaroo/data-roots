import { Component, OnInit } from '@angular/core';
import { DataService, Dado } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Data Roots Dashboard';
  dados: Dado[] = [];
  carregando = false;
  erro: string | null = null;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.buscarDados();
  }

  buscarDados() {
    this.carregando = true;
    this.erro = null;

    this.dataService.getDados({ ano: 1993, sigla_uf: 'SP' })
      .subscribe({
        next: (res) => {
          this.dados = res;
          this.carregando = false;
        },
        error: (err) => {
          this.erro = 'Erro ao buscar dados';
          console.error(err);
          this.carregando = false;
        }
      });
  }
}
