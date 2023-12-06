import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {  ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GraficsService } from 'src/app/services/grafics.service';
import { PlatosService } from 'src/app/services/platos.service';


@Component({
  selector: 'app-prediccion-demanda',
  templateUrl: './prediccion-demanda.component.html',
  styleUrls: ['./prediccion-demanda.component.css']
})
export class PrediccionDemandaComponent implements OnInit{

  public listProductosBodega:any[]=[]
  public fechaDesde!: string;
  public fechaHasta!: string;
  public productoSeleccionado: number=1;

  
  @Input() isFilter: boolean = true;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

 

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [65, 59, 80, 81, 56, 55, 40],
        label: 'prediccion',
        backgroundColor: 'rgba(148,159,177,0.2)',
        borderColor: 'rgba(148,159,177,1)',
        pointBackgroundColor: 'rgba(148,159,177,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin',
      },
      {
        data: [28, 48, 40],
        label: 'realidad',
        backgroundColor: 'rgba(77,83,96,0.2)',
        borderColor: 'rgba(77,83,96,1)',
        pointBackgroundColor: 'rgba(77,83,96,1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin',
      },
    ],
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  };


  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    elements: {
      line: {
        tension: 0.5,
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



  constructor(
    private platoServices:PlatosService,
    private graficsServices:GraficsService
  ) {}

  ngOnInit(): void {
    this.loaddata()
    this.updatedata()
  }


  loaddata(){
    this.platoServices.getAllProducts().subscribe((resp:any)=>{
      this.listProductosBodega= resp.entriesList;
    })
    this.graficsServices.getDates().subscribe((resp:any)=>{
      this.fechaDesde = resp.oldestDate
      this.fechaHasta = resp.mostRecentDate
    })
  }

  updatedata(){
    const data ={
      "id":this.productoSeleccionado,
      "fechaDesde":this.fechaDesde,
      "fechaHasta":this.fechaHasta
    
    }
    this.graficsServices.getPredictDemandGrafic(data).subscribe((resp:any)=>{
      this.lineChartData= resp;
    })
  }

  changeFilter(){
    this.updatedata()
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


  

}
