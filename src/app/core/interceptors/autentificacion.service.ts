import { HttpClient, HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GestionUsuariosService } from 'src/app/auth/services/gestion-usuarios.service';
import { environment } from 'src/environments/environment.prod';
const baseUrl = environment.baseURLF;

@Injectable({
  providedIn: 'root'
})
export class Autentificacion implements HttpInterceptor  {

  constructor(private notification: NzNotificationService,private router:Router, private gestion:GestionUsuariosService) { }


  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = localStorage.getItem('token');if (!token) {
      return next.handle(req);
    }const headers = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)

    });return next.handle(headers).pipe(

      catchError((error: HttpErrorResponse) => {
        // process the obtained error
        // for logging or monitoring


        // -----------------------------------
            // validaciones
            if (error.error.message=='JWT Token not found' )
            {
              this.gestion.logout();
              this.createNotification('error','No registrado: ','Debe registrarse');
              this.createNotification('error','error: ',error.error.message);
            }

            if (error.error.message=='Expired JWT Token') {
              this.createNotification('error','Sesión expirada : ','Debe registrarse');
              setTimeout(()=>{                           //<<<---using ()=> syntax
              this.gestion.logout();
               }, 6000);

            }


        // -------------------------------------

        // create new Observable stream
        // which the clients
        // can subscribe and
        // catch the Erroneous response

        return throwError(error.error.message);
    }));
  }




  manejarError(error:HttpErrorResponse){


    console.log(error.error.message)


    return throwError(error.error.message)

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




