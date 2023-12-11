import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class ProveedoresService {

  constructor(
    private http:HttpClient
  ) { }

  getProv(){
    const url = `${base_url}/proveedor`
    return this.http.get(url)
  }
}
