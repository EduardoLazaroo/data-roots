import { Component } from '@angular/core';

@Component({
  selector: 'app-about-details.component',
  templateUrl: './about-details.component.html',
  styleUrls: ['./about-details.component.css'],
})
export class AboutDetailsComponent {
  items = [
    {
      url: 'https://files.catbox.moe/edvhtl.png',
      titulo: 'Gráficos e mapas',
      descricao: 'Temos ótimos gráficos gratuitos',
    },
    {
      url: 'https://files.catbox.moe/xpueg8.png',
      titulo: 'IA para analisar',
      descricao: 'Opção ainda em beta, criação de análises',
    },
    {
      url: 'https://files.catbox.moe/kp7bad.png',
      titulo: 'Personalização',
      descricao: 'Podemos personalizar algum dashboard só para você',
    },
    {
      url: 'https://files.catbox.moe/3c5i1p.png',
      titulo: 'Relatório',
      descricao: 'Gerador de relatório PDF',
    },
  ];
}
