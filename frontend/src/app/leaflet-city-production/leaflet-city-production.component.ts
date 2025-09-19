import { Component, OnInit, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';
import { LeafletService } from '../services/leaflet.service';
import {
  MunicipioProduzido,
  Produto,
  UF,
} from '../models/leaflet-models.model';

@Component({
  selector: 'app-leaflet-city-production',
  templateUrl: './leaflet-city-production.component.html',
  styleUrls: ['./leaflet-city-production.component.css'],
})
export class LeafletCityProductionComponent implements OnInit, AfterViewInit {
  ufs: UF[] = [];
  produtos: Produto[] = [];
  municipios: MunicipioProduzido[] = [];

  selectedUF: string = '';
  selectedProduto: string = '';
  selectedAno: number | null = null;
  selectedTipo: string = 'permanente';
  loadingUFs = true;
  loadingProdutos = false;
  buscaRealizada = false;

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
    this.leafletService.getUFs(this.selectedTipo).subscribe({
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

  setTipo(tipo: string): void {
    this.selectedTipo = tipo;
    this.selectedUF = '';
    this.selectedProduto = '';
    this.produtos = [];
    this.municipios = [];
    this.markers.clearLayers();
    this.loadUFs();
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
      .getProdutosPorUF(this.selectedUF, this.selectedAno, this.selectedTipo)
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
      .getMunicipios(
        this.selectedUF,
        this.selectedAno,
        this.selectedProduto,
        10,
        this.selectedTipo
      )
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
        Produção: ${m.quantidade_total.toLocaleString('pt-BR')} ton<br>
        Área colhida: ${m.area_colhida.toLocaleString('pt-BR')} ha<br>
        Rendimento médio: ${m.rendimento_medio_producao.toLocaleString(
          'pt-BR'
        )} kg/ha<br>
        Valor da produção: ${new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(m.valor_producao * 1000)}
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
