import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class GraficsService {

  constructor(
    private http:HttpClient
  ) { }

  getDates(){
    const url = `${base_url}/mvd/getdates`;
    return this.http.get(url)
  }

  getPredictDemandGrafic(data:any){
    const url = `${base_url}/mvd/predictionDemand`;
    return this.http.post(url,data)

  }

  getTrendSales(data:any){
    const url = `${base_url}/mvd/trendSales`;
    return this.http.post(url,data)

  }

  getInventory(id:number){
    const url = `${base_url}/mvd/inventoryProduct/${id}`;
    return this.http.get(url)

  }

  
  getSummaryOrders(data:any){
    const url = `${base_url}/mvd/summaryOrder`;
    return this.http.post(url,data)

  }

  saveDatapredicted(data:any){
    const url = `${base_url}/mvd/savePredictdemand`;
    return this.http.post(url,data)

  }

  getNamesAnalisis(){
    const url = `${base_url}/mvd/getAllAnalisis`;
    return this.http.get(url)
  }

  getDataAnalisis(data:any){
    const url = `${base_url}/mvd/doAnalisis`;
    return this.http.post(url,data)
  }
}
