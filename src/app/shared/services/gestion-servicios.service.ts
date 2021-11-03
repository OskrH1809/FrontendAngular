import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
const baseUrl = environment.baseURLF;
@Injectable({
  providedIn: 'root'
})
export class GestionServiciosService {

  constructor(private http: HttpClient) { }

  get_servicios(): Observable<any>{
    return this.http.get(`${baseUrl}/api/services`);
  }


  sendPost(data: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/api/services`, data);
  }

  updateServicio(id,data){
    return this.http.put(`${baseUrl}/api/services/${id}`, data);
  }

  deleteServicio(id): Observable<any>{
    return this.http.delete(`${baseUrl}/api/services/${id}`);
  }

  getSearchServices(search){
    return this.http.get(`${baseUrl}/api/services_search/${search}`);
  }

  activarServicio(data){
    return this.http.put(`${baseUrl}/api/activar_servicios`, data);
  }

  desactivarServicio(data){
    return this.http.put(`${baseUrl}/api/desactivar_servicios`, data);
  }
}
