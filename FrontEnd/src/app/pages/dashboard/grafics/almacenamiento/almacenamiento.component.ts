import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { PlatosService } from 'src/app/services/platos.service';
import { GraficsService } from 'src/app/services/grafics.service';

@Component({
  selector: 'app-almacenamiento',
  templateUrl: './almacenamiento.component.html',
  styleUrls: ['./almacenamiento.component.css']
})
export class AlmacenamientoComponent  implements OnInit{



  public listProductosBodega:any[]=[]
  public productoSeleccionado: number=1;



  @Input() isFilter: boolean = true;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {min:0},
      y: {
        min: 0,
      },
    },
    plugins: {
      legend: {
        display: true,
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
      },
    },
  };
  public barChartType: ChartType = 'bar';
  public barChartPlugins = [DataLabelsPlugin];

  public barChartData: ChartData<'bar'> = {
    labels: ['Producto 1'],
    datasets: [
      { data: [65], label: 'Catidad Maxima' },
      { data: [28], label: 'Catidad Actual' },
      { data: [18], label: 'Catidad Minima' },
      
    ],
  };

  constructor(
    private platoServices:PlatosService,
    private graficsServices:GraficsService
    ){}


  ngOnInit(): void {
    this.loaddata()
    this.updatedata()
  }

  loaddata(){
    this.platoServices.getAllProducts().subscribe((resp:any)=>{
      this.listProductosBodega= resp.entriesList;
    })
    this.graficsServices.getDates().subscribe((resp:any)=>{

    })
  }

  updatedata(){
    this.graficsServices.getInventory(this.productoSeleccionado).subscribe((resp:any)=>{
      this.barChartData= resp;
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

  public randomize(): void {
    // Only Change 3 values
    this.barChartData.datasets[0].data = [
      Math.round(Math.random() * 100),
      59,
      80,
      Math.round(Math.random() * 100),
      56,
      Math.round(Math.random() * 100),
      40,
    ];

    this.chart?.update();
  }
  
}
