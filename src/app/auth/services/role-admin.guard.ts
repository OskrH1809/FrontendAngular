import { Injectable } from '@angular/core';
import { CanActivate, CanLoad, Route, UrlSegment, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RolesGuard implements CanActivate, CanLoad {

  constructor(private route:Router,private notification: NzNotificationService){

  }

  helper = new JwtHelperService();
  decodeToken = this.helper.decodeToken(localStorage.getItem('token'))

  role = this.decodeToken.roles[0];


  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.role=='ROLE_ADMIN') {

      return true;
    } else {

      this.createNotification('error','Error','No cuenta con permisos para acceder a esta pagina');
      setTimeout(()=>{                           //<<<---using ()=> syntax
        this.route.navigate(['cards']);
        return false
      }, 2000);

    }
  }
  canLoad(
    route: Route,
    segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {
      if (this.role=='ROLE_ADMIN') {
        return true;
      } else {

        this.createNotification('error','Error','No cuenta con permisos para acceder a esta pagina');
        setTimeout(()=>{                           //<<<---using ()=> syntax
          return false
        }, 6000);

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
