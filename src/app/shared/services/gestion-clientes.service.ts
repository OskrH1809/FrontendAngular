import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { environment } from 'src/environments/environment.prod';
import { Observable } from 'rxjs';
// const baseUrl = environment.baseURL;
const baseUrlF = environment.baseURLF;

@Injectable({
  providedIn: 'root'
})
export class GestionClientesService {

  constructor(private http: HttpClient) { }



  get_usersAll(): Observable<any>{
    return this.http.get(`${baseUrlF}/api/users`);
  }

  get_data_this_user(){
    return this.http.get(`${baseUrlF}/api/data_this_user`);
  }

  actualizarDatosUsuario(data:any):Observable<any>{
    return this.http.put(`${baseUrlF}/api/edit_data_this_user`,data);
  }

  nuevoRegistroDatosUsuarios(data:any):Observable<any>{
    return this.http.post(`${baseUrlF}/api/new_data_this_user`,data);
  }

  envioCorreoNuevoUsuario(data){
    return this.http.post(`${baseUrlF}/api/send_email`,data);
  }

}
