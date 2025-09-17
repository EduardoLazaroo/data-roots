import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletService } from '../services/leaflet.service';
import { MunicipioProduzido } from '../models/leaflet-models.model';

@Component({
  selector: 'app-leaflet-city-production',
  templateUrl: './leaflet-city-production.component.html',
  styleUrls: ['./leaflet-city-production.component.css'],
})
export class LeafletCityProductionComponent implements OnInit, AfterViewInit {
  ufs: { sigla_uf: string; nome: string }[] = [];
  produtos: { produto: string; area_colhida_total: number }[] = [];

  selectedUF: string = '';
  selectedProduto: string = '';
  selectedAno: number | null = null;
  loadingUFs = true;
  loadingProdutos = false;
  buscaRealizada = false;

  municipios: MunicipioProduzido[] = [];
  private map!: L.Map;
  private markers: L.LayerGroup = L.layerGroup();

  constructor(private leafletService: LeafletService) {}

  ngOnInit(): void {
    this.loadUFs();
  }

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap(): void {
    if (this.map) return;
    this.map = L.map('map', { center: [-23.0, -46.6], zoom: 6 });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);
    this.markers.addTo(this.map);
  }

  private loadUFs(): void {
    this.leafletService.getUFs().subscribe({
      next: (data) => {
        this.ufs = data;
        this.loadingUFs = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingUFs = false;
      },
    });
  }

  buscarProdutos(): void {
    if (!this.selectedUF || !this.selectedAno) return;

    this.buscaRealizada = true;

    this.produtos = [];
    this.selectedProduto = '';
    this.municipios = [];
    this.markers.clearLayers();

    this.loadingProdutos = true;

    this.leafletService
      .getProdutosPorUF(this.selectedUF, this.selectedAno)
      .subscribe({
        next: (data) => {
          this.produtos = data;
          this.loadingProdutos = false;
        },
        error: (err) => {
          console.error(err);
          this.loadingProdutos = false;
        },
      });
  }

  selectProduto(produto: string): void {
    this.selectedProduto = produto;
    this.fetchMunicipios();
  }

  fetchMunicipios(): void {
    if (!this.selectedUF || !this.selectedProduto || !this.selectedAno) return;

    this.leafletService
      .getMunicipios(this.selectedUF, this.selectedAno, this.selectedProduto)
      .subscribe({
        next: (data) => {
          this.municipios = data;
          this.updateMarkers();
        },
        error: (err) => console.error(err),
      });
  }

  private updateMarkers(): void {
    this.markers.clearLayers();

    this.municipios.forEach((m) => {
      const popupContent = `
      <b>${m.municipio}</b><br>
      Produção: ${m.quantidade_produzida.toLocaleString('pt-BR')}<br>
      Área: ${m.area_colhida.toLocaleString('pt-BR')} ha<br>
      Rendimento: ${m.rendimento_medio_producao.toLocaleString('pt-BR')} /ha<br>
      Valor: R$ ${m.valor_producao.toLocaleString('pt-BR')}
    `;

      const marker = L.circleMarker([m.latitude, m.longitude], {
        radius: 8,
        color: 'orange',
        fillColor: 'orange',
        fillOpacity: 0.6,
      }).bindPopup(popupContent);

      this.markers.addLayer(marker);
    });

    if (this.municipios.length) {
      const bounds = L.latLngBounds(
        this.municipios.map((m) => [m.latitude, m.longitude])
      );
      this.map.fitBounds(bounds);
    }
  }
}
