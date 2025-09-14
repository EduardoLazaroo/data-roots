import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/dashboard.service';
import { UF, Municipio, Produto } from '../models/dashboard-models.model';

@Component({
  selector: 'app-permanent-crop',
  templateUrl: './permanent-crop.component.html',
  styleUrls: ['./permanent-crop.component.css'],
})
export class PermanentCropComponent implements OnInit {
  ufs: UF[] = [];
  municipios: Municipio[] = [];
  produtos: Produto[] = [];

  selectedUF: string = '';
  selectedMunicipio: number | null = null;
  selectedAno: number | null = null;

  loadingUFs = true;
  loadingMunicipios = false;
  loadingProdutos = false;

  chartOptions: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.dataService.getUFs().subscribe({
      next: (ufs) => {
        this.ufs = ufs;
        this.loadingUFs = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingUFs = false;
      },
    });
  }

  onUFChange() {
    if (!this.selectedUF) return;
    this.loadingMunicipios = true;
    this.dataService.getMunicipios(this.selectedUF).subscribe({
      next: (muns) => {
        this.municipios = muns;
        this.selectedMunicipio = null;
        this.produtos = [];
        this.loadingMunicipios = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingMunicipios = false;
      },
    });
  }

  fetchProdutos() {
    if (!this.selectedUF || !this.selectedMunicipio || !this.selectedAno)
      return;

    this.loadingProdutos = true;
    this.dataService
      .getProdutos(this.selectedUF, this.selectedMunicipio, this.selectedAno)
      .subscribe({
        next: (prods) => {
          this.produtos = prods;
          this.loadingProdutos = false;
          this.updateChart();
        },
        error: (err) => {
          console.error(err);
          this.loadingProdutos = false;
        },
      });
  }

  updateChart() {
    this.chartOptions = {
      tooltip: {},
      xAxis: {
        type: 'category',
        data: this.produtos.map((p) => p.produto),
      },
      yAxis: {
        type: 'value',
      },
      series: [
        {
          data: this.produtos.map((p) => p.area_colhida),
          type: 'bar',
        },
      ],
    };
  }
}
