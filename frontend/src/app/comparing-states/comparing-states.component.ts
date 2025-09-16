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
  selectedUF1: string = '';
  selectedUF2: string = '';
  comparison: any[] = [];

  loadingProdutos = false;
  loadingCompare = false;

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

  compare() {
    if (!this.selectedUF1 || !this.selectedUF2 || !this.selectedProduto || !this.selectedAno) return;
    this.loadingCompare = true;
    this.comparison = [];
    this.dataService.compareStates(this.selectedUF1, this.selectedUF2, this.selectedProduto, this.selectedAno).subscribe({
      next: (res) => {
        this.comparison = res;
        this.loadingCompare = false;
      },
      error: () => {
        this.loadingCompare = false;
      },
    });
  }
}
