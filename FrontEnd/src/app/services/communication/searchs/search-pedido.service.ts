import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchPedidoService {

  private searchParameter:object | undefined;
  private searchParameter$: Subject<object>;

  constructor() {
    this.searchParameter$= new Subject();
   }


   changeSearchParameter(atributeSearch:string,paramSeacrh:string){
    this.searchParameter = {
      paramSeacrh,
      atributeSearch
    };
    this.searchParameter$.next(this.searchParameter);
  }

  getSearchParameter$():Observable<object>{
    return this.searchParameter$.asObservable();
  }
}
