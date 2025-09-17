import { Component } from '@angular/core';
import { DataService } from '../services/dashboard.service';

@Component({
  selector: 'app-comparing-states',
  templateUrl: './comparing-states.component.html',
  styleUrls: ['./comparing-states.component.css'],
})
export class ComparingStatesComponent {
  selectedAno: number | null = null;
  produtos: any[] = [];
  selectedProduto: string = '';
  selectedUFs: string[] = [];
  ufsFiltradas: string[] = [];
  comparison: any[] = [];

  loadingProdutos = false;
  loadingCompare = false;

  chartOptions: any = {};

  constructor(private dataService: DataService) {}

  fetchProducts() {
    if (!this.selectedAno) return;
    this.loadingProdutos = true;
    this.produtos = [];
    this.dataService.getProductsAndUfsByYear(this.selectedAno).subscribe({
      next: (res) => {
        this.produtos = res;
        this.loadingProdutos = false;
      },
      error: () => {
        this.loadingProdutos = false;
      },
    });
  }

  onProdutoSelecionado() {
    const produtoEncontrado = this.produtos.find(
      (p) => p.produto === this.selectedProduto
    );
    this.ufsFiltradas = produtoEncontrado?.ufs || [];
    this.selectedUFs = [];
  }

  compare() {
    if (!this.selectedProduto || !this.selectedAno || this.selectedUFs.length === 0) return;
    this.loadingCompare = true;
    this.comparison = [];
    this.dataService
      .compareStates(this.selectedProduto, this.selectedAno, this.selectedUFs)
      .subscribe({
        next: (res) => {
          this.comparison = res;
          this.updateChart();
          this.loadingCompare = false;
        },
        error: () => {
          this.loadingCompare = false;
        },
      });
  }

  updateChart() {
    this.chartOptions = {
      title: {
        text: `Produção de ${this.selectedProduto} (${this.selectedAno})`,
      },
      tooltip: {},
      xAxis: {
        type: 'category',
        data: this.comparison.map((c) => c.sigla_uf),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          name: 'Produção',
          type: 'bar',
          data: this.comparison.map((c) => c.total_producao),
        },
      ],
    };
  }
}
