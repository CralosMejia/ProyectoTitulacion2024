import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class OrdenesService {

  constructor(
    private http:HttpClient
  ) { }


  getOrders(){
    const url= `${base_url}/orden` 
    return this.http.get(url)
  }

  getOrderComplete(id:string){
    const url= `${base_url}/map/getOrdenComplete/${id}` 
    return this.http.get(url)

  }

  updatedetalleorden(id:number,data:any){
    const url= `${base_url}/map/updateDetalleOrden/${id}` 
    return this.http.put(url,data)
  }

  createDetalle(data:any){
    const url= `${base_url}/map/createDetalleOrden` 
    return this.http.post(url,data)

  }

  deleteDetalle(id:number){
    const url= `${base_url}/map/deleteDetalleOrden/${id}`
    return this.http.delete(url)
  }

  getInfoDetalle(idProd:number){
    const url= `${base_url}/map/getInfoDetalleOrder/${idProd}`
    return this.http.get(url)
  }

  createOrdenComplete(data:any){
    const url= `${base_url}/map/createComplete`
    return this.http.post(url,data)

  }

  updateStatus(id:number,data:any){
    const url= `${base_url}/map/updateOrderStatus/${id}`
    return this.http.put(url,data);

  }

  reciveOrder(idOrder:number,data:any){
    const url= `${base_url}/map/finalizeOrder/${idOrder}`
    return this.http.post(url,data);
  }

  search(data:any){
    const url= `${base_url}/map/searchOrdenes`
    return this.http.put(url,data);
  }

  searchPedido(id:string,data:any){
    const url= `${base_url}/map/searchOrden/${id}`
    return this.http.put(url,data);
  }


}
