import { Component, Input, OnInit, ViewChild } from '@angular/core';
import {  ChartConfiguration, ChartEvent, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { GraficsService } from 'src/app/services/grafics.service';
import { PlatosService } from 'src/app/services/platos.service';
import lineChartDataLabels from 'chartjs-plugin-datalabels';
import * as XLSX from 'xlsx';
import Swal from 'sweetalert2';




@Component({
  selector: 'app-prediccion-demanda',
  templateUrl: './prediccion-demanda.component.html',
  styleUrls: ['./prediccion-demanda.component.css']
})
export class PrediccionDemandaComponent implements OnInit{

  public listProductosBodega:any[]=[]
  public fechaDesde!: string;
  public fechaHasta!: string;
  public productoSeleccionado: number=-1;
  public peso=''
  public simbolo:string=''
  public agrpacionPor='m'
  public nombreAgrpacionPor='Semanas'
  public datosTabla:any=[]
  public valorTotalEstimado=0
  public valorTotalreal=0
  public data:any;
  public anios:any=[]
  public aniosOptions=''



  
  @Input() isFilter: boolean = true;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

 

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
        data: [],
        label: 'realidad',
        backgroundColor: 'rgba(134, 189, 78, 0.34)',
        borderColor: 'rgba(134, 189, 78, 0.79)',
        pointBackgroundColor: 'rgba(114, 146, 82, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(77,83,96,1)',
        fill: 'origin'
      },
      {
        data: [],
        label: 'prediccion',
        backgroundColor: 'rgba(235, 139, 150, 0.29)',
        borderColor: 'rgba(238, 137, 149, 0.54)',
        pointBackgroundColor: 'rgba(238, 137, 149, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(148,159,177,0.8)',
        fill: 'origin'
      },
      
    ],
    labels: []
  };


  public lineChartOptions: ChartConfiguration['options'] 
  public lineChartPlugins = [lineChartDataLabels];

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
      this.listProductosBodega.push({
        producto_bodega_id:-1,
        nombre_producto: 'GENERAL'

    })
    resp.entriesList.forEach((element:any) => {
      this.listProductosBodega.push(element)
    });
      
    })
    this.graficsServices.getDates().subscribe((resp:any)=>{
      this.anios=resp.yearsBetween
      this.mostrarAlertaConInputs()

    })
  }

  updatedata(){
    const data ={
      "id":this.productoSeleccionado,
      "fechaDesde":this.fechaDesde,
      "fechaHasta":this.fechaHasta,
      "frecuencia":this.agrpacionPor
    
    }
    this.graficsServices.getPredictDemandGrafic(data).subscribe((resp:any)=>{
      this.valorTotalEstimado=0
      this.valorTotalreal=0
      this.data=resp
      this.lineChartData= resp.datos;
      this.peso=resp.peso
      this.simbolo=resp.unidad
      this.lineChartOptions= resp.options
      this.datosTabla=resp.resumenDatos
      this.datosTabla.forEach((dato:any)=>{
        this.valorTotalEstimado+=dato.valor_estimado

      })
      this.updateChart()
    })
    
  }

  updateChart(){
    this.lineChartData.datasets.forEach(dataset => {
      dataset.datalabels = {
        formatter: (value, context) => {
          return `${value} ${this.peso}`; // Asegúrate de que `peso.simbolo` existe
        },
      };
    });

    // this.lineChartOptions?.plugins?.tooltip=
  }

  changeFilter(){
    this.changeNameTable()
    this.updatedata()
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


  exportToExcel(){
    const name=this.listProductosBodega.find((prod:any)=>prod.producto_bodega_id == this.productoSeleccionado)
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.datosTabla);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Hoja1');

    // Guarda el archivo
    XLSX.writeFile(wb, `datos_prediccion_demanda_${name.nombre_producto}.xlsx`);
  }

  printComponent() {
    window.print();

  }

  saveInfoPredictDemand(){
    let inicioAnio;
    let finAnio;

    const currentDate =new Date()




    Swal.fire({
      title: 'Ingrese los datos',
      html: `
        <h3>Ingrese el nombre de la información</h3>
        <input id="swal-input2" class="swal2-input" placeholder="Texto">
        <select id="swal-input1" class="swal2-input">
          <option value="" disabled selected>Seleccione un año</option>
          ${this.aniosOptions}
        </select>
      `,
      focusConfirm: false,
      preConfirm: () => {
        const inputAnio = (document.getElementById('swal-input1') as HTMLSelectElement).value;
        const inputTexto = (document.getElementById('swal-input2') as HTMLInputElement).value;
        if (!inputAnio || !inputTexto) {
          Swal.showValidationMessage('Ambos campos deben estar llenos');
          return false;
        }
        return { anio: inputAnio, texto: inputTexto };
      }
    }).then((result) => {
      if (result.value) {
        console.log('Año:', result.value.anio);
        console.log('Texto:', result.value.texto);
        const data ={
          "id":this.productoSeleccionado,
          "fechaDesde":result.value.anio+'-01'+'-01',
          "fechaHasta":result.value.anio+'-12'+'-31',
          "frecuencia":this.agrpacionPor
        
        }
        this.graficsServices.getPredictDemandGrafic(data).subscribe((resp:any)=>{
          this.data=resp
          this.graficsServices.saveDatapredicted({
            date:currentDate,
            name:result.value.texto,
            data:this.data
            
          }).subscribe()

        })
        
        // Aquí puedes hacer lo que sea necesario con los valores de los inputs
      }
    });
  }
  
  

  mostrarAlertaConInputs() {
    this.aniosOptions = this.anios.map((anio:any) => `<option value="${anio}">${anio}</option>`).join('');
  } 
}
