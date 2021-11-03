import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Observable } from 'rxjs';
import { GestionUsuariosService } from './gestion-usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class RegistroGuard implements CanActivate, CanLoad {
  verificarAcceso = this.gestionUsuario.verificarAcceso();

  role = this.gestion.role()

  constructor(private gestion:GestionUsuariosService, private router: Router, private gestionUsuario:GestionUsuariosService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    if (this.verificarAcceso==false || this.role == 'ROLE_ADMIN') {
      return true

    } else {
      this.router.navigate(['cards']);
      return false
    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }
}
