import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlNavigationParameter:object | undefined;
  private urlNavigationParameter$: Subject<object>;

  constructor() { 
    this.urlNavigationParameter$= new Subject();
  }

  changeurlNavigationParameter(url:string,name:string){
    // this.urlNavigationParameter = url;
    this.urlNavigationParameter = {name,url};
    this.urlNavigationParameter$.next(this.urlNavigationParameter);
  }

  geturlNavigationParameter$():Observable<object>{
    return this.urlNavigationParameter$.asObservable();
  }
}
