import { Component, Input, OnInit, ViewChild } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GraficsService } from 'src/app/services/grafics.service';
import { PlatosService } from 'src/app/services/platos.service';

@Component({
  selector: 'app-informacion-pedidos',
  templateUrl: './informacion-pedidos.component.html',
  styleUrls: ['./informacion-pedidos.component.css']
})
export class InformacionPedidosComponent implements OnInit {


  public fechaDesde!: string;
  public fechaHasta!: string;

  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  @Input() isFilter: boolean = true;
  // Pie
  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'left',
      },

    },
  };
  public pieChartData: ChartData<'pie', number[], string | string[]> = {
    labels: [['Creados','Manualmente'],['Aprobados sin',' modificaciones'],['Editados y',' aprobados'],'cancelados'],
    datasets: [
      {
        data: [300, 500, 100,10],
      },
    ],
  };
  public pieChartType: ChartType = 'pie';
  public pieChartPlugins = [DatalabelsPlugin];

  constructor(
    private platoServices:PlatosService,
    private graficsServices:GraficsService
  ){}
  ngOnInit(): void {
    this.updatedata()
  }
  updatedata(){
    const data ={
      "fechaDesde":this.fechaDesde,
      "fechaHasta":this.fechaHasta
    
    }
    this.graficsServices.getSummaryOrders(data).subscribe((resp:any)=>{
      this.pieChartData= resp;
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
    event: ChartEvent;
    active: object[];
  }): void {
  }

  public chartHovered({
    event,
    active,
  }: {
    event: ChartEvent;
    active: object[];
  }): void {
  }
}
