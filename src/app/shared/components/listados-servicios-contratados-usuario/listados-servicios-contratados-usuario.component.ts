import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { faEdit } from '@fortawesome/free-regular-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Location } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosContratadosService } from '../../services/gestion-servicios-contratados.service';
import { NzImageService } from 'ng-zorro-antd/image';
import * as moment from 'moment';
import { environment } from 'src/environments/environment.prod';
const baseUrlF = environment.baseURLF;


interface ItemData {
  id: string;
  servicio: string;
  price: string;
  estado: string
  disabled: boolean


}
@Component({
  selector: 'app-listados-servicios-contratados-usuario',
  templateUrl: './listados-servicios-contratados-usuario.component.html',
  styleUrls: ['./listados-servicios-contratados-usuario.component.css']
})
export class ListadosSeComponent implements OnInit {

  baseUrl = baseUrlF
  // tabla
  i = 0;
  editId: string | null = null;
  listOfData: ItemData[] = [];
  mesActual = moment().format('M').toString();
  Nombre;
  id: any;

  idUser = this.route.snapshot.paramMap.get("idUser");
  idEstado = this.route.snapshot.paramMap.get("id");
  radioValue = this.idEstado;
  cliente;
  documento;
  sinAprobar: any;
  aprobado: any;
  pendienteDeAprobar: any;


  deleteRow(id: string, nombre: string): void {
    this.listOfData = this.listOfData.filter(d => d.id !== id);
    this.createNotification('warning', 'Cliente: ' + `${nombre}`, 'Eliminado con éxito');

  }
  //


  fatrash = faTrash;
  faedit = faEdit;
  constructor(
    private serviciosContratados: GestionServiciosContratadosService,
    private notification: NzNotificationService,
    private modalService: NgbModal,
    private _location: Location,
    private route: ActivatedRoute,
    private nzImageService: NzImageService
  ) {



  }
  public form: FormGroup;
  ngOnInit(): void {
    this.getServiciosContratadosSinAprobarByUser();
    this.getServiciosContratadosPendientesDeAprobarByUser();
    this.getServiciosContratadosAprobadosByUser();



  }


  backClicked() {
    this._location.back();
  }


  //
  agregarServicio(array) {
    console.log(this.listOfData)
    console.log(array)
    array.forEach(element => {

      console.log(element.name)
      this.contratarNuevosServicios(element.id, element.name);
    });
    // this.listOfData = this.listOfData.concat(array);
  }



  // notificaciones
  createNotification(type1: string, type2: string, type3: string,): void {
    this.notification.create(
      type1,
      type2,
      type3,
      { nzDuration: 12000 }
    );

  }
  // modal ng zorro
  isVisibled = false;
  servicioContratadoId


  showModald(serviceContractId): void {
    this.isVisibled = true;
    this.servicioContratadoId = serviceContractId;
  }

  handleOkd(): void {
    console.log('Button ok clicked!');
    this.isVisibled = false;



  }

  handleCanceld(): void {
    console.log('Button cancel clicked!');
    this.isVisibled = false;
  }

  // modal formulario
  isVisibleFormulariof = false;


  showModalFormulariof(): void {
    this.isVisibleFormulariof = true;

  }

  handleOkFormulariof(): void {

    this.isVisibleFormulariof = false;

  }

  handleCancelFormulariof(): void {

    this.isVisibleFormulariof = false;
  }



  // ================================================
  ListaserviciosContratados = [];


  getServiciosContratadosSinAprobarByUser() {
    const data = { userId: this.idUser }
    this.serviciosContratados.getServiciosContratadosSinAprobarByUser(data).subscribe(respuesta => {
      this.sinAprobar = respuesta.data;
      if (this.idEstado=="1") {
        this.listOfData= this.sinAprobar;
        console.log(respuesta.data)

      }
      if (!this.cliente) {
        this.cliente = this.sinAprobar[0].email
      }
      console.log(this.sinAprobar);
    }, err => {
      console.log(err);
      this.createNotification('error', 'Listado: ', err);
    })
  }

  getServiciosContratadosPendientesDeAprobarByUser() {

    const data = { userId: this.idUser }
    this.serviciosContratados.getServiciosContratadosPendientesDeAprobarByUser(data).subscribe(respuesta => {
      this.pendienteDeAprobar = respuesta.data;
      console.log(respuesta.data)
      if (this.idEstado=="2") {
        this.listOfData= this.pendienteDeAprobar;
      }

      if (!this.cliente) {
        this.cliente = this.pendienteDeAprobar[0].email
      }

    }, err => {
      console.log(err);
      this.createNotification('error', 'Listado: ', 'Error al obtener los servicio');
    })
  }


  getServiciosContratadosAprobadosByUser() {

    const data = { userId: this.idUser }
    this.serviciosContratados.getServiciosContratadosAprobadosByUser(data).subscribe(respuesta => {
      this.aprobado = respuesta.data
      if (this.idEstado=="2") {
        this.listOfData==this.aprobado
      }
      if (!this.cliente) {
        this.cliente = this.aprobado[0].email
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Listado: ', 'Error al obtener los servicio');
    })
  }






  contratarNuevosServicios(idServicio, nombreServicio) {
    const data = {
      usuario: this.idUser,
      servicio: idServicio
    }
    this.serviciosContratados.registrarNuevosServicios(data).subscribe(respuesta => {
      if (respuesta) {
        this.getServiciosContratadosSinAprobarByUser();
        this.getServiciosContratadosPendientesDeAprobarByUser();
        this.getServiciosContratadosAprobadosByUser();
        this.createNotification('success', `Registro de servicio: ${nombreServicio} `, 'Registrado con éxito');

      }
    }, err => {
      console.log(err);
      this.createNotification('error', `El servicio: ${nombreServicio}`, 'Ya se encuentra registrado ');
    });
  }

  activarServicioContratado(idServicioContratado, nombreServicio) {
    const data = { servicioContratado: idServicioContratado }
    this.serviciosContratados.activarServicioContratado(data).subscribe(respuesta => {
      if (respuesta) {
        this.getServiciosContratadosSinAprobarByUser();
        this.getServiciosContratadosPendientesDeAprobarByUser();
        this.getServiciosContratadosAprobadosByUser();
        this.createNotification('success', ` servicio contratado: ${nombreServicio} `, 'Activado con éxito');

      }
    }, err => {
      console.log(err);
      this.createNotification('error', `El servicio contratado: ${nombreServicio}`, 'No pudo activarse');
    });
  }

  desactivarServicioContratado(idServicioContratado, nombreServicio) {
    const data = { servicioContratado: idServicioContratado }
    this.serviciosContratados.desactivarServicioContratado(data).subscribe(respuesta => {
      if (respuesta) {
        this.getServiciosContratadosSinAprobarByUser();
        this.getServiciosContratadosPendientesDeAprobarByUser();
        this.getServiciosContratadosAprobadosByUser();
        this.createNotification('success', ` Servicio contratado: ${nombreServicio} `, 'Desactivado con éxito');

      }
    }, err => {
      console.log(err);
      this.createNotification('error', `El servicio contratado: ${nombreServicio}`, 'No pudo desactivarse');
    });
  }

  filtro(filtro) {
    if (filtro == '1') {
      this.listOfData = this.sinAprobar
    }

    if (filtro == '2') {
      this.listOfData = this.pendienteDeAprobar
    }
    if (filtro == '3') {
      this.listOfData = this.aprobado
    }
  }


}
