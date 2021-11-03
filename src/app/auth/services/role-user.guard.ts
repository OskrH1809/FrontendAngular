import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GestionUsuariosService } from './gestion-usuarios.service';

@Injectable({
  providedIn: 'root'
})
export class RoleUserGuard implements CanActivate {
  verificarAcceso = this.gestionUsuario.verificarAcceso();

  role = this.gestion.role()

  constructor(private gestion:GestionUsuariosService, private router: Router, private gestionUsuario:GestionUsuariosService){}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if (this.role=='ROLE_CLIENT') {

        return true;
      } else {

        this.router.navigate(['panel']);
        return false

      }
  }

}
