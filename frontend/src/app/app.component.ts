import { Component, OnInit } from '@angular/core';
import { DataService, TopProduto } from './services/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  topProdutosOptions: any;
  loading = true;

  // filtros dinâmicos
  anoSelecionado = 2019;
  ufSelecionado = 'MG';
  top_n = 100;

  anosDisponiveis = [2017, 2018, 2019, 2020, 2021];
  ufsDisponiveis = ['MG', 'SP', 'PR', 'RS', 'BA'];

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadTopProdutos(this.anoSelecionado, this.ufSelecionado);
  }

  loadTopProdutos(ano: number, uf: string): void {
    this.loading = true;

    this.dataService.getTopProdutosAnoUf(ano, uf, this.top_n).subscribe({
      next: (data: TopProduto[]) => {
        const produtos = data.map(d => d.produto);
        const ocorrencias = data.map(d => d.ocorrencias);

        this.topProdutosOptions = {
          title: {
            text: `Top Produtos - ${uf} (${ano})`,
            left: 'center'
          },
          tooltip: { trigger: 'axis' },
          xAxis: {
            type: 'category',
            data: produtos,
            axisLabel: { rotate: 45 },
          },
          yAxis: {
            type: 'value',
            name: 'Ocorrências'
          },
          series: [
            {
              name: 'Ocorrências',
              type: 'bar',
              data: ocorrencias,
              itemStyle: { color: '#3398DB' },
              label: { show: true, position: 'top' }
            }
          ],
          grid: { bottom: 80, left: 50, right: 30 }
        };

        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar top produtos:', err);
        this.loading = false;
      }
    });
  }

  onFiltroChange(): void {
    this.loadTopProdutos(this.anoSelecionado, this.ufSelecionado);
  }
}
