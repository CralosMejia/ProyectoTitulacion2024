import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class BodegaService {

  constructor(
    private http:HttpClient
  ) { }

  addNewLote(data:any){
    const url = `${base_url}/mgpaab/createLote`
    return this.http.post(url,data)
  }

  getAllInfoproducts(){
    const url = `${base_url}/mgpaab/getAllInfoProducts`
    return this.http.get(url)
  }


  updateLote(id:number,data:any){
    const url= `${base_url}/lote/update/${id}`
    return this.http.put(url,data)
  }

  deleteLote(id:number){
    const url= `${base_url}/lote/delete/${id}`
    return this.http.delete(url)
  }

  createProd(data:any){
    const url = `${base_url}/productoBodega/create`
    return this.http.post(url,data)
  }

  upodateProd(id:number,data:any){
    const url = `${base_url}/productoBodega/update/${id}`
    return this.http.put(url,data)
  }


  search(data:any){
    const url = `${base_url}/mgpaab/searchProduct`
    return this.http.put(url,data)
  }
}
