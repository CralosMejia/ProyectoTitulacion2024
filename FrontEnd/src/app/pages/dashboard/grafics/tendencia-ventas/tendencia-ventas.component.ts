import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GraficsService } from 'src/app/services/grafics.service';
import { PlatosService } from 'src/app/services/platos.service';

@Component({
  selector: 'app-tendencia-ventas',
  templateUrl: './tendencia-ventas.component.html',
  styleUrls: ['./tendencia-ventas.component.css']
})
export class TendenciaVentasComponent  implements OnInit{
  public listPlatos:any[]=[]
  public fechaDesde!: string;
  public fechaHasta!: string;
  public platoSeleccionado: number=1;


  @Input() isFilter: boolean = true;

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;



  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
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



  constructor(
    private platoServices:PlatosService,
    private graficsServices:GraficsService
  ) {
  }
  
  ngOnInit(): void {
    this.loaddata()
    this.updatedata()
  }


  
  loaddata(){
    this.platoServices.getAllPlatos().subscribe((resp:any)=>{
      this.listPlatos= resp.entriesList
      console.log(resp)
    })
    this.graficsServices.getDates().subscribe((resp:any)=>{
      this.fechaDesde = resp.oldestDate
      this.fechaHasta = resp.mostRecentDate
    })
  }

  
  updatedata(){
    const data ={
      "id":this.platoSeleccionado,
      "fechaDesde":this.fechaDesde,
      "fechaHasta":this.fechaHasta
    
    }
    this.graficsServices.getTrendSales(data).subscribe((resp:any)=>{
      this.lineChartData= resp;
    })
  }

  changeFilter(){
    this.updatedata()
  }

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
  }

  public chartHovered({
    event,
    active,
  }: {
    event?: ChartEvent;
    active?: object[];
  }): void {
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
