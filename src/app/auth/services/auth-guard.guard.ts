import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';
import { GestionUsuariosService } from './gestion-usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardGuard implements CanLoad, CanActivate {
  constructor(private notification: NzNotificationService,private router: Router, private gestionUsuario:GestionUsuariosService){}
  token = localStorage.getItem('token')
  verificarAcceso = this.gestionUsuario.verificarAcceso();



  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {

    if (this.verificarAcceso==false) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['']);
      return false

    }else{

      return true;

    }


  }


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {



    if (this.verificarAcceso==false) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['']);
      return false

    }else{

      return true;

    }

  }



  createNotification(type1: string,type2:string,type3:string,): void {
    this.notification.create(
      type1,
      type2,
      type3,
      { nzDuration:12000 }
    );

  }


}
