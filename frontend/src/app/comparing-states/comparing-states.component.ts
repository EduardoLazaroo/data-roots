import { Component } from '@angular/core';
import { DataService } from '../services/dashboard.service';
import { ComparacaoProduto, Produto } from '../models/dashboard-models.model';
import { AnaliseService } from '../services/chat.service';

@Component({
  selector: 'app-comparing-states',
  templateUrl: './comparing-states.component.html',
  styleUrls: ['./comparing-states.component.css'],
})
export class ComparingStatesComponent {
  selectedAno: number | null = null;
  produtos: any[] = [];
  selectedProduto: string = '';
  comparison: ComparacaoProduto[] = [];

  loadingProdutos = false;
  loadingCompare = false;
  loadingIA = false;
  chartOptions: any = {};

  selectedTipo: 'permanente' | 'temporaria' = 'permanente';

  resumoAnalise: string | null = null;

  constructor(
    private dataService: DataService,
    private analiseService: AnaliseService
  ) {}

  setTipo(value: 'permanente' | 'temporaria') {
    if (this.selectedTipo !== value) {
      this.selectedTipo = value;
      if (this.selectedAno) {
        this.fetchProducts();
      }
    }
  }

  fetchProducts() {
    if (!this.selectedAno) return;
    this.loadingProdutos = true;
    this.produtos = [];
    this.dataService
      .getProductsAndUfsByYear(this.selectedAno, this.selectedTipo)
      .subscribe({
        next: (res) => {
          this.produtos = res;
          this.loadingProdutos = false;
        },
        error: () => {
          this.loadingProdutos = false;
        },
      });
  }

  compare() {
    if (!this.selectedProduto || !this.selectedAno) return;
    this.loadingCompare = true;
    this.comparison = [];

    const produtoEncontrado = this.produtos.find(
      (p) => p.produto === this.selectedProduto
    );
    const selectedUFs = produtoEncontrado?.ufs || [];

    this.dataService
      .compareStates(
        this.selectedProduto,
        this.selectedAno,
        selectedUFs,
        this.selectedTipo
      )
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

  gerarAnalise(): void {
    if (!this.comparison.length || !this.selectedProduto || !this.selectedAno)
      return;

    this.loadingIA = true;

    const data = {
      name: 'ComparingStatesComponent',
      content: {
        produto: this.selectedProduto,
        ano: this.selectedAno,
        tipo: this.selectedTipo,
        comparacao: this.comparison,
      },
    };

    this.analiseService.gerarRelatorio(data).subscribe({
      next: (res) => {
        this.resumoAnalise = res.relatorio;
        this.loadingIA = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingIA = false;
      },
    });
  }

  updateChart() {
    const legendSelected: any = {};
    this.comparison.forEach((c) => (legendSelected[c.sigla_uf] = true));

    this.chartOptions = {
      title: {
        text: `Produção de ${this.selectedProduto} (${this.selectedAno})`,
      },
      tooltip: {},
      legend: {
        data: this.comparison.map((c) => c.sigla_uf),
        selected: legendSelected,
        orient: 'horizontal',
        bottom: 10,
        left: 'center',
      },
      xAxis: {
        type: 'category',
        data: [this.selectedProduto],
      },
      yAxis: {
        type: 'value',
      },
      series: this.comparison.map((c) => ({
        name: c.sigla_uf,
        type: 'bar',
        data: [c.total_producao],
      })),
    };
  }
}
