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
  selectedTipo: 'permanente' | 'temporaria' = 'permanente';

  loadingUFs = true;
  loadingMunicipios = false;
  loadingProdutos = false;

  chartOptions: any;

  constructor(private dataService: DataService) {}

  ngOnInit() {
    this.fetchUFs();
  }

  setTipo(value: 'permanente' | 'temporaria') {
    if (this.selectedTipo !== value) {
      this.selectedTipo = value;
      this.fetchUFs();
      this.municipios = [];
      this.produtos = [];
      this.selectedUF = '';
      this.selectedMunicipio = null;
    }
  }

  fetchUFs() {
    this.loadingUFs = true;
    this.dataService.getUFs(this.selectedTipo).subscribe({
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
    this.dataService.getMunicipios(this.selectedUF, this.selectedTipo).subscribe({
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
      .getProdutos(
        this.selectedUF,
        this.selectedMunicipio,
        this.selectedAno,
        1,
        this.selectedTipo
      )
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
      tooltip: {
        trigger: 'item',
        formatter: '{b}: {c} ha ({d}%)',
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: this.produtos.map((p) => p.produto),
      },
      series: [
        {
          name: 'Área Colhida',
          type: 'pie',
          radius: '70%',
          center: ['50%', '60%'],
          data: this.produtos.map((p) => ({
            name: p.produto,
            value: p.area_colhida,
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    };
  }
}
