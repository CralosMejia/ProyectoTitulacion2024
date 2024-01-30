import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartData, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';

import DataLabelsPlugin from 'chartjs-plugin-datalabels';
import { PlatosService } from 'src/app/services/platos.service';
import { GraficsService } from 'src/app/services/grafics.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-almacenamiento',
  templateUrl: './almacenamiento.component.html',
  styleUrls: ['./almacenamiento.component.css']
})
export class AlmacenamientoComponent  implements OnInit{



  public listProductosBodega:any[]=[]
  public productoSeleccionado: number=1;
  public infoLotestabla:any=[]
  public cantTotal=0
  public subStr=''



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
    this.cantTotal=0
    this.graficsServices.getInventory(this.productoSeleccionado).subscribe((resp:any)=>{
      this.barChartData= resp.datos;
      this.infoLotestabla=resp.infoLotes

      this.infoLotestabla.forEach((element:any) => {
          this.subStr= element.cantidad.substring(element.cantidad.length - 2)
          const cant= element.cantidad.replace(this.subStr,'')
          this.cantTotal+=Number(cant)
      });
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

  printComponent() {
    window.print();

  }

  exportToExcel(){
    console.log(this.listProductosBodega)
    const name=this.listProductosBodega.find((prod:any)=>prod.producto_bodega_id ==this.productoSeleccionado)
    console.log(name)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.infoLotestabla);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

    // Guarda el archivo
    XLSX.writeFile(wb, `datos_informacion_bodega_${name.nombre_producto}.xlsx`);
  }
  
}
