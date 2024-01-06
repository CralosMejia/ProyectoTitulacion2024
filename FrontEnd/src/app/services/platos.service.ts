import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;

@Injectable({
  providedIn: 'root'
})
export class PlatosService {

  constructor(
    private http:HttpClient
  ) { }

  getCompletePlatos(){
    const url = `${base_url}/mipp/infoPlatos`;
    return this.http.get(url);
  }

  chagePlateStatus(id:number){
    const url = `${base_url}/mipp/chageState/${id}`;
    return this.http.post(url,{})
  }

  getInfoPlato(id:String){
    const url = `${base_url}/mipp/infoPlato/${id}`;
    return this.http.get(url);

  }

  getAllProducts(){
    const url = `${base_url}/productoBodega`;
    return this.http.get(url);

  }

  getAllPeso(){
    const url = `${base_url}/peso`;
    return this.http.get(url);
  }

  addIngredient(ingredient:any){
    const url = `${base_url}/mipp/addingrediente`;
    return this.http.post(url,ingredient)
  }

  deleteIngredient(id:number){
    const url = `${base_url}/mipp/deleteingrediente/${id}`;
    return this.http.delete(url)
  }

  editIngredient(id:number,data:any){
    const url = `${base_url}/mipp/updatedingrediente/${id}`;
    return this.http.put(url,data)
    
  }

  editPlato(id:number,data:any){
    const url = `${base_url}/plato/update/${id}`;
    return this.http.put(url,data)
  }

  createNewPlato(data:any){
    const url = `${base_url}/mipp/create`;
    return this.http.post(url,data)

  }

  getAllPlatos(){
    const url = `${base_url}/plato`
    return this.http.get(url)
  }

  search(data:any){
    const url = `${base_url}/mipp/search`;
    return this.http.put(url,data)
  }

  searchIngredient(id:number,data:any){
    const url = `${base_url}/mipp/searchIngredientes/${id}`;
    return this.http.put(url,data)
  }


}
