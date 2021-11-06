import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.prod';
const baseUrlF = environment.baseURLF;

@Injectable({
  providedIn: 'root'
})
export class GestionServiciosContratadosService {
  constructor(private http: HttpClient) { }
  usuario = localStorage.getItem('usuario');
  headers = new HttpHeaders();
  bloqueador: boolean;
  bloqueadorInicioMes: boolean;
  bloqueadorFinMes: boolean;
  bloqueadorMesAnteriores: boolean;

  // servicios contratados by user
  getServiciosContratadosSinAprobarByUser(data): Observable<any> {
    return this.http.post(`${baseUrlF}/api/sin_aprobar_by_user`, data);
    //
  }
  getServiciosContratadosPendientesDeAprobarByUser(data): Observable<any> {
    return this.http.post(`${baseUrlF}/api/pendientes_aprobacion_by_user`, data);
    //
  }

  contadorDocumentosServicioContratado(data): Observable<any> {
    return this.http.post(`${baseUrlF}/api/count_documents_services_contracted`, data);
  }

  getServiciosContratadosAprobadosByUser(data): Observable<any> {
    return this.http.post(`${baseUrlF}/api/aprobados_by_user`, data);
    //
  }
  //

  getPay_service_all() {
    return this.http.get(`${baseUrlF}/api/pay_service_all`);
  }
  getPayServiceByUser(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/pay_service_by_user`);
    //
  }

  getName(id): Observable<any> {
    return this.http.get(`${baseUrlF}/api/get_name/${id}`);
    //
  }

  getServiciosContratadosSinAprobar(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/sin_aprobar`);
    //
  }

  getServicioEspecifico(idServicio): Observable<any> {
    return this.http.get(`${baseUrlF}/api/service_specific/${idServicio}`);
    //
  }

  getServiciosContratadosPendientesDeAprobar(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/pendientes_aprobacion`);
    //
  }

  getServiciosContratadosAprobados(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/aprobados`);
    //
  }

  getServiciosContratadosByUser(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/services_by_user`);
    //
  }

  getServiciosContratadosAll(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/contrated_services`);
    //
  }

  registrarNuevosServicios(data) {
    return this.http.post(`${baseUrlF}/api/new_contrated`, data);
  }

  registrarNuevosServiciosOpcional(data) {
    return this.http.post(`${baseUrlF}/api/new_contrated_optional`, data);
  }

  getClientesDeServicios(idServicio) {
    return this.http.get(`${baseUrlF}/api/clientes_de_servicio/${idServicio}`);
  }

  getServiciosContratadosUsuarioEspecifico(data: string): Observable<any> {

    return this.http.get(`${baseUrlF}/api/servicios_contratados_usuario_especifico/${data}`,);
  }


  updateEstadoServicioContratado(id, data): Observable<any> {
    return this.http.put(`${baseUrlF}/api/editestado/${id}`, data);
  }

  cambiarPeriodoPagoServicioContratado(data): Observable<any> {
    return this.http.put(`${baseUrlF}/api/periodo_pago`, data);
  }


  postDocumentServiceContracted(data: any): Observable<any> {
    return this.http.post(`${baseUrlF}/api/documents`, data);
  }
  postDocumentosMesAnterior(data: any): Observable<any> {
    return this.http.post(`${baseUrlF}/api/documentos_mes_anterior`, data);
  }

  getDocumentsServiceContracted(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/documents`,);
  }

  activarServicioContratado(data) {
    return this.http.put(`${baseUrlF}/api/activar_servicio_contratado`, data);
  }

  desactivarServicioContratado(data) {
    return this.http.put(`${baseUrlF}/api/desactivar_servicio_contratado`, data);
  }


  // Tareas

  newTareas(data: any): Observable<any> {
    return this.http.post(`${baseUrlF}/api/tareas`, data);
  }

  tareasUsuarioEspecifico(): Observable<any> {
    return this.http.get(`${baseUrlF}/api/tareas_especificas_usuario`);
  }

  editarTarea(data: any) {
    return this.http.put(`${baseUrlF}/api/tareas`, data);
  }

  eliminarTarea(data) {

    return this.http.delete(`${baseUrlF}/api/tareas/${data}`,);
  }

  getOneDocumentSpecific(usuario, tipo, servicioContratado) {
    return this.http.get<any>(`${baseUrlF}/api/documents/${usuario}/${tipo}/${servicioContratado}`);
  }


  getTareasEspeficas(usuario, servicio: string) {
    return this.http.get(`${baseUrlF}/api/tareas_especificas/${usuario}/${servicio}`);
  }

  actualizarEstadoTarea(data) {
    return this.http.put(`${baseUrlF}/api/tareas_actualizar_estado`, data);
  }

  ingresarHorasTarea(data) {
    return this.http.put(`${baseUrlF}/api/tareas_ingresar_horas`, data);
  }

  getTareasAll() {
    return this.http.get<any>(`${baseUrlF}/api/get_all_task`);

  }

  //comentarios

  getComentariosTareas(tarea) {
    return this.http.get<any>(`${baseUrlF}/api/comments/${tarea}`);
  }

  postComentariosTarea(data) {
    return this.http.post(`${baseUrlF}/api/comment`, data);
  }

  getComentariosAll() {
    return this.http.get<any>(`${baseUrlF}/api/comments`);
  }

  changeViewedUser(data) {
    return this.http.post(`${baseUrlF}/api/change_viewed_user`, data);
  }

  changeViewedAdmin(data) {
    return this.http.post(`${baseUrlF}/api/change_viewed_admin`, data);
  }

  // documento

  cambiarAprobacionDocumento(data) {
    return this.http.post(`${baseUrlF}/api/aprobar_documento`, data);
  }

}
