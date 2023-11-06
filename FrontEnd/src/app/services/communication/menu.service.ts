import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  private urlNavigationParameter:string | undefined;
  private urlNavigationParameter$: Subject<string>;

  constructor() { 
    this.urlNavigationParameter$= new Subject();
  }

  changeurlNavigationParameter(url:string,name:string){
    this.urlNavigationParameter = url;
    this.urlNavigationParameter = name;
    this.urlNavigationParameter$.next(this.urlNavigationParameter);
  }

  geturlNavigationParameter$():Observable<string>{
    return this.urlNavigationParameter$.asObservable();
  }
}
