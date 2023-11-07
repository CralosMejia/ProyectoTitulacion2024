import { Component, Input, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-tendencia-ventas',
  templateUrl: './tendencia-ventas.component.html',
  styleUrls: ['./tendencia-ventas.component.css']
})
export class TendenciaVentasComponent {
  private newLabel? = 'New label';

  @Input() isFilter: boolean = true;

  constructor() {
  }

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      // {
      //   data: [65, 59, 80, 81, 56, 55, 40],
      //   label: 'Papas con Cuero',
      //   backgroundColor: 'rgba(148,159,177,0.2)',
      //   borderColor: 'rgba(148,159,177,1)',
      //   pointBackgroundColor: 'rgba(148,159,177,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(148,159,177,0.8)',
      //   fill: 'origin',
      // },
      // {
      //   data: [28, 48, 40, 81, 36, 50, 40],
      //   label: 'Mote pillo',
      //   backgroundColor: 'rgba(77,83,96,0.2)',
      //   borderColor: 'rgba(77,83,96,1)',
      //   pointBackgroundColor: 'rgba(77,83,96,1)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(77,83,96,1)',
      //   fill: 'origin',
      // },
      {
        data: [180, 480, 770, 90, 1000, 270, 400],
        label: 'Papas con Cuero',
        yAxisID: 'y1',
        backgroundColor: 'rgba(255,0,0,0.3)',
        borderColor: 'red',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0,
      },
    },
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      y: {
        position: 'left',
      },
      y1: {
        position: 'right',
        grid: {
          color: 'rgba(255,0,0,0.3)',
        },
        ticks: {
          color: 'red',
        },
      },
    },

    
  };

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  private static generateNumber(i: number): number {
    return Math.floor(Math.random() * (i < 2 ? 100 : 1000) + 1);
  }

  // events
  public chartClicked({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
    console.log(event, active);
  }

  ///Filtros
  //-----------------
  platos = [
    { name: 'Mote pillo', checked: false },
    { name: 'Papas con cuero', checked: false },
    // Añadir más opciones aquí
  ];

  toggleDropdown = true;

  get selectedOptions() {
    return this.platos
      .filter(plato => plato.checked)
      .map(plato => plato.name);
  }
}
