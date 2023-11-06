import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuService } from 'src/app/services/communication/menu.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  public nameRoute:string=''
  constructor(
    private router:Router,
    private menuSrv: MenuService
  ){}

  ngOnInit() {
    this.menuSrv.geturlNavigationParameter$().subscribe(param=>{
      this.nameRoute=this.formatTitle(param);
    })
  }

  formatTitle(cadena:string){
    // Obtiene la primera letra de la cadena
    const mayuscula = cadena.charAt(0).toUpperCase();

    return mayuscula + cadena.slice(1);
  }

  navigateToSettings(){
    this.menuSrv.changeurlNavigationParameter('/settings','Settings')
    this.router.navigate(['settings'])
  }
}
