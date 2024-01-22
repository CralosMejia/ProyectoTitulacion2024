import { Component, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GraficsService } from 'src/app/services/grafics.service';

@Component({
  selector: 'app-analisi-prediccion-demanda',
  templateUrl: './analisi-prediccion-demanda.component.html',
  styleUrls: ['./analisi-prediccion-demanda.component.css']
})
export class AnalisiPrediccionDemandaComponent implements OnInit {


  opciones:any = [ ];
  listSelection:any=[]
  resumenDatos:any=[]
  cantTotalA=0
  cantTotalB=0
  cantMonetariaTotalA=0
  cantMonetariaTotalB=0
  variacionTotal=0
  variacionMonetariaTotal=0


  public agrpacionPor='p'


  @ViewChild(BaseChartDirective) chart: BaseChartDirective | undefined;

  public barChartOptions: ChartConfiguration['options'] = {
    elements: {
      line: {
        tension: 0.4,
      },
    },
    // We use these empty structures as placeholders for dynamic theming.
    scales: {
      x: {
        title: {
          display: true,
          text: 'Tiempo', // Etiqueta para el eje X
        }
      },
      y: {
        title: {
          display: true,
          text: `Dolares`, // Etiqueta para el eje Y
        },
        min: 10,
      },
    },
    plugins: {
      legend: { display: true },
    },
  };
  public barChartLabels: string[] = [
    '2006',
    '2007',
    '2008',
    '2009',
    '2010',
    '2011',
    '2012',
  ];
  public barChartType: ChartType = 'bar';

  public barChartData: ChartData<'bar'> = {
    labels: this.barChartLabels,
    datasets: [
      { data: [65, 59, 80, 81, 56, 55, 40], label: 'Series A' },
      { data: [28, 48, 40, 19, 86, 27, 90], label: 'Series B' },
    ],
  };


  constructor(
    private grafServices: GraficsService
  ){

  }
  ngOnInit(): void {
    this.grafServices.getNamesAnalisis().subscribe((resp:any)=>{
      this.opciones= resp
    })
  }

  
  updateSelection(selection:any): void {

    if(selection.selected){
      this.listSelection.push(selection.id)
    }else{
      let indice = this.listSelection.indexOf(selection.id);
      this.listSelection.splice(indice, 1);

    }

    const seleccionados = this.opciones.filter((opcion:any) => opcion.selected);


    if(seleccionados.length === 2){
      this.opciones.forEach((opcion:any)=>{
        if(!opcion.selected){
          opcion.disabled=true
        }
      })
    }else{
      this.opciones.forEach((opcion:any)=>{
        if(!opcion.selected){
          opcion.disabled=false
        }
      })
    }

    this.sendSelection()
    

  }

  sendSelection(){
    if(this.listSelection.length ==2){
      this.grafServices.getDataAnalisis({data:this.listSelection}).subscribe((resp:any)=>{
        this.barChartData=resp.datos
        this.resumenDatos= resp.resumenDatos
        this.cantTotalA=0
        this.cantTotalB=0
        this.variacionTotal=0

        resp.resumenDatos.forEach((element:any) => {
            this.cantTotalA+=element.cant_a
            this.cantTotalB+=element.cant_b
            this.variacionMonetariaTotal+=element.variacionMonetaria
        });

        this.variacionTotal= ((this.cantTotalB-this.cantTotalA)/this.cantTotalA)*100
        
        console.log(resp)
      })
    }
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
    this.barChartType = this.barChartType === 'bar' ? 'line' : 'bar';
  }
}
