import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GraficsService } from 'src/app/services/grafics.service';
import { PlatosService } from 'src/app/services/platos.service';
import * as XLSX from 'xlsx';


@Component({
  selector: 'app-tendencia-ventas',
  templateUrl: './tendencia-ventas.component.html',
  styleUrls: ['./tendencia-ventas.component.css']
})
export class TendenciaVentasComponent  implements OnInit{
  public listPlatos:any[]=[]
  public fechaDesde!: string;
  public fechaHasta!: string;
  public platoSeleccionado: number=-1;
  public agrpacionPor='w'
  public nombreAgrpacionPor='Semanas'
  public datosTabla:any=[]
  public valorTotal=0



  @Input() isFilter: boolean = true;

  public lineChartType: ChartType = 'line';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;



  public lineChartData: ChartConfiguration['data'] = {
    datasets: []
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
      y1: {
        position: 'left',
        grid: {
          color: 'rgba(255,0,0,0.3)',
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
      this.listPlatos.push({
        nombre_plato:'GENERAL',
        plato_id:-1
      })
      resp.entriesList.forEach((element:any) => {
        this.listPlatos.push(element)
      });
      console.log(resp)

    })
    // this.graficsServices.getDates().subscribe((resp:any)=>{
    //   this.fechaDesde = resp.oldestDate
    //   this.fechaHasta = resp.mostRecentDate
    // })
  }

  
  updatedata(){
    const data ={
      "id":this.platoSeleccionado,
      "fechaDesde":this.fechaDesde,
      "fechaHasta":this.fechaHasta,
      "frecuencia":this.agrpacionPor
    
    }
    this.graficsServices.getTrendSales(data).subscribe((resp:any)=>{
      console.log(resp)
      this.valorTotal=0
      this.lineChartData= resp.datos;
      this.datosTabla=resp.resumenDatos
      this.datosTabla.forEach((dato:any)=>{
        this.valorTotal+=dato.valor_Real
      })

    })
  }

  changeNameTable(){
    if(this.agrpacionPor === 'w'){
      this.nombreAgrpacionPor='Semanas'
    }else if(this.agrpacionPor === 'm'){
      this.nombreAgrpacionPor='Meses'
    }else{
      this.nombreAgrpacionPor='Años'
    }

  }

  changeFilter(){
    this.changeNameTable()
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

  exportToExcel(){
    const name=this.listPlatos.find((prod:any)=>prod.plato_id ==this.platoSeleccionado)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datosTabla);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

    // Guarda el archivo
    XLSX.writeFile(wb, `datos_tendencia_ventas_${name.nombre_plato}.xlsx`);
  }

  printComponent() {
    window.print();

  }
}
