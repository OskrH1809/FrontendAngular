import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Location } from '@angular/common';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { GestionServiciosService } from 'src/app/shared/services/gestion-servicios.service';
interface ItemData {
  date: string
  id: string;
  name: string;
  price: string;
  horasServicio: string;

}
@Component({
  selector: 'app-creacion-servicios',
  templateUrl: './creacion-servicios.component.html',
  styleUrls: ['./creacion-servicios.component.css']
})
export class CreacionServiciosComponent implements OnInit {

  // tabla
  value: string;
  indice: any;
  buscar;
  editId: string | null = null;
  listOfData: any = [];
  i;
  public form: FormGroup;     //creacion de la variable que contendra los valores del formulario



  //Funcion para asignar el id del servicio que se ha seleccionado en la tabla para poder editarlo
  startEdit(id: string): void {
    this.editId = id;
  }

  //Funcion que indica que se ha finalizado la edicion y pasa los nuevos parametros para actualizarlos
  stopEdit(id, nombre, precio,horasServicio): void {
    this.editId = null;
    this.actualizacionServicio(id, nombre, precio,horasServicio);

  }

  // funcion que se utiliza para agregar un nuevo servicio
  addRow(): void {
    this.listOfData = [
      ...this.listOfData,
    ];
    this.CrearServicio();
    this.i++;
  }

  // Funcion que proporciona el id del servicio que se procedera a eliminar
  deleteRow(id: string, nombre: string): void {
    this.EliminacionServicio(id)
    this.get_serviciosall(this.buscar);
  }

  constructor(
    private notification: NzNotificationService,
    private _location: Location,
    private formBuilder: FormBuilder,
    private servicio: GestionServiciosService

  ) { }

  // funcion que hace la peticion post a la api para crear el nuevo servicio
  CrearServicio() {
    const nuevoServicio = { name: `${this.form.value.nombre}`, price: `${this.form.value.precio}`, horasServicio:`${this.form.value.horasServicio}` }
    this.servicio.sendPost(nuevoServicio).subscribe(
      res => {
        console.log(res);
        if (res) {
          this.createNotification('success', 'Servicio: ' + `${this.form.value.nombre}`, 'Agregado con éxito');
          this.get_serviciosall(this.buscar);
          this.form.reset();
        }
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al crear servicio: ', err);
      });
  }

  // funcion que hace la peticion delete a la api para crear el nuevo servicio
  EliminacionServicio(id) {
    this.servicio.deleteServicio(id).subscribe(
      res => {
        console.log(res);
        if (res) {
          this.createNotification('warning', 'Servicio: ', 'Eliminado con éxito');
        }
      }, err => {
        if (err) {
          this.createNotification('error', 'Error al eliminar servicio: ', 'Para eliminar el servicio este no debe estar asociado a contrataciones.');
        }
      }
    );
  }

  // funcion que hace la peticion put a la api para crear el nuevo servicio
  actualizacionServicio(id, nombre, precio,horasServicio) {
    const data = { name: nombre, price: precio,horasServicio:horasServicio }
    console.log(data);
    this.servicio.updateServicio(id, data).subscribe(
      resp => {
        console.log(resp);
        if (resp) {
          this.createNotification('info', 'Servicio: ', 'Servicio actualizado con éxito');
        }
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al actualizar servicio: ', err);
      })

  }

  ngOnInit(): void {

    this.get_serviciosall(this.buscar);                              //  llamada a la funcion para obtener y visualizar los servicios
    //declaración del formulario
    this.form = this.formBuilder.group({
      nombre: ['', [Validators.required]],
      precio: ['', Validators.required],
      horasServicio: ['', Validators.required]


    });

  }




  // funcion que envia los datos del formulario
  send(): any {
    console.log(this.form.value);       // la variable form.value contiene los valores enviados a travez del formulario
  }


  // funcion que permite regresar a la pagina anterior
  backClicked() {
    this._location.back();
  }

  data_serviciosall: any;

  // funcion que hace un llamado a la api para obtener y visualizar los servicios
  get_serviciosall(buscar) {
    // se realiza una validacion el cual se verifica si existe algun elemento por cual se debe filtrar, si existe se visualizaran los servicios que contenga dicho nombre, si no existe ningun elemento en el filtro mostrara todos los servicios
    if (buscar) {
      this.servicio.getSearchServices(this.value).subscribe(data => {
        this.listOfData = data;
        console.log(data);
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al obtener los servicios: ', err);
      });
    } else {
      this.servicio.get_servicios().subscribe(data => {
        this.listOfData = data;
        console.log(data);
      }, err => {
        console.log(err);
        this.createNotification('error', 'Error al obtener los servicios: ', err);
      });
    }

  }



  // notificaciones
  createNotification(
    type1: string,        //Muestra el tipo de notificación(Success,Info,Waring, error)
    type2: string,        //Muestra un mensaje elegido por el usuario
    type3: string         //Muestra un mensaje elegido por el usuario
  ): void {
    this.notification.create(
      type1,
      type2,
      type3
    );

  }

  // funcion que esta a la escucha del evento del momento en el que se presiona la tecla enter para hacer un llamado a la funcion con un elemento de filtro
  EnterSubmit(evento) {
    if (evento.keyCode === 13) {
      this.buscar = this.value
      this.get_serviciosall(this.buscar);
    }


  }

  // funcion que cancela el proceso de filtrado en los servicios, mostrando todos los servicios existentes
  cancelarBusqueda() {
    const buscar = null;
    this.value = ''
    this.get_serviciosall(buscar);
  }


  activarServicio(idServicio,nombreServicio){
    const data = {servicio:idServicio}
    this.servicio.activarServicio(data).subscribe(respuesta=>{
      if (respuesta){
        this.get_serviciosall(this.buscar);
        this.createNotification('success', `Servicio: ${nombreServicio} `, 'Servicio activado con éxito');
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al activar servicio: ', 'Fallo en el proceso de activar el servicio');
    })
  }

  desactivarServicio(idServicio,nombreServicio){
    const data = {servicio:idServicio}
    this.servicio.desactivarServicio(data).subscribe(respuesta=>{
      if (respuesta){
        this.get_serviciosall(this.buscar);
        this.createNotification('success', `Servicio: ${nombreServicio} `, 'Servicio desactivado con éxito');
      }
    }, err => {
      console.log(err);
      this.createNotification('error', 'Error al activar servicio: ', 'Fallo en el proceso de desactivar el servicio');
    })
  }

}






